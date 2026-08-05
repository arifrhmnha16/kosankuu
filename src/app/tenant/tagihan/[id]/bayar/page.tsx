import Link from "next/link";
import { ArrowLeft, FileText, LockKeyhole } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { sectionDetail } from "@/lib/firestore/private-data";
import { adminDb } from "@/lib/firebase/admin";
import { PaymentPanel } from "@/components/tenant/payment-panel";
import { RecordDetails, SnapshotDetails } from "@/components/record-details";
import { rupiah } from "@/lib/format";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireRole("tenant");
  const invoice = await sectionDetail(session, "tagihan", id);
  const settings = await adminDb().doc("propertySettings/main").get();
  const snapshot = invoice.snapshot as Record<string, unknown> | undefined;
  const status = String(invoice.status || "unpaid");
  const payable = ["unpaid", "pending"].includes(status);
  return <>
    <div className="payment-page-head">
      <Link href={`/tenant/tagihan/${id}`}><ArrowLeft size={17} /> Kembali ke tagihan</Link>
      <span><LockKeyhole size={16} /> Pembayaran aman</span>
    </div>
    <header className="payment-checkout-title">
      <p className="eyebrow">Pembayaran tagihan</p>
      <h1>{String(invoice.invoiceNumber || "Tagihan")}</h1>
      <p>Periksa rincian, lalu pilih metode pembayaran yang paling nyaman.</p>
    </header>
    <div className="payment-checkout-grid">
      <section className="payment-summary-card">
        <div className="payment-summary-total"><span>Total pembayaran</span><strong>{rupiah(Number(invoice.totalAmount || 0))}</strong></div>
        <RecordDetails section="tagihan" record={invoice} />
        {snapshot && <div className="payment-snapshot"><h2>Detail booking</h2><SnapshotDetails snapshot={snapshot} /></div>}
        <a className="button outline" href={`/api/invoices/${id}/pdf`}><FileText size={17} /> Unduh invoice PDF</a>
      </section>
      <aside className="payment-method-card">
        {payable ? <PaymentPanel invoice={invoice} bank={settings.data()?.bank} /> : status === "paid" ? <div className="payment-state success"><h2>Tagihan sudah lunas</h2><p>Invoice dan struk pembayaran telah dikirim ke email Anda.</p><Link className="button dark" href={`/tenant/tagihan/${id}`}>Lihat detail tagihan</Link></div> : <div className="payment-state"><h2>Pembayaran tidak tersedia</h2><p>Status tagihan saat ini: <strong>{status.replaceAll("_", " ")}</strong>.</p><Link className="button outline" href={`/tenant/tagihan/${id}`}>Kembali</Link></div>}
      </aside>
    </div>
  </>;
}
