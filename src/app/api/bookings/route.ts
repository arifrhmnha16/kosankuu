import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { bookingInput } from "@/lib/validation";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { calculatePrice, invoiceNumber, isActiveBookingLock, lockIds, validateBookingPeriod } from "@/lib/booking";
import { AppError, resultError, success } from "@/lib/errors";
import type { Room } from "@/types/domain";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    if (session.role !== "tenant" && session.role !== "owner") throw new AppError("FORBIDDEN", "Akses ditolak.", 403);
    if (session.role === "tenant" && !session.email_verified) throw new AppError("EMAIL_NOT_VERIFIED", "Verifikasi email sebelum melakukan booking.", 403);
    const input = bookingInput.parse(await request.json());
    const tenantId = session.role === "owner" ? input.tenantId : session.uid;
    if (!tenantId) throw new AppError("VALIDATION_ERROR", "Tenant wajib dipilih untuk booking manual.", 422);
    const start = new Date(input.startAt), end = new Date(input.endAt), db = adminDb();
    const periodError = validateBookingPeriod(input.rentalType, start, end);
    if (periodError) throw new AppError("INVALID_BOOKING_PERIOD", periodError, 422);
    const bookingRef = db.collection("bookings").doc(), invoiceRef = db.collection("invoices").doc(), roomRef = db.doc(`rooms/${input.roomId}`);
    const tenantRef = db.doc(`users/${tenantId}`), settingsRef = db.doc("propertySettings/main");
    const counterRef = db.doc(`counters/invoice-${new Date().toISOString().slice(0, 7).replace("-", "")}`);
    const locks = lockIds(input.roomId, input.rentalType, start, end);
    const result = await db.runTransaction(async (transaction) => {
      const [roomDoc, tenantDoc, settingsDoc] = await Promise.all([transaction.get(roomRef), transaction.get(tenantRef), transaction.get(settingsRef)]);
      if (!roomDoc.exists) throw new AppError("NOT_FOUND", "Kamar tidak ditemukan.", 404);
      if (!tenantDoc.exists || tenantDoc.data()?.role !== "tenant" || tenantDoc.data()?.isActive === false) throw new AppError("TENANT_UNAVAILABLE", "Tenant tidak aktif atau tidak ditemukan.", 409);
      const room = { id: roomDoc.id, ...roomDoc.data() } as Room;
      if (room.archivedAt || !["available", "reserved", "occupied"].includes(room.status) || !room.rentalTypes.includes(input.rentalType) || (session.role === "tenant" && !room.isPublic)) throw new AppError("ROOM_UNAVAILABLE", "Kamar atau tipe sewa tidak tersedia.", 409);
      const lockRefs = locks.map((id) => db.doc(`bookingLocks/${id}`));
      const lockDocs = await transaction.getAll(...lockRefs);
      if (lockDocs.some((doc) => doc.exists && isActiveBookingLock(doc.data()?.expiresAt?.toDate?.()))) throw new AppError("BOOKING_CONFLICT", "Jadwal baru saja dipilih pengguna lain.", 409);
      const price = calculatePrice(room.pricing, input.rentalType, start, end);
      const counter = await transaction.get(counterRef), sequence = (counter.data()?.currentValue ?? 0) + 1;
      const number = invoiceNumber(new Date().toISOString().slice(0, 7).replace("-", ""), sequence);
      const expirationMinutes = Math.max(5, Number(settingsDoc.data()?.bookingExpirationMinutes || 30));
      const expiresAt = new Date(Date.now() + expirationMinutes * 60_000), now = FieldValue.serverTimestamp(), tenant = tenantDoc.data()!;
      const snapshot = { room: { id: room.id, name: room.name, number: room.number, slug: room.slug, pricing: room.pricing }, tenant: { uid: tenantId, fullName: tenant.fullName || "Tenant", email: tenant.email || "", phone: tenant.phone || "" }, property: { name: settingsDoc.data()?.name || "Manzsa Residence", address: settingsDoc.data()?.address || "", email: settingsDoc.data()?.email || "" }, pricing: price };
      transaction.set(counterRef, { currentValue: sequence, periodKey: number.slice(3, 9), updatedAt: now }, { merge: true });
      transaction.set(bookingRef, { code: `BKG-${bookingRef.id.slice(0, 8).toUpperCase()}`, tenantId, roomId: room.id, rentalType: input.rentalType, startAt: Timestamp.fromDate(start), endAt: Timestamp.fromDate(end), status: "pending_payment", expiresAt: Timestamp.fromDate(expiresAt), invoiceId: invoiceRef.id, snapshot, createdBy: session.uid, createdAt: now, updatedAt: now });
      transaction.set(invoiceRef, { invoiceNumber: number, bookingId: bookingRef.id, tenantId, subtotal: price.subtotal, depositAmount: price.deposit, additionalAmount: price.additional, discountAmount: price.discount, totalAmount: price.total, status: "unpaid", issuedAt: now, dueAt: Timestamp.fromDate(expiresAt), snapshot, createdAt: now, updatedAt: now });
      lockRefs.forEach((ref) => transaction.set(ref, { bookingId: bookingRef.id, roomId: room.id, tenantId, startAt: Timestamp.fromDate(start), endAt: Timestamp.fromDate(end), expiresAt: Timestamp.fromDate(expiresAt), createdAt: now }));
      transaction.set(db.collection("activities").doc(), { actorId: session.uid, tenantId, subjectType: "booking", subjectId: bookingRef.id, action: "created", description: session.role === "owner" ? "Booking manual dibuat owner." : "Booking dibuat dan menunggu pembayaran.", createdAt: now });
      return { bookingId: bookingRef.id, invoiceId: invoiceRef.id, invoiceNumber: number, total: price.total };
    });
    return Response.json(success(result), { status: 201 });
  } catch (error) {
    const { body, status } = resultError(error); return Response.json(body, { status });
  }
}
