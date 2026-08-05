"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { rupiah } from "@/lib/format";
import type { Room } from "@/types/domain";
const schema = z
  .object({
    roomId: z.string().min(1),
    rentalType: z.enum(["hourly", "daily", "monthly", "yearly"]),
    startAt: z.string().min(1),
    endAt: z.string().min(1),
  })
  .refine((v) => new Date(v.endAt) > new Date(v.startAt), {
    message: "Waktu selesai harus setelah waktu mulai.",
    path: ["endAt"],
  });
type Values = z.infer<typeof schema>;
export function BookingWizard({
  rooms,
  initialRoom,
}: {
  rooms: Room[];
  initialRoom?: string;
}) {
  const router = useRouter(),
    [preview, setPreview] = useState<Record<string, unknown> | null>(null),
    [message, setMessage] = useState(""),
    [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      roomId: initialRoom || rooms[0]?.id || "",
      rentalType: "monthly",
    },
  });
  async function call(final: boolean) {
    setMessage("");
    setPreview(null);
    const v = getValues(),
      body = {
        ...v,
        startAt: new Date(v.startAt).toISOString(),
        endAt: new Date(v.endAt).toISOString(),
      },
      res = await fetch(final ? "/api/bookings" : "/api/bookings/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
      data = await res.json();
    if (!res.ok) {
      setMessage(data.message || data.error || "Booking tidak dapat diproses.");
      return;
    }
    if (final) {
      router.push(`/tenant/booking/${data.data?.bookingId || data.bookingId}`);
      router.refresh();
    } else setPreview(data.data);
  }
  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await call(true);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form className="card form" onSubmit={handleSubmit(() => submit())}>
      <h2>Ajukan booking</h2>
      <div className="grid three">
        <div className="field">
          <label>Kamar</label>
          <select className="input" {...register("roomId")}>
            {rooms.map((r) => (
              <option value={r.id} key={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Tipe sewa</label>
          <select className="input" {...register("rentalType")}>
            <option value="hourly">Per jam</option>
            <option value="daily">Per 24 jam</option>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
        </div>
        <div />
        <div className="field">
          <label>Mulai</label>
          <input
            className="input"
            type="datetime-local"
            {...register("startAt")}
          />
        </div>
        <div className="field">
          <label>Selesai</label>
          <input
            className="input"
            type="datetime-local"
            {...register("endAt")}
          />
          {errors.endAt && (
            <span className="field-error">{errors.endAt.message}</span>
          )}
        </div>
      </div>
      {message && (
        <div className="alert" role="alert">
          {message}
        </div>
      )}
      {preview && (
        <div className="card">
          <h3>Ringkasan harga</h3>
          <p>
            Subtotal:{" "}
            {rupiah(
              Number((preview.price as Record<string, unknown>).subtotal),
            )}
          </p>
          <p>
            Deposit:{" "}
            {rupiah(Number((preview.price as Record<string, unknown>).deposit))}
          </p>
          <p>
            <strong>
              Total:{" "}
              {rupiah(Number((preview.price as Record<string, unknown>).total))}
            </strong>
          </p>
        </div>
      )}
      <div className="actions">
        <button
          type="button"
          className="button outline"
          disabled={isSubmitting}
          onClick={() => void handleSubmit(() => call(false))()}
        >
          Periksa harga & ketersediaan
        </button>
        <button className="button dark" disabled={submitting || !preview}>
          {submitting ? "Mengirim…" : "Kirim booking"}
        </button>
      </div>
    </form>
  );
}
