import { getRouteAccess } from '@/features/auth/access';

describe('role route protection', () => {
  it('allows only tenant routes for an active tenant', () => {
    expect(getRouteAccess('authenticated', 'tenant', true)).toEqual({ auth: false, tenant: true, owner: false, accountStatus: false });
  });

  it('allows only owner routes for an active owner', () => {
    expect(getRouteAccess('authenticated', 'owner', true)).toEqual({ auth: false, tenant: false, owner: true, accountStatus: false });
  });

  it('blocks protected routes while unauthenticated', () => {
    expect(getRouteAccess('unauthenticated', null, false)).toEqual({ auth: true, tenant: false, owner: false, accountStatus: false });
  });

  it('routes inactive accounts to account status only', () => {
    expect(getRouteAccess('inactive', 'tenant', true)).toEqual({ auth: false, tenant: false, owner: false, accountStatus: true });
  });
});
