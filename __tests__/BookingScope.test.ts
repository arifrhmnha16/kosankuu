import { getBookingMilestoneState } from '@/features/rooms/utils/bookingScope';

test('Milestone 3 CTA cannot create a booking document', () => {
  expect(getBookingMilestoneState()).toEqual({
    canCreateBooking: false,
    message: 'Fitur booking akan tersedia pada tahap berikutnya.',
  });
});
