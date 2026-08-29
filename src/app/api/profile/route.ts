import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { getSession } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { success, resultError, AppError } from "@/lib/errors";
import { cleanText } from "@/lib/security";
import { mediaSchema } from "@/lib/validation";

const schema = z.object({
  fullName: z.string().min(2).max(100), phone: z.string().min(8).max(20), address: z.string().min(5).max(500),
  emergencyContact: z.object({ name: z.string().min(2).max(100), phone: z.string().min(8).max(20) }),
  identityNumber: z.string().max(30), avatar: mediaSchema.nullable(),
});

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "tenant") throw new AppError("FORBIDDEN", "Akses tenant diperlukan.", 403);
    const input = schema.parse(await request.json());
    if (input.avatar && !input.avatar.publicId.startsWith(`manzsa-residence/users/${session.uid}/`)) throw new AppError("INVALID_UPLOAD", "Folder avatar tidak valid.", 422);
    await adminDb().doc(`users/${session.uid}`).update({ ...input, fullName: cleanText(input.fullName), address: cleanText(input.address), emergencyContact: { name: cleanText(input.emergencyContact.name), phone: input.emergencyContact.phone }, updatedAt: FieldValue.serverTimestamp() });
    return Response.json(success({ uid: session.uid }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
