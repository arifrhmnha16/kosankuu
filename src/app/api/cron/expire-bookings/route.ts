import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { success, resultError, AppError } from "@/lib/errors";
import { sendTransactionalEmail } from "@/lib/email";
export async function GET(req: Request) {
  try {
    if (
      !process.env.CRON_SECRET ||
      req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
    )
      throw new AppError("FORBIDDEN", "Akses cron ditolak.", 401);
    const db = adminDb(),
      due = await db
        .collection("bookings")
        .where("status", "in", ["pending_payment", "pending_approval"])
        .where("expiresAt", "<=", Timestamp.now())
        .limit(100)
        .get();
    let expired = 0;
    for (const item of due.docs) {
      const locks = await db
        .collection("bookingLocks")
        .where("bookingId", "==", item.id)
        .get();
      let email = "";
      const changed = await db.runTransaction(async (tx) => {
        const current = await tx.get(item.ref);
        if (
          !current.exists ||
          !["pending_payment", "pending_approval"].includes(
            current.data()!.status,
          )
        )
          return false;
        const data = current.data()!,
          now = FieldValue.serverTimestamp();
        tx.update(item.ref, { status: "expired", updatedAt: now });
        if (data.invoiceId)
          tx.update(db.doc(`invoices/${data.invoiceId}`), {
            status: "expired",
            updatedAt: now,
          });
        locks.docs.forEach((lock) => {
          if (lock.data().bookingId === item.id) tx.delete(lock.ref);
        });
        tx.set(db.doc(`activities/booking-expired-${item.id}`), {
          actorId: "system",
          tenantId: data.tenantId,
          subjectType: "booking",
          subjectId: item.id,
          action: "expired",
          description: "Booking kedaluwarsa otomatis.",
          createdAt: now,
        });
        email = data.snapshot?.tenant?.email || "";
        return true;
      });
      if (changed) {
        expired++;
        if (email)
          void sendTransactionalEmail({
            to: email,
            subject: "Booking kedaluwarsa",
            title: "Booking kedaluwarsa",
            message:
              "Batas pembayaran booking telah berakhir dan jadwal kembali tersedia.",
            template: "booking_expired",
            relatedId: item.id,
          }).catch(() => undefined);
      }
    }
    return Response.json(success({ scanned: due.size, expired }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
