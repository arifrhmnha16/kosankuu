import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';

import { firebasePublicConfig, hasFirebasePublicConfig } from './config';

let firebaseApp: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!hasFirebasePublicConfig) throw new Error('Konfigurasi Firebase belum tersedia. Salin .env.example ke .env dan isi nilai project pada Milestone 2.');
  const options: FirebaseOptions = {
    apiKey: firebasePublicConfig.apiKey,
    authDomain: firebasePublicConfig.authDomain,
    projectId: firebasePublicConfig.projectId,
    storageBucket: firebasePublicConfig.storageBucket,
    messagingSenderId: firebasePublicConfig.messagingSenderId,
    appId: firebasePublicConfig.appId,
    measurementId: firebasePublicConfig.measurementId,
  } as FirebaseOptions;
  firebaseApp = firebaseApp ?? (getApps().length ? getApp() : initializeApp(options));
  return firebaseApp;
}
