"use client";
import Image from "next/image";
import { useState } from "react";
import type { MediaAsset } from "@/types/domain";
import type { ActionResult } from "@/types/api";

type Purpose = "room" | "gallery" | "avatar" | "complaint" | "payment" | "property";
export function CloudinaryUploader({ purpose, resourceId, value, onChange, multiple = true }: { purpose: Purpose; resourceId: string; value: MediaAsset[]; onChange: (assets: MediaAsset[]) => void; multiple?: boolean }) {
  const [progress, setProgress] = useState(0), [error, setError] = useState("");
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const next = [...value];
    try {
      for (const file of Array.from(files)) {
        const signResponse = await fetch("/api/cloudinary/sign", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ purpose, resourceId, mimeType: file.type, bytes: file.size }) });
        const signed = await signResponse.json() as ActionResult<{ signature: string; timestamp: number; folder: string; apiKey: string; cloudName: string; deliveryType?: string }>;
        if (!signed.ok) throw new Error(signed.message);
        const form = new FormData();
        form.set("file", file); form.set("api_key", signed.data.apiKey); form.set("timestamp", String(signed.data.timestamp)); form.set("signature", signed.data.signature); form.set("folder", signed.data.folder);
        if (signed.data.deliveryType) form.set("type", signed.data.deliveryType);
        const asset = await xhr(`https://api.cloudinary.com/v1_1/${signed.data.cloudName}/image/upload`, form, setProgress);
        next.push({ publicId: String(asset.public_id), secureUrl: String(asset.secure_url), width: Number(asset.width), height: Number(asset.height), format: String(asset.format), bytes: Number(asset.bytes), resourceType: "image", altText: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "), sortOrder: next.length });
      }
      onChange(multiple ? next : next.slice(-1));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gagal.");
    } finally {
      setProgress(0);
    }
  }
  return <div className="field"><label>Unggah gambar</label><input className="input" type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} onChange={(event) => void upload(event.target.files)} />{progress > 0 && <progress value={progress} max={100} aria-label="Progress upload">{progress}%</progress>}{error && <span className="field-error">{error}</span>}{value.length > 0 && <div className="photo-list">{value.map((asset, index) => <div className="card" key={asset.publicId}><Image src={asset.secureUrl} alt={asset.altText} width={100} height={75} unoptimized={purpose === "payment" || purpose === "complaint"} /><input className="input" aria-label={`Alt gambar ${index + 1}`} value={asset.altText} onChange={(event) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, altText: event.target.value } : item))} /><div className="actions"><button type="button" className="button outline" disabled={index === 0} onClick={() => onChange(move(value, index, index - 1))}>Naik</button><button type="button" className="button outline" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, sortOrder: itemIndex })))}>Hapus</button></div></div>)}</div>}</div>;
}

function move<T>(items: T[], from: number, to: number) { const output = [...items]; const [item] = output.splice(from, 1); output.splice(to, 0, item); return output.map((value, index) => ({ ...value as object, sortOrder: index })) as T[]; }
function xhr(url: string, data: FormData, progress: (value: number) => void) { return new Promise<Record<string, unknown>>((resolve, reject) => { const request = new XMLHttpRequest(); request.open("POST", url); request.upload.onprogress = (event) => event.lengthComputable && progress(Math.round(event.loaded / event.total * 100)); request.onload = () => { try { const body = JSON.parse(request.responseText); if (request.status >= 200 && request.status < 300) resolve(body); else reject(new Error(body.error?.message || "Upload gagal.")); } catch { reject(new Error("Respons upload tidak valid.")); } }; request.onerror = () => reject(new Error("Koneksi upload gagal.")); request.send(data); }); }
