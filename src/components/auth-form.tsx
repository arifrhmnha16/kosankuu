"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

type Mode = "login" | "register" | "forgot" | "reset";

async function createServerSession(token: string) {
  return fetch("/api/auth/session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const reset = mode === "reset";
  const forgot = mode === "forgot";
  const register = mode === "register";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      if (forgot) {
        const response = await fetch("/api/auth/reset-request", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error("Instruksi reset gagal dikirim.");
        setSuccess("Jika email terhubung ke akun, instruksi reset telah dikirim.");
        return;
      }

      if (reset) {
        const code = params.get("oobCode");
        if (!code) throw new Error("Tautan reset tidak valid atau kedaluwarsa.");
        if (password !== form.get("confirm")) throw new Error("Konfirmasi password tidak sama.");
        await confirmPasswordReset(firebaseAuth(), code, password);
        router.push("/login?reset=success");
        return;
      }

      if (register) {
        if (password.length < 8) throw new Error("Password minimal 8 karakter.");
        if (password !== form.get("confirm")) throw new Error("Konfirmasi password tidak sama.");
        const auth = firebaseAuth();
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const registration = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            token: await credential.user.getIdToken(),
            fullName: form.get("fullName"),
            phone: form.get("phone"),
          }),
        });
        if (!registration.ok) {
          const body = await registration.json();
          throw new Error(body.message || "Registrasi gagal.");
        }
        sessionStorage.setItem("verificationEmail", email);
        await signOut(auth);
        router.push("/verifikasi-email");
        router.refresh();
        return;
      }

      const credential = await signInWithEmailAndPassword(firebaseAuth(), email, password);
      if (!credential.user.emailVerified) {
        await signOut(firebaseAuth());
        throw new Error("Email belum diverifikasi. Periksa kotak masuk dan folder spam Anda.");
      }
      const response = await createServerSession(await credential.user.getIdToken(true));
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Sesi tidak dapat dibuat.");
      const role = body.data?.role as "owner" | "tenant" | undefined;
      router.push(params.get("next") || (role === "owner" ? "/owner" : "/"));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Permintaan gagal. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form auth-form" onSubmit={submit}>
      {error && <div className="alert auth-error" role="alert">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      {register && <>
        <div className="field"><label htmlFor="fullName">Nama lengkap</label><input className="input" id="fullName" name="fullName" placeholder="Nama lengkap" required /></div>
        <div className="field"><label htmlFor="phone">Nomor WhatsApp</label><input className="input" id="phone" name="phone" placeholder="08xxxxxxxxxx" required /></div>
      </>}
      {!reset && <div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" placeholder="nama@email.com" autoComplete="email" required /></div>}
      {!forgot && <div className={register ? "auth-password-grid" : ""}>
        <div className="field"><label htmlFor="password">{reset ? "Password baru" : "Password"}</label><input className="input" id="password" name="password" type="password" placeholder="Minimal 8 karakter" minLength={8} autoComplete={register || reset ? "new-password" : "current-password"} required /></div>
        {(register || reset) && <div className="field"><label htmlFor="confirm">Konfirmasi password{reset ? " baru" : ""}</label><input className="input" id="confirm" name="confirm" type="password" placeholder="Ulangi password" minLength={8} required /></div>}
      </div>}
      {mode === "login" && <div className="auth-helper-row"><label><input type="checkbox" name="remember" /> Ingat saya</label><Link href="/lupa-password">Lupa password?</Link></div>}
      {register && <label className="auth-terms"><input type="checkbox" required /> Saya menyetujui syarat dan kebijakan privasi.</label>}
      <button className="button dark auth-submit" disabled={busy}>{busy && <span className="spinner" />}{busy ? "Memproses…" : forgot ? "Kirim Instruksi Reset" : reset ? "Simpan Password Baru" : register ? "Buat Akun" : "Login"}</button>
      {mode === "login" ? <p className="auth-switch">Belum punya akun? <Link href="/daftar">Daftar tenant</Link></p> : <p className="auth-switch"><Link href="/login">← Kembali ke Login</Link></p>}
    </form>
  );
}
