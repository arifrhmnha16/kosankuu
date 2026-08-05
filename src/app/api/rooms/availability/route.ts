import { adminDb } from "@/lib/firebase/admin";
import { resultError, success } from "@/lib/errors";

export async function GET(request: Request) {
  try {
    const roomId = new URL(request.url).searchParams.get("roomId");
    if (!roomId) return Response.json({ ok: false, code: "ROOM_REQUIRED", message: "Kamar wajib dipilih." }, { status: 422 });
    const snapshot = await adminDb().collection("bookings").where("roomId", "==", roomId).limit(300).get();
    const periods = snapshot.docs.filter((document) => ["pending_payment", "confirmed", "active"].includes(document.data().status)).map((document) => { const data = document.data(); return { rentalType: data.rentalType, startAt: data.startAt.toDate().toISOString(), endAt: data.endAt.toDate().toISOString() }; });
    return Response.json(success({ periods }));
  } catch (error) { const { body, status } = resultError(error); return Response.json(body, { status }); }
}
