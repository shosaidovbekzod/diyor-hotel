"use client";

import { useState } from "react";
import { createBooking } from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

type BookingFormProps = {
  roomId: number;
  pricePerNight: number;
  lang: Language;
};

export function BookingForm({ roomId, pricePerNight, lang }: BookingFormProps) {
  const copy = t(lang).booking;
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequest, setSpecialRequest] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const estimate = (() => {
    if (!checkIn || !checkOut) {
      return 0;
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    return nights * pricePerNight;
  })();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem("diyor_token");
    if (!token) {
      setMessage(copy.loginRequired);
      return;
    }

    setPending(true);
    setMessage("");
    try {
      const booking = await createBooking(token, {
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guestsCount,
        special_request: specialRequest
      });
      setMessage(`${copy.success} ${booking.booking_reference}`);
    } catch {
      setMessage(copy.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card gold-ring space-y-4 p-6">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-ink/50">{copy.reserve}</div>
        <h3 className="mt-2 font-display text-2xl">{copy.title}</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>{copy.checkIn}</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>{copy.checkOut}</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" required />
        </label>
      </div>
      <label className="space-y-2 text-sm">
        <span>{copy.guests}</span>
        <input type="number" min={1} max={8} value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" />
      </label>
      <label className="space-y-2 text-sm">
        <span>{copy.specialRequest}</span>
        <textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} className="min-h-28 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none" placeholder={copy.requestPlaceholder} />
      </label>
      <div className="rounded-2xl bg-ink px-4 py-4 text-white">
        <div className="text-sm text-white/60">{copy.estimate}</div>
        <div className="mt-1 font-display text-3xl">{estimate.toLocaleString("en-US")} UZS</div>
      </div>
      <button disabled={pending} className="w-full rounded-full bg-champagne px-5 py-3 font-medium text-ink transition hover:opacity-90 disabled:opacity-60">
        {pending ? copy.confirming : copy.confirm}
      </button>
      {message ? <p className="text-sm text-ink/70">{message}</p> : null}
    </form>
  );
}
