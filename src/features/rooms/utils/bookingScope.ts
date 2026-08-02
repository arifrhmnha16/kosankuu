export const BOOKING_UNAVAILABLE_MESSAGE = 'Fitur booking akan tersedia pada tahap berikutnya.';

export function getBookingMilestoneState() {
  return { canCreateBooking: false, message: BOOKING_UNAVAILABLE_MESSAGE } as const;
}
