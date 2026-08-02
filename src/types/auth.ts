import type { User } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'owner' | 'tenant';
export type UserAccountStatus = 'active' | 'inactive' | 'pending';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserAccountStatus;
  propertyId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type AuthState = 'initializing' | 'unauthenticated' | 'resolving-profile' | 'authenticated' | 'missing-profile' | 'inactive' | 'pending' | 'invalid-role' | 'configuration-error' | 'error';

export interface AuthSnapshot {
  firebaseUser: User | null;
  profile: UserProfile | null;
  authState: AuthState;
  error: string | null;
}
