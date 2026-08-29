import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { mapMidtransStatus } from "@/lib/midtrans";
import { AppError } from "@/lib/errors";
import { sendTransactionalEmail } from "@/lib/email";
import { sendPaymentSuccessEmail } from "@/lib/payment-email";
import { lockIds } from "@/lib/booking";

const finalStatuses = ["paid", "refunded"];

export async function applyMidtransStatus(input: {
  orderId: string;
  transactionStatus: string;
  fraudStatus?: string;
  transactionId?: string;
  grossAmount?: number;
  eventId?: string;
}) {
  const db = adminDb();
  const query = await db
    .collection("payments")
    .where("providerOrderId", "==", input.orderId)
    .limit(1)
    .get();
  if (query.empty)
    throw new AppError("PAYMENT_NOT_FOUND", "Pembayaran tidak ditemukan.", 404);
  const paymentDocument = query.docs[0];
  const before = paymentDocument.data();
  const bookingDocument = await db.doc(`bookings/${before.bookingId}`).get();
  if (!bookingDocument.exists)
    throw new AppError(
      "BOOKING_NOT_FOUND",
      "Booking pembayaran tidak ditemukan.",
      409,
    );
  const booking = bookingDocument.data()!;
  const lockReferences = lockIds(
    booking.roomId,
    booking.rentalType,
    booking.startAt.toDate(),
    booking.endAt.toDate(),
  ).map((id) => db.doc(`bookingLocks/${id}`));
  const status = mapMidtransStatus(input.transactionStatus, input.fraudStatus);
  if (input.grossAmount !== undefined && input.grossAmount !== before.amount)
    throw new AppError(
      "AMOUNT_MISMATCH",
      "Nominal pembayaran tidak sesuai.",
      409,
    );
  let changed = false;

  await db.runTransaction(async (transaction) => {
    const event = input.eventId
      ? db.doc(`webhookEvents/${input.eventId}`)
      : null;
    const eventSnapshot = event ? await transaction.get(event) : null;
    const current = await transaction.get(paymentDocument.ref);
    const currentBooking = await transaction.get(bookingDocument.ref);
    const currentLocks = await transaction.getAll(...lockReferences);
    if (eventSnapshot?.exists || !current.exists) return;
    const currentStatus = current.data()!.status;
    const now = FieldValue.serverTimestamp();
    if (event)
      transaction.set(event, {
        provider: "midtrans",
        eventKey: input.eventId,
        orderId: input.orderId,
        signatureValid: true,
        processingStatus: "processed",
        receivedAt: now,
        processedAt: now,
      });
    if (finalStatuses.includes(currentStatus) && currentStatus !== status)
      return;
    changed = currentStatus !== status;
    if (!changed) return;
    if (
      status === "paid" &&
      (!currentBooking.exists ||
        currentLocks.some(
          (lock) => !lock.exists || lock.data()!.bookingId !== before.bookingId,
        ))
    ) {
      throw new AppError(
        "BOOKING_LOCK_LOST",
        "Jadwal booking sudah kedaluwarsa dan memerlukan rekonsiliasi owner.",
        409,
      );
    }
    transaction.update(paymentDocument.ref, {
      status,
      providerTransactionId:
        input.transactionId || current.data()!.providerTransactionId || null,
      safeProviderSnapshot: {
        transaction_status: input.transactionStatus,
        fraud_status: input.fraudStatus || null,
      },
      paidAt: status === "paid" ? now : current.data()!.paidAt || null,
      updatedAt: now,
    });
    transaction.update(db.doc(`invoices/${before.invoiceId}`), {
      status: status === "paid" ? "paid" : status,
      paidAt: status === "paid" ? now : null,
      updatedAt: now,
    });
    if (status === "paid") {
      transaction.update(db.doc(`bookings/${before.bookingId}`), {
        status: "confirmed",
        expiresAt: null,
        updatedAt: now,
      });
      currentLocks.forEach((lock) =>
        transaction.update(lock.ref, { expiresAt: null, updatedAt: now }),
      );
    }
    transaction.set(db.collection("activities").doc(), {
      actorId: "midtrans",
      tenantId: before.tenantId,
      subjectType: "payment",
      subjectId: paymentDocument.id,
      action: `status_${status}`,
      description: `Status Midtrans menjadi ${status}.`,
      createdAt: now,
    });
    transaction.set(db.collection("notifications").doc(), {
      userId: before.tenantId,
      type: "payment_updated",
      title: "Status pembayaran diperbarui",
      message: `Pembayaran kini ${status}.`,
      link: `/tenant/tagihan/${before.invoiceId}`,
      readAt: null,
      createdAt: now,
    });
  });

  if (changed && status === "paid") {
    await sendPaymentSuccessEmail(paymentDocument.id).catch(() => undefined);
  } else if (changed && before.tenantEmail) {
    await sendTransactionalEmail({
      to: before.tenantEmail,
      subject: "Status pembayaran diperbarui",
      title: "Status pembayaran diperbarui",
      message: `Pembayaran Anda kini berstatus ${status}.`,
      template: "payment_updated",
      relatedId: `${paymentDocument.id}_${status}`,
    }).catch(() => undefined);
  }
  return {
    paymentId: paymentDocument.id,
    status,
    changed,
    tenantId: before.tenantId,
  };
}
