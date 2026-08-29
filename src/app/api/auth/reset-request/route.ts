import { z } from "zod";
import { resultError, success } from "@/lib/errors";
import { sendTransactionalEmail } from "@/lib/email";
import { adminAuth } from "@/lib/firebase/admin";
import { assertSameOrigin, rateLimit } from "@/lib/security";

export async function POST(request: Request) {
  try {
    await assertSameOrigin(request);
    await rateLimit(`reset:${request.headers.get("x-forwarded-for") || "local"}`, 5, 300_000);
    const { email } = z.object({ email: z.string().email() }).parse(await request.json());
    try {
      const link = await adminAuth().generatePasswordResetLink(email, { url: `${process.env.NEXT_PUBLIC_APP_URL || "https://kosankuu.vercel.app"}/login` });
      void sendTransactionalEmail({ to: email, subject: "Reset password Manzsa Residence", title: "Atur ulang password", message: `Gunakan tautan berikut untuk mengatur ulang password: ${link}`, template: "password_reset", relatedId: `reset_${Date.now()}` }).catch(() => undefined);
    } catch { /* Prevent account enumeration. */ }
    return Response.json(success({ sent: true }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
