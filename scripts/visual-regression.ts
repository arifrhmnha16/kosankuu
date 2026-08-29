import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { setTimeout as delay } from "node:timers/promises";

const viewports = [[1536, 960], [390, 844], [768, 1024], [1366, 768], [1920, 1080]] as const;
const output = path.resolve("visual-tests");
if (!existsSync(output)) mkdirSync(output, { recursive: true });
const compiledPrototypeCss = path.join(output, "prototype-tailwind.css");
const tailwind = spawnSync(process.execPath, [path.resolve("node_modules/@tailwindcss/cli/dist/index.mjs"), "-i", path.resolve("scripts/prototype-tailwind.css"), "-o", compiledPrototypeCss, "--minify"], { stdio: "inherit" });
if (tailwind.status !== 0) throw new Error("CSS utility prototype gagal dikompilasi.");
const existingNodePids = process.platform === "win32" ? String(spawnSync("powershell.exe", ["-NoProfile", "-Command", "Get-Process node -ErrorAction SilentlyContinue | ForEach-Object Id"], { encoding: "utf8", windowsHide: true }).stdout).trim().split(/\s+/).filter(Boolean) : [];
const mime: Record<string, string> = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml" };
const staticServer = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  const target = path.resolve("prototype", `.${pathname === "/" ? "/aeline_landing_page.html" : pathname}`);
  if (!target.startsWith(path.resolve("prototype")) || !existsSync(target)) { response.writeHead(404).end(); return; }
  response.setHeader("content-type", mime[path.extname(target)] || "application/octet-stream"); response.end(readFileSync(target));
});
await new Promise<void>((resolve) => staticServer.listen(4174, "127.0.0.1", resolve));
const next = spawn(process.execPath, [path.resolve("node_modules/next/dist/bin/next"), "dev", "--hostname", "127.0.0.1", "--port", "3108"], { cwd: process.cwd(), stdio: "ignore", windowsHide: true, env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", FIREBASE_ADMIN_PROJECT_ID: "", FIREBASE_ADMIN_CLIENT_EMAIL: "", FIREBASE_ADMIN_PRIVATE_KEY: "" } });
for (let attempt = 0; attempt < 80; attempt++) { try { if ((await fetch("http://127.0.0.1:3108/api/health")).ok) break; } catch { /* server starting */ } await delay(500); if (attempt === 79) throw new Error("Next.js visual server tidak siap."); }

const browser = await chromium.launch();
const results: Array<{ viewport: string; differentPixels: number; ratio: number }> = [];
try {
  for (const [width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4174/aeline_landing_page.html", { waitUntil: "networkidle" });
    await page.addStyleTag({ path: compiledPrototypeCss });
    await page.addStyleTag({ content: ".bg-primary{background-color:#c6f564!important}.text-primary{color:#c6f564!important}.bg-secondary{background-color:#1da1f2!important}.bg-surface{background-color:#f3f4f6!important}.bg-dark{background-color:#111827!important}.text-dark{color:#111827!important}.text-body{color:#6b7280!important}[data-public-header]{color:#fff}.border-white{border-color:#fff!important}.bg-white{background-color:#fff!important}#beranda{background-image:linear-gradient(to bottom right,#1da1f2,#1269a4)!important;color:#fff!important}h1,h2,h3,h4,h5,h6{font-family:'Cormorant Garamond',serif!important}body,button,input,select,textarea{font-family:Montserrat,sans-serif!important}" });
    const prototypePath = path.join(output, `prototype-landing-${width}x${height}.png`); await page.screenshot({ path: prototypePath });
    await page.goto("http://127.0.0.1:3108", { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
    const nextPath = path.join(output, `nextjs-landing-${width}x${height}.png`); await page.screenshot({ path: nextPath });
    const original = PNG.sync.read(readFileSync(prototypePath)), implementation = PNG.sync.read(readFileSync(nextPath));
    const diff = new PNG({ width, height });
    const differentPixels = pixelmatch(original.data, implementation.data, diff.data, width, height, { threshold: 0.12 });
    writeFileSync(path.join(output, `diff-landing-${width}x${height}.png`), PNG.sync.write(diff));
    results.push({ viewport: `${width}x${height}`, differentPixels, ratio: differentPixels / (width * height) });
    await context.close();
  }
  writeFileSync(path.join(output, "landing-results.json"), JSON.stringify(results, null, 2));
  console.table(results);
} finally {
  await browser.close(); await new Promise<void>((resolve) => staticServer.close(() => resolve()));
  if (next.pid && next.exitCode === null) { if (process.platform === "win32") { spawnSync("taskkill", ["/PID", String(next.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true }); const exclusions = existingNodePids.length ? ` | Where-Object { $_.Id -notin @(${existingNodePids.join(",")}) }` : ""; spawnSync("powershell.exe", ["-NoProfile", "-Command", `Get-Process node -ErrorAction SilentlyContinue${exclusions} | Stop-Process -Force -ErrorAction SilentlyContinue`], { stdio: "ignore", windowsHide: true }); } else next.kill("SIGTERM"); }
}
