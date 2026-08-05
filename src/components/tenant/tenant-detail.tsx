"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { rupiah } from "@/lib/format";
import { RecordDetails, SnapshotDetails } from "@/components/record-details";
export function TenantDetail({
  section,
  record,
  histories,
}: {
  section: string;
  record: Record<string, unknown>;
  histories: Record<string, unknown>[];
}) {
  const router = useRouter(),
    [reason, setReason] = useState(""),
    [message, setMessage] = useState(""),
    status = String(record.status || ""),
    snapshot = record.snapshot as Record<string, unknown> | undefined;
  async function action(url: string, body: unknown, success: string) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
      data = await res.json();
    setMessage(res.ok ? success : data.message || "Permintaan gagal.");
    if (res.ok) {
      setReason("");
      router.refresh();
    }
  }
  return (
    <>
      <div className="grid three">
        <div className="card" style={{ gridColumn: "span 2" }}>
          <h2>Detail</h2>
          <RecordDetails section={section} record={record} />
          {snapshot ? (
            <>
              <h2>Snapshot transaksi</h2>
              <SnapshotDetails snapshot={snapshot} />
            </>
          ) : null}
          {histories.length > 0 && (
            <>
              <h2>Timeline</h2>
              <div className="timeline">
                {histories.map((h) => (
                  <div key={String(h.id)}>
                    <strong>{String(h.newStatus || "Balasan")}</strong>
                    <p>{String(h.message || "")}</p>
                    <small>{String(h.createdAt || "")}</small>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <aside className="card">
          {["tagihan", "invoice"].includes(section) && status !== "paid" && (
            <div className="invoice-payment-callout">
              <p className="eyebrow">Pembayaran</p>
              <h2>{rupiah(Number(record.totalAmount || 0))}</h2>
              <p>Periksa rincian dan pilih metode pembayaran pada halaman berikutnya.</p>
              <Link className="button primary" href={`/tenant/tagihan/${record.id}/bayar`}>Pilih metode pembayaran</Link>
            </div>
          )}
          {section === "booking" &&
            [
              "draft",
              "pending_approval",
              "pending_payment",
              "confirmed",
            ].includes(status) && (
              <>
                <h2>Batalkan booking</h2>
                <textarea
                  className="input"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Alasan pembatalan"
                />
                <button
                  className="button outline"
                  disabled={reason.length < 5}
                  onClick={() =>
                    void action(
                      `/api/bookings/${record.id}/cancel`,
                      { reason },
                      "Booking berhasil dibatalkan.",
                    )
                  }
                >
                  Batalkan booking
                </button>
              </>
            )}
          {section === "keluhan" && status === "waiting_tenant" && (
            <>
              <h2>Balas owner</h2>
              <textarea
                className="input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <button
                className="button dark"
                disabled={reason.length < 2}
                onClick={() =>
                  void action(
                    `/api/complaints/${record.id}/reply`,
                    { message: reason },
                    "Balasan berhasil dikirim.",
                  )
                }
              >
                Kirim balasan
              </button>
            </>
          )}
          {section === "invoice" && (
            <a className="button dark" href={`/api/invoices/${record.id}/pdf`}>
              Unduh PDF
            </a>
          )}
          {message && (
            <div
              className={
                message.includes("berhasil") ? "alert success" : "alert"
              }
            >
              {message}
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
