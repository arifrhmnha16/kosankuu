"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Menu } from "lucide-react";
import { useState } from "react";
const owner = [["/owner", "Ringkasan"], ["/owner/kamar", "Kamar"], ["/owner/booking", "Booking"], ["/owner/tenant", "Tenant"], ["/owner/pembayaran", "Pembayaran"], ["/owner/invoice", "Invoice"], ["/owner/keluhan", "Keluhan"], ["/owner/pengumuman", "Pengumuman"], ["/owner/laporan", "Laporan"], ["/owner/pengaturan", "Pengaturan"]];
const tenant = [["/tenant", "Ringkasan"], ["/tenant/tagihan", "Tagihan & Pembayaran"], ["/tenant/invoice", "Invoice"], ["/tenant/keluhan", "Keluhan"], ["/tenant/pengumuman", "Pengumuman"], ["/tenant/aktivitas", "Aktivitas"], ["/tenant/profil", "Data Diri"]];
export function DashboardShell({ role, name, children }: { role: "owner" | "tenant"; name: string; children: React.ReactNode }) {
  const path = usePathname(), [open, setOpen] = useState(false), router = useRouter(), links = role === "owner" ? owner : tenant;
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || (role === "owner" ? "OW" : "TN");
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); }
  return <div className="dashboard"><aside className={`sidebar ${open ? "open" : ""}`}><Link className="brand" href="/"><Home size={20} /> Manzsa Residence</Link><div className="tenant-card"><div className="avatar">{initials}</div><div><p>{name}</p><small>{role === "owner" ? "Administrator" : "Tenant"}</small></div></div><nav>{links.map(([href, label]) => <Link className={path === href ? "active" : ""} key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav><div className="sidebar-bottom dashboard-bottom"><Link href="/">{role === "owner" ? "Lihat Website" : "Kembali ke Website"}</Link><button type="button" onClick={logout}>Keluar</button></div></aside><div className="dashboard-main"><header className="topbar"><button className="mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Buka menu"><Menu /></button><span /><strong>{name}</strong></header><main className="dashboard-page">{children}</main></div>{open && <button className="sidebar-backdrop" aria-label="Tutup menu" onClick={() => setOpen(false)} />}</div>;
}
