"use client";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CloudinaryUploader } from "@/components/cloudinary-uploader";
import type { MediaAsset } from "@/types/domain";

const schema = z.object({ title: z.string().min(5), category: z.string().min(2), description: z.string().min(10), priority: z.enum(["low", "medium", "high", "urgent"]), roomId: z.string() });
type Values = z.infer<typeof schema>;

export function ComplaintForm({ uid, roomId = "" }: { uid: string; roomId?: string }) {
  const router = useRouter(), uploadId = useId().replace(/:/g, "");
  const [attachments, setAttachments] = useState<MediaAsset[]>([]), [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { priority: "medium", roomId } });
  async function submit(value: Values) {
    const response = await fetch("/api/complaints", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...value, roomId: value.roomId || undefined, attachments }) });
    const data = await response.json();
    if (!response.ok) { setMessage(data.message || data.error || "Keluhan gagal dikirim."); return; }
    router.push(`/tenant/keluhan/${data.data?.id || data.id}`); router.refresh();
  }
  return <form className="card form" onSubmit={handleSubmit(submit)}><h2>Buat keluhan</h2>
    <div className="grid three"><div className="field"><label>Judul</label><input className="input" {...register("title")} />{errors.title && <span className="field-error">{errors.title.message}</span>}</div><div className="field"><label>Kategori</label><select className="input" {...register("category")}><option value="fasilitas_kamar">Fasilitas kamar</option><option value="area_umum">Area umum</option><option value="keamanan">Keamanan</option><option value="lainnya">Lainnya</option></select></div><div className="field"><label>Prioritas</label><select className="input" {...register("priority")}><option value="low">Rendah</option><option value="medium">Sedang</option><option value="high">Tinggi</option><option value="urgent">Mendesak</option></select></div></div>
    <div className="field"><label>Deskripsi</label><textarea className="input" rows={6} {...register("description")} /></div><input type="hidden" {...register("roomId")} />
    <CloudinaryUploader purpose="complaint" resourceId={`${uid}-${uploadId}`} value={attachments} onChange={setAttachments} />
    {message && <div className="alert">{message}</div>}<button className="button dark" disabled={isSubmitting}>{isSubmitting ? "Mengirim…" : "Kirim keluhan"}</button>
  </form>;
}
