import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { integrationStatus } from "@/lib/env";
import { serializeDoc } from "@/lib/firestore/serialize";
import { sampleRooms, type Room } from "@/types/domain";

const fallbackAllowed = () => process.env.NODE_ENV !== "production" || process.env.ALLOW_PUBLIC_FALLBACK === "true";

export const fallbackProperty = {
  name: "Manzsa Residence",
  description: "Hunian nyaman dengan proses sewa yang jelas.",
  address: process.env.NEXT_PUBLIC_PROPERTY_ADDRESS || "Jakarta, Indonesia",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "halo@manzsaresidence.id",
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "",
  operatingHours: "Senin–Sabtu, 08.00–18.00 WIB",
  facilities: ["Wi-Fi", "AC", "Dapur bersama", "CCTV", "Laundry", "Parkir"],
  faq: [],
};

function requireConfiguredPublicData() {
  if (!fallbackAllowed()) throw new Error("Firebase Admin wajib dikonfigurasi untuk data publik production.");
}

export async function publicProperty() {
  if (!integrationStatus().firebaseAdmin) {
    requireConfiguredPublicData();
    return fallbackProperty;
  }
  const document = await adminDb().doc("propertySettings/main").get();
  if (!document.exists) {
    requireConfiguredPublicData();
    return fallbackProperty;
  }
  return { ...fallbackProperty, ...serializeDoc(document) };
}

export async function publicRooms(): Promise<Room[]> {
  if (!integrationStatus().firebaseAdmin) {
    requireConfiguredPublicData();
    return sampleRooms;
  }
  const snapshot = await adminDb().collection("rooms").where("isPublic", "==", true).limit(100).get();
  return snapshot.docs.map(serializeDoc).filter((room) => room.status !== "inactive" && room.status !== "maintenance" && !room.archivedAt) as unknown as Room[];
}

export async function publicRoomBySlug(slug: string) {
  return (await publicRooms()).find((room) => room.slug === slug) || null;
}

export async function publicFacilities() {
  if (!integrationStatus().firebaseAdmin) {
    requireConfiguredPublicData();
    return fallbackProperty.facilities.map((name, index) => ({ id: String(index), name, description: "" }));
  }
  const snapshot = await adminDb().collection("facilities").where("isPublic", "==", true).limit(100).get();
  return snapshot.docs.map(serializeDoc);
}

export async function publicGallery() {
  if (!integrationStatus().firebaseAdmin) {
    requireConfiguredPublicData();
    return [];
  }
  const snapshot = await adminDb().collection("gallery").where("isPublic", "==", true).limit(100).get();
  return snapshot.docs.map(serializeDoc).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
}
