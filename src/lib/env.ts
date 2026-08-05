import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Manzsa Residence"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://kosankuu.vercel.app"),
  NEXT_PUBLIC_TIMEZONE: z.string().default("Asia/Jakarta"),
  SESSION_COOKIE_NAME: z.string().default("manzsa_session"),
  SESSION_EXPIRES_DAYS: z.coerce.number().int().min(1).max(14).default(7),
});

export const env = schema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_TIMEZONE: process.env.NEXT_PUBLIC_TIMEZONE,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  SESSION_EXPIRES_DAYS: process.env.SESSION_EXPIRES_DAYS,
});

export const integrationStatus = () => ({
  firebaseClient: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  firebaseAdmin: Boolean(process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY),
  cloudinary: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  resend: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
  midtrans: Boolean(process.env.MIDTRANS_SERVER_KEY && process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY),
});
