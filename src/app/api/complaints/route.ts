import { FieldValue } from "firebase-admin/firestore";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { complaintInput } from "@/lib/validation";
import { success, resultError, AppError } from "@/lib/errors";
import { cleanText } from "@/lib/security";
import { sendTransactionalEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "tenant") throw new AppError("FORBIDDEN", "Akses tenant diperlukan.", 403);
    const input = complaintInput.parse(await request.json());
    if (input.attachments.some((asset) => !asset.publicId.startsWith(`manzsa-residence/complaints/${session.uid}-`))) throw new AppError("INVALID_UPLOAD", "Folder lampiran keluhan tidak valid.", 422);
    const db = adminDb(), reference = db.collection("complaints").doc(), history = reference.collection("histories").doc(), now = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      transaction.set(reference, { ...input, title: cleanText(input.title), description: cleanText(input.description), tenantId: session.uid, tenantEmail: session.email || "", status: "open", createdAt: now, updatedAt: now });
      transaction.set(history, { actorId: session.uid, previousStatus: null, newStatus: "open", message: "Keluhan dibuat.", createdAt: now });
      transaction.set(db.collection("activities").doc(), { actorId: session.uid, tenantId: session.uid, subjectType: "complaint", subjectId: reference.id, action: "created", description: "Keluhan baru dibuat.", createdAt: now });
    });
    if (session.email) void sendTransactionalEmail({ to: session.email, subject: "Keluhan diterima", title: "Keluhan diterima", message: "Keluhan Anda telah tercatat dan akan ditindaklanjuti.", template: "complaint_received", relatedId: reference.id }).catch(() => undefined);
    return Response.json(success({ id: reference.id }), { status: 201 });
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
