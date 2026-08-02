import type { AuthState, UserRole } from '@/types/auth';

export interface RouteAccess {
  auth: boolean;
  tenant: boolean;
  owner: boolean;
  accountStatus: boolean;
}

export function getRouteAccess(authState: AuthState, role: UserRole | null, hasFirebaseUser: boolean): RouteAccess {
  const active = authState === 'authenticated';
  return {
    auth: authState === 'unauthenticated' || authState === 'configuration-error',
    tenant: active && role === 'tenant',
    owner: active && role === 'owner',
    accountStatus: hasFirebaseUser && ['missing-profile', 'inactive', 'pending', 'invalid-role', 'error'].includes(authState),
  };
}
