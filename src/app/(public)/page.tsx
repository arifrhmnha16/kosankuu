import Link from "next/link";
import { Suspense } from "react";
import { RegistrationNotice } from "@/components/registration-notice";
import { PrototypeGallery } from "@/components/prototype-gallery";
import { RoomCard } from "@/components/room-card";
import { getSession } from "@/lib/auth/session";
import {
  publicGallery,
  publicProperty,
  publicRooms,
} from "@/lib/firestore/public-data";

const fallbackImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1000&auto=format&fit=crop",
];
function roomImage(room: Record<string, unknown> | undefined, index: number) {
  const images = room?.images as Array<{ secureUrl?: string }> | undefined;
  return images?.[0]?.secureUrl || fallbackImages[index];
}
const faq = [
  [
    "Bagaimana cara melakukan booking?",
    "Pilih kamar, tentukan jadwal, periksa ringkasan harga, lalu kirim permintaan booking melalui akun Anda.",
  ],
  [
    "Apakah booking langsung diterima?",
    "Permintaan akan diperiksa terlebih dahulu untuk memastikan kamar dan jadwal masih tersedia.",
  ],
  [
    "Metode pembayaran apa yang tersedia?",
    "Pembayaran online dan transfer manual dengan unggahan bukti pembayaran.",
  ],
  [
    "Kapan booking dianggap terkonfirmasi?",
    "Booking terkonfirmasi setelah permintaan disetujui dan pembayaran berhasil diverifikasi.",
  ],
  [
    "Apakah booking dapat dibatalkan?",
    "Pembatalan mengikuti kebijakan properti dan status booking.",
  ],
  [
    "Apakah saya menerima invoice?",
    "Ya. Invoice dibuat otomatis dan dapat dilihat dari dashboard setelah pembayaran tercatat.",
  ],
];

export default async function Home() {
  const [rooms, gallery, property, session] = await Promise.all([
    publicRooms(),
    publicGallery(),
    publicProperty(),
    getSession(),
  ]);
  const ordered = rooms
    .filter((room) => room.isFeatured)
    .concat(rooms.filter((room) => !room.isFeatured));
  const galleryItems = (
    gallery.length
      ? gallery
          .filter((item) => item.secureUrl)
          .map((item) => ({
            src: String(item.secureUrl),
            alt: String(item.altText || "Galeri Manzsa Residence"),
          }))
      : fallbackImages.map((src, index) => ({
          src,
          alt: `Suasana Manzsa Residence ${index + 1}`,
        }))
  ).slice(0, 4);
  return (
    <div className="landing-home">
      <Suspense>
        <RegistrationNotice />
      </Suspense>
      <section id="beranda" className="prototype-landing-hero">
        <div className="prototype-hero-grid-bg" />
        <div className="prototype-glow prototype-glow-left" />
        <div className="prototype-glow prototype-glow-right" />
        <div className="prototype-hero-copy">
          <h1>
            Nyaman untuk tinggal.
            <br />
            Jelas sejak booking.
          </h1>
          <p>
            Kamar siap huni dengan fasilitas lengkap, proses booking yang
            transparan, dan pengelolaan kebutuhan penghuni dalam satu sistem.
          </p>
          <div className="prototype-hero-actions">
            <Link
              className="prototype-btn prototype-btn-outline-white"
              href="/kamar"
            >
              Lihat Kamar
            </Link>
            <Link
              className="prototype-btn prototype-btn-lime"
              href={session ? "/kamar" : "/login?next=/kamar"}
            >
              Booking Sekarang
            </Link>
          </div>
        </div>
        <div className="prototype-room-composition">
          <div className="prototype-room-stage">
            <div
              className="prototype-room-photo prototype-room-left"
              style={{
                backgroundImage: `url('${roomImage(ordered[0] as unknown as Record<string, unknown>, 0)}')`,
              }}
            />
            <div
              className="prototype-room-photo prototype-room-center"
              style={{
                backgroundImage: `url('${roomImage(ordered[1] as unknown as Record<string, unknown>, 1)}')`,
              }}
            />
            <div
              className="prototype-room-photo prototype-room-right"
              style={{
                backgroundImage: `url('${roomImage(ordered[2] as unknown as Record<string, unknown>, 2)}')`,
              }}
            />
          </div>
          <p>Pilih kamar yang paling sesuai dengan kebutuhan Anda</p>
        </div>
      </section>
      <section id="tentang" className="prototype-section">
        <div className="prototype-shell">
          <div className="prototype-section-heading">
            <p>Kenapa Manzsa Residence</p>
            <h2>Semua proses penting dibuat lebih jelas.</h2>
          </div>
          <div className="prototype-benefits">
            {[
              [
                "✓",
                "Status kamar jelas",
                "Lihat ketersediaan kamar sebelum mengajukan booking.",
                "blue",
              ],
              [
                "⌕",
                "Booking diperiksa",
                "Setiap permintaan diverifikasi untuk mencegah jadwal bentrok.",
                "soft",
              ],
              [
                "↗",
                "Pembayaran fleksibel",
                "Bayar online atau unggah bukti transfer manual.",
                "lime",
              ],
              [
                "▤",
                "Invoice otomatis",
                "Riwayat tagihan dan invoice tersimpan dengan rapi.",
                "soft",
              ],
              [
                "!",
                "Keluhan tercatat",
                "Laporan penghuni terdokumentasi hingga selesai.",
                "dark",
              ],
            ].map(([icon, title, copy, tone]) => (
              <article className={`prototype-benefit ${tone}`} key={title}>
                <span>{icon}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="prototype-centered-action">
            <Link className="prototype-btn prototype-btn-line" href="/tentang">
              Selengkapnya Tentang Kami
            </Link>
          </div>
        </div>
      </section>
      <section id="kamar" className="prototype-section prototype-surface">
        <div className="prototype-shell">
          <div className="prototype-section-heading">
            <p>Pilihan kamar</p>
            <h2>Kamar yang tersedia</h2>
          </div>
          {ordered.length ? (
            <div className="prototype-room-grid">
              {ordered.slice(0, 3).map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>Kamar belum tersedia saat ini</h3>
              <p>
                Silakan kembali lagi atau hubungi pengelola untuk informasi
                berikutnya.
              </p>
            </div>
          )}
          <div className="prototype-centered-action">
            <Link className="prototype-btn prototype-btn-dark" href="/kamar">
              Lihat Semua Kamar
            </Link>
          </div>
        </div>
      </section>
      <section id="fasilitas" className="prototype-section">
        <div className="prototype-shell prototype-facilities">
          <div className="prototype-section-heading">
            <p>Fasilitas properti</p>
            <h2>Kebutuhan harian sudah disiapkan.</h2>
            <span>
              Fasilitas dapat berbeda menurut tipe kamar. Detail lengkap
              tersedia pada halaman setiap kamar.
            </span>
          </div>
          <div className="prototype-facility-grid">
            {[
              ["⌁", "Wi-Fi berkecepatan tinggi", "blue"],
              ["❄", "AC di setiap kamar", "soft"],
              ["▣", "Dapur bersama", "soft"],
              ["◉", "CCTV & akses 24 jam", "lime"],
              ["▤", "Laundry area", "dark"],
              ["P", "Area parkir", "soft"],
            ].map(([icon, title, tone]) => (
              <div className={`prototype-facility ${tone}`} key={title}>
                <span>{icon}</span>
                <h3>{title}</h3>
              </div>
            ))}
          </div>
          <Link className="prototype-btn prototype-btn-dark" href="/fasilitas">
            Lihat Semua Fasilitas
          </Link>
        </div>
      </section>
      <section
        id="galeri"
        className="prototype-section prototype-gallery-section"
      >
        <div className="prototype-shell">
          <div className="prototype-section-heading">
            <p>Galeri</p>
            <h2>Lihat suasana Manzsa.</h2>
            <span>Klik foto untuk melihat tampilan lebih besar.</span>
          </div>
          <PrototypeGallery images={galleryItems} compact />
        </div>
      </section>
      <section id="faq" className="prototype-section">
        <div className="prototype-shell prototype-faq-layout">
          <div className="prototype-section-heading">
            <p>FAQ</p>
            <h2>Pertanyaan yang sering diajukan.</h2>
          </div>
          <div className="prototype-faq-list">
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span>+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section id="kontak" className="prototype-contact-wrap">
        <div className="prototype-contact-cta">
          <div>
            <p>Butuh bantuan?</p>
            <h2>Hubungi pengelola Manzsa Residence.</h2>
            <span>
              {String(property.address || "Jakarta, Indonesia")} ·{" "}
              {String(property.operatingHours || "Sen–Sab, 08.00–18.00")}
            </span>
          </div>
          <div>
            <a
              className="prototype-btn prototype-btn-lime"
              href={`https://wa.me/${String(property.whatsapp || "").replace(/\D/g, "")}`}
            >
              Chat WhatsApp
            </a>
            <a
              className="prototype-contact-email"
              href={`mailto:${String(property.email || "halo@manzsaresidence.id")}`}
            >
              {String(property.email || "halo@manzsaresidence.id")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
