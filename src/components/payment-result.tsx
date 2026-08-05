"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock3, RefreshCw, XCircle } from "lucide-react";
type State = { loading: boolean; status: string; message: string };
export function PaymentResult() {
  const params = useSearchParams(),
    orderId = params.get("order_id") || params.get("midtrans_order_id") || "",
    invoiceId = params.get("invoiceId") || "",
    [state, setState] = useState<State>({
      loading: true,
      status: "",
      message: "Memeriksa status pembayaran ke Midtrans…",
    });
  const refresh = useCallback(async () => {
    if (!orderId) {
      setState({
        loading: false,
        status: "failed",
        message: "Nomor transaksi tidak ditemukan pada URL kembali.",
      });
      return;
    }
    setState((current) => ({
      ...current,
      loading: true,
      message: "Memeriksa status pembayaran ke Midtrans…",
    }));
    try {
      const response = await fetch(
          `/api/payments/midtrans/status/${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        ),
        body = await response.json();
      if (!response.ok)
        throw new Error(
          body.message || "Status pembayaran belum dapat diperiksa.",
        );
      const status = String(body.data?.status || "pending");
      setState({
        loading: false,
        status,
        message:
          status === "paid"
            ? "Pembayaran telah diterima dan tagihan diperbarui."
            : status === "pending"
              ? "Pembayaran masih diproses. Anda dapat memeriksa ulang beberapa saat lagi."
              : `Pembayaran berstatus ${status}.`,
      });
    } catch (error) {
      setState({
        loading: false,
        status: "failed",
        message:
          error instanceof Error
            ? error.message
            : "Status pembayaran gagal diperiksa.",
      });
    }
  }, [orderId]);
  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  const paid = state.status === "paid",
    pending = state.loading || state.status === "pending";
  return (
    <main className="payment-result-page">
      <section className="payment-result-card">
        {paid ? (
          <CheckCircle2 className="paid" />
        ) : pending ? (
          <Clock3 className="pending" />
        ) : (
          <XCircle className="failed" />
        )}
        <p className="eyebrow">Status pembayaran</p>
        <h1>
          {state.loading
            ? "Sedang memeriksa…"
            : paid
              ? "Pembayaran berhasil"
              : "Pembayaran belum selesai"}
        </h1>
        <p>{state.message}</p>
        <div className="payment-result-reference">
          <span>Nomor transaksi</span>
          <strong>{orderId || "—"}</strong>
        </div>
        <div className="actions">
          {invoiceId && (
            <Link className="button dark" href={`/tenant/tagihan/${invoiceId}`}>
              {paid ? "Lihat Tagihan" : "Kembali ke Tagihan"}
            </Link>
          )}
          {!paid && (
            <button
              className="button outline"
              disabled={state.loading}
              onClick={() => void refresh()}
            >
              <RefreshCw size={16} />
              Periksa Ulang
            </button>
          )}
        </div>
        <small>
          Status hanya ditetapkan dari Get Status dan notifikasi terverifikasi
          Midtrans, bukan parameter callback browser.
        </small>
      </section>
    </main>
  );
}
