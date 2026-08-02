import { Timestamp } from 'firebase/firestore';
import { parseRoomDocument, roomFormSchema } from '@/features/rooms/schemas/roomSchema';

const valid = { propertyId: 'manzsa-residence', code: 'A01', name: 'Kamar A01', status: 'available', monthlyPrice: 1000000, capacity: 1, facilities: [], description: 'Kamar nyaman dan terawat.', imageUrls: [], imageStoragePaths: [], isPublished: false, isDeleted: false, createdAt: new Timestamp(1, 0), updatedAt: new Timestamp(1, 0) };

test('room parser accepts valid data and rejects unsafe data', () => {
  expect(parseRoomDocument('room-1', valid)?.code).toBe('A01');
  expect(parseRoomDocument('room-1', { ...valid, capacity: 0 })).toBeNull();
});

test('room form trims values and converts optional empty prices', () => {
  const result = roomFormSchema.parse({ code: ' A01 ', name: ' Kamar A01 ', status: 'available', monthlyPrice: '0', dailyPrice: '', hourlyPrice: '', depositAmount: '', capacity: '1', floor: '', facilitiesText: 'Wi-Fi, AC', description: 'Deskripsi kamar yang valid.', isPublished: false });
  expect(result).toMatchObject({ code: 'A01', monthlyPrice: 0, capacity: 1, dailyPrice: undefined });
});

test('room form rejects negative price and empty required data', () => {
  const result = roomFormSchema.safeParse({ code: '', name: '', status: 'available', monthlyPrice: -1, capacity: 0, facilitiesText: '', description: 'pendek', isPublished: false });
  expect(result.success).toBe(false);
});
