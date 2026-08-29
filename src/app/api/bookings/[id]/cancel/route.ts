import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { cancelTenantBooking } from "@/lib/booking-workflows";
import { success, resultError, AppError } from "@/lib/errors";
import { assertSameOrigin } from "@/lib/security";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin(request);
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    const { id } = await params;
    const { reason } = z.object({ reason: z.string().min(5).max(500) }).parse(await request.json());
    await cancelTenantBooking(session, id, reason);
    return Response.json(success({ id, status: "cancelled" }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
