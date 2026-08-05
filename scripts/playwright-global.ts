import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

let server: ChildProcess | undefined;

async function stopServer() {
  if (!server || server.exitCode !== null || !server.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
    spawnSync("powershell.exe", ["-NoProfile", "-Command", `Stop-Process -Id ${server.pid} -Force -ErrorAction SilentlyContinue`], { stdio: "ignore", windowsHide: true });
    return;
  }
  server.kill("SIGTERM");
  await Promise.race([new Promise<void>((resolve) => server?.once("exit", () => resolve())), delay(10_000)]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

export default async function globalSetup() {
  try { const existing = await fetch("http://127.0.0.1:3000/api/health"); if (existing.ok) return async () => undefined; } catch { /* start a managed server below */ }
  const bin = path.resolve("node_modules/next/dist/bin/next");
  server = spawn(process.execPath, [bin, "dev", "--hostname", "127.0.0.1", "--port", "3000"], {
    cwd: process.cwd(), stdio: "inherit", windowsHide: true,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", FIREBASE_ADMIN_PROJECT_ID: "", FIREBASE_ADMIN_CLIENT_EMAIL: "", FIREBASE_ADMIN_PRIVATE_KEY: "" },
  });
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Next.js berhenti sebelum siap (${server.exitCode}).`);
    try { const response = await fetch("http://127.0.0.1:3000/api/health"); if (response.ok) return stopServer; } catch { /* retry while server starts */ }
    await delay(500);
  }
  await stopServer();
  throw new Error("Next.js tidak siap dalam 30 detik.");
}
