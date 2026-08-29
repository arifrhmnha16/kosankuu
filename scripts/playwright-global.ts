import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

let server: ChildProcess | undefined, emulators: ChildProcess | undefined;
const projectId = "demo-manzsa-e2e";

function portReady(port: number) {
  return new Promise<boolean>((resolve) => { const socket = net.createConnection(port, "127.0.0.1"); socket.once("connect", () => { socket.destroy(); resolve(true); }); socket.once("error", () => resolve(false)); socket.setTimeout(300, () => { socket.destroy(); resolve(false); }); });
}

function stopTree(processHandle?: ChildProcess) {
  if (!processHandle || processHandle.exitCode !== null || !processHandle.pid) return;
  if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(processHandle.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
  else processHandle.kill("SIGTERM");
}

async function waitFor(label: string, check: () => Promise<boolean>, processHandle: ChildProcess, attempts = 120) {
  for (let attempt = 0; attempt < attempts; attempt++) { if (processHandle.exitCode !== null) throw new Error(`${label} berhenti sebelum siap (${processHandle.exitCode}).`); if (await check()) return; await delay(500); }
  throw new Error(`${label} tidak siap.`);
}

async function seed() {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.GCLOUD_PROJECT = projectId;
  const app = getApps().find((candidate) => candidate.name === "playwright-seed") || initializeApp({ projectId }, "playwright-seed");
  const auth = getAuth(app), db = getFirestore(app);
  const users = [
    { uid: "e2e-owner", email: "owner.e2e@example.test", password: "OwnerE2E!123", role: "owner" },
    { uid: "e2e-tenant", email: "tenant.e2e@example.test", password: "TenantE2E!123", role: "tenant" },
    { uid: "e2e-other", email: "other.e2e@example.test", password: "OtherE2E!123", role: "tenant" },
  ];
  for (const user of users) { await auth.createUser({ uid: user.uid, email: user.email, password: user.password, emailVerified: true }); await auth.setCustomUserClaims(user.uid, { role: user.role }); await db.doc(`users/${user.uid}`).set({ uid: user.uid, email: user.email, fullName: user.uid, phone: "081234567890", address: "Alamat pengujian", emergencyContact: { name: "Kontak", phone: "081234567891" }, identityNumber: "", role: user.role, status: "active", emailVerified: true, activeRoomId: user.uid === "e2e-tenant" ? "e2e-room" : null, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }); }
  await db.doc("propertySettings/main").set({ name: "Manzsa Residence E2E", isPublic: true, bookingExpirationMinutes: 30, bank: { name: "Bank Test", accountNumber: "000111222", holder: "Manzsa" }, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  await db.doc("rooms/e2e-room").set({ number: "E2E-01", name: "Kamar E2E", slug: "kamar-e2e", type: "Standard", description: "Kamar khusus pengujian end-to-end.", capacity: 1, area: 12, status: "available", isPublic: true, isFeatured: true, archivedAt: null, rentalTypes: ["hourly", "daily", "monthly", "yearly"], pricing: { hourly: 50_000, daily: 250_000, monthly: 1_500_000, yearly: 16_000_000, deposit: 500_000 }, facilities: ["Wi-Fi"], rules: ["Tidak merokok"], images: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  const midtransStart = Timestamp.fromDate(new Date("2030-01-10T00:00:00Z")), midtransEnd = Timestamp.fromDate(new Date("2030-01-11T00:00:00Z"));
  await Promise.all([
    db.doc("bookings/midtrans-booking").set({ code: "BKG-MIDTRANS", tenantId: "e2e-tenant", roomId: "e2e-room", rentalType: "daily", startAt: midtransStart, endAt: midtransEnd, status: "pending_payment", invoiceId: "midtrans-invoice", expiresAt: Timestamp.fromDate(new Date("2030-01-01T00:00:00Z")), snapshot: { tenant: { email: "tenant.e2e@example.test" }, room: { name: "Kamar E2E" } }, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }),
    db.doc("invoices/midtrans-invoice").set({ invoiceNumber: "MR-E2E-MIDTRANS", bookingId: "midtrans-booking", tenantId: "e2e-tenant", totalAmount: 250_000, status: "pending", snapshot: { tenant: { email: "tenant.e2e@example.test" }, room: { name: "Kamar E2E" } }, issuedAt: Timestamp.now(), createdAt: Timestamp.now(), updatedAt: Timestamp.now() }),
    db.doc("payments/midtrans-payment").set({ invoiceId: "midtrans-invoice", bookingId: "midtrans-booking", tenantId: "e2e-tenant", tenantEmail: "tenant.e2e@example.test", provider: "midtrans", providerOrderId: "e2e-order", amount: 250_000, status: "pending", createdAt: Timestamp.now(), updatedAt: Timestamp.now() }),
    db.doc("bookingLocks/e2e-room_20300110").set({ bookingId: "midtrans-booking", roomId: "e2e-room", tenantId: "e2e-tenant", startAt: midtransStart, endAt: midtransEnd, expiresAt: Timestamp.fromDate(new Date("2030-01-01T00:00:00Z")), createdAt: Timestamp.now() }),
    db.doc("bookings/expired-booking").set({ code: "BKG-EXPIRED", tenantId: "e2e-other", roomId: "e2e-room", rentalType: "daily", startAt: Timestamp.fromDate(new Date("2029-01-10T00:00:00Z")), endAt: Timestamp.fromDate(new Date("2029-01-11T00:00:00Z")), status: "pending_payment", invoiceId: "expired-invoice", expiresAt: Timestamp.fromDate(new Date(Date.now() - 60_000)), snapshot: { tenant: { email: "" } }, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }),
    db.doc("invoices/expired-invoice").set({ invoiceNumber: "MR-E2E-EXPIRED", bookingId: "expired-booking", tenantId: "e2e-other", totalAmount: 250_000, status: "unpaid", issuedAt: Timestamp.now(), createdAt: Timestamp.now(), updatedAt: Timestamp.now() }),
    db.doc("bookingLocks/e2e-room_20290110").set({ bookingId: "expired-booking", roomId: "e2e-room", tenantId: "e2e-other", expiresAt: Timestamp.fromDate(new Date(Date.now() - 60_000)), createdAt: Timestamp.now() }),
  ]);
}

export default async function globalSetup() {
  const firebase = path.resolve("node_modules/firebase-tools/lib/bin/firebase.js");
  emulators = spawn(process.execPath, [firebase, "emulators:start", "--only", "auth,firestore", "--project", projectId], { cwd: process.cwd(), stdio: "inherit", windowsHide: true, env: { ...process.env, FIREBASE_CLI_DISABLE_UPDATE_CHECK: "true", XDG_CONFIG_HOME: path.resolve(".firebase-config") } });
  try {
    await waitFor("Firebase Emulator", async () => await portReady(8080) && await portReady(9099), emulators);
    await seed();
    const bin = path.resolve("node_modules/next/dist/bin/next");
    server = spawn(process.execPath, [bin, "dev", "--hostname", "127.0.0.1", "--port", "3000"], { cwd: process.cwd(), stdio: "inherit", windowsHide: true, env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", FIREBASE_ADMIN_PROJECT_ID: projectId, FIREBASE_ADMIN_CLIENT_EMAIL: "", FIREBASE_ADMIN_PRIVATE_KEY: "", FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099", FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080", GCLOUD_PROJECT: projectId, NEXT_PUBLIC_FIREBASE_API_KEY: "e2e-api-key", NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${projectId}.firebaseapp.com`, NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId, NEXT_PUBLIC_FIREBASE_APP_ID: "e2e-app", NEXT_PUBLIC_USE_FIREBASE_EMULATOR: "true", RESEND_API_KEY: "", RESEND_FROM_EMAIL: "", MIDTRANS_SERVER_KEY: "e2e-midtrans-server-key", MIDTRANS_IS_PRODUCTION: "false", CRON_SECRET: "e2e-cron-secret" } });
    await waitFor("Next.js", async () => { try { return (await fetch("http://127.0.0.1:3000/api/health")).ok; } catch { return false; } }, server, 60);
    return () => { stopTree(server); stopTree(emulators); };
  } catch (error) { stopTree(server); stopTree(emulators); throw error; }
}
