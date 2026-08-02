import { act, render, waitFor } from '@testing-library/react-native';
import type { User } from 'firebase/auth';
import { AppText } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider, type AuthDependencies } from '@/providers/AuthProvider';
import type { UserProfile, UserRole, UserAccountStatus } from '@/types/auth';
import type { ProfileLoadResult } from '@/features/auth/profile';

const firebaseUser = { uid: 'user-1', email: 'user@example.com' } as User;

function profile(role: UserRole, status: UserAccountStatus = 'active'): UserProfile {
  return { uid: 'user-1', email: 'user@example.com', displayName: 'Pengguna Test', role, status, propertyId: 'manzsa', createdAt: {} as UserProfile['createdAt'], updatedAt: {} as UserProfile['updatedAt'] };
}

function createDependencies(result: ProfileLoadResult = { kind: 'found', profile: profile('tenant') }) {
  let listener = (_user: User | null) => {};
  const deps: AuthDependencies = {
    subscribe: async (next) => { listener = next; return jest.fn(); },
    signIn: jest.fn(async () => {}),
    signOut: jest.fn(async () => { listener(null); }),
    sendPasswordReset: jest.fn(async () => {}),
    loadProfile: jest.fn(async () => result),
  };
  return { deps, emit: (user: User | null) => listener(user) };
}

function Probe() {
  const auth = useAuth();
  return <AppText>{`${auth.authState}|${auth.role ?? '-'}|${auth.profile?.displayName ?? '-'}`}</AppText>;
}

describe('AuthProvider', () => {
  it('resolves unauthenticated state', async () => {
    const harness = createDependencies();
    const screen = render(<AuthProvider dependencies={harness.deps}><Probe /></AuthProvider>);
    await act(async () => harness.emit(null));
    expect(screen.getByText('unauthenticated|-|-')).toBeOnTheScreen();
  });

  it.each([['owner'], ['tenant']] as const)('resolves an active %s profile', async (role) => {
    const harness = createDependencies({ kind: 'found', profile: profile(role) });
    const screen = render(<AuthProvider dependencies={harness.deps}><Probe /></AuthProvider>);
    await act(async () => harness.emit(firebaseUser));
    await waitFor(() => expect(screen.getByText(`authenticated|${role}|Pengguna Test`)).toBeOnTheScreen());
  });

  it('handles a missing profile', async () => {
    const harness = createDependencies({ kind: 'missing' } as const);
    const screen = render(<AuthProvider dependencies={harness.deps}><Probe /></AuthProvider>);
    await act(async () => harness.emit(firebaseUser));
    await waitFor(() => expect(screen.getByText('missing-profile|-|-')).toBeOnTheScreen());
  });

  it('handles an inactive profile', async () => {
    const harness = createDependencies({ kind: 'found', profile: profile('tenant', 'inactive') });
    const screen = render(<AuthProvider dependencies={harness.deps}><Probe /></AuthProvider>);
    await act(async () => harness.emit(firebaseUser));
    await waitFor(() => expect(screen.getByText('inactive|tenant|Pengguna Test')).toBeOnTheScreen());
  });

  it('clears profile state when signing out', async () => {
    const harness = createDependencies();
    function LogoutProbe() { const auth = useAuth(); return <><AppText>{`${auth.authState}|${auth.profile?.displayName ?? '-'}`}</AppText><AppText onPress={() => void auth.signOut()}>Keluar test</AppText></>; }
    const screen = render(<AuthProvider dependencies={harness.deps}><LogoutProbe /></AuthProvider>);
    await act(async () => harness.emit(firebaseUser));
    await waitFor(() => screen.getByText('authenticated|Pengguna Test'));
    await act(async () => screen.getByText('Keluar test').props.onPress());
    await waitFor(() => expect(screen.getByText('unauthenticated|-')).toBeOnTheScreen());
  });
});
