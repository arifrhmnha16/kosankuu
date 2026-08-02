import type { RoomDocument } from '@/features/rooms/types';
import { filterPublicRooms, isPublicRoomAvailable } from '@/features/rooms/utils/publicRooms';

const base = { id: 'one', propertyId: 'manzsa-residence', code: 'A01', name: 'A01', status: 'available', monthlyPrice: 100, capacity: 1, facilities: ['Wi-Fi'], description: 'Valid room description', imageUrls: [], imageStoragePaths: [], isPublished: true, isDeleted: false } as unknown as RoomDocument;

test('public room filter respects visibility, availability, price, and facility', () => {
  const rooms = [base, { ...base, id: 'private', isPublished: false }, { ...base, id: 'occupied', status: 'occupied' as const }, { ...base, id: 'expensive', monthlyPrice: 500 }];
  expect(filterPublicRooms(rooms, { availableOnly: true, minimum: '50', maximum: '200', facility: 'wi-fi' }).map((room) => room.id)).toEqual(['one']);
});

test('detail availability rejects missing, unpublished, and deleted rooms', () => {
  expect(isPublicRoomAvailable(base)).toBe(true);
  expect(isPublicRoomAvailable({ ...base, isDeleted: true })).toBe(false);
  expect(isPublicRoomAvailable({ ...base, isPublished: false })).toBe(false);
  expect(isPublicRoomAvailable(null)).toBe(false);
});
