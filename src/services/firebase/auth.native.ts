import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';

import { getFirebaseApp } from './app';

let nativeAuth: Auth | undefined;

export async function getFirebaseAuth(): Promise<Auth> {
  if (nativeAuth) return nativeAuth;
  const app = getFirebaseApp();
  try {
    nativeAuth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'auth/already-initialized') nativeAuth = getAuth(app);
    else throw error;
  }
  return nativeAuth;
}
