import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

describe("mutation origin guard", () => {
  it("menerima mutation same-origin", () => {
    const response = proxy(new NextRequest("https://kosankuu.vercel.app/api/profile", { method: "PATCH", headers: { host: "kosankuu.vercel.app", origin: "https://kosankuu.vercel.app" } }));
    expect(response.status).toBe(200);
  });
  it("menolak origin asing dan origin kosong", () => {
    expect(proxy(new NextRequest("https://kosankuu.vercel.app/api/profile", { method: "PATCH", headers: { host: "kosankuu.vercel.app", origin: "https://evil.example" } })).status).toBe(403);
    expect(proxy(new NextRequest("https://kosankuu.vercel.app/api/profile", { method: "PATCH", headers: { host: "kosankuu.vercel.app" } })).status).toBe(403);
  });
  it("melewatkan webhook Midtrans server-to-server", () => {
    expect(proxy(new NextRequest("https://kosankuu.vercel.app/api/payments/midtrans/notification", { method: "POST", headers: { host: "kosankuu.vercel.app" } })).status).toBe(200);
  });
});
