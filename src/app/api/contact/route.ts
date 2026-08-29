import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { sendTransactionalEmail } from "@/lib/email";
import { integrationStatus } from "@/lib/env";
import { AppError, resultError, success } from "@/lib/errors";
import { adminDb } from "@/lib/firebase/admin";
import { cleanText, rateLimit } from "@/lib/security";

const schema = z.object({ name: z.string().min(2).max(100), email: z.string().email(), message: z.string().min(10).max(2000) });

export async function POST(request: Request) {
  try {
    await rateLimit(`contact:${request.headers.get("x-forwarded-for") || "local"}`, 5, 300_000);
    if (!integrationStatus().firebaseAdmin) throw new AppError("INTEGRATION_NOT_CONFIGURED", "Form kontak memerlukan konfigurasi Firebase.", 503);
    const input = schema.parse(await request.json());
    const reference = adminDb().collection("contactMessages").doc();
    await reference.set({ name: cleanText(input.name), email: input.email, message: cleanText(input.message), status: "new", createdAt: FieldValue.serverTimestamp() });
    const ownerEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (ownerEmail) void sendTransactionalEmail({ to: ownerEmail, subject: `Pesan kontak dari ${input.name}`, title: "Pesan kontak baru", message: input.message, template: "contact", relatedId: reference.id }).catch(() => undefined);
    return Response.json(success({ id: reference.id }), { status: 201 });
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
