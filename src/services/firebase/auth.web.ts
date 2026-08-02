import { browserLocalPersistence, getAuth, setPersistence, type Auth } from 'firebase/auth';

import { getFirebaseApp } from './app';

let webAuthPromise: Promise<Auth> | undefined;

export function getFirebaseAuth(): Promise<Auth> {
  webAuthPromise ??= (async () => {
    const auth = getAuth(getFirebaseApp());
    await setPersistence(auth, browserLocalPersistence);
    return auth;
  })();
  return webAuthPromise;
}
