import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { success, resultError, AppError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    const { publicId, purpose } = z.object({ publicId: z.string().startsWith("manzsa-residence/"), purpose: z.enum(["room", "gallery", "avatar", "complaint", "payment", "property"]) }).parse(await request.json());
    if (["room", "gallery", "property", "payment"].includes(purpose) && session.role !== "owner") throw new AppError("FORBIDDEN", "Akses hapus ditolak.", 403);
    if (purpose === "avatar" && !publicId.startsWith(`manzsa-residence/users/${session.uid}/`)) throw new AppError("FORBIDDEN", "Aset bukan milik Anda.", 403);
    if (purpose === "complaint" && session.role !== "owner" && !publicId.startsWith(`manzsa-residence/complaints/${session.uid}-`)) throw new AppError("FORBIDDEN", "Lampiran bukan milik Anda.", 403);
    cloudinary.config({ cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
    const deliveryType = ["payment", "complaint"].includes(purpose) ? "authenticated" : "upload";
    const result = await cloudinary.uploader.destroy(publicId, { type: deliveryType, invalidate: true });
    if (!["ok", "not found"].includes(result.result)) throw new AppError("DELETE_FAILED", "Aset gagal dihapus.", 502);
    return Response.json(success({ publicId, deleted: true }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
