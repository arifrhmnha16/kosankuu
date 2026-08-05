import "server-only";
import { adminAuth } from "@/lib/firebase/admin";
import { sendTransactionalEmail } from "@/lib/email";
export async function sendVerificationEmail(uid:string,email:string,attempt:string){const base=process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000",link=await adminAuth().generateEmailVerificationLink(email,{url:`${base}/verifikasi-email?verified=1`});return sendTransactionalEmail({to:email,subject:"Verifikasi email Manzsa Residence",title:"Verifikasi alamat email Anda",message:"Klik tombol berikut untuk mengaktifkan akun. Setelah terverifikasi, Anda dapat login dan booking kamar dari kalender ketersediaan.",template:"email_verification",relatedId:`${uid}_${attempt}`,actionUrl:link,actionLabel:"Verifikasi Email"})}
