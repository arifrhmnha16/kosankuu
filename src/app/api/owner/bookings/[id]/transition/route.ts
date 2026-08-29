import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { transitionBooking } from "@/lib/booking-workflows";
import { success, resultError, AppError } from "@/lib/errors";
import { assertSameOrigin } from "@/lib/security";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin(request);
    const session = await getSession();
    if (!session) throw new AppError("UNAUTHENTICATED", "Silakan login.", 401);
    const { id } = await params;
    const { status: nextStatus, reason } = z.object({ status: z.enum(["pending_approval", "pending_payment", "confirmed", "active", "completed", "cancelled", "rejected", "expired"]), reason: z.string().max(500).optional() }).parse(await request.json());
    await transitionBooking(session, id, nextStatus, reason);
    return Response.json(success({ id, status: nextStatus }));
  } catch (error) {
    const { body, status } = resultError(error);
    return Response.json(body, { status });
  }
}
