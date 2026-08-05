import { Image as ImageIcon } from "lucide-react";
import { publicGallery } from "@/lib/firestore/public-data";
import { PrototypeGallery } from "@/components/prototype-gallery";
export const metadata = { title: "Galeri", alternates: { canonical: "/galeri" } };
export default async function Page() {
  const images = await publicGallery(), items = images.filter((item) => item.secureUrl).map((item) => ({ src: String(item.secureUrl), alt: String(item.altText || "Galeri Manzsa Residence") }));
  return <section className="section"><div className="container"><p className="eyebrow">Galeri</p><h1 className="section-title">Lihat ruang dan suasananya.</h1>{items.length ? <PrototypeGallery images={items} /> : <div className="empty"><ImageIcon /><h2>Galeri belum tersedia</h2></div>}</div></section>;
}
