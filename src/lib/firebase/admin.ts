import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function app() {
  if (getApps()[0]) return getApps()[0];
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    if (!projectId) throw new Error("Project ID emulator Firebase belum dikonfigurasi.");
    return initializeApp({ projectId });
  }
  if (!projectId || !clientEmail || !privateKey) throw new Error("Firebase Admin belum dikonfigurasi.");
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}
export const adminAuth = () => getAuth(app());
export const adminDb = () => getFirestore(app());
