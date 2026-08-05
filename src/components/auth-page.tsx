import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

const sideCopy = {
  login: ["Selamat datang kembali", "Kelola kebutuhan hunian dalam satu akun.", "Lihat booking, pembayaran, invoice, dan laporan Anda melalui dashboard."],
  register: ["Registrasi tenant", "Buat akun untuk mulai booking.", "Akun digunakan untuk mengirim booking, menyimpan invoice, dan mengelola kebutuhan selama tinggal."],
  forgot: ["Pemulihan akun", "Atur ulang akses akun Anda.", "Kami akan mengirimkan instruksi reset ke alamat email yang Anda masukkan."],
  reset: ["Password baru", "Buat password yang aman.", "Gunakan minimal delapan karakter dan hindari password yang mudah ditebak."],
} as const;

export function AuthPage({ mode, title, description }: { mode: "login" | "register" | "forgot" | "reset"; title: string; description: string }) {
  const copy = sideCopy[mode];
  return <main className={`auth auth-wrap auth-${mode}`}><aside className="auth-side"><p className="eyebrow">{copy[0]}</p><h2 className="title">{copy[1]}</h2><p>{copy[2]}</p></aside><section className="auth-main auth-panel"><div className="auth-box"><h1 className="section-title">{title}</h1>{description && <p className="muted auth-description">{description}</p>}<Suspense fallback={<div className="skeleton" />}><AuthForm mode={mode} /></Suspense></div></section></main>;
}
