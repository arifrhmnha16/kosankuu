import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { DecodedIdToken } from "firebase-admin/auth";
import type { Role } from "@/types/domain";
import { adminAuth } from "@/lib/firebase/admin";
import { env } from "@/lib/env";

export async function getSession(): Promise<DecodedIdToken | null> {
  const value = (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
  if (!value) return null;
  try { return await adminAuth().verifySessionCookie(value, true); } catch { return null; }
}
export async function requireRole(role: Role) {
  const session = await getSession();
  if (!session) redirect(`/login?next=/${role}`);
  if (session.role !== role) redirect(session.role === "owner" ? "/owner" : "/tenant");
  return session;
}
export { owns } from "@/lib/permissions";
