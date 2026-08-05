"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, MailCheck } from "lucide-react";

export function VerificationPage() {
  const params = useSearchParams(),
    verified = params.get("verified") === "1",
    [email, setEmail] = useState(() => typeof window === "undefined" ? "" : sessionStorage.getItem("verificationEmail") || ""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function resend() {
    if (!email) {
      setMessage("Masukkan email akun Anda.");
      return;
    }
    setBusy(true);
    const response = await fetch("/api/auth/verification/resend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      }),
      body = await response.json();
    setBusy(false);
    setMessage(
      response.ok
        ? "Jika akun ditemukan dan belum aktif, email verifikasi baru telah dikirim."
        : body.message || "Email belum dapat dikirim.",
    );
  }
  return (
    <main className="verification-page">
      <section className="verification-card">
        {verified ? <CheckCircle2 size={54} /> : <MailCheck size={54} />}
        <p className="eyebrow">Verifikasi akun</p>
        <h1>
          {verified ? "Email berhasil diverifikasi." : "Periksa email Anda."}
        </h1>
        <p>
          {verified
            ? "Akun Anda sudah aktif. Silakan login, pilih kamar, lalu tentukan jadwal dari kalender booking."
            : "Kami mengirim tautan verifikasi dengan email resmi Manzsa Residence. Buka tautan tersebut sebelum login dan booking."}
        </p>
        {verified ? (
          <Link className="button dark" href="/login?verified=1">
            Login Sekarang
          </Link>
        ) : (
          <>
            <div className="field">
              <label>Email akun</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
              />
            </div>
            <button
              className="button dark"
              disabled={busy}
              onClick={() => void resend()}
            >
              {busy ? "Mengirim…" : "Kirim Ulang Verifikasi"}
            </button>
            <Link href="/">Kembali ke website</Link>
          </>
        )}
        {message && (
          <div className="alert success" role="status">
            {message}
          </div>
        )}
      </section>
    </main>
  );
}
