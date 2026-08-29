import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { success, resultError, AppError } from "@/lib/errors";
import { sendTransactionalEmail } from "@/lib/email";
import { sendPaymentSuccessEmail } from "@/lib/payment-email";
import { lockIds } from "@/lib/booking";

const schema = z
  .object({
    decision: z.enum(["approve", "reject"]),
    note: z.string().max(500),
  })
  .superRefine((value, context) => {
    if (value.decision === "reject" && value.note.trim().length < 5)
      context.addIssue({
        code: "custom",
        path: ["note"],
        message: "Alasan penolakan minimal 5 karakter.",
      });
  });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "owner")
      throw new AppError("FORBIDDEN", "Akses owner diperlukan.", 403);
    const { id } = await params;
    const input = schema.parse(await request.json());
    const db = adminDb();
    const paymentReference = db.doc(`payments/${id}`);
    const initialPayment = await paymentReference.get();
    if (!initialPayment.exists)
      throw new AppError("NOT_FOUND", "Pembayaran tidak ditemukan.", 404);
    const initial = initialPayment.data()!;
    const bookingReference = db.doc(`bookings/${initial.bookingId}`);
    const bookingDocument = await bookingReference.get();
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
    ).map((lockId) => db.doc(`bookingLocks/${lockId}`));
    const approved = input.decision === "approve";
    let changed = false;
    let email = "";

    await db.runTransaction(async (transaction) => {
      const payment = await transaction.get(paymentReference);
      const invoice = await transaction.get(
        db.doc(`invoices/${initial.invoiceId}`),
      );
      const currentBooking = await transaction.get(bookingReference);
      const locks = await transaction.getAll(...lockReferences);
      if (!payment.exists || !invoice.exists || !currentBooking.exists)
        throw new AppError(
          "RELATED_DATA_MISSING",
          "Data pembayaran tidak lengkap.",
          409,
        );
      const paymentData = payment.data()!;
      const expectedFinalStatus = approved ? "paid" : "rejected";
      if (paymentData.status === expectedFinalStatus) return;
      if (paymentData.status !== "waiting_verification")
        throw new AppError(
          "INVALID_STATUS",
          "Pembayaran tidak dapat diverifikasi.",
          409,
        );
      if (
        approved &&
        locks.some(
          (lock) =>
            !lock.exists || lock.data()!.bookingId !== initial.bookingId,
        )
      )
        throw new AppError(
          "BOOKING_LOCK_LOST",
          "Jadwal booking telah kedaluwarsa atau digunakan booking lain.",
          409,
        );

      changed = true;
      email = paymentData.tenantEmail || "";
      const now = FieldValue.serverTimestamp();
      transaction.update(paymentReference, {
        status: expectedFinalStatus,
        verificationNote: input.note || null,
        verifiedAt: now,
        verifiedBy: session.uid,
        rejectionReason: approved ? null : input.note,
        paidAt: approved ? now : null,
        updatedAt: now,
      });
      transaction.update(invoice.ref, {
        status: approved ? "paid" : "unpaid",
        paidAt: approved ? now : null,
        updatedAt: now,
      });
      transaction.update(bookingReference, {
        status: approved ? "confirmed" : "pending_payment",
        ...(approved ? { expiresAt: null } : {}),
        updatedAt: now,
      });
      if (approved)
        locks.forEach((lock) =>
          transaction.update(lock.ref, { expiresAt: null, updatedAt: now }),
        );
      transaction.set(db.collection("activities").doc(), {
        actorId: session.uid,
        tenantId: paymentData.tenantId,
        subjectType: "payment",
        subjectId: id,
        action: approved ? "approved" : "rejected",
        description: approved
          ? "Transfer manual disetujui."
          : `Transfer manual ditolak: ${input.note}`,
        createdAt: now,
      });
      transaction.set(db.collection("notifications").doc(), {
        userId: paymentData.tenantId,
        type: "payment_updated",
        title: approved ? "Pembayaran disetujui" : "Pembayaran ditolak",
        message: approved ? "Transfer manual telah diverifikasi." : input.note,
        link: `/tenant/tagihan/${initial.invoiceId}`,
        readAt: null,
        createdAt: now,
      });
    });

    if (changed && approved)
      await sendPaymentSuccessEmail(id).catch(() => undefined);
    else if (changed && email)
      await sendTransactionalEmail({
        to: email,
        subject: "Pembayaran ditolak",
        title: "Pembayaran ditolak",
        message: input.note,
        template: "manual_payment_rejected",
        relatedId: id,
      }).catch(() => undefined);
    return Response.json(
      success({ id, status: approved ? "paid" : "rejected", changed }),
    );
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
