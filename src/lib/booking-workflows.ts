import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import type { DecodedIdToken } from "firebase-admin/auth";
import { adminDb } from "@/lib/firebase/admin";
import { AppError } from "@/lib/errors";
import { lockIds } from "@/lib/booking";
import { sendTransactionalEmail } from "@/lib/email";
import { canTransitionBooking } from "@/lib/booking-state";

function lockReferences(data: FirebaseFirestore.DocumentData) {
  const db = adminDb();
  return lockIds(data.roomId, data.rentalType, data.startAt.toDate(), data.endAt.toDate()).map((lockId) => db.doc(`bookingLocks/${lockId}`));
}

export async function transitionBooking(session: DecodedIdToken, id: string, to: string, reason?: string) {
  if (session.role !== "owner") throw new AppError("FORBIDDEN", "Akses owner diperlukan.", 403);
  const db = adminDb(), reference = db.doc(`bookings/${id}`), initial = await db.doc(`bookings/${id}`).get();
  if (!initial.exists) throw new AppError("NOT_FOUND", "Booking tidak ditemukan.", 404);
  const references = lockReferences(initial.data()!);
  let recipient = "", code = id;
  await db.runTransaction(async (transaction) => {
    const booking = await transaction.get(reference);
    const locks = await transaction.getAll(...references);
    if (!booking.exists) throw new AppError("NOT_FOUND", "Booking tidak ditemukan.", 404);
    const data = booking.data()!;
    if (!canTransitionBooking(data.status, to)) throw new AppError("INVALID_TRANSITION", `Status ${data.status} tidak dapat diubah menjadi ${to}.`, 409);
    if (["rejected", "cancelled"].includes(to) && !reason?.trim()) throw new AppError("REASON_REQUIRED", "Alasan wajib diisi.", 422);
    if (["confirmed", "active"].includes(to) && locks.some((lock) => !lock.exists || lock.data()!.bookingId !== id)) throw new AppError("BOOKING_LOCK_LOST", "Lock booking tidak lagi dimiliki booking ini.", 409);
    const now = FieldValue.serverTimestamp();
    transaction.update(reference, { status: to, statusReason: reason || null, updatedAt: now, ...(to === "confirmed" ? { expiresAt: null } : {}), ...(to === "active" ? { activatedAt: now } : {}), ...(to === "completed" ? { completedAt: now } : {}) });
    if (to === "confirmed") locks.forEach((lock) => transaction.update(lock.ref, { expiresAt: null, updatedAt: now }));
    if (["rejected", "cancelled", "completed", "expired"].includes(to)) locks.forEach((lock) => { if (lock.exists && lock.data()!.bookingId === id) transaction.delete(lock.ref); });
    if (data.invoiceId && ["rejected", "cancelled", "expired"].includes(to)) transaction.update(db.doc(`invoices/${data.invoiceId}`), { status: to === "expired" ? "expired" : "cancelled", updatedAt: now });
    if (to === "active") transaction.update(db.doc(`rooms/${data.roomId}`), { status: "occupied", updatedAt: now });
    if (["completed", "cancelled"].includes(to) && data.status === "active") transaction.update(db.doc(`rooms/${data.roomId}`), { status: "available", updatedAt: now });
    transaction.set(db.collection("activities").doc(), { actorId: session.uid, tenantId: data.tenantId, subjectType: "booking", subjectId: id, action: `status_${to}`, description: `Status booking diubah menjadi ${to}${reason ? `: ${reason}` : ""}.`, createdAt: now });
    transaction.set(db.collection("notifications").doc(), { userId: data.tenantId, type: "booking_updated", title: "Status booking diperbarui", message: `Booking ${data.code || id} kini ${to}.`, link: `/tenant/booking/${id}`, readAt: null, createdAt: now });
    recipient = data.snapshot?.tenant?.email || ""; code = data.code || id;
  });
  if (recipient) void sendTransactionalEmail({ to: recipient, subject: "Status booking diperbarui", title: "Status booking diperbarui", message: `Booking ${code} kini berstatus ${to}.`, template: `booking_${to}`, relatedId: `${id}_${to}` }).catch(() => undefined);
}

export async function cancelTenantBooking(session: DecodedIdToken, id: string, reason: string) {
  const db = adminDb(), reference = db.doc(`bookings/${id}`), initial = await db.doc(`bookings/${id}`).get();
  if (!initial.exists || initial.data()!.tenantId !== session.uid) throw new AppError("NOT_FOUND", "Booking tidak ditemukan.", 404);
  const references = lockReferences(initial.data()!);
  await db.runTransaction(async (transaction) => {
    const booking = await transaction.get(reference);
    const locks = await transaction.getAll(...references);
    if (!booking.exists || booking.data()!.tenantId !== session.uid) throw new AppError("NOT_FOUND", "Booking tidak ditemukan.", 404);
    const data = booking.data()!;
    if (!["draft", "pending_approval", "pending_payment", "confirmed"].includes(data.status)) throw new AppError("INVALID_TRANSITION", "Booking ini tidak dapat dibatalkan.", 409);
    const now = FieldValue.serverTimestamp();
    transaction.update(reference, { status: "cancelled", statusReason: reason, updatedAt: now });
    locks.forEach((lock) => { if (lock.exists && lock.data()!.bookingId === id) transaction.delete(lock.ref); });
    if (data.invoiceId) transaction.update(db.doc(`invoices/${data.invoiceId}`), { status: "cancelled", updatedAt: now });
    transaction.set(db.collection("activities").doc(), { actorId: session.uid, tenantId: session.uid, subjectType: "booking", subjectId: id, action: "cancelled", description: `Booking dibatalkan: ${reason}`, createdAt: now });
  });
}
