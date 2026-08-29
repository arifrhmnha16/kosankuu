import { NextResponse, type NextRequest } from "next/server";

const mutationMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const serverToServerPaths = new Set(["/api/payments/midtrans/notification"]);

export function proxy(request: NextRequest) {
  if (!mutationMethods.has(request.method) || serverToServerPaths.has(request.nextUrl.pathname)) return NextResponse.next();
  const origin = request.headers.get("origin");
  const expectedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !expectedHost) {
    return NextResponse.json({ ok: false, code: "INVALID_ORIGIN", message: "Origin permintaan tidak valid." }, { status: 403 });
  }
  try {
    if (new URL(origin).host !== expectedHost) throw new Error("origin mismatch");
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_ORIGIN", message: "Permintaan lintas situs ditolak." }, { status: 403 });
  }
  return NextResponse.next();
}

export const config = { matcher: "/api/:path*" };
