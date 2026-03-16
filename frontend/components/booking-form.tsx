"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking, quoteBooking, type BookingQuote } from "@/lib/api";
import { t, type Language } from "@/lib/i18n";

type BookingFormProps = {
  roomId: number;
  lang: Language;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuestsCount?: number;
};

export function BookingForm({
  roomId,
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
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [quotePending, setQuotePending] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState<string>(copy.selectDatesHint);
  const router = useRouter();

  const today = new Date().toISOString().slice(0, 10);
  const dateRangeReady = Boolean(checkIn && checkOut);
  const dateRangeValid = useMemo(() => {
    if (!dateRangeReady) {
      return false;
    }
    return new Date(checkOut).getTime() > new Date(checkIn).getTime();
  }, [checkIn, checkOut, dateRangeReady]);

  useEffect(() => {
    if (!dateRangeReady) {
      setQuote(null);
      setQuotePending(false);
      setQuoteMessage(copy.selectDatesHint);
      return;
    }

    if (!dateRangeValid) {
      setQuote(null);
      setQuotePending(false);
      setQuoteMessage(copy.invalidDates);
      return;
    }

    let cancelled = false;

    async function loadQuote() {
      setQuotePending(true);
      setQuoteMessage(copy.checking);
      try {
        const nextQuote = await quoteBooking({
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          guests_count: guestsCount
        });
        if (cancelled) {
          return;
        }
        setQuote(nextQuote);
        setQuoteMessage(copy.availableForDates);
      } catch (error) {
        if (cancelled) {
          return;
        }
        setQuote(null);
        setQuoteMessage(error instanceof Error ? error.message : copy.unavailableForDates);
      } finally {
        if (!cancelled) {
          setQuotePending(false);
        }
      }
    }

    void loadQuote();

    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, copy.availableForDates, copy.checking, copy.invalidDates, copy.selectDatesHint, copy.unavailableForDates, dateRangeReady, dateRangeValid, guestsCount, roomId]);

  const estimate = quote ? Number(quote.total_price) : 0;
  const canSubmit = dateRangeValid && Boolean(quote) && !quotePending && !pending;

  function money(value?: number | string | null) {
    return Number(value ?? 0).toLocaleString("en-US");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = window.localStorage.getItem("diyor_token");
    if (!token) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      router.push(`/account?returnTo=${encodeURIComponent(returnTo)}`);
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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.error);
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
            min={today}
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
            min={checkIn || today}
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuoteMetric label={copy.nights} value={quote ? quote.nights : 0} />
          <QuoteMetric label={copy.subtotal} value={`${money(quote?.subtotal)} UZS`} />
          <QuoteMetric label={copy.total} value={`${estimate.toLocaleString("en-US")} UZS`} />
        </div>
        <div className={`mt-5 border px-5 py-4 text-sm ${
          quote
            ? "border-[#c9dac5] bg-[#eef5eb] text-[#284527]"
            : quotePending
              ? "border-[#ddd1c0] bg-[#f4ede4] text-ink/72"
              : "border-[#ead7d3] bg-[#f7eae6] text-[#8b4338]"
        }`}>
          <div className="section-label mb-2">{copy.liveAvailability}</div>
          {quoteMessage}
        </div>
      </div>

      <button
        disabled={!canSubmit}
        className="mt-8 w-full border border-ink bg-ink px-6 py-4 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721] disabled:opacity-60"
      >
        {pending ? copy.confirming : copy.confirm}
      </button>
      {message ? <p className="mt-4 text-sm text-ink/70">{message}</p> : null}
    </form>
  );
}

function QuoteMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[#ddd1c0] bg-white/70 p-4">
      <div className="section-label">{label}</div>
      <div className="mt-3 text-base font-medium text-ink">{value}</div>
    </div>
  );
}
