import { Suspense } from "react";
import { VerificationPage } from "@/components/verification-page";
export const metadata = { title: "Verifikasi email", robots: { index: false, follow: false } };
export default function Page() { return <Suspense><VerificationPage /></Suspense>; }
