import { z } from "zod";
import { adminAuth } from "@/lib/firebase/admin";
import { assertSameOrigin, rateLimit } from "@/lib/security";
import { resultError, success } from "@/lib/errors";
import { sendVerificationEmail } from "@/lib/verification-email";
export async function POST(request:Request){try{await assertSameOrigin(request);const{email}=z.object({email:z.string().email()}).parse(await request.json());rateLimit(`verify:${request.headers.get("x-forwarded-for")||"local"}:${email.toLowerCase()}`,3,15*60_000);try{const user=await adminAuth().getUserByEmail(email);if(!user.emailVerified)await sendVerificationEmail(user.uid,email,`resend_${Math.floor(Date.now()/900_000)}`)}catch{}return Response.json(success({sent:true}))}catch(error){const{body,status}=resultError(error);return Response.json(body,{status})}}
