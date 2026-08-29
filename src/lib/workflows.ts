import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { AppError } from "@/lib/errors";
import { sendTransactionalEmail } from "@/lib/email";
import type { DecodedIdToken } from "firebase-admin/auth";

const complaintTransitions: Record<string, string[]> = { open: ["in_progress", "rejected"], in_progress: ["waiting_tenant", "resolved", "rejected"], waiting_tenant: ["in_progress", "resolved"], resolved: ["closed", "in_progress"], closed: [], rejected: [] };
export function canTransition(kind: "booking" | "complaint", from: string, to: string) {
  if (kind === "booking") return false;
  return complaintTransitions[from]?.includes(to) ?? false;
}

export async function transitionComplaint(session: DecodedIdToken, id: string, to: string, message: string) {
  if (session.role !== "owner") throw new AppError("FORBIDDEN", "Akses owner diperlukan.", 403);
  const db = adminDb(), reference = db.doc(`complaints/${id}`);
  let email = "";
  await db.runTransaction(async (transaction) => {
    const document = await transaction.get(reference);
    if (!document.exists) throw new AppError("NOT_FOUND", "Keluhan tidak ditemukan.", 404);
    const from = document.data()!.status;
    if (!canTransition("complaint", from, to)) throw new AppError("INVALID_TRANSITION", `Status ${from} tidak dapat diubah menjadi ${to}.`, 409);
    const now = FieldValue.serverTimestamp();
    transaction.update(reference, { status: to, ownerResponse: message, updatedAt: now, ...(to === "resolved" ? { resolvedAt: now } : {}), ...(to === "closed" ? { closedAt: now } : {}) });
    transaction.set(reference.collection("histories").doc(), { actorId: session.uid, previousStatus: from, newStatus: to, message, createdAt: now });
    transaction.set(db.collection("activities").doc(), { actorId: session.uid, tenantId: document.data()!.tenantId, subjectType: "complaint", subjectId: id, action: `status_${to}`, description: message, createdAt: now });
    transaction.set(db.collection("notifications").doc(), { userId: document.data()!.tenantId, type: "complaint_updated", title: "Keluhan diperbarui", message, link: `/tenant/keluhan/${id}`, readAt: null, createdAt: now });
    email = document.data()!.tenantEmail || "";
  });
  if (email) void sendTransactionalEmail({ to: email, subject: "Keluhan diperbarui", title: "Keluhan diperbarui", message, template: "complaint_updated", relatedId: `${id}_${to}` }).catch(() => undefined);
}

export async function setTenantActive(session: DecodedIdToken, uid: string, active: boolean, note?: string) {
  if (session.role !== "owner") throw new AppError("FORBIDDEN", "Akses owner diperlukan.", 403);
  const user = await adminAuth().getUser(uid);
  await adminAuth().updateUser(uid, { disabled: !active });
  if (!active) await adminAuth().revokeRefreshTokens(uid);
  const db = adminDb(), batch = db.batch(), now = FieldValue.serverTimestamp();
  batch.set(db.doc(`users/${uid}`), { status: active ? "active" : "inactive", disabled: !active, internalNote: note || null, updatedAt: now }, { merge: true });
  batch.set(db.collection("activities").doc(), { actorId: session.uid, subjectType: "user", subjectId: uid, action: active ? "activated" : "deactivated", description: `Akun ${user.email || uid} ${active ? "diaktifkan" : "dinonaktifkan"}.`, createdAt: now });
  await batch.commit();
}

export async function deleteTenantAccount(session: DecodedIdToken, uid: string) {
  if (session.role !== "owner") throw new AppError("FORBIDDEN", "Akses owner diperlukan.", 403);
  const db = adminDb(), profile = await db.doc(`users/${uid}`).get();
  if (!profile.exists || profile.data()?.role !== "tenant") throw new AppError("NOT_FOUND", "Tenant tidak ditemukan.", 404);
  const bookings = await db.collection("bookings").where("tenantId", "==", uid).limit(100).get();
  if (bookings.docs.some((document) => ["pending_payment", "confirmed", "active"].includes(document.data().status))) throw new AppError("TENANT_HAS_ACTIVE_BOOKING", "Akun dengan booking atau sewa aktif tidak dapat dihapus.", 409);
  await adminAuth().deleteUser(uid);
  const batch = db.batch(), now = FieldValue.serverTimestamp();
  batch.delete(db.doc(`users/${uid}`));
  batch.set(db.collection("activities").doc(), { actorId: session.uid, subjectType: "user", subjectId: uid, action: "account_deleted", description: "Akun tenant dihapus. Riwayat transaksi historis tetap dipertahankan.", createdAt: now });
  await batch.commit();
}

export async function createAnnouncementNotifications(announcementId: string, data: Record<string, unknown>) {
  if (data.status !== "published") return;
  const db = adminDb();
  let query: FirebaseFirestore.Query = db.collection("users").where("role", "==", "tenant").where("status", "==", "active");
  if (data.audienceType === "tenant") query = query.where("uid", "==", data.targetUserId);
  if (data.audienceType === "room") query = query.where("activeRoomId", "==", data.targetRoomId);
  const users = await query.limit(500).get(), batch = db.batch(), now = FieldValue.serverTimestamp();
  for (const user of users.docs) batch.set(db.collection("notifications").doc(), { userId: user.id, type: "announcement", title: data.title, message: String(data.content).slice(0, 180), link: `/tenant/pengumuman/${announcementId}`, readAt: null, createdAt: now });
  await batch.commit();
  if (data.priority === "important") for (const user of users.docs) { const email = user.data().email; if (email) void sendTransactionalEmail({ to: email, subject: String(data.title), title: String(data.title), message: String(data.content), template: "important_announcement", relatedId: `${announcementId}_${user.id}` }).catch(() => undefined); }
}

export async function restoreRoom(session: DecodedIdToken, id: string) {
  if (session.role !== "owner") throw new AppError("FORBIDDEN", "Akses owner diperlukan.", 403);
  const db = adminDb(), now = FieldValue.serverTimestamp(), batch = db.batch();
  batch.update(db.doc(`rooms/${id}`), { archivedAt: null, status: "inactive", isPublic: false, updatedAt: now });
  batch.set(db.collection("activities").doc(), { actorId: session.uid, subjectType: "room", subjectId: id, action: "restored", description: "Kamar dipulihkan sebagai inactive dan private.", createdAt: now });
  await batch.commit();
}
