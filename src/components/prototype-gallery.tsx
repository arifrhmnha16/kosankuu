"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
export type GalleryItem = { src: string; alt: string };
export function PrototypeGallery({ images, compact = false }: { images: GalleryItem[]; compact?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  useEffect(() => { if (active === null) return; const key = (event: KeyboardEvent) => { if (event.key === "Escape") setActive(null); if (event.key === "ArrowRight") setActive((active + 1) % images.length); if (event.key === "ArrowLeft") setActive((active - 1 + images.length) % images.length); }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, [active, images.length]);
  return <><div className={compact ? "prototype-gallery-grid" : "prototype-gallery-grid prototype-gallery-page"}>{images.map((item, index) => <button type="button" className="prototype-gallery-item" key={`${item.src}-${index}`} onClick={() => setActive(index)} aria-label={`Buka ${item.alt}`}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 767px) 50vw, 33vw" /></button>)}</div>{active !== null && <div className="prototype-lightbox" role="dialog" aria-modal="true" aria-label={images[active].alt} onClick={() => setActive(null)}><div className="prototype-lightbox-inner" onClick={(event) => event.stopPropagation()}><Image src={images[active].src} alt={images[active].alt} width={1600} height={1000} /><button type="button" className="prototype-lightbox-close" onClick={() => setActive(null)} aria-label="Tutup preview">×</button><p>{images[active].alt}</p></div></div>}</>;
}
