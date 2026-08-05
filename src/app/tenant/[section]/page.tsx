import { notFound } from "next/navigation";
import { tenantSections } from "@/lib/navigation";
import { requireRole } from "@/lib/auth/session";
import { listSection, tenantDashboard } from "@/lib/firestore/private-data";
import { publicRooms } from "@/lib/firestore/public-data";
import { TenantSection } from "@/components/tenant/tenant-section";
import { BookingWizard } from "@/components/tenant/booking-wizard";
import { ComplaintForm } from "@/components/tenant/complaint-form";
import { ProfileForm } from "@/components/tenant/profile-form";

export default async function Page({params,searchParams}:{params:Promise<{section:string}>;searchParams:Promise<{room?:string}>}){
  const {section}=await params,info=tenantSections[section as keyof typeof tenantSections];
  if(!info)notFound();
  const session=await requireRole("tenant"),records=await listSection(session,section),dashboard=section==="keluhan"?await tenantDashboard(session):null;
  return <><header className="dash-head"><h1>{info[0]}</h1><p>{info[1]}</p></header>
    {section==="booking"&&<BookingWizard rooms={await publicRooms()} initialRoom={(await searchParams).room}/>} 
    {section==="keluhan"&&<ComplaintForm uid={session.uid} roomId={String(dashboard?.user?.activeRoomId||"")}/>} 
    {section==="profil"?<ProfileForm profile={records[0]||({id:session.uid,email:session.email})}/>:<TenantSection section={section} records={records}/>}</>
}
