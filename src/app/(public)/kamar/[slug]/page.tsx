import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PublicBookingCalendar } from "@/components/public-booking-calendar";
import { publicRoomBySlug } from "@/lib/firestore/public-data";
import { rupiah } from "@/lib/format";
import type { MediaAsset, RentalType } from "@/types/domain";
const fallbacks = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=85",
];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params,
    room = await publicRoomBySlug(slug);
  return room
    ? {
        title: room.name,
        description: room.description,
        alternates: { canonical: `/kamar/${slug}` },
        openGraph: {
          title: room.name,
          description: room.description,
          images: [room.images?.[0]?.secureUrl || fallbacks[0]],
        },
      }
    : { title: "Kamar tidak ditemukan" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    room = await publicRoomBySlug(slug);
  if (!room) notFound();
  const uploaded = [...(room.images || [])].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    ),
    images: Array<
      | MediaAsset
      | {
          secureUrl: string;
          altText: string;
          publicId: string;
          sortOrder: number;
        }
    > = uploaded.length
      ? uploaded
      : fallbacks.map((secureUrl, index) => ({
          secureUrl,
          altText: `Foto ${room.name} ${index + 1}`,
          publicId: `fallback-${index}`,
          sortOrder: index,
        }));
  return (
    <main className="prototype-room-detail">
      <section className="detail-breadcrumb prototype-shell">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <Link href="/kamar">Kamar</Link>
        <span>/</span>
        <strong>{room.name}</strong>
      </section>
      <section className="detail-prototype-gallery prototype-shell">
        {Array.from(
          { length: 4 },
          (_, index) => images[index % images.length],
        ).map((image, index) => (
          <div
            key={`${image.publicId}-${index}`}
            className={index === 0 ? "detail-photo-main" : "detail-photo-small"}
          >
            <Image
              src={image.secureUrl}
              alt={image.altText || `Foto ${room.name}`}
              width={900}
              height={600}
              priority
              sizes={index === 0 ? "(max-width: 900px) 100vw, 60vw" : "30vw"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </section>
      <section className="detail-prototype-layout prototype-shell">
        <div className="detail-prototype-content">
          <header className="detail-room-heading">
            <div>
              <p>
                No. {room.number} · {room.type}
              </p>
              <h1>{room.name}</h1>
            </div>
            <span className={`detail-room-status ${room.status}`}>
              ● {room.status === "available" ? "Tersedia" : "Periksa jadwal"}
            </span>
          </header>
          <p className="detail-description">{room.description}</p>
          <div className="detail-room-stats">
            <div>
              <small>Kapasitas</small>
              <strong>Maksimal {room.capacity} orang</strong>
            </div>
            <div>
              <small>Luas kamar</small>
              <strong>{room.area} m²</strong>
            </div>
          </div>
          <section className="detail-info-block">
            <h2>Fasilitas kamar</h2>
            <div className="detail-facility-list">
              {room.facilities.map((item) => (
                <p key={item}>
                  <Check size={16} />
                  {item}
                </p>
              ))}
            </div>
          </section>
          <section className="detail-info-block">
            <h2>Aturan kamar dan kos</h2>
            <ul>
              {room.rules.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="detail-info-block detail-calendar" id="booking">
            <div className="detail-availability-title">
              <div>
                <h2>Ketersediaan kamar</h2>
                <p>Pilih tipe sewa dan tanggal yang masih tersedia.</p>
              </div>
              <div>
                <span>
                  <i className="available" />
                  Tersedia
                </span>
                <span>
                  <i />
                  Tidak tersedia
                </span>
              </div>
            </div>
            <PublicBookingCalendar room={room} />
          </section>
        </div>
        <aside className="detail-booking-aside">
          <h2>Harga sewa</h2>
          <div className="detail-price-list">
            {room.rentalTypes.map((type) => (
              <p key={type}>
                <span>{label(type)}</span>
                <strong>{rupiah(room.pricing[type])}</strong>
              </p>
            ))}
          </div>
          <div className="detail-deposit">
            <span>Deposit bulanan/tahunan</span>
            <strong>{rupiah(room.pricing.deposit)}</strong>
            <small>
              Hanya untuk sewa bulanan dan tahunan. Per jam dan per 24 jam tanpa
              deposit.
            </small>
          </div>
          <div className="detail-steps">
            <h3>Langkah booking</h3>
            <ol>
              <li>
                <span>1.</span>Pilih tipe sewa dan tanggal
              </li>
              <li>
                <span>2.</span>Pilih jam jika sewa per jam
              </li>
              <li>
                <span>3.</span>Periksa ringkasan harga
              </li>
              <li>
                <span>4.</span>Kirim booking dan bayar
              </li>
            </ol>
          </div>
          <a className="prototype-btn prototype-btn-lime" href="#booking">
            Booking Kamar Ini
          </a>
          <p>Jadwal dan harga diverifikasi ulang oleh server.</p>
        </aside>
      </section>
    </main>
  );
}
function label(type: RentalType) {
  return type === "hourly"
    ? "Per jam"
    : type === "daily"
      ? "Per 24 jam"
      : type === "monthly"
        ? "Per bulan"
        : "Per tahun";
}
