import"server-only";import{headers}from"next/headers";import{AppError}from"@/lib/errors";
const buckets=new Map<string,{count:number;reset:number}>();
export async function assertSameOrigin(req:Request){const origin=req.headers.get("origin");if(!origin)return;const host=(await headers()).get("x-forwarded-host")||(await headers()).get("host");if(!host||new URL(origin).host!==host)throw new AppError("INVALID_ORIGIN","Permintaan lintas situs ditolak.",403)}
export function rateLimit(key:string,limit=20,windowMs=60_000){const now=Date.now(),entry=buckets.get(key);if(!entry||entry.reset<=now){buckets.set(key,{count:1,reset:now+windowMs});return}if(entry.count>=limit)throw new AppError("RATE_LIMITED","Terlalu banyak permintaan. Coba kembali beberapa saat lagi.",429);entry.count++}
export const cleanText=(value:string)=>value.replace(/<[^>]*>/g,"").replace(/[\u0000-\u001F\u007F]/g,"").trim();
