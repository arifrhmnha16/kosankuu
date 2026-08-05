import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { z } from "zod";
import { getSession, owns } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { apiError } from "@/lib/http";
import { env } from "@/lib/env";
const schema = z.object({ invoiceId: z.string().min(1) });
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return apiError(new Error("Silakan login."), 401);
  try {
    const { invoiceId } = schema.parse(await req.json()),
      db = adminDb(),
      doc = await db.doc(`invoices/${invoiceId}`).get();
    if (!doc.exists) throw new Error("Invoice tidak ditemukan.");
    const invoice = doc.data()!;
    if (!owns(s, invoice.tenantId))
      return apiError(new Error("Akses ditolak."), 403);
    if (!["unpaid", "pending"].includes(String(invoice.status)))
      return apiError(new Error(invoice.status === "paid" ? "Tagihan sudah lunas." : "Tagihan tidak dapat dibayar pada status ini."), 409);
    if (!Number.isFinite(Number(invoice.totalAmount)) || Number(invoice.totalAmount) <= 0)
      return apiError(new Error("Nominal tagihan tidak valid."), 422);
    const existing = await db.collection("payments")
      .where("invoiceId", "==", invoiceId)
      .where("status", "==", "pending")
      .limit(5)
      .get();
    const resumable = existing.docs.find((item) => item.data().provider === "midtrans" && item.data().redirectUrl);
    if (resumable) {
      const payment = resumable.data();
      return NextResponse.json({ redirectUrl: payment.redirectUrl, orderId: payment.providerOrderId, resumed: true });
    }
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) throw new Error("Midtrans belum dikonfigurasi.");
    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
    });
    const orderId = `MR-${invoiceId}-${Date.now()}`,
      finishUrl = new URL("/tenant/pembayaran-selesai", env.NEXT_PUBLIC_APP_URL);
    finishUrl.searchParams.set("invoiceId", invoiceId);
    finishUrl.searchParams.set("midtrans_order_id", orderId);
    const transaction = await snap.createTransaction({
        transaction_details: {
          order_id: orderId,
          gross_amount: invoice.totalAmount,
        },
        customer_details: { email: s.email, first_name: s.name || "Tenant" },
        enabled_payments: ["qris", "gopay", "bank_transfer"],
        callbacks: { finish: finishUrl.toString() },
      } as never);
    await db
      .collection("payments")
      .add({
        invoiceId,
        bookingId: invoice.bookingId,
        tenantId: invoice.tenantId,
        tenantEmail: s.email || invoice.snapshot?.tenant?.email || "",
        method: "midtrans",
        provider: "midtrans",
        providerOrderId: orderId,
        redirectUrl: transaction.redirect_url,
        amount: invoice.totalAmount,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    return NextResponse.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
      orderId,
    });
  } catch (err) {
    return apiError(err);
  }
}
