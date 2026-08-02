import type { RoomDocument } from '@/features/rooms/types';
import { createRoom, setRoomDeleted, updateRoom } from '@/features/rooms/api/roomMutations';
import { createRoomReference, patchRoom, saveNewRoom } from '@/features/rooms/api/roomApi';
import { deleteRoomImage, uploadRoomImage } from '@/features/rooms/api/imageUpload';

jest.mock('@/features/rooms/api/roomApi', () => ({ createRoomReference: jest.fn(), patchRoom: jest.fn(), saveNewRoom: jest.fn() }));
jest.mock('@/features/rooms/api/imageUpload', () => ({ uploadRoomImage: jest.fn(), deleteRoomImage: jest.fn() }));

const values = { code: 'A01', name: 'Kamar A01', status: 'available' as const, monthlyPrice: 1000000, capacity: 1, facilitiesText: 'Wi-Fi', description: 'Kamar nyaman dan terawat.', isPublished: false };
const image = { id: 'local', uri: 'file.jpg', mimeType: 'image/jpeg' };
const existing = { id: 'room-1', propertyId: 'manzsa-residence', imageUrls: ['old-url'], imageStoragePaths: ['old-path'], isPublished: true } as RoomDocument;

beforeEach(() => jest.clearAllMocks());

test('create uploads first and persists one complete room document', async () => {
  jest.mocked(createRoomReference).mockReturnValue({ id: 'room-1' } as ReturnType<typeof createRoomReference>);
  jest.mocked(uploadRoomImage).mockResolvedValue({ storagePath: 'new-path', downloadUrl: 'new-url' });
  await expect(createRoom({ propertyId: 'manzsa-residence', values, images: [image] })).resolves.toBe('room-1');
  expect(saveNewRoom).toHaveBeenCalledWith('manzsa-residence', 'room-1', expect.objectContaining({ imageUrls: ['new-url'] }));
});

test('update writes new metadata before cleaning removed files', async () => {
  jest.mocked(uploadRoomImage).mockResolvedValue({ storagePath: 'new-path', downloadUrl: 'new-url' });
  await updateRoom({ existing, values, newImages: [image], keptImageUrls: [], keptStoragePaths: [] });
  expect(patchRoom).toHaveBeenCalledWith('manzsa-residence', 'room-1', expect.objectContaining({ imageUrls: ['new-url'] }));
  expect(deleteRoomImage).toHaveBeenCalledWith('old-path');
});

test('soft-delete unpublishes without hard deleting a Firestore document', async () => {
  await setRoomDeleted(existing, true);
  expect(patchRoom).toHaveBeenCalledWith('manzsa-residence', 'room-1', { isDeleted: true, isPublished: false });
});
