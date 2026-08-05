import { describe, expect, it } from "vitest";
import {
  calculatePrice,
  invoiceNumber,
  lockIds,
  overlaps,
} from "@/lib/booking";
const pricing = {
  hourly: 50_000,
  daily: 250_000,
  monthly: 1_500_000,
  yearly: 16_000_000,
  deposit: 500_000,
};
describe("booking domain", () => {
  it("sewa harian tidak mengenakan deposit bulanan", () =>
    expect(
      calculatePrice(
        pricing,
        "daily",
        new Date("2026-08-01T00:00:00Z"),
        new Date("2026-08-03T00:00:00Z"),
      ).total,
    ).toBe(500_000));
  it("deposit hanya dikenakan untuk sewa jangka panjang", () => {
    expect(calculatePrice(pricing, "hourly", new Date("2026-08-01T00:00:00Z"), new Date("2026-08-01T02:00:00Z")).deposit).toBe(0);
    expect(calculatePrice(pricing, "monthly", new Date("2026-08-01T00:00:00Z"), new Date("2026-09-01T00:00:00Z")).deposit).toBe(500_000);
  });
  it("membulatkan durasi jam", () =>
    expect(
      calculatePrice(
        pricing,
        "hourly",
        new Date("2026-08-01T00:00:00Z"),
        new Date("2026-08-01T01:01:00Z"),
      ).units,
    ).toBe(2));
  it("menghitung satu tahun kalender", () =>
    expect(calculatePrice(pricing, "yearly", new Date("2026-08-01T00:00:00Z"), new Date("2027-08-01T00:00:00Z")).units).toBe(1));
  it("mendeteksi overlap dengan interval setengah terbuka", () => {
    expect(overlaps(new Date(0), new Date(10), new Date(9), new Date(20))).toBe(
      true,
    );
    expect(
      overlaps(new Date(0), new Date(10), new Date(10), new Date(20)),
    ).toBe(false);
  });
  it("membuat lock deterministik", () =>
    expect(
      lockIds(
        "r1",
        "daily",
        new Date("2026-08-01T10:00:00Z"),
        new Date("2026-08-03T00:00:00Z"),
      ),
    ).toEqual(["r1_20260801", "r1_20260802"]));
  it("membuat nomor invoice", () =>
    expect(invoiceNumber("202608", 7)).toBe("MR-202608-0007"));
});
