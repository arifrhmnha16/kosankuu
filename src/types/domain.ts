export type Role = "owner" | "tenant";
export type RentalType = "hourly" | "daily" | "monthly" | "yearly";
export type RoomStatus = "available" | "reserved" | "occupied" | "maintenance" | "inactive";
export type BookingStatus = "draft" | "pending_approval" | "pending_payment" | "confirmed" | "active" | "completed" | "cancelled" | "rejected" | "expired";
export type PaymentStatus = "pending" | "waiting_verification" | "paid" | "failed" | "expired" | "cancelled" | "refunded" | "rejected";

export interface MediaAsset { publicId: string; secureUrl: string; width: number; height: number; format: string; bytes: number; resourceType: "image"; altText: string; sortOrder: number }
export interface Pricing { hourly: number; daily: number; monthly: number; yearly: number; deposit: number }
export interface Room {
  id: string; slug: string; number: string; name: string; type: string; description: string;
  capacity: number; area: number; status: RoomStatus; isPublic: boolean; isFeatured: boolean;
  rentalTypes: RentalType[]; pricing: Pricing; facilities: string[]; rules: string[]; images: MediaAsset[]; archivedAt?: unknown;
}
export interface AppUser { uid: string; role: Role; fullName: string; email: string; phone: string; avatar?: MediaAsset; disabled?: boolean }
export interface PriceBreakdown { unitPrice: number; units: number; subtotal: number; deposit: number; additional: number; discount: number; total: number }
export interface BookingSnapshot { room: Pick<Room, "id" | "name" | "number" | "slug" | "pricing">; tenant: Pick<AppUser, "uid" | "fullName" | "email" | "phone">; property: { name: string; address: string; email: string }; pricing: PriceBreakdown }
export interface Booking { id: string; code: string; tenantId: string; roomId: string; rentalType: RentalType; startAt: Date; endAt: Date; status: BookingStatus; expiresAt?: Date; invoiceId: string; snapshot: BookingSnapshot }

export const sampleRooms: Room[] = [
  { id:"room-101", slug:"kamar-standard-101", number:"101", name:"Kamar Standard 101", type:"Standard", description:"Kamar tenang dengan pencahayaan alami dan kebutuhan harian yang tertata.", capacity:1, area:14, status:"available", isPublic:true, isFeatured:true, rentalTypes:["daily","monthly","yearly"], pricing:{hourly:0,daily:275000,monthly:1650000,yearly:18000000,deposit:500000}, facilities:["AC","Wi-Fi","Kamar mandi dalam","Meja kerja"], rules:["Maksimal 1 penghuni","Tidak merokok di dalam kamar"], images:[] },
  { id:"room-201", slug:"kamar-deluxe-201", number:"201", name:"Kamar Deluxe 201", type:"Deluxe", description:"Ruang lebih lega dengan area kerja, kamar mandi privat, dan suasana hangat.", capacity:2, area:20, status:"available", isPublic:true,isFeatured:true,rentalTypes:["hourly","daily","monthly","yearly"],pricing:{hourly:85000,daily:375000,monthly:2250000,yearly:25000000,deposit:750000},facilities:["AC","Wi-Fi","Kamar mandi dalam","Smart TV","Lemari"],rules:["Maksimal 2 penghuni","Tamu wajib melapor"],images:[] },
  { id:"room-301", slug:"kamar-premium-301", number:"301", name:"Kamar Premium 301", type:"Premium", description:"Kamar premium dengan pantry ringkas dan sudut duduk privat.", capacity:2, area:26, status:"reserved", isPublic:true,isFeatured:true,rentalTypes:["daily","monthly","yearly"],pricing:{hourly:0,daily:525000,monthly:3150000,yearly:35000000,deposit:1000000},facilities:["AC","Wi-Fi","Pantry","Smart TV","Water heater"],rules:["Maksimal 2 penghuni","Tidak membawa hewan"],images:[] }
];
