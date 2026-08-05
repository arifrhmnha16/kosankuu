import { expect, test } from "@playwright/test";

test("landing mempertahankan hover, scroll header, FAQ, dan lightbox prototype", async ({ page }) => {
  await page.goto("/");
  const leftPhoto = page.locator(".prototype-room-left");
  await expect(leftPhoto).toBeVisible();
  const before = await leftPhoto.evaluate((element) => getComputedStyle(element).transform);
  await leftPhoto.hover();
  await page.waitForTimeout(350);
  const after = await leftPhoto.evaluate((element) => getComputedStyle(element).transform);
  expect(after).not.toBe(before);

  await page.evaluate(() => window.scrollTo({ top: 200 }));
  await expect(page.locator(".prototype-header")).toHaveClass(/is-scrolled/);

  const faq = page.locator(".prototype-faq-list details").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");

  await page.locator(".prototype-gallery-item").first().click();
  await expect(page.locator(".prototype-lightbox")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".prototype-lightbox")).toHaveCount(0);
});

test("mobile menu memakai transisi prototype", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".prototype-menu-toggle").click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.locator(".prototype-menu-toggle").click();
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
});

test("Lenis menghaluskan scroll anchor tanpa mengganggu aksesibilitas", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.locator(".prototype-links a[href='/#tentang']").click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3000 }).toBeGreaterThan(100);
  await expect(page.locator("#tentang")).toBeInViewport();
});

test("landing mobile memadatkan manfaat, tiga fasilitas, dan FAQ tanpa mengubah konten", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const benefits = page.locator(".prototype-benefits");
  const facilities = page.locator(".prototype-facility:visible");
  await expect(facilities).toHaveCount(3);
  expect(await benefits.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  const faq = page.locator(".prototype-faq-list details").first();
  expect(await faq.evaluate((element) => element.getBoundingClientRect().height)).toBeLessThan(70);
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
});

for (const [route, heading] of [["/login", "Login"], ["/daftar", "Daftar tenant"], ["/lupa-password", "Lupa password"], ["/reset-password?oobCode=visual-test", "Reset password"]] as const) {
  test(`halaman autentikasi mobile ${route} mengikuti komposisi prototype`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.locator(".prototype-header")).toBeVisible();
    await expect(page.locator(".auth-side")).toBeVisible();
    await expect(page.locator(".auth-box")).toBeVisible();
    await expect(page.locator(".auth-box h1")).toHaveText(heading);
  });
}

test("halaman verifikasi email menyediakan kirim ulang", async ({ page }) => {
  await page.goto("/verifikasi-email");
  await expect(page.getByRole("heading", { name: "Periksa email Anda." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Kirim Ulang Verifikasi" })).toBeVisible();
});

test("halaman verifikasi menampilkan status selesai", async ({ page }) => {
  await page.goto("/verifikasi-email?verified=1");
  await expect(page.getByRole("heading", { name: "Email berhasil diverifikasi." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Login Sekarang" })).toHaveAttribute("href", "/login?verified=1");
});
