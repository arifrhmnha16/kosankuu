import { MAX_IMAGE_BYTES, validateRoomImage } from '@/features/rooms/api/imageUpload';
import { mapRoomError } from '@/features/rooms/utils/errors';

test('upload validation accepts supported images and rejects invalid inputs', () => {
  expect(validateRoomImage({ mimeType: 'image/jpeg', fileSize: 1024 })).toBeNull();
  expect(validateRoomImage({ mimeType: 'application/pdf', fileSize: 1024 })).toContain('JPG');
  expect(validateRoomImage({ mimeType: 'image/png', fileSize: MAX_IMAGE_BYTES + 1 })).toContain('5 MB');
});

test('Firebase room errors map to an Indonesian message', () => {
  expect(mapRoomError({ code: 'storage/unauthorized' })).toContain('izin');
  expect(mapRoomError({ code: 'firestore/permission-denied' })).toContain('izin');
});
