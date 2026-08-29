import { notFound } from "next/navigation";
import { ownerSections } from "@/lib/navigation";
import { requireRole } from "@/lib/auth/session";
import { listSection } from "@/lib/firestore/private-data";
import { OwnerSection } from "@/components/owner/owner-section";
import { SettingsForm } from "@/components/owner/settings-form";
import { ReportPanel } from "@/components/owner/report-panel";
import { OwnerBookingForm } from "@/components/owner/booking-form";

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params, info = ownerSections[section as keyof typeof ownerSections];
  if (!info) notFound();
  const session = await requireRole("owner"), records = section === "laporan" ? [] : await listSection(session, section);
  const bookingLookups = section === "booking" ? await Promise.all([listSection(session, "kamar"), listSection(session, "tenant")]) : null;
  return <><header className="dash-head"><h1>{info[0]}</h1><p>{info[1]}</p></header>{section === "booking" && bookingLookups && <OwnerBookingForm rooms={bookingLookups[0]} tenants={bookingLookups[1]} />}{section === "pengaturan" ? <SettingsForm settings={records[0] || {}} /> : section === "laporan" ? <ReportPanel /> : <OwnerSection section={section} records={records} />}</>;
}
