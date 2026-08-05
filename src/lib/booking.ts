import type { PriceBreakdown, Pricing, RentalType } from "@/types/domain";

const HOUR = 3_600_000, DAY = 86_400_000;
export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) { return aStart < bEnd && bStart < aEnd; }
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
