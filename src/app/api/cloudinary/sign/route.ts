import { v2 as cloudinary } from "cloudinary";
import { getSession, owns } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { uploadInput } from "@/lib/validation";
import { success, resultError, AppError } from "@/lib/errors";
import { rateLimit } from "@/lib/security";

const folders = { room: "rooms", gallery: "gallery", avatar: "users", complaint: "complaints", payment: "payments", property: "property" } as const;

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    await rateLimit(`upload:${session.uid}`, 20, 60_000);
    const input = uploadInput.parse(await request.json());
    if (["room", "gallery", "property"].includes(input.purpose) && session.role !== "owner") throw new AppError("FORBIDDEN", "Akses upload ditolak.", 403);
    if (input.purpose === "avatar" && input.resourceId !== session.uid) throw new AppError("FORBIDDEN", "Folder avatar tidak valid.", 403);
    if (input.purpose === "complaint" && session.role !== "owner" && !input.resourceId.startsWith(`${session.uid}-`)) throw new AppError("FORBIDDEN", "Folder lampiran keluhan tidak valid.", 403);
    if (input.purpose === "payment" && session.role !== "owner") {
      const invoice = await adminDb().doc(`invoices/${input.resourceId}`).get();
      if (!invoice.exists || !owns(session, invoice.data()!.tenantId)) throw new AppError("FORBIDDEN", "Invoice upload tidak dapat diakses.", 403);
      if (invoice.data()!.status === "paid") throw new AppError("ALREADY_PAID", "Invoice sudah lunas.", 409);
    }
    const scope = input.purpose === "avatar" ? session.uid : input.resourceId.replace(/[^a-zA-Z0-9_-]/g, "");
    if (!scope) throw new AppError("INVALID_UPLOAD_SCOPE", "Scope upload tidak valid.", 422);
    const folder = `manzsa-residence/${folders[input.purpose]}/${scope}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const deliveryType = ["payment", "complaint"].includes(input.purpose) ? "authenticated" : "upload";
    const secret = process.env.CLOUDINARY_API_SECRET, apiKey = process.env.CLOUDINARY_API_KEY, cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!secret || !apiKey || !cloudName) throw new AppError("INTEGRATION_NOT_CONFIGURED", "Cloudinary belum dikonfigurasi.", 503);
    const signature = cloudinary.utils.api_sign_request({ folder, timestamp, type: deliveryType }, secret);
    return Response.json(success({ signature, timestamp, folder, apiKey, cloudName, deliveryType, maxBytes: 8_000_000, allowedFormats: ["jpg", "png", "webp"] }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
