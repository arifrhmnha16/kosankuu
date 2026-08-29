"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Application route error", { digest: error.digest }); }, [error]);
  return <main className="container" style={{ paddingBlock: 140 }}><div className="empty"><h1>Halaman belum dapat dimuat</h1><p className="muted">Terjadi gangguan saat mengambil data. Data palsu tidak ditampilkan.</p><button className="button dark" onClick={reset}>Coba lagi</button></div></main>;
}
