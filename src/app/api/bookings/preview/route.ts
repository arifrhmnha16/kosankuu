import { bookingInput } from "@/lib/validation";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { calculatePrice, isActiveBookingLock, lockIds, validateBookingPeriod } from "@/lib/booking";
import { success, resultError, AppError } from "@/lib/errors";
import type { Room } from "@/types/domain";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    if (session.role === "tenant" && !session.email_verified) throw new AppError("EMAIL_NOT_VERIFIED", "Verifikasi email sebelum melakukan booking.", 403);
    const input = bookingInput.parse(await request.json());
    const roomDocument = await adminDb().doc(`rooms/${input.roomId}`).get();
    if (!roomDocument.exists) throw new AppError("NOT_FOUND", "Kamar tidak ditemukan.", 404);
    const room = { id: roomDocument.id, ...roomDocument.data() } as Room;
    if (room.archivedAt || !["available", "reserved", "occupied"].includes(room.status) || !room.rentalTypes.includes(input.rentalType) || (session.role === "tenant" && !room.isPublic)) throw new AppError("ROOM_UNAVAILABLE", "Kamar atau tipe sewa tidak tersedia.", 409);
    const start = new Date(input.startAt), end = new Date(input.endAt);
    const periodError = validateBookingPeriod(input.rentalType, start, end);
    if (periodError) throw new AppError("INVALID_BOOKING_PERIOD", periodError, 422);
    const ids = lockIds(room.id, input.rentalType, start, end);
    const locks = await adminDb().getAll(...ids.map((id) => adminDb().doc(`bookingLocks/${id}`)));
    if (locks.some((document) => document.exists && isActiveBookingLock(document.data()?.expiresAt?.toDate?.()))) throw new AppError("BOOKING_CONFLICT", "Jadwal sudah dipilih pengguna lain.", 409);
    return Response.json(success({ room: { id: room.id, name: room.name, number: room.number }, price: calculatePrice(room.pricing, input.rentalType, start, end), available: true }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
