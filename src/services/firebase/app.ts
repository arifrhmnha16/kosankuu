import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import { getFirebaseConfig } from './config';

let firebaseApp: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  const config = getFirebaseConfig();
  if (!config.options) throw new Error(`Konfigurasi Firebase belum lengkap: ${config.missingKeys.join(', ')}`);
  firebaseApp = firebaseApp ?? (getApps().length ? getApp() : initializeApp(config.options));
  return firebaseApp;
}
