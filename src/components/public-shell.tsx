"use client";
import Link from "next/link";
import { Home, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [["/#beranda", "Beranda"], ["/#tentang", "Tentang"], ["/#kamar", "Kamar"], ["/#fasilitas", "Fasilitas"], ["/#galeri", "Galeri"], ["/#faq", "FAQ"], ["/#kontak", "Kontak"]];
export function PublicHeader() {
  const [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false), [role, setRole] = useState<"owner" | "tenant" | null>(null);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 12); update(); window.addEventListener("scroll", update, { passive: true }); void fetch("/api/auth/session").then((response) => response.json()).then((body) => { const authenticated = Boolean(body.data?.authenticated); setRole(authenticated ? body.data.role : null); if (authenticated) document.querySelectorAll<HTMLAnchorElement>('a[href="/login?next=/kamar"]').forEach((link) => { link.href = "/kamar"; }); }).catch(() => setRole(null)); return () => window.removeEventListener("scroll", update); }, []);
  return <header className={`prototype-header ${scrolled ? "is-scrolled" : ""}`} data-public-header><nav className="prototype-shell prototype-nav">
    <Link className="prototype-brand" href="/" aria-label="Manzsa Residence"><Home size={25} strokeWidth={2.4} /><span>Manzsa Residence</span></Link>
    <div className="prototype-links">{links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</div>
    <div className="prototype-auth">{role ? <Link className="prototype-btn prototype-btn-lime prototype-btn-small" href={role === "owner" ? "/owner" : "/tenant"}>Dashboard Saya</Link> : <><Link href="/login">Login</Link><Link className="prototype-btn prototype-btn-lime prototype-btn-small" href="/daftar">Daftar</Link></>}</div>
    <button type="button" className="prototype-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Buka menu navigasi" onClick={() => setOpen(!open)}>{open ? <X size={28} /> : <Menu size={28} />}</button>
  </nav>{open && <div id="mobile-navigation" className="prototype-mobile-nav">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<div className="prototype-mobile-auth">{role ? <Link className="prototype-btn prototype-btn-lime" href={role === "owner" ? "/owner" : "/tenant"}>Dashboard Saya</Link> : <><Link href="/login">Login</Link><Link className="prototype-btn prototype-btn-lime" href="/daftar">Daftar</Link></>}</div></div>}</header>;
}

export function PublicFooter() {
  return <footer className="prototype-footer"><div className="prototype-shell prototype-footer-grid"><div><div className="prototype-brand"><Home size={22} /> Manzsa Residence</div><p>Hunian nyaman dengan proses booking yang jelas dan mudah.</p></div><div><strong>Navigasi</strong><p><Link href="/kamar">Kamar</Link><br /><Link href="/fasilitas">Fasilitas</Link><br /><Link href="/faq">FAQ</Link></p></div><div><strong>Kontak</strong><p>{process.env.NEXT_PUBLIC_CONTACT_EMAIL || "halo@manzsaresidence.id"}<br />{process.env.NEXT_PUBLIC_PROPERTY_ADDRESS || "Jakarta, Indonesia"}</p></div></div></footer>;
}
