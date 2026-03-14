"use client";

import { useState } from "react";
import { createBooking } from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

type BookingFormProps = {
  roomId: number;
  pricePerNight: number;
  lang: Language;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuestsCount?: number;
};

export function BookingForm({
  roomId,
  pricePerNight,
  lang,
  defaultCheckIn = "",
  defaultCheckOut = "",
  defaultGuestsCount = 2
}: BookingFormProps) {
  const copy = t(lang).booking;
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guestsCount, setGuestsCount] = useState(defaultGuestsCount);
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
    <form onSubmit={handleSubmit} className="card p-8 md:p-10">
      <div className="section-label">{copy.reserve}</div>
      <h3 className="mt-4 font-display text-4xl text-ink">{copy.title}</h3>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-ink/70">
          <span>{copy.checkIn}</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border-b border-[#d8cfc2] bg-transparent px-0 py-3 text-ink outline-none"
            required
          />
        </label>
        <label className="space-y-2 text-sm text-ink/70">
          <span>{copy.checkOut}</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border-b border-[#d8cfc2] bg-transparent px-0 py-3 text-ink outline-none"
            required
          />
        </label>
      </div>

      <label className="mt-5 block space-y-2 text-sm text-ink/70">
        <span>{copy.guests}</span>
        <input
          type="number"
          min={1}
          max={8}
          value={guestsCount}
          onChange={(e) => setGuestsCount(Number(e.target.value))}
          className="w-full border-b border-[#d8cfc2] bg-transparent px-0 py-3 text-ink outline-none"
        />
      </label>

      <label className="mt-5 block space-y-2 text-sm text-ink/70">
        <span>{copy.specialRequest}</span>
        <textarea
          value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)}
          className="min-h-28 w-full border-b border-[#d8cfc2] bg-transparent px-0 py-3 text-ink outline-none"
          placeholder={copy.requestPlaceholder}
        />
      </label>

      <div className="mt-8 border-t border-[#d8cfc2] pt-6">
        <div className="section-label">{copy.estimate}</div>
        <div className="mt-3 font-display text-5xl text-ink">{estimate.toLocaleString("en-US")} UZS</div>
      </div>

      <button
        disabled={pending}
        className="mt-8 w-full border border-ink bg-ink px-6 py-4 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721] disabled:opacity-60"
      >
        {pending ? copy.confirming : copy.confirm}
      </button>
      {message ? <p className="mt-4 text-sm text-ink/70">{message}</p> : null}
    </form>
  );
}
