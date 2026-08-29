import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { serializeDoc } from "@/lib/firestore/serialize";
import type { DecodedIdToken } from "firebase-admin/auth";
import { AppError } from "@/lib/errors";
const collections = {
  booking: "bookings",
  tagihan: "invoices",
  invoice: "invoices",
  keluhan: "complaints",
  pengumuman: "announcements",
  aktivitas: "activities",
  profil: "users",
  kamar: "rooms",
  tenant: "users",
  pembayaran: "payments",
  laporan: "payments",
  pengaturan: "propertySettings",
} as const;
export async function listSection(session: DecodedIdToken, section: string) {
  const collection = collections[section as keyof typeof collections];
  if (!collection)
    throw new AppError("NOT_FOUND", "Bagian tidak ditemukan.", 404);
  const db = adminDb();
  if (section === "profil")
    return [await db.doc(`users/${session.uid}`).get()]
      .filter((d) => d.exists)
      .map(serializeDoc);
  if (section === "pengaturan")
    return [await db.doc("propertySettings/main").get()]
      .filter((d) => d.exists)
      .map(serializeDoc);
  let q: FirebaseFirestore.Query = db.collection(collection);
  if (session.role !== "owner") {
    if (section === "pengumuman") return tenantAnnouncements(session);
    q = q.where("tenantId", "==", session.uid);
  } else if (section === "tenant") q = q.where("role", "==", "tenant");
  const snap = await q.limit(250).get();
  return snap.docs
    .map(serializeDoc)
    .sort((a, b) =>
      String(b.createdAt || b.updatedAt || "").localeCompare(
        String(a.createdAt || a.updatedAt || ""),
      ),
    );
}
async function tenantAnnouncements(session: DecodedIdToken) {
  const db = adminDb(),
    user = await db.doc(`users/${session.uid}`).get(),
    roomId = user.data()?.activeRoomId,
    now = Date.now(),
    snap = await db
      .collection("announcements")
      .where("status", "==", "published")
      .limit(200)
      .get();
  return snap.docs
    .map(serializeDoc)
    .filter(
      (a) =>
        (!a.publishedAt || Date.parse(String(a.publishedAt)) <= now) &&
        (!a.expiresAt || Date.parse(String(a.expiresAt)) > now) &&
        (a.audienceType === "all" ||
          (a.audienceType === "tenant" && a.targetUserId === session.uid) ||
          (a.audienceType === "room" && a.targetRoomId === roomId)),
    );
}
export async function sectionDetail(
  session: DecodedIdToken,
  section: string,
  id: string,
) {
  const collection = collections[section as keyof typeof collections];
  if (!collection)
    throw new AppError("NOT_FOUND", "Data tidak ditemukan.", 404);
  const doc = await adminDb().doc(`${collection}/${id}`).get();
  if (!doc.exists)
    throw new AppError("NOT_FOUND", "Data tidak ditemukan.", 404);
  const data = serializeDoc(doc);
  if (session.role !== "owner") {
    const ownerId = section === "profil" ? id : data.tenantId;
    if (ownerId !== session.uid)
      throw new AppError("FORBIDDEN", "Akses ditolak.", 403);
  }
  return data;
}
export async function tenantDashboard(session: DecodedIdToken) {
  const [
    bookings,
    invoices,
    payments,
    complaints,
    announcements,
    activities,
    user,
  ] = await Promise.all([
    listSection(session, "booking"),
    listSection(session, "invoice"),
    listSection(session, "pembayaran"),
    listSection(session, "keluhan"),
    listSection(session, "pengumuman"),
    listSection(session, "aktivitas"),
    adminDb().doc(`users/${session.uid}`).get(),
  ]);
  return {
    user: user.exists ? serializeDoc(user) : null,
    activeBooking:
      bookings.find((x) =>
        ["confirmed", "active"].includes(String(x.status)),
      ) || null,
    unpaidInvoice:
      invoices.find(
        (x) => !["paid", "expired", "cancelled"].includes(String(x.status)),
      ) || null,
    latestPayment: payments[0] || null,
    activeComplaint:
      complaints.find(
        (x) => !["closed", "resolved", "rejected"].includes(String(x.status)),
      ) || null,
    latestAnnouncement: announcements[0] || null,
    recentActivities: activities.slice(0, 8),
  };
}
export async function ownerDashboard() {
  const db = adminDb(),
    [rooms, bookings, invoices, payments, complaints, activities] =
      await Promise.all(
        [
          "rooms",
          "bookings",
          "invoices",
          "payments",
          "complaints",
          "activities",
        ].map((c) => db.collection(c).limit(500).get()),
      );
  const roomRows = rooms.docs.map(serializeDoc),
    invoiceRows = invoices.docs.map(serializeDoc);
  const paid = invoiceRows
      .filter((i) => i.status === "paid")
      .reduce((n, i) => n + Number(i.totalAmount || 0), 0),
    activeRooms = roomRows.filter(
      (r) => !r.archivedAt && r.status !== "inactive",
    ),
    occupied = activeRooms.filter((r) => r.status === "occupied").length;
  return {
    revenue: paid,
    occupancy: activeRooms.length
      ? Math.round((occupied / activeRooms.length) * 100)
      : 0,
    newBookings: bookings.docs.filter((d) =>
      ["pending_approval", "pending_payment"].includes(d.data().status),
    ).length,
    waitingPayments: payments.docs.filter(
      (d) => d.data().status === "waiting_verification",
    ).length,
    openComplaints: complaints.docs.filter(
      (d) => !["closed", "resolved", "rejected"].includes(d.data().status),
    ).length,
    rooms: roomRows,
    activities: activities.docs.map(serializeDoc).slice(0, 8),
  };
}
