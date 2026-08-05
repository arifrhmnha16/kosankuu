import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { mapMidtransStatus } from "@/lib/midtrans";
import { AppError } from "@/lib/errors";
import { sendTransactionalEmail } from "@/lib/email";
import { sendPaymentSuccessEmail } from "@/lib/payment-email";

const finalStatuses = ["paid", "refunded"];

export async function applyMidtransStatus(input: { orderId: string; transactionStatus: string; fraudStatus?: string; transactionId?: string; grossAmount?: number; eventId?: string }) {
  const db = adminDb();
  const query = await db.collection("payments").where("providerOrderId", "==", input.orderId).limit(1).get();
  if (query.empty) throw new AppError("PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan.", 404);
  const paymentDocument = query.docs[0];
  const before = paymentDocument.data();
  const status = mapMidtransStatus(input.transactionStatus, input.fraudStatus);
  if (input.grossAmount !== undefined && input.grossAmount !== before.amount) throw new AppError("AMOUNT_MISMATCH", "Nominal pembayaran tidak sesuai.", 409);
  let changed = false;

  await db.runTransaction(async (transaction) => {
    if (input.eventId) {
      const event = db.doc(`webhookEvents/${input.eventId}`);
      if ((await transaction.get(event)).exists) return;
      transaction.set(event, { provider: "midtrans", eventKey: input.eventId, orderId: input.orderId, signatureValid: true, processingStatus: "processed", receivedAt: FieldValue.serverTimestamp(), processedAt: FieldValue.serverTimestamp() });
    }
    const current = await transaction.get(paymentDocument.ref);
    if (!current.exists) return;
    const currentStatus = current.data()!.status;
    if (finalStatuses.includes(currentStatus) && currentStatus !== status) return;
    changed = currentStatus !== status;
    const now = FieldValue.serverTimestamp();
    transaction.update(paymentDocument.ref, { status, providerTransactionId: input.transactionId || current.data()!.providerTransactionId || null, safeProviderSnapshot: { transaction_status: input.transactionStatus, fraud_status: input.fraudStatus || null }, paidAt: status === "paid" ? now : current.data()!.paidAt || null, updatedAt: now });
    transaction.update(db.doc(`invoices/${before.invoiceId}`), { status: status === "paid" ? "paid" : status, paidAt: status === "paid" ? now : null, updatedAt: now });
    if (status === "paid") transaction.update(db.doc(`bookings/${before.bookingId}`), { status: "confirmed", updatedAt: now });
    transaction.set(db.collection("activities").doc(), { actorId: "midtrans", subjectType: "payment", subjectId: paymentDocument.id, action: `status_${status}`, description: `Status Midtrans menjadi ${status}.`, createdAt: now });
    transaction.set(db.collection("notifications").doc(), { userId: before.tenantId, type: "payment_updated", title: "Status pembayaran diperbarui", message: `Pembayaran kini ${status}.`, link: `/tenant/tagihan/${before.invoiceId}`, readAt: null, createdAt: now });
  });

  if (changed && status === "paid") {
    await sendPaymentSuccessEmail(paymentDocument.id).catch(() => undefined);
  } else if (changed && before.tenantEmail) {
    await sendTransactionalEmail({ to: before.tenantEmail, subject: "Status pembayaran diperbarui", title: "Status pembayaran diperbarui", message: `Pembayaran Anda kini berstatus ${status}.`, template: "payment_updated", relatedId: `${paymentDocument.id}_${status}` }).catch(() => undefined);
  }
  return { paymentId: paymentDocument.id, status, changed, tenantId: before.tenantId };
}
