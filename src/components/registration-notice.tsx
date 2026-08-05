"use client";
import { useSearchParams } from "next/navigation";

export function RegistrationNotice() {
  const visible = useSearchParams().get("registration") === "verify-email";
  return visible ? <div className="registration-notice" role="status"><strong>Akun berhasil dibuat.</strong><span>Periksa email dan klik tautan verifikasi. Setelah itu Anda dapat login, memilih kamar, dan booking langsung dari kalender kamar.</span></div> : null;
}
