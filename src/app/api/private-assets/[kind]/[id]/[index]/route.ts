import { v2 as cloudinary } from "cloudinary";
import { getSession, owns } from "@/lib/auth/session";
import { adminDb } from "@/lib/firebase/admin";
import { AppError, resultError } from "@/lib/errors";

export async function GET(_: Request, { params }: { params: Promise<{ kind: string; id: string; index: string }> }) {
  try {
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    const { kind, id, index } = await params;
    if (!['payment', 'complaint'].includes(kind)) throw new AppError("NOT_FOUND", "Aset tidak ditemukan.", 404);
    const document = await adminDb().doc(`${kind === "payment" ? "payments" : "complaints"}/${id}`).get();
    if (!document.exists || !owns(session, document.data()!.tenantId)) throw new AppError("FORBIDDEN", "Aset tidak dapat diakses.", 403);
    const rawAsset = kind === "payment" ? document.data()!.proof : document.data()!.attachments?.[Number(index)];
    const publicId = String(rawAsset?.publicId || "");
    const expectedPrefix = `manzsa-residence/${kind === "payment" ? "payments" : "complaints"}/`;
    if (!publicId.startsWith(expectedPrefix)) throw new AppError("NOT_FOUND", "Aset tidak ditemukan.", 404);
    cloudinary.config({ cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
    const signedUrl = cloudinary.url(publicId, { type: "authenticated", sign_url: true, secure: true, resource_type: "image" });
    const upstream = await fetch(signedUrl, { cache: "no-store" });
    if (!upstream.ok) throw new AppError("ASSET_UNAVAILABLE", "Aset tidak dapat dimuat.", 502);
    return new Response(upstream.body, { headers: { "content-type": upstream.headers.get("content-type") || "application/octet-stream", "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status, headers: { "cache-control": "private, no-store" } });
  }
}
