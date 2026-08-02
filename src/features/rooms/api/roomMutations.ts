import type { RoomFormValues } from '../schemas/roomSchema';
import { roomFormToData } from '../schemas/roomSchema';
import type { LocalRoomImage, RoomDocument, RoomStatus } from '../types';
import { createRoomReference, patchRoom, saveNewRoom } from './roomApi';
import { deleteRoomImage, uploadRoomImage } from './imageUpload';

function clean(data: Record<string, unknown>) { return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)); }
async function uploadAll(propertyId: string, roomId: string, images: LocalRoomImage[]) {
  const uploaded: { storagePath: string; downloadUrl: string }[] = [];
  try {
    for (const image of images) uploaded.push(await uploadRoomImage(propertyId, roomId, image));
    return uploaded;
  } catch (error) {
    await Promise.allSettled(uploaded.map((item) => deleteRoomImage(item.storagePath)));
    throw error;
  }
}
export async function createRoom(input: { propertyId: string; values: RoomFormValues; images: LocalRoomImage[] }) {
  const roomRef = createRoomReference(input.propertyId); const uploaded = await uploadAll(input.propertyId, roomRef.id, input.images);
  try {
    const imageUrls = uploaded.map((item) => item.downloadUrl);
    if (input.values.isPublished && !imageUrls.length) throw new Error('Room yang dipublikasikan wajib memiliki foto.');
    await saveNewRoom(input.propertyId, roomRef.id, clean({ ...roomFormToData(input.values), facilitiesText: undefined, imageUrls, imageStoragePaths: uploaded.map((item) => item.storagePath), coverImageUrl: imageUrls[0] }));
    return roomRef.id;
  } catch (error) { await Promise.allSettled(uploaded.map((item) => deleteRoomImage(item.storagePath))); throw error; }
}
export async function updateRoom(input: { existing: RoomDocument; values: RoomFormValues; newImages: LocalRoomImage[]; keptImageUrls: string[]; keptStoragePaths: string[] }) {
  const uploaded = await uploadAll(input.existing.propertyId, input.existing.id, input.newImages);
  const imageUrls = [...input.keptImageUrls, ...uploaded.map((item) => item.downloadUrl)]; const paths = [...input.keptStoragePaths, ...uploaded.map((item) => item.storagePath)];
  if (input.values.isPublished && !imageUrls.length) { await Promise.allSettled(uploaded.map((item) => deleteRoomImage(item.storagePath))); throw new Error('Room yang dipublikasikan wajib memiliki foto.'); }
  try { await patchRoom(input.existing.propertyId, input.existing.id, clean({ ...roomFormToData(input.values), imageUrls, imageStoragePaths: paths, coverImageUrl: imageUrls[0] })); }
  catch (error) { await Promise.allSettled(uploaded.map((item) => deleteRoomImage(item.storagePath))); throw error; }
  const removed = input.existing.imageStoragePaths.filter((path) => !input.keptStoragePaths.includes(path)); await Promise.allSettled(removed.map((path) => deleteRoomImage(path)));
}
export async function setRoomPublished(room: RoomDocument, isPublished: boolean) { if (isPublished && !room.imageUrls.length) throw new Error('Tambahkan minimal satu foto sebelum publish.'); await patchRoom(room.propertyId, room.id, { isPublished }); }
export async function setRoomStatus(room: RoomDocument, status: RoomStatus) { await patchRoom(room.propertyId, room.id, { status }); }
export async function setRoomDeleted(room: RoomDocument, isDeleted: boolean) { await patchRoom(room.propertyId, room.id, { isDeleted, isPublished: isDeleted ? false : room.isPublished }); }
