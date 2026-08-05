import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import net from "node:net";
import { setTimeout as delay } from "node:timers/promises";

const cache = path.join(homedir(), ".cache", "firebase", "emulators");
let jar = existsSync(cache) ? readdirSync(cache).filter((name) => /^cloud-firestore-emulator-.*\.jar$/.test(name)).sort().at(-1) : undefined;
if (!jar) {
  const firebase = path.resolve("node_modules/firebase-tools/lib/bin/firebase.js");
  const download = spawnSync(process.execPath, [firebase, "setup:emulators:firestore"], {
    stdio: "inherit", env: { ...process.env, XDG_CONFIG_HOME: path.resolve(".firebase-config"), FIREBASE_CLI_DISABLE_UPDATE_CHECK: "true" },
  });
  if (download.status !== 0) process.exit(download.status ?? 1);
  jar = readdirSync(cache).filter((name) => /^cloud-firestore-emulator-.*\.jar$/.test(name)).sort().at(-1);
}
if (!jar) throw new Error("Binary Firestore Emulator tidak ditemukan.");

const existingJavaPids = process.platform === "win32" ? String(spawnSync("powershell.exe", ["-NoProfile", "-Command", "Get-Process java -ErrorAction SilentlyContinue | ForEach-Object Id"], { encoding: "utf8", windowsHide: true }).stdout).trim().split(/\s+/).filter(Boolean) : [];
const javaExecutable = process.platform === "win32" ? String(spawnSync("where.exe", ["java"], { encoding: "utf8" }).stdout).split(/\r?\n/).find(Boolean) || "java" : "java";
const emulator = spawn(javaExecutable, ["-Duser.language=en", "-Duser.country=US", "-jar", path.join(cache, jar), "--host", "127.0.0.1", "--port", "8080", "--websocket_port", "9150", "--project_id", "demo-manzsa"], {
  stdio: "ignore", windowsHide: true,
});

function canConnect() {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection(8080, "127.0.0.1");
    socket.once("connect", () => { socket.destroy(); resolve(true); });
    socket.once("error", () => resolve(false));
    socket.setTimeout(300, () => { socket.destroy(); resolve(false); });
  });
}

async function ready() {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (emulator.exitCode !== null) throw new Error("Firestore Emulator berhenti sebelum siap.");
    if (await canConnect()) return;
    await delay(250);
  }
  throw new Error("Firestore Emulator tidak siap dalam 15 detik.");
}

async function stopEmulator() {
  if (emulator.exitCode !== null) return;
  if (process.platform === "win32" && emulator.pid) {
    spawnSync("taskkill", ["/PID", String(emulator.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
    spawnSync("powershell.exe", ["-NoProfile", "-Command", `Stop-Process -Id ${emulator.pid} -Force -ErrorAction SilentlyContinue`], { stdio: "ignore", windowsHide: true });
    const exclusions = existingJavaPids.length ? ` | Where-Object { $_.Id -notin @(${existingJavaPids.join(",")}) }` : "";
    spawnSync("powershell.exe", ["-NoProfile", "-Command", `Get-Process java -ErrorAction SilentlyContinue${exclusions} | Stop-Process -Force -ErrorAction SilentlyContinue`], { stdio: "ignore", windowsHide: true });
    return;
  }
  emulator.kill("SIGTERM");
  await Promise.race([new Promise<void>((resolve) => emulator.once("exit", () => resolve())), delay(5_000)]);
  if (emulator.exitCode === null) emulator.kill("SIGKILL");
}

let code = 1;
try {
  await ready();
  const vitest = spawn(process.execPath, [path.resolve("node_modules/vitest/vitest.mjs"), "run", "--config", "vitest.rules.config.ts"], {
    stdio: "inherit", windowsHide: true,
    env: { ...process.env, FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080", GCLOUD_PROJECT: "demo-manzsa" },
  });
  code = await new Promise<number>((resolve) => vitest.once("exit", (value) => resolve(value ?? 1)));
} finally {
  await stopEmulator();
}
process.exit(code);
