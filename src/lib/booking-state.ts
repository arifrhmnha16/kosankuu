export const bookingTransitions: Record<string, readonly string[]> = {
  draft: ["pending_approval", "cancelled"],
  pending_approval: ["pending_payment", "rejected", "cancelled"],
  pending_payment: ["confirmed", "cancelled", "expired"],
  confirmed: ["active", "cancelled"],
  active: ["completed", "cancelled"],
  completed: [], cancelled: [], rejected: [], expired: [],
};

export function canTransitionBooking(from: string, to: string) {
  return bookingTransitions[from]?.includes(to) ?? false;
}
