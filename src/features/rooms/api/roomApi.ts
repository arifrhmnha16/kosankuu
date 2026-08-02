import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/services/firebase/firestore';
import { parseRoomDocument } from '../schemas/roomSchema';

function roomsCollection(propertyId: string) { return collection(getFirebaseFirestore(), 'properties', propertyId, 'rooms'); }

export async function getPublicRooms(propertyId: string) {
  const snapshot = await getDocs(query(roomsCollection(propertyId), where('isPublished', '==', true), where('isDeleted', '==', false), limit(100)));
  return snapshot.docs.flatMap((item) => { const room = parseRoomDocument(item.id, item.data()); if (!room && __DEV__) console.error('Room publik invalid:', item.id); return room ? [room] : []; }).sort((a, b) => a.code.localeCompare(b.code));
}
export async function getOwnerRooms(propertyId: string) {
  const snapshot = await getDocs(query(roomsCollection(propertyId), limit(200)));
  return snapshot.docs.flatMap((item) => { const room = parseRoomDocument(item.id, item.data()); if (!room && __DEV__) console.error('Room owner invalid:', item.id); return room ? [room] : []; });
}
export async function getRoom(propertyId: string, roomId: string, scope: 'public' | 'owner') {
  const snapshot = await getDoc(doc(roomsCollection(propertyId), roomId));
  if (!snapshot.exists()) return null;
  const room = parseRoomDocument(snapshot.id, snapshot.data());
  if (!room) throw new Error('Data kamar tidak valid.');
  if (scope === 'public' && (!room.isPublished || room.isDeleted)) return null;
  return room;
}

export function createRoomReference(propertyId: string) { return doc(roomsCollection(propertyId)); }
export async function saveNewRoom(propertyId: string, roomId: string, data: Record<string, unknown>) {
  await setDoc(doc(roomsCollection(propertyId), roomId), { ...data, propertyId, isDeleted: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
export async function patchRoom(propertyId: string, roomId: string, data: Record<string, unknown>) {
  const { propertyId: _ignored, createdAt: _created, ...safe } = data;
  await updateDoc(doc(roomsCollection(propertyId), roomId), { ...safe, updatedAt: serverTimestamp() });
}
