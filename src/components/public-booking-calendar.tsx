"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, ShieldCheck } from "lucide-react";
import { rupiah } from "@/lib/format";
import type { Room, RentalType } from "@/types/domain";

type Period = { rentalType: RentalType; startAt: string; endAt: string };
const hours = Array.from({ length: 14 }, (_, index) => index + 8);
const isoDay = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function PublicBookingCalendar({ room }: { room: Room }) {
  const router = useRouter(),
    [type, setType] = useState<RentalType>(room.rentalTypes[0]),
    [month, setMonth] = useState(
      () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    ),
    [periods, setPeriods] = useState<Period[]>([]),
    [selected, setSelected] = useState(""),
    [hour, setHour] = useState<number | null>(null),
    [duration, setDuration] = useState(1),
    [preview, setPreview] = useState<Record<string, unknown> | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    void fetch(`/api/rooms/availability?roomId=${encodeURIComponent(room.id)}`)
      .then((response) => response.json())
      .then((body) => setPeriods(body.data?.periods || []))
      .catch(() => setMessage("Ketersediaan belum dapat dimuat. Coba lagi."));
  }, [room.id]);
  const days = useMemo(() => {
    const first = new Date(month),
      start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [month]);
  const overlaps = (start: Date, end: Date) =>
    periods.some(
      (period) =>
        new Date(period.startAt) < end && new Date(period.endAt) > start,
    );
  const blockedDay = (date: Date) => {
    const start = new Date(`${isoDay(date)}T00:00:00`),
      end = new Date(start);
    end.setDate(end.getDate() + 1);
    return periods.some(
      (period) =>
        period.rentalType !== "hourly" &&
        new Date(period.startAt) < end &&
        new Date(period.endAt) > start,
    );
  };
  const payload = () => {
    if (!selected) return null;
    const start = new Date(
        `${selected}T${type === "hourly" ? `${String(hour ?? 8).padStart(2, "0")}:00` : "00:00"}:00`,
      ),
      end = new Date(start);
    if (type === "hourly") end.setHours(end.getHours() + duration);
    else if (type === "daily") end.setDate(end.getDate() + duration);
    else if (type === "monthly") end.setMonth(end.getMonth() + duration);
    else end.setFullYear(end.getFullYear() + duration);
    return {
      roomId: room.id,
      rentalType: type,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
    };
  };
  async function request(final: boolean) {
    const body = payload();
    if (!body || (type === "hourly" && hour === null)) {
      setMessage("Pilih tanggal dan jam yang tersedia.");
      return;
    }
    setBusy(true);
    setMessage("");
    const response = await fetch(
        final ? "/api/bookings" : "/api/bookings/preview",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
      ),
      data = await response.json();
    setBusy(false);
    if (response.status === 401) {
      router.push(`/login?next=${encodeURIComponent(`/kamar/${room.slug}`)}`);
      return;
    }
    if (!response.ok) {
      setMessage(data.message || "Jadwal tidak tersedia.");
      setPreview(null);
      return;
    }
    if (final) {
      router.push(`/tenant/tagihan/${data.data.invoiceId}`);
      router.refresh();
    } else setPreview(data.data);
  }
  return (
    <section className="booking-calendar" id="booking">
      <div className="booking-instructions">
        <p className="eyebrow">Cara booking</p>
        <h2>Pilih jadwal kamar</h2>
        <ol>
          <li>
            <span>1</span>
            <div>
              <strong>Pilih tipe sewa</strong>
              <p>Per jam, harian, atau bulanan sesuai opsi kamar.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Pilih tanggal dan jam</strong>
              <p>Tanggal abu-abu atau jam terkunci sudah dipesan.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Periksa total</strong>
              <p>Harga dan deposit dihitung ulang oleh server.</p>
            </div>
          </li>
          <li>
            <span>4</span>
            <div>
              <strong>Login dan bayar</strong>
              <p>
                Booking dikunci setelah dikirim, lalu tagihan muncul di
                dashboard.
              </p>
            </div>
          </li>
        </ol>
        <p className="booking-safe">
          <ShieldCheck size={18} /> Jadwal diverifikasi ulang saat booking
          dikirim.
        </p>
      </div>
      <div className="calendar-card">
        <div className="rental-tabs">
          {room.rentalTypes.map((item) => (
            <button
              type="button"
              className={type === item ? "active" : ""}
              key={item}
              onClick={() => {
                setType(item);
                setSelected("");
                setHour(null);
                if (item === "yearly") setDuration(1);
                setPreview(null);
              }}
            >
              {item === "hourly" ? "Per jam" : item === "daily" ? "Per 24 jam" : item === "monthly" ? "Bulanan" : "Tahunan"}
            </button>
          ))}
        </div>
        <div className="calendar-head">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            <ChevronLeft />
          </button>
          <strong>
            {month.toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </strong>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            <ChevronRight />
          </button>
        </div>
        <div className="calendar-week">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((date) => {
            const key = isoDay(date),
              past = date < new Date(new Date().setHours(0, 0, 0, 0)),
              blocked = past || blockedDay(date),
              outside = date.getMonth() !== month.getMonth();
            return (
              <button
                type="button"
                key={key}
                className={`${selected === key ? "selected" : ""} ${outside ? "outside" : ""} ${blocked ? "booked" : ""}`}
                disabled={blocked}
                onClick={() => {
                  setSelected(key);
                  setHour(null);
                  setPreview(null);
                }}
              >
                <span>{date.getDate()}</span>
                {blocked && !past && <small>Penuh</small>}
              </button>
            );
          })}
        </div>
        {selected && type === "hourly" && (
          <div className="time-slots">
            <h3>
              <Clock size={17} /> Jam tersedia
            </h3>
            <div>
              {hours.map((item) => {
                const start = new Date(
                    `${selected}T${String(item).padStart(2, "0")}:00:00`,
                  ),
                  end = new Date(start);
                end.setHours(end.getHours() + 1);
                const booked = overlaps(start, end);
                return (
                  <button
                    type="button"
                    disabled={booked}
                    className={hour === item ? "selected" : ""}
                    onClick={() => {
                      setHour(item);
                      setPreview(null);
                    }}
                    key={item}
                  >
                    {String(item).padStart(2, "0")}.00–{String(item + 1).padStart(2, "0")}.00
                    {booked ? " · Terisi" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="booking-duration">
          <label>
            Durasi{" "}
            {type === "hourly" ? "(jam)" : type === "daily" ? "(24 jam)" : type === "monthly" ? "(bulan)" : "(tahun)"}
          </label>
          <input
            className="input"
            type="number"
            min={1}
            max={type === "hourly" ? 24 : type === "daily" ? 30 : type === "monthly" ? 12 : 1}
            disabled={type === "yearly"}
            value={duration}
            onChange={(event) => {
              setDuration(Math.max(1, Number(event.target.value)));
              setPreview(null);
            }}
          />
        </div>
        {message && <div className="alert">{message}</div>}
        {preview && (
          <div className="booking-summary">
            <span>
              Subtotal{" "}
              {rupiah(
                Number((preview.price as Record<string, unknown>).subtotal),
              )}
            </span>
            <span>
              Deposit{" "}
              {rupiah(
                Number((preview.price as Record<string, unknown>).deposit),
              )}
            </span>
            <strong>
              Total{" "}
              {rupiah(Number((preview.price as Record<string, unknown>).total))}
            </strong>
          </div>
        )}
        <div className="booking-actions">
          <button
            className="button outline"
            disabled={busy || !selected}
            onClick={() => void request(false)}
          >
            Periksa harga
          </button>
          <button
            className="button dark"
            disabled={busy || !preview}
            onClick={() => void request(true)}
          >
            {busy ? "Memproses…" : "Booking Sekarang"}
          </button>
        </div>
      </div>
    </section>
  );
}
