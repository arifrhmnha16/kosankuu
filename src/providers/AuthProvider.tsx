import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { createContext, type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { loadUserProfile, type ProfileLoadResult } from '@/features/auth/profile';
import { getFirebaseAuth } from '@/services/firebase/auth';
import { getFirebaseConfig } from '@/services/firebase/config';
import { mapFirebaseAuthError } from '@/services/firebase/errors';
import type { AuthSnapshot, UserAccountStatus, UserRole } from '@/types/auth';

export interface AuthDependencies {
  subscribe: (listener: (user: User | null) => void, onError: (error: unknown) => void) => Promise<() => void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  loadProfile: (uid: string) => Promise<ProfileLoadResult>;
}

const defaultDependencies: AuthDependencies = {
  subscribe: async (listener, onError) => onAuthStateChanged(await getFirebaseAuth(), listener, onError),
  signIn: async (email, password) => { await signInWithEmailAndPassword(await getFirebaseAuth(), email, password); },
  signOut: async () => firebaseSignOut(await getFirebaseAuth()),
  sendPasswordReset: async (email) => sendPasswordResetEmail(await getFirebaseAuth(), email),
  loadProfile: loadUserProfile,
};

export interface AuthContextValue extends AuthSnapshot {
  role: UserRole | null;
  accountStatus: UserAccountStatus | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps extends PropsWithChildren { dependencies?: AuthDependencies; }

const initialSnapshot: AuthSnapshot = { firebaseUser: null, profile: null, authState: 'initializing', error: null };

export function AuthProvider({ children, dependencies }: AuthProviderProps) {
  const deps = dependencies ?? defaultDependencies;
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(() => !dependencies && !getFirebaseConfig().configured
    ? { firebaseUser: null, profile: null, authState: 'configuration-error', error: 'Firebase belum dikonfigurasi untuk lingkungan ini.' }
    : initialSnapshot);
  const generation = useRef(0);

  const resolveProfile = useCallback(async (user: User) => {
    const request = ++generation.current;
    setSnapshot({ firebaseUser: user, profile: null, authState: 'resolving-profile', error: null });
    try {
      const result = await deps.loadProfile(user.uid);
      if (request !== generation.current) return;
      if (result.kind === 'missing') setSnapshot({ firebaseUser: user, profile: null, authState: 'missing-profile', error: null });
      else if (result.kind === 'invalid') setSnapshot({ firebaseUser: user, profile: null, authState: 'invalid-role', error: 'Profil akun tidak valid. Hubungi owner untuk memperbaiki akses.' });
      else if (result.profile.status === 'inactive') setSnapshot({ firebaseUser: user, profile: result.profile, authState: 'inactive', error: null });
      else if (result.profile.status === 'pending') setSnapshot({ firebaseUser: user, profile: result.profile, authState: 'pending', error: null });
      else setSnapshot({ firebaseUser: user, profile: result.profile, authState: 'authenticated', error: null });
    } catch (error) {
      if (request !== generation.current) return;
      const mapped = mapFirebaseAuthError(error);
      if (__DEV__) console.error('Gagal mengambil profil pengguna:', mapped.cause);
      setSnapshot({ firebaseUser: user, profile: null, authState: 'error', error: 'Profil akun belum dapat dimuat. Periksa koneksi lalu coba lagi.' });
    }
  }, [deps]);

  useEffect(() => {
    if (!dependencies && !getFirebaseConfig().configured) {
      return;
    }
    let mounted = true;
    let unsubscribe: (() => void) | undefined;
    void deps.subscribe((user) => {
      if (!mounted) return;
      if (!user) {
        generation.current += 1;
        setSnapshot({ firebaseUser: null, profile: null, authState: 'unauthenticated', error: null });
      } else void resolveProfile(user);
    }, (error) => {
      if (!mounted) return;
      const mapped = mapFirebaseAuthError(error);
      if (__DEV__) console.error('Firebase auth listener gagal:', mapped.cause);
      setSnapshot({ firebaseUser: null, profile: null, authState: 'error', error: mapped.message });
    }).then((cleanup) => { if (mounted) unsubscribe = cleanup; else cleanup(); }).catch((error) => {
      if (!mounted) return;
      const mapped = mapFirebaseAuthError(error);
      setSnapshot({ firebaseUser: null, profile: null, authState: 'error', error: mapped.message });
    });
    return () => { mounted = false; generation.current += 1; unsubscribe?.(); };
  }, [dependencies, deps, resolveProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setSnapshot((current) => ({ ...current, error: null }));
    try { await deps.signIn(email.trim(), password); }
    catch (error) { const mapped = mapFirebaseAuthError(error); if (__DEV__) console.error('Login gagal:', mapped.cause); setSnapshot((current) => ({ ...current, error: mapped.message })); throw mapped; }
  }, [deps]);

  const signOut = useCallback(async () => {
    generation.current += 1;
    setSnapshot({ firebaseUser: null, profile: null, authState: 'initializing', error: null });
    try { await deps.signOut(); }
    catch (error) { const mapped = mapFirebaseAuthError(error); setSnapshot({ firebaseUser: null, profile: null, authState: 'error', error: mapped.message }); throw mapped; }
  }, [deps]);

  const reset = useCallback(async (email: string) => {
    setSnapshot((current) => ({ ...current, error: null }));
    try { await deps.sendPasswordReset(email.trim()); }
    catch (error) { const mapped = mapFirebaseAuthError(error); if (__DEV__) console.error('Reset password gagal:', mapped.cause); setSnapshot((current) => ({ ...current, error: mapped.message })); throw mapped; }
  }, [deps]);

  const refreshProfile = useCallback(async () => { if (snapshot.firebaseUser) await resolveProfile(snapshot.firebaseUser); }, [resolveProfile, snapshot.firebaseUser]);

  const value = useMemo<AuthContextValue>(() => ({ ...snapshot, role: snapshot.profile?.role ?? null, accountStatus: snapshot.profile?.status ?? null, isLoading: snapshot.authState === 'initializing' || snapshot.authState === 'resolving-profile', signIn, signOut, sendPasswordReset: reset, refreshProfile }), [snapshot, signIn, signOut, reset, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
