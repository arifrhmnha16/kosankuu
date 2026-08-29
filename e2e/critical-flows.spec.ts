import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { createHash } from "node:crypto";

async function login(context: BrowserContext, email: string, password: string) {
  const page = await context.newPage();
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).not.toHaveURL(/\/login/);
  return page;
}

async function api<T = unknown>(
  page: Page,
  url: string,
  options?: { method?: string; body?: unknown },
) {
  return (await page.evaluate(
    async ({ url, method, body }) => {
      const response = await fetch(url, {
        method: method || "GET",
        headers: body ? { "content-type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      return {
        status: response.status,
        contentType: response.headers.get("content-type"),
        body: response.headers.get("content-type")?.includes("json")
          ? await response.json()
          : null,
      };
    },
    { url, method: options?.method, body: options?.body },
  )) as { status: number; contentType: string | null; body: T };
}

test("registrasi berhenti pada verifikasi email", async ({ page }) => {
  await page.goto("/daftar");
  await page.getByLabel("Nama lengkap").fill("Tenant Registrasi E2E");
  await page.getByLabel("Nomor WhatsApp").fill("081234567899");
  await page.getByLabel("Email").fill(`register-${Date.now()}@example.test`);
  await page.getByLabel("Password", { exact: true }).fill("RegisterE2E!123");
  await page.getByLabel("Konfirmasi password").fill("RegisterE2E!123");
  await page.getByText("Saya menyetujui").click();
  await page.getByRole("button", { name: "Buat Akun" }).click();
  await expect(page).toHaveURL(/\/verifikasi-email/);
  await expect(
    page.getByRole("heading", { name: "Periksa email Anda." }),
  ).toBeVisible();
});

test("alur booking, transfer manual, approval, invoice, keluhan, pengumuman, laporan, dan isolasi tenant", async ({
  browser,
}) => {
  const tenantContext = await browser.newContext(),
    ownerContext = await browser.newContext(),
    otherContext = await browser.newContext();
  const tenant = await login(
    tenantContext,
    "tenant.e2e@example.test",
    "TenantE2E!123",
  );
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 2);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  const booking = await api<{
    ok: boolean;
    data: { bookingId: string; invoiceId: string };
  }>(tenant, "/api/bookings", {
    method: "POST",
    body: {
      roomId: "e2e-room",
      rentalType: "daily",
      startAt: start.toISOString(),
      endAt: end.toISOString(),
    },
  });
  expect(booking.status).toBe(201);
  const { bookingId, invoiceId } = booking.body.data;
  await tenant.goto(`/tenant/tagihan/${invoiceId}/bayar`);
  await expect(
    tenant.getByRole("heading", { name: /Bagaimana Anda ingin membayar/ }),
  ).toBeVisible();
  const proof = {
    publicId: `manzsa-residence/payments/${invoiceId}/proof`,
    secureUrl: "https://res.cloudinary.com/demo/image/authenticated/proof.jpg",
    width: 800,
    height: 600,
    format: "jpg",
    bytes: 1000,
    resourceType: "image",
    altText: "Bukti transfer",
    sortOrder: 0,
  };
  const manual = await api<{ ok: boolean; data: { paymentId: string } }>(
    tenant,
    "/api/payments/manual",
    { method: "POST", body: { invoiceId, proof } },
  );
  expect(manual.status).toBe(201);
  const paymentId = manual.body.data.paymentId;

  const owner = await login(
    ownerContext,
    "owner.e2e@example.test",
    "OwnerE2E!123",
  );
  await expect(owner).toHaveURL(/\/owner/);
  const approval = await api<{
    ok: boolean;
    data: { status: string; changed: boolean };
  }>(owner, `/api/owner/payments/${paymentId}/verify`, {
    method: "POST",
    body: { decision: "approve", note: "Sesuai mutasi rekening" },
  });
  expect(approval.status).toBe(200);
  expect(approval.body.data).toMatchObject({ status: "paid", changed: true });
  const duplicateApproval = await api<{
    ok: boolean;
    data: { changed: boolean };
  }>(owner, `/api/owner/payments/${paymentId}/verify`, {
    method: "POST",
    body: { decision: "approve", note: "Sesuai mutasi rekening" },
  });
  expect(duplicateApproval.status).toBe(200);
  expect(duplicateApproval.body.data.changed).toBe(false);
  const invoice = await api<{ ok: boolean; data: { status: string } }>(
    tenant,
    `/api/dashboard/invoice/${invoiceId}`,
  );
  expect(invoice.body.data.status).toBe("paid");
  const pdf = await api(tenant, `/api/invoices/${invoiceId}/pdf`);
  expect(pdf.status).toBe(200);
  expect(pdf.contentType).toContain("application/pdf");

  const complaint = await api<{ ok: boolean; data: { id: string } }>(
    tenant,
    "/api/complaints",
    {
      method: "POST",
      body: {
        title: "AC kamar tidak dingin",
        category: "fasilitas_kamar",
        description: "AC kamar tidak mengeluarkan udara dingin sejak pagi.",
        priority: "high",
        roomId: "e2e-room",
        attachments: [],
      },
    },
  );
  expect(complaint.status).toBe(201);
  const complaintId = complaint.body.data.id;
  expect(
    (
      await api(owner, `/api/owner/complaints/${complaintId}`, {
        method: "PATCH",
        body: {
          status: "in_progress",
          message: "Teknisi dijadwalkan hari ini.",
        },
      })
    ).status,
  ).toBe(200);
  expect(
    (
      await api(owner, `/api/owner/complaints/${complaintId}`, {
        method: "PATCH",
        body: {
          status: "resolved",
          message: "AC telah dibersihkan dan kembali dingin.",
        },
      })
    ).status,
  ).toBe(200);

  const announcement = await api<{ ok: boolean; data: { id: string } }>(
    owner,
    "/api/owner/announcements",
    {
      method: "POST",
      body: {
        title: "Informasi tenant E2E",
        content: "Pengumuman ini hanya ditujukan kepada tenant pengujian.",
        audienceType: "tenant",
        targetUserId: "e2e-tenant",
        targetRoomId: null,
        priority: "normal",
        status: "published",
        expiresAt: null,
      },
    },
  );
  expect(announcement.status).toBe(201);
  const tenantAnnouncements = await api<{ data: Array<{ id: string }> }>(
    tenant,
    "/api/dashboard/pengumuman",
  );
  expect(
    tenantAnnouncements.body.data.some(
      (item: { id: string }) => item.id === announcement.body.data.id,
    ),
  ).toBe(true);
  const other = await login(
    otherContext,
    "other.e2e@example.test",
    "OtherE2E!123",
  );
  const otherAnnouncements = await api<{ data: Array<{ id: string }> }>(
    other,
    "/api/dashboard/pengumuman",
  );
  expect(
    otherAnnouncements.body.data.some(
      (item: { id: string }) => item.id === announcement.body.data.id,
    ),
  ).toBe(false);
  expect((await api(other, `/api/dashboard/invoice/${invoiceId}`)).status).toBe(
    403,
  );
  expect(
    (
      await api(other, "/api/cloudinary/sign", {
        method: "POST",
        body: {
          purpose: "payment",
          resourceId: invoiceId,
          mimeType: "image/jpeg",
          bytes: 1000,
        },
      })
    ).status,
  ).toBe(403);
  expect(
    (
      await api(other, "/api/cloudinary/sign", {
        method: "POST",
        body: {
          purpose: "complaint",
          resourceId: "e2e-tenant-forged",
          mimeType: "image/jpeg",
          bytes: 1000,
        },
      })
    ).status,
  ).toBe(403);

  const report = await api<{ ok: boolean; data: { rows: unknown[] } }>(
    owner,
    "/api/owner/reports/export?kind=payments&format=json&preset=today",
  );
  expect(report.status).toBe(200);
  expect(report.body.data.rows.length).toBeGreaterThan(0);
  expect(
    (
      await api(
        owner,
        "/api/owner/reports/export?kind=payments&format=pdf&preset=today",
      )
    ).contentType,
  ).toContain("application/pdf");
  expect(
    (
      await api(
        owner,
        "/api/owner/reports/export?kind=payments&format=xlsx&preset=today",
      )
    ).contentType,
  ).toContain("spreadsheetml");
  const bookingRecord = await api<{ ok: boolean; data: { status: string } }>(
    tenant,
    `/api/dashboard/booking/${bookingId}`,
  );
  expect(bookingRecord.body.data.status).toBe("confirmed");
  await Promise.all([
    tenantContext.close(),
    ownerContext.close(),
    otherContext.close(),
  ]);
});

test("webhook Midtrans memverifikasi signature, nominal, dan idempotency", async ({
  page,
}) => {
  const serverKey = "e2e-midtrans-server-key";
  const payload = {
    order_id: "e2e-order",
    status_code: "200",
    gross_amount: "250000",
    transaction_status: "settlement",
    transaction_id: "e2e-transaction",
  };
  const post = async (body: Record<string, string>) =>
    page.request.post("/api/payments/midtrans/notification", { data: body });
  expect((await post({ ...payload, signature_key: "invalid" })).status()).toBe(
    401,
  );
  const wrongAmount = { ...payload, gross_amount: "999999" };
  const wrongSignature = createHash("sha512")
    .update(
      `${wrongAmount.order_id}${wrongAmount.status_code}${wrongAmount.gross_amount}${serverKey}`,
    )
    .digest("hex");
  expect(
    (await post({ ...wrongAmount, signature_key: wrongSignature })).status(),
  ).toBe(409);
  const signature = createHash("sha512")
    .update(
      `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`,
    )
    .digest("hex");
  const first = await post({ ...payload, signature_key: signature });
  expect(first.status()).toBe(200);
  expect((await first.json()).data).toMatchObject({
    status: "paid",
    changed: true,
  });
  const duplicate = await post({ ...payload, signature_key: signature });
  expect(duplicate.status()).toBe(200);
  expect((await duplicate.json()).data).toMatchObject({
    status: "paid",
    changed: false,
  });
});

test("cron expiry terlindungi dan idempotent", async ({ page }) => {
  expect((await page.request.get("/api/cron/expire-bookings")).status()).toBe(
    401,
  );
  const headers = { authorization: "Bearer e2e-cron-secret" };
  const first = await page.request.get("/api/cron/expire-bookings", {
    headers,
  });
  expect(first.status()).toBe(200);
  expect((await first.json()).data.expired).toBe(1);
  const second = await page.request.get("/api/cron/expire-bookings", {
    headers,
  });
  expect(second.status()).toBe(200);
  expect((await second.json()).data.expired).toBe(0);
});
