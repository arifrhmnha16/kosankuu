import { doc, getDoc, Timestamp, type DocumentData } from 'firebase/firestore';

import { getFirebaseFirestore } from '@/services/firebase/firestore';
import type { UserAccountStatus, UserProfile, UserRole } from '@/types/auth';

const roles: UserRole[] = ['owner', 'tenant'];
const statuses: UserAccountStatus[] = ['active', 'inactive', 'pending'];

export function parseUserProfile(uid: string, data: DocumentData): UserProfile | null {
  if (data.uid !== uid || typeof data.email !== 'string' || typeof data.displayName !== 'string' || !roles.includes(data.role) || !statuses.includes(data.status) || typeof data.propertyId !== 'string' || !data.propertyId || !(data.createdAt instanceof Timestamp) || !(data.updatedAt instanceof Timestamp)) return null;
  return data as UserProfile;
}

export type ProfileLoadResult = { kind: 'found'; profile: UserProfile } | { kind: 'missing' } | { kind: 'invalid' };

export async function loadUserProfile(uid: string): Promise<ProfileLoadResult> {
  const snapshot = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
  if (!snapshot.exists()) return { kind: 'missing' };
  const profile = parseUserProfile(uid, snapshot.data());
  return profile ? { kind: 'found', profile } : { kind: 'invalid' };
}
