import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/", "/kamar", "/kamar/kamar-e2e", "/fasilitas", "/galeri",
  "/faq", "/kontak", "/tentang", "/login", "/daftar", "/lupa-password",
  "/reset-password?oobCode=test", "/verifikasi-email",
];

for (const route of publicRoutes) {
  test(`runtime publik ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), route).toBeLessThan(400);
    expect(await page.locator("body").isVisible()).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `${route} overflow horizontal`).toBe(true);
    expect(errors.filter((message) => !message.includes("favicon")), `${route} console`).toEqual([]);
  });
}

for (const route of ["/tenant", "/tenant/tagihan", "/tenant/invoice", "/tenant/keluhan", "/tenant/pengumuman", "/tenant/aktivitas", "/tenant/profil", "/owner", "/owner/kamar", "/owner/booking", "/owner/tenant", "/owner/pembayaran", "/owner/invoice", "/owner/keluhan", "/owner/pengumuman", "/owner/laporan", "/owner/pengaturan"]) {
  test(`route terlindungi ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(/\/login\?next=/);
  });
}
