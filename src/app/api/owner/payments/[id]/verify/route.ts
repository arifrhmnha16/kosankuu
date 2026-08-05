import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { success, resultError, AppError } from "@/lib/errors";
import { sendTransactionalEmail } from "@/lib/email";
import { sendPaymentSuccessEmail } from "@/lib/payment-email";

const schema = z.object({ decision: z.enum(["approve", "reject"]), note: z.string().max(500) }).superRefine((value, context) => {
  if (value.decision === "reject" && value.note.trim().length < 5) context.addIssue({ code: "custom", path: ["note"], message: "Alasan penolakan minimal 5 karakter." });
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "owner") throw new AppError("FORBIDDEN", "Akses owner diperlukan.", 403);
    const { id } = await params;
    const input = schema.parse(await req.json());
    const db = adminDb();
    const reference = db.doc(`payments/${id}`);
    let email = "";
    const approved = input.decision === "approve";
    await db.runTransaction(async (transaction) => {
      const document = await transaction.get(reference);
      if (!document.exists || document.data()!.status !== "waiting_verification") throw new AppError("INVALID_STATUS", "Pembayaran tidak dapat diverifikasi.", 409);
      const payment = document.data()!;
      const now = FieldValue.serverTimestamp();
      transaction.update(reference, { status: approved ? "paid" : "rejected", verificationNote: input.note || null, verifiedAt: now, verifiedBy: session.uid, rejectionReason: approved ? null : input.note, paidAt: approved ? now : null, updatedAt: now });
      transaction.update(db.doc(`invoices/${payment.invoiceId}`), { status: approved ? "paid" : "unpaid", paidAt: approved ? now : null, updatedAt: now });
      transaction.update(db.doc(`bookings/${payment.bookingId}`), { status: approved ? "confirmed" : "pending_payment", updatedAt: now });
      transaction.set(db.collection("activities").doc(), { actorId: session.uid, subjectType: "payment", subjectId: id, action: approved ? "approved" : "rejected", description: approved ? "Transfer manual disetujui." : `Transfer manual ditolak: ${input.note}`, createdAt: now });
      transaction.set(db.collection("notifications").doc(), { userId: payment.tenantId, type: "payment_updated", title: approved ? "Pembayaran disetujui" : "Pembayaran ditolak", message: approved ? "Transfer manual telah diverifikasi." : input.note, link: `/tenant/tagihan/${payment.invoiceId}`, readAt: null, createdAt: now });
      email = payment.tenantEmail || "";
    });
    if (approved) await sendPaymentSuccessEmail(id).catch(() => undefined);
    else if (email) await sendTransactionalEmail({ to: email, subject: "Pembayaran ditolak", title: "Pembayaran ditolak", message: input.note, template: "manual_payment_rejected", relatedId: id }).catch(() => undefined);
    return Response.json(success({ id, status: approved ? "paid" : "rejected" }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
