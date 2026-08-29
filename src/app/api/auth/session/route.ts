import { z } from "zod";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { env } from "@/lib/env";
import { success, resultError, AppError } from "@/lib/errors";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { getSession } from "@/lib/auth/session";
import { sendTransactionalEmail } from "@/lib/email";
export async function GET() {
  const session = await getSession();
  return Response.json(
    success(
      session
        ? { authenticated: true, role: session.role as "owner" | "tenant" }
        : { authenticated: false, role: null },
    ),
  );
}
export async function POST(req: Request) {
  try {
    await assertSameOrigin(req);
    await rateLimit(
      `session:${req.headers.get("x-forwarded-for") || "local"}`,
      20,
      60_000,
    );
    const { token } = z
        .object({ token: z.string().min(100) })
        .parse(await req.json()),
      decoded = await adminAuth().verifyIdToken(token);
    if (!["owner", "tenant"].includes(String(decoded.role)))
      throw new AppError("ROLE_MISSING", "Role akun belum tersedia.", 403);
    if (decoded.role === "tenant" && !decoded.email_verified)
      throw new AppError(
        "EMAIL_NOT_VERIFIED",
        "Verifikasi email sebelum login.",
        403,
      );
    const userReference = adminDb().doc(`users/${decoded.uid}`);
    const profile = await userReference.get();
    if (!profile.exists || profile.data()?.role !== decoded.role)
      throw new AppError("PROFILE_MISMATCH", "Profil dan hak akses akun tidak konsisten.", 403);
    if (profile.data()?.status !== "active" || profile.data()?.disabled === true)
      throw new AppError("ACCOUNT_DISABLED", "Akun tidak aktif.", 403);
    const sendWelcome = decoded.role === "tenant" && profile.data()?.emailVerified !== true;
    if (decoded.role === "tenant") await userReference.set({ emailVerified: true }, { merge: true });
    const expiresIn = env.SESSION_EXPIRES_DAYS * 86400000,
      cookie = await adminAuth().createSessionCookie(token, { expiresIn }),
      res = Response.json(
        success({ role: decoded.role as "owner" | "tenant" }),
      );
    res.headers.append(
      "Set-Cookie",
      `${env.SESSION_COOKIE_NAME}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${expiresIn / 1000}${process.env.NODE_ENV === "production" ? "; Secure" : ""}; Priority=High`,
    );
    if (sendWelcome && decoded.email) {
      await sendTransactionalEmail({
        to: decoded.email,
        subject: "Selamat datang di Manzsa Residence",
        title: "Selamat datang",
        message: "Email Anda sudah terverifikasi. Sekarang Anda dapat memilih kamar dan melakukan booking langsung dari website Manzsa Residence.",
        template: "welcome",
        relatedId: decoded.uid,
        actionUrl: `${env.NEXT_PUBLIC_APP_URL}/kamar`,
        actionLabel: "Pilih kamar",
      }).catch(() => undefined);
    }
    return res;
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
