import type { PriceBreakdown, Pricing, RentalType } from "@/types/domain";

const HOUR = 3_600_000, DAY = 86_400_000;
export function validateBookingPeriod(type: RentalType, start: Date, end: Date, now = new Date()): string | null {
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) return "Waktu booking tidak valid.";
  if (start < now) return "Waktu mulai tidak boleh berada di masa lalu.";
  const duration = end.getTime() - start.getTime();
  if (type === "hourly" && (duration < HOUR || duration > 24 * HOUR || duration % HOUR !== 0)) return "Sewa per jam harus 1–24 jam penuh.";
  if (type === "daily" && (duration < DAY || duration > 30 * DAY || duration % DAY !== 0)) return "Sewa harian harus 1–30 periode 24 jam.";
  if (type === "monthly" && (duration < 28 * DAY || duration > 367 * DAY)) return "Sewa bulanan harus 1–12 bulan.";
  if (type === "yearly") {
    const expected = new Date(start);
    expected.setUTCFullYear(expected.getUTCFullYear() + 1);
    if (end.getTime() !== expected.getTime()) return "Sewa tahunan harus tepat satu tahun.";
  }
  return null;
}
export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) { return aStart < bEnd && bStart < aEnd; }
export function isActiveBookingLock(expiresAt: Date | null | undefined, now = new Date()) {
  return !expiresAt || expiresAt > now;
}

export function bookingBlocksAvailability(status: string, expiresAt: Date | null | undefined, now = new Date()) {
  if (["confirmed", "active"].includes(status)) return true;
  return ["pending_payment", "pending_approval"].includes(status) && isActiveBookingLock(expiresAt, now);
}
export function calculatePrice(pricing: Pricing, type: RentalType, start: Date, end: Date, additional = 0, discount = 0): PriceBreakdown {
  if (end <= start) throw new Error("Waktu selesai harus setelah waktu mulai.");
  const diff = end.getTime() - start.getTime();
  const units = type === "hourly" ? Math.ceil(diff / HOUR) : type === "daily" ? Math.ceil(diff / DAY) : type === "monthly" ? monthUnits(start, end) : yearUnits(start, end);
  const unitPrice = pricing[type];
  if (unitPrice <= 0) throw new Error("Tipe sewa tidak tersedia.");
  const subtotal = unitPrice * units;
  const deposit = type === "monthly" || type === "yearly" ? pricing.deposit : 0;
  return { unitPrice, units, subtotal, deposit, additional, discount, total: Math.max(0, subtotal + deposit + additional - discount) };
}
function monthUnits(start: Date, end: Date) { const exact = (end.getUTCFullYear()-start.getUTCFullYear())*12 + end.getUTCMonth()-start.getUTCMonth(); return Math.max(1, exact + (end.getUTCDate()>start.getUTCDate()?1:0)); }
function yearUnits(start: Date, end: Date) { const exact = end.getUTCFullYear()-start.getUTCFullYear(); return Math.max(1, exact + (end.getUTCMonth()>start.getUTCMonth()||(end.getUTCMonth()===start.getUTCMonth()&&end.getUTCDate()>start.getUTCDate())?1:0)); }
export function lockIds(roomId: string, type: RentalType, start: Date, end: Date) {
  const step = type === "hourly" ? HOUR : DAY; const ids: string[] = [];
  let cursor = type === "hourly" ? Math.floor(start.getTime()/HOUR)*HOUR : Date.UTC(start.getUTCFullYear(),start.getUTCMonth(),start.getUTCDate());
  while (cursor < end.getTime()) { ids.push(`${roomId}_${new Date(cursor).toISOString().slice(0,type === "hourly" ? 13 : 10).replace(/[-T:]/g,"")}`); cursor += step; if(ids.length > 400) throw new Error("Periode booking terlalu panjang."); }
  return ids;
}
export function invoiceNumber(period: string, sequence: number) { if(!/^\d{6}$/.test(period)||sequence<1) throw new Error("Nomor invoice tidak valid."); return `MR-${period}-${String(sequence).padStart(4,"0")}`; }
