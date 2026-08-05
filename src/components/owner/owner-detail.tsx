"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { rupiah } from "@/lib/format";
import { RecordDetails, SnapshotDetails } from "@/components/record-details";

export function OwnerDetail({
  section,
  record,
  related,
}: {
  section: string;
  record: Record<string, unknown>;
  related: Record<string, unknown>[];
}) {
  const router = useRouter(),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [reason, setReason] = useState("");
  const status = String(record.status || ""),
    proof = record.proof as { secureUrl?: string } | undefined,
    snapshot = record.snapshot as
      | Record<string, Record<string, unknown>>
      | undefined;
  async function mutate(url: string, body: unknown, method = "POST") {
    setBusy(true);
    setMessage("");
    const response = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        ...(method === "DELETE" ? {} : { body: JSON.stringify(body) }),
      }),
      data = await response.json();
    setMessage(
      response.ok
        ? "Perubahan berhasil disimpan."
        : data.message || data.error || "Perubahan gagal.",
    );
    setBusy(false);
    if (response.ok) {
      if (method === "DELETE") router.push("/owner/tenant");
      router.refresh();
    }
  }
  return (
    <>
      <div className="grid three">
        <div className="card" style={{ gridColumn: "span 2" }}>
          <h2>Informasi</h2>
          <RecordDetails section={section} record={record} />
          <dl className="detail-list technical-details">
            {Object.entries(record)
              .filter(
                ([key]) =>
                  ![
                    "snapshot",
                    "safeProviderSnapshot",
                    "proof",
                    "images",
                  ].includes(key),
              )
              .map(([key, value]) => (
                <div className="detail-row" key={key}>
                  <dt>{label(key)}</dt>
                  <dd>
                    {typeof value === "number" &&
                    (key.toLowerCase().includes("amount") ||
                      key.toLowerCase().includes("total"))
                      ? rupiah(value)
                      : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value ?? "—")}
                  </dd>
                </div>
              ))}
          </dl>
          {snapshot && (
            <>
              <h2>Snapshot historis</h2>
              <SnapshotDetails snapshot={snapshot} />
              <pre className="snapshot technical-details">
                {JSON.stringify(snapshot, null, 2)}
              </pre>
            </>
          )}
          {proof?.secureUrl && (
            <>
              <h2>Bukti transfer</h2>
              <Image
                src={String(proof.secureUrl)}
                alt="Bukti transfer tenant"
                width={480}
                height={360}
              />
            </>
          )}
        </div>
        <aside className="card">
          <h2>Aksi</h2>
          {section === "booking" && (
            <>
              <div className="field">
                <label>Alasan (wajib untuk tolak/batal)</label>
                <textarea
                  className="input"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </div>
              {[
                "pending_payment",
                "confirmed",
                "active",
                "completed",
                "rejected",
                "cancelled",
              ].map((next) => (
                <button
                  key={next}
                  className="button outline"
                  disabled={busy}
                  onClick={() =>
                    void mutate(`/api/owner/bookings/${record.id}/transition`, {
                      status: next,
                      reason,
                    })
                  }
                >
                  {next}
                </button>
              ))}
            </>
          )}
          {section === "pembayaran" && status === "waiting_verification" && (
            <>
              <div className="field">
                <label>Catatan verifikasi</label>
                <textarea
                  className="input"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </div>
              <button
                className="button dark"
                disabled={busy}
                onClick={() =>
                  void mutate(`/api/owner/payments/${record.id}/verify`, {
                    decision: "approve",
                    note: reason,
                  })
                }
              >
                Setujui transfer
              </button>
              <button
                className="button outline"
                disabled={busy || reason.length < 5}
                onClick={() =>
                  void mutate(`/api/owner/payments/${record.id}/verify`, {
                    decision: "reject",
                    note: reason,
                  })
                }
              >
                Tolak transfer
              </button>
            </>
          )}
          {section === "keluhan" && (
            <>
              <div className="field">
                <label>Respons owner</label>
                <textarea
                  className="input"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </div>
              {[
                "in_progress",
                "waiting_tenant",
                "resolved",
                "closed",
                "rejected",
              ].map((next) => (
                <button
                  key={next}
                  className="button outline"
                  disabled={busy || reason.length < 2}
                  onClick={() =>
                    void mutate(`/api/owner/complaints/${record.id}`, {
                      status: next,
                      message: reason,
                    })
                  }
                >
                  {next}
                </button>
              ))}
            </>
          )}
          {section === "tenant" && (
            <>
              <div className="field">
                <label>Catatan internal</label>
                <textarea
                  className="input"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </div>
              <button
                className="button dark"
                disabled={busy}
                onClick={() =>
                  void mutate(`/api/owner/tenants/${record.id}/status`, {
                    active: status !== "active",
                    note: reason,
                  })
                }
              >
                {status === "active" ? "Nonaktifkan akun" : "Aktifkan akun"}
              </button>
              <button
                className="button outline"
                disabled={busy}
                onClick={() => {
                  if (
                    confirm(
                      "Hapus akun tenant secara permanen? Riwayat transaksi tetap disimpan.",
                    )
                  )
                    void mutate(
                      `/api/owner/tenants/${record.id}/status`,
                      {},
                      "DELETE",
                    );
                }}
              >
                Hapus akun tenant
              </button>
            </>
          )}
          {section === "invoice" && (
            <a className="button dark" href={`/api/invoices/${record.id}/pdf`}>
              Unduh PDF
            </a>
          )}
          <p>
            <Link href={`/owner/${section}`}>← Kembali</Link>
          </p>
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
      {related.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <h2>Data terkait</h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {related.map((item) => (
                  <tr key={String(item.id)}>
                    <td>
                      {String(
                        item.code ||
                          item.invoiceNumber ||
                          item.title ||
                          item.id,
                      )}
                    </td>
                    <td>{String(item.status || "")}</td>
                    <td>{String(item.createdAt || item.updatedAt || "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
const label = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase());
