import type{DecodedIdToken}from"firebase-admin/auth";export function owns(session:DecodedIdToken,resourceTenantId:string){return session.role==="owner"||session.uid===resourceTenantId}
