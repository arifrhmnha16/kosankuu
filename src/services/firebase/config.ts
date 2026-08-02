import type { FirebaseOptions } from 'firebase/app';

const rawFirebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
} as const;

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
export type FirebaseRequiredKey = (typeof requiredKeys)[number];

export interface FirebaseConfigResult {
  configured: boolean;
  missingKeys: FirebaseRequiredKey[];
  options: FirebaseOptions | null;
}

export function getFirebaseConfig(): FirebaseConfigResult {
  const missingKeys = requiredKeys.filter((key) => !rawFirebaseConfig[key]?.trim());
  if (missingKeys.length) return { configured: false, missingKeys, options: null };
  const options: FirebaseOptions = {
    apiKey: rawFirebaseConfig.apiKey!,
    authDomain: rawFirebaseConfig.authDomain!,
    projectId: rawFirebaseConfig.projectId!,
    storageBucket: rawFirebaseConfig.storageBucket!,
    messagingSenderId: rawFirebaseConfig.messagingSenderId!,
    appId: rawFirebaseConfig.appId!,
  };
  if (rawFirebaseConfig.measurementId?.trim()) options.measurementId = rawFirebaseConfig.measurementId;
  return { configured: true, missingKeys: [], options };
}
