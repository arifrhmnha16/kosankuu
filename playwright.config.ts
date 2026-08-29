import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  globalSetup: "./scripts/playwright-global.ts",
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", testIgnore: /critical-flows\.spec\.ts/, use: { ...devices["Pixel 7"], browserName: "chromium" } },
  ],
});
