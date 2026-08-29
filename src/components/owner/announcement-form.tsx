"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({ title: z.string().min(4), content: z.string().min(10), audienceType: z.enum(["all", "room", "tenant"]), targetRoomId: z.string(), targetUserId: z.string(), priority: z.enum(["normal", "important"]), status: z.enum(["draft", "published"]), expiresAt: z.string() }).superRefine((value, context) => { if (value.audienceType === "room" && !value.targetRoomId) context.addIssue({ code: "custom", path: ["targetRoomId"], message: "Pilih kamar target." }); if (value.audienceType === "tenant" && !value.targetUserId) context.addIssue({ code: "custom", path: ["targetUserId"], message: "Pilih tenant target." }); });
type Values = z.infer<typeof schema>;

export function AnnouncementForm({ record }: { record?: Record<string, unknown> }) {
  const router = useRouter(), [message, setMessage] = useState("");
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { title: String(record?.title || ""), content: String(record?.content || ""), audienceType: (record?.audienceType as Values["audienceType"]) || "all", targetRoomId: String(record?.targetRoomId || ""), targetUserId: String(record?.targetUserId || ""), priority: (record?.priority as Values["priority"]) || "normal", status: (record?.status as Values["status"]) || "draft", expiresAt: record?.expiresAt ? String(record.expiresAt).slice(0, 16) : "" } });
  const audience = useWatch({ control, name: "audienceType" });
  async function submit(value: Values) {
    const body = { ...value, targetRoomId: value.audienceType === "room" ? value.targetRoomId : null, targetUserId: value.audienceType === "tenant" ? value.targetUserId : null, expiresAt: value.expiresAt ? new Date(value.expiresAt).toISOString() : null };
    const response = await fetch(record ? `/api/owner/announcements/${record.id}` : "/api/owner/announcements", { method: record ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json(); setMessage(response.ok ? "Pengumuman berhasil disimpan." : data.message || data.error || "Pengumuman gagal disimpan.");
    if (response.ok) { router.push("/owner/pengumuman"); router.refresh(); }
  }
  return <form className="card form" onSubmit={handleSubmit(submit)}><div className="field"><label>Judul</label><input className="input" {...register("title")} />{errors.title && <span className="field-error">{errors.title.message}</span>}</div><div className="field"><label>Isi pengumuman</label><textarea className="input" rows={7} {...register("content")} />{errors.content && <span className="field-error">{errors.content.message}</span>}</div><div className="grid three"><div className="field"><label>Target</label><select className="input" {...register("audienceType")}><option value="all">Semua tenant</option><option value="room">Satu kamar</option><option value="tenant">Satu tenant</option></select></div>{audience === "room" && <div className="field"><label>ID kamar</label><input className="input" {...register("targetRoomId")} /></div>}{audience === "tenant" && <div className="field"><label>UID tenant</label><input className="input" {...register("targetUserId")} /></div>}<div className="field"><label>Prioritas</label><select className="input" {...register("priority")}><option value="normal">Normal</option><option value="important">Penting + email</option></select></div><div className="field"><label>Status</label><select className="input" {...register("status")}><option value="draft">Draft</option><option value="published">Published</option></select></div><div className="field"><label>Kedaluwarsa (opsional)</label><input className="input" type="datetime-local" {...register("expiresAt")} /></div></div>{message && <div className={message.includes("berhasil") ? "alert success" : "alert"}>{message}</div>}<button className="button dark" disabled={isSubmitting}>{isSubmitting ? "Menyimpan…" : "Simpan pengumuman"}</button></form>;
}
