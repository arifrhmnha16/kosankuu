"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { CloudinaryUploader } from "@/components/cloudinary-uploader";
import type { MediaAsset } from "@/types/domain";
import { rupiah } from "@/lib/format";

export function PaymentPanel({ invoice, bank }: { invoice: Record<string, unknown>; bank?: Record<string, unknown> }) {
  const router = useRouter();
  const [proof, setProof] = useState<MediaAsset[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<"online" | "manual" | null>(null);

  async function payOnline() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/payments/midtrans/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ invoiceId: invoice.id }) });
      const data = await response.json();
      if (!response.ok) return setMessage(data.message || data.error || "Pembayaran belum dapat dibuat.");
      const url = data.data?.redirectUrl || data.redirectUrl;
      if (!url) return setMessage("Tautan pembayaran tidak diterima. Silakan coba lagi.");
      location.assign(url);
    } catch {
      setMessage("Tidak dapat terhubung ke layanan pembayaran. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function submitManual() {
    if (!proof[0]) return setMessage("Unggah bukti transfer terlebih dahulu.");
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/payments/manual", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ invoiceId: invoice.id, proof: proof[0] }) });
      const data = await response.json();
      setMessage(response.ok ? "Bukti transfer dikirim dan menunggu verifikasi owner." : data.message || data.error || "Bukti transfer gagal dikirim.");
      if (response.ok) router.refresh();
    } catch {
      setMessage("Bukti transfer gagal dikirim. Periksa koneksi lalu coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="payment-panel">
    <p className="eyebrow">Pilih metode pembayaran</p>
    <h2>Bagaimana Anda ingin membayar?</h2>
    <p className="payment-due">Batas pembayaran: {formatDate(invoice.dueAt)}.</p>
    <div className="payment-option-list">
      <button type="button" className={method === "online" ? "payment-option active" : "payment-option"} onClick={() => { setMethod("online"); setMessage(""); }}>
        <CreditCard size={22} /><span><strong>Pembayaran online</strong><small>QRIS, GoPay, dan virtual account melalui Midtrans</small></span>
      </button>
      <button type="button" className={method === "manual" ? "payment-option active" : "payment-option"} onClick={() => { setMethod("manual"); setMessage(""); }}>
        <Landmark size={22} /><span><strong>Transfer bank manual</strong><small>Transfer ke rekening properti lalu unggah bukti</small></span>
      </button>
    </div>
    {method === "online" && <div className="payment-method">
      <h3>Konfirmasi pembayaran online</h3>
      <p>Anda baru akan diarahkan ke halaman resmi Midtrans setelah menekan tombol di bawah.</p>
      <div className="payment-confirm-total"><span>Nominal</span><strong>{rupiah(Number(invoice.totalAmount || 0))}</strong></div>
      <button className="button dark" disabled={busy} onClick={() => void payOnline()}>{busy ? "Menyiapkan pembayaran…" : "Bayar melalui Midtrans"}</button>
      <small><ShieldCheck size={15} />Status lunas hanya berasal dari verifikasi server Midtrans.</small>
    </div>}
    {method === "manual" && <div className="payment-method">
      <div className="bank-box"><small>Rekening tujuan</small><strong>{String(bank?.name || "Bank belum diatur")}</strong><b>{String(bank?.accountNumber || "—")}</b><span>a.n. {String(bank?.holder || "—")}</span></div>
      <p>Transfer tepat sebesar <strong>{rupiah(Number(invoice.totalAmount || 0))}</strong>, kemudian unggah bukti yang jelas.</p>
      <CloudinaryUploader purpose="payment" resourceId={String(invoice.id)} value={proof} onChange={setProof} multiple={false} />
      <button className="button dark" disabled={busy || !bank?.accountNumber} onClick={() => void submitManual()}>{busy ? "Mengirim bukti…" : "Kirim bukti transfer"}</button>
    </div>}
    {!method && <div className="payment-method-placeholder"><ShieldCheck size={24} /><p>Pilih salah satu metode di atas untuk melanjutkan.</p></div>}
    {message && <div className={message.includes("dikirim") ? "alert success" : "alert"}>{message}</div>}
  </div>;
}

function formatDate(value: unknown) {
  const parsed = new Date(String(value || ""));
  return Number.isNaN(parsed.getTime()) ? "mengikuti batas pada invoice" : parsed.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}
