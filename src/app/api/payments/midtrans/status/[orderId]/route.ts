import midtransClient from "midtrans-client";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { applyMidtransStatus } from "@/lib/midtrans-workflow";
import { success, resultError, AppError } from "@/lib/errors";

export async function GET(_: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    const { orderId } = await params;
    const paymentQuery = await adminDb().collection("payments").where("providerOrderId", "==", orderId).limit(1).get();
    if (paymentQuery.empty) throw new AppError("PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan.", 404);
    const localPayment = paymentQuery.docs[0].data();
    if (session.role !== "owner" && localPayment.tenantId !== session.uid) throw new AppError("FORBIDDEN", "Akses ditolak.", 403);
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) throw new AppError("INTEGRATION_NOT_CONFIGURED", "Midtrans belum dikonfigurasi.", 503);
    const core = new midtransClient.CoreApi({ isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true", serverKey, clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "" }) as unknown as { transaction: { status(id: string): Promise<{ transaction_status: string; fraud_status?: string; transaction_id?: string; gross_amount: string }> } };
    const remote = await core.transaction.status(orderId);
    const data = await applyMidtransStatus({ orderId, transactionStatus: remote.transaction_status, fraudStatus: remote.fraud_status, transactionId: remote.transaction_id, grossAmount: Number(remote.gross_amount) });
    return Response.json(success(data));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
