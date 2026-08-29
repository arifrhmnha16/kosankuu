"use client";
import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const config = { apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID };
let emulatorConnected = false;
export function firebaseAuth(){const app=getApps()[0]??initializeApp(config),auth=getAuth(app);if(process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR==="true"&&!emulatorConnected){connectAuthEmulator(auth,"http://127.0.0.1:9099",{disableWarnings:true});emulatorConnected=true}return auth}
