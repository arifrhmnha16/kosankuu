import * as ImageManipulator from 'expo-image-manipulator';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { getFirebaseStorage } from '@/services/firebase/storage';
import type { LocalRoomImage } from '../types';

export const MAX_ROOM_IMAGES = 8;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export function validateRoomImage(image: Pick<LocalRoomImage, 'mimeType' | 'fileSize'>) {
  if (!ALLOWED_IMAGE_TYPES.includes(image.mimeType as (typeof ALLOWED_IMAGE_TYPES)[number])) return 'Gunakan gambar JPG, PNG, atau WebP.';
  if (image.fileSize && image.fileSize > MAX_IMAGE_BYTES) return 'Ukuran gambar maksimum 5 MB.';
  return null;
}

export async function prepareRoomImage(image: LocalRoomImage) {
  const error = validateRoomImage(image); if (error) throw new Error(error);
  if (image.width && image.width <= 1600) return image.uri;
  const result = await ImageManipulator.manipulateAsync(image.uri, [{ resize: { width: 1600 } }], { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG });
  return result.uri;
}

export async function uploadRoomImage(propertyId: string, roomId: string, image: LocalRoomImage, onProgress?: (progress: number) => void) {
  const uri = await prepareRoomImage(image); const response = await fetch(uri); const blob = await response.blob();
  const extension = image.mimeType === 'image/png' ? 'png' : image.mimeType === 'image/webp' ? 'webp' : 'jpg';
  const storagePath = `properties/${propertyId}/rooms/${roomId}/${crypto.randomUUID()}.${extension}`;
  const task = uploadBytesResumable(ref(getFirebaseStorage(), storagePath), blob, { contentType: image.mimeType });
  await new Promise<void>((resolve, reject) => task.on('state_changed', (snapshot) => onProgress?.(snapshot.bytesTransferred / snapshot.totalBytes), reject, resolve));
  return { storagePath, downloadUrl: await getDownloadURL(task.snapshot.ref) };
}
export async function deleteRoomImage(storagePath: string) { await deleteObject(ref(getFirebaseStorage(), storagePath)); }
