import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { success, resultError, AppError } from "@/lib/errors";
import { assertSameOrigin, cleanText, rateLimit } from "@/lib/security";
import { sendVerificationEmail } from "@/lib/verification-email";
const schema=z.object({token:z.string().min(100),fullName:z.string().min(2).max(100),phone:z.string().min(8).max(20)});
export async function POST(request:Request){try{await assertSameOrigin(request);rateLimit(`register:${request.headers.get("x-forwarded-for")||"local"}`,5,300_000);const input=schema.parse(await request.json()),user=await adminAuth().verifyIdToken(input.token);if(!user.email)throw new AppError("EMAIL_REQUIRED","Email wajib tersedia.",422);await adminAuth().setCustomUserClaims(user.uid,{role:"tenant"});await adminDb().doc(`users/${user.uid}`).set({uid:user.uid,role:"tenant",fullName:cleanText(input.fullName),email:user.email,phone:input.phone,status:"active",emailVerified:false,createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()},{merge:true});let verificationEmailSent=true;try{await sendVerificationEmail(user.uid,user.email,"register")}catch{verificationEmailSent=false}return Response.json(success({uid:user.uid,verificationRequired:true,verificationEmailSent}),{status:201})}catch(error){const{body,status}=resultError(error);return Response.json(body,{status})}}
