import "server-only";
import { createHash } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import { headers } from "next/headers";
import { AppError } from "@/lib/errors";
import { adminDb } from "@/lib/firebase/admin";
import { integrationStatus } from "@/lib/env";

const localBuckets = new Map<string, { count: number; reset: number }>();
export async function assertSameOrigin(request: Request) { const origin = request.headers.get("origin"); if (!origin) return; const values = await headers(), host = values.get("x-forwarded-host") || values.get("host"); if (!host || new URL(origin).host !== host) throw new AppError("INVALID_ORIGIN", "Permintaan lintas situs ditolak.", 403); }

export async function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  if (!integrationStatus().firebaseAdmin) return localRateLimit(key, limit, windowMs);
  const now = Date.now(), id = createHash("sha256").update(key).digest("hex"), reference = adminDb().doc(`rateLimits/${id}`);
  await adminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference), data = snapshot.data(), resetAt = data?.resetAt?.toMillis?.() || 0;
    if (!snapshot.exists || resetAt <= now) { transaction.set(reference, { count: 1, resetAt: Timestamp.fromMillis(now + windowMs), updatedAt: Timestamp.fromMillis(now) }); return; }
    if (Number(data?.count || 0) >= limit) throw new AppError("RATE_LIMITED", "Terlalu banyak permintaan. Coba kembali beberapa saat lagi.", 429);
    transaction.update(reference, { count: Number(data?.count || 0) + 1, updatedAt: Timestamp.fromMillis(now) });
  });
}

function localRateLimit(key: string, limit: number, windowMs: number) { const now = Date.now(), entry = localBuckets.get(key); if (!entry || entry.reset <= now) { localBuckets.set(key, { count: 1, reset: now + windowMs }); return; } if (entry.count >= limit) throw new AppError("RATE_LIMITED", "Terlalu banyak permintaan. Coba kembali beberapa saat lagi.", 429); entry.count++; }
export const cleanText = (value: string) => value.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001F\u007F]/g, "").trim();
