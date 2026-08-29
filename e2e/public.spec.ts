import { test, expect } from "@playwright/test";
test("visitor menjelajah kamar", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Nyaman untuk tinggal/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Lihat Kamar", exact: true }).click();
  await expect(page).toHaveURL(/\/kamar/);
  await expect(
    page.getByRole("heading", { name: "Temukan kamar yang pas." }),
  ).toBeVisible();
});
test("layout mobile dapat digunakan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Buka menu" })).toBeVisible();
});
