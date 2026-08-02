import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/services/firebase/firestore';
import { parsePropertyDocument } from '../schemas/propertySchema';

export async function getPublicProperty(propertyId: string) {
  const snapshot = await getDoc(doc(getFirebaseFirestore(), 'properties', propertyId));
  if (!snapshot.exists()) return null;
  const property = parsePropertyDocument(snapshot.id, snapshot.data());
  if (!property) throw new Error('Dokumen profil properti tidak valid.');
  return property.isPublished ? property : null;
}

export async function getOwnerProperty(propertyId: string) {
  const snapshot = await getDoc(doc(getFirebaseFirestore(), 'properties', propertyId));
  if (!snapshot.exists()) return null;
  const property = parsePropertyDocument(snapshot.id, snapshot.data());
  if (!property) throw new Error('Dokumen profil properti tidak valid.');
  return property;
}
