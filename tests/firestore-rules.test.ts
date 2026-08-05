import{afterAll,beforeAll,beforeEach,describe,expect,it}from"vitest";
import{assertFails,assertSucceeds,initializeTestEnvironment,type RulesTestEnvironment}from"@firebase/rules-unit-testing";
import{readFileSync}from"node:fs";
import{doc,getDoc,setDoc,updateDoc,Timestamp,runTransaction}from"firebase/firestore";

describe("Firestore security rules dan concurrency",()=>{
 let env:RulesTestEnvironment;
 beforeAll(async()=>{const[host,port]=String(process.env.FIRESTORE_EMULATOR_HOST||"127.0.0.1:8080").split(":");env=await initializeTestEnvironment({projectId:"demo-manzsa",firestore:{rules:readFileSync("firestore.rules","utf8"),host,port:Number(port)}})});
 beforeEach(async()=>{await env.clearFirestore();await env.withSecurityRulesDisabled(async ctx=>{const db=ctx.firestore();await Promise.all([setDoc(doc(db,"rooms/public"),{isPublic:true,status:"available",archivedAt:null}),setDoc(doc(db,"rooms/private"),{isPublic:false,status:"available"}),setDoc(doc(db,"users/tenant-a"),{uid:"tenant-a",role:"tenant",activeRoomId:"room-a"}),setDoc(doc(db,"users/tenant-b"),{uid:"tenant-b",role:"tenant",activeRoomId:"room-b"}),setDoc(doc(db,"bookings/b1"),{tenantId:"tenant-a"}),setDoc(doc(db,"invoices/i1"),{tenantId:"tenant-a"}),setDoc(doc(db,"payments/p1"),{tenantId:"tenant-a",status:"pending"}),setDoc(doc(db,"announcements/all"),{status:"published",audienceType:"all",publishedAt:Timestamp.fromDate(new Date(Date.now()-1000))}),setDoc(doc(db,"announcements/room"),{status:"published",audienceType:"room",targetRoomId:"room-a",publishedAt:Timestamp.fromDate(new Date(Date.now()-1000))})])})});
 afterAll(async()=>{if(env)await env.cleanup()});
 const publicDb=()=>env.unauthenticatedContext().firestore(),tenant=(uid="tenant-a")=>env.authenticatedContext(uid,{role:"tenant"}).firestore(),owner=()=>env.authenticatedContext("owner",{role:"owner"}).firestore();
 it("public hanya membaca kamar publik aktif",async()=>{await assertSucceeds(getDoc(doc(publicDb(),"rooms/public")));await assertFails(getDoc(doc(publicDb(),"rooms/private")))});
 it("tenant hanya membaca profil sendiri",async()=>{await assertSucceeds(getDoc(doc(tenant(),"users/tenant-a")));await assertFails(getDoc(doc(tenant(),"users/tenant-b")))});
 it("tenant hanya membaca booking sendiri",async()=>{await assertSucceeds(getDoc(doc(tenant(),"bookings/b1")));await assertFails(getDoc(doc(tenant("tenant-b"),"bookings/b1")))});
 it("tenant hanya membaca invoice sendiri",async()=>{await assertSucceeds(getDoc(doc(tenant(),"invoices/i1")));await assertFails(getDoc(doc(tenant("tenant-b"),"invoices/i1")))});
 it("tenant hanya membaca pembayaran sendiri",async()=>{await assertSucceeds(getDoc(doc(tenant(),"payments/p1")));await assertFails(getDoc(doc(tenant("tenant-b"),"payments/p1")))});
 it("owner membaca data operasional",async()=>{await assertSucceeds(getDoc(doc(owner(),"rooms/private")));await assertSucceeds(getDoc(doc(owner(),"payments/p1")))});
 it("client tidak dapat mengubah role atau profil",async()=>{await assertFails(updateDoc(doc(tenant(),"users/tenant-a"),{role:"owner"}));await assertFails(updateDoc(doc(tenant(),"users/tenant-a"),{fullName:"Ubah"}))});
 it("tenant tidak dapat memfinalkan pembayaran",async()=>assertFails(updateDoc(doc(tenant(),"payments/p1"),{status:"paid"})));
 it("client tidak dapat menulis booking",async()=>assertFails(setDoc(doc(tenant(),"bookings/new"),{tenantId:"tenant-a"})));
 it("client tidak dapat menulis lock",async()=>assertFails(setDoc(doc(owner(),"bookingLocks/x"),{bookingId:"x"})));
 it("client tidak dapat menulis counter",async()=>assertFails(setDoc(doc(owner(),"counters/x"),{currentValue:2})));
 it("client tidak dapat menulis webhook",async()=>assertFails(setDoc(doc(owner(),"webhookEvents/x"),{provider:"midtrans"})));
 it("client tidak dapat menulis email event",async()=>assertFails(setDoc(doc(owner(),"emailEvents/x"),{status:"sent"})));
 it("announcement room hanya terlihat tenant kamar target",async()=>{await assertSucceeds(getDoc(doc(tenant(),"announcements/room")));await assertFails(getDoc(doc(tenant("tenant-b"),"announcements/room")))});
 it("dua booking simultan menghasilkan tepat satu pemenang lock",async()=>{let results:PromiseSettledResult<string>[]=[];await env.withSecurityRulesDisabled(async ctx=>{const db=ctx.firestore(),attempt=(id:string)=>runTransaction(db,async tx=>{const lock=doc(db,"bookingLocks/room-a_20260805"),current=await tx.get(lock);if(current.exists())throw new Error("conflict");tx.set(lock,{bookingId:id});tx.set(doc(db,`bookings/${id}`),{tenantId:id,roomId:"room-a",status:"pending_payment"});return id});results=await Promise.allSettled([attempt("one"),attempt("two")])});expect(results.filter(x=>x.status==="fulfilled")).toHaveLength(1);expect(results.filter(x=>x.status==="rejected")).toHaveLength(1)});
});
