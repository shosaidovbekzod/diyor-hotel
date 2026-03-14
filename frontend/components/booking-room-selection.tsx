"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  PhoneCall,
  ShieldCheck,
  Tv,
  Users,
  UtensilsCrossed,
  Wifi,
  XCircle
} from "lucide-react";
import type { Room } from "@/lib/api";
import type { Language } from "@/lib/i18n";

type BookingRoomSelectionProps = {
  lang: Language;
  ui: {
    eyebrow: string;
    panelTitle: string;
    resultSummary: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
    adultsHint: string;
    childrenHint: string;
    search: string;
    invalidDates: string;
    options: string;
    roomCta: string;
    details: string;
    perNight: string;
    guests: string;
    noResultsTitle: string;
    noResultsBody: string;
    soldOut: string;
    soldOutHint: string;
    bestRate: string;
    directOffer: string;
    directOfferHint: string;
    directBookingTitle: string;
    directBookingItems: readonly string[];
    showDates: string;
    expand: string;
    collapse: string;
  };
  rooms: Room[];
  defaultCheckIn: string;
  defaultCheckOut: string;
  adults: number;
  children: number;
  guests: number;
  validDates: boolean;
  resultHrefSuffix: string;
};

const ROOM_CARD_ICONS = [
  { match: ["wifi"], icon: Wifi },
  { match: ["breakfast", "nonushta", "завтрак"], icon: UtensilsCrossed },
  { match: ["smart tv", "tv"], icon: Tv },
  { match: ["bathroom", "hammom", "ванная"], icon: Bath },
  { match: ["kitchen", "oshxona", "кухня"], icon: BedDouble },
  { match: ["gym", "зал", "sport"], icon: Dumbbell }
] as const;

export function BookingRoomSelection({
  lang,
  ui,
  rooms,
  defaultCheckIn,
  defaultCheckOut,
  adults,
  children,
  guests,
  validDates,
  resultHrefSuffix
}: BookingRoomSelectionProps) {
  return (
    <>
      <section className="shell mt-12">
        <form id="booking-search" action="/booking" className="editorial-panel p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#d8cfc2] pb-5">
            <div>
              <div className="section-label">{ui.eyebrow}</div>
              <h2 className="mt-4 font-display text-4xl text-ink">{ui.panelTitle}</h2>
            </div>
            <div className="max-w-sm text-sm leading-7 text-ink/68">{ui.resultSummary}</div>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr_0.9fr_auto]">
            <label className="space-y-2 text-sm text-ink/70">
              <span>{ui.checkIn}</span>
              <input type="date" name="checkIn" defaultValue={defaultCheckIn} className="editorial-input" required />
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{ui.checkOut}</span>
              <input type="date" name="checkOut" defaultValue={defaultCheckOut} className="editorial-input" required />
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{ui.adults}</span>
              <select name="adults" defaultValue={String(adults)} className="editorial-input">
                {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>
                    {getAdultLabel(lang, count)}
                  </option>
                ))}
              </select>
              <div className="text-xs uppercase tracking-[0.2em] text-stone">{ui.adultsHint}</div>
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{ui.children}</span>
              <select name="children" defaultValue={String(children)} className="editorial-input">
                {Array.from({ length: 7 }, (_, index) => index).map((count) => (
                  <option key={count} value={count}>
                    {getChildrenLabel(lang, count)}
                  </option>
                ))}
              </select>
              <div className="text-xs uppercase tracking-[0.2em] text-stone">{ui.childrenHint}</div>
            </label>
            <button className="editorial-button h-[52px] self-start px-8 mt-7 xl:mt-0">{ui.search}</button>
          </div>

          {!validDates ? (
            <div className="mt-6 border border-[#e3c9c2] bg-[#f7eae6] px-5 py-4 text-sm text-[#8b4338]">
              {ui.invalidDates}
            </div>
          ) : null}
        </form>
      </section>

      <section className="shell mt-10">
        <div className="booking-benefits-panel">
          <div>
            <div className="section-label text-[#9b6a1f]">{ui.directOffer}</div>
            <h3 className="mt-4 font-display text-4xl leading-none text-[#7f4d16]">{ui.directBookingTitle}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {ui.directBookingItems.map((item) => (
              <div key={item} className="flex items-start gap-3 text-[#865319]">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
                <span className="text-sm leading-7">{item}</span>
              </div>
            ))}
          </div>
          <div className="booking-benefits-chip">
            <ShieldCheck className="h-4 w-4" />
            <span>{ui.bestRate}</span>
          </div>
        </div>
      </section>

      <section className="shell mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8cfc2] pb-5">
          <div>
            <div className="section-label">{ui.eyebrow}</div>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink">{ui.panelTitle}</h2>
          </div>
          <div className="inline-flex items-center gap-2 border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-stone">
            <CalendarDays className="h-4 w-4" />
            {rooms.length} {ui.options}
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="editorial-panel mt-8 p-8 md:p-10">
            <h3 className="font-display text-4xl text-ink">{ui.noResultsTitle}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">{ui.noResultsBody}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {rooms.map((room) => (
              <RoomBookingCard
                key={room.id}
                room={room}
                ui={ui}
                lang={lang}
                resultHrefSuffix={resultHrefSuffix}
                guests={guests}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function RoomBookingCard({
  room,
  ui,
  lang,
  resultHrefSuffix,
  guests
}: {
  room: Room;
  ui: BookingRoomSelectionProps["ui"];
  lang: Language;
  resultHrefSuffix: string;
  guests: number;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const images = useMemo(() => (room.gallery.length ? room.gallery : [room.image_url]), [room.gallery, room.image_url]);
  const amenityIcons = useMemo(() => getAmenityIcons(room.amenities), [room.amenities]);
  const perNightPrice = Number(room.display_price);
  const originalPrice = Number(room.price_per_night);
  const hasDiscount = room.promo_price !== null && room.promo_price !== undefined && Number(room.promo_price) < originalPrice;
  const discountPercent = hasDiscount ? Math.max(1, Math.round(((originalPrice - perNightPrice) / originalPrice) * 100)) : 0;

  return (
    <article className="booking-room-card">
      <div className="booking-room-gallery">
        <div className="booking-room-icon-strip">
          {amenityIcons.map((Icon, index) => (
            <Icon key={`${room.id}-${index}`} className="h-5 w-5" />
          ))}
        </div>

        <div className="relative h-[280px] overflow-hidden md:h-[360px]">
          <Image src={images[imageIndex]} alt={room.title} fill className="object-cover" />
        </div>

        <div className="booking-room-dots">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setImageIndex(index)}
              className={`booking-room-dot ${index === imageIndex ? "booking-room-dot-active" : ""}`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="booking-room-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="booking-room-title">{room.title}</h3>
            <div className="mt-5 flex flex-wrap gap-5 text-[#767676]">
              <RoomMeta icon={Users} label={`${room.capacity} ${ui.guests}`} />
              <RoomMeta icon={CalendarDays} label={`${room.size_sqm} m2`} />
              <RoomMeta icon={BedDouble} label={room.view_label || room.bed_type} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="booking-room-expand"
            aria-label={expanded ? ui.collapse : ui.expand}
          >
            {expanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </button>
        </div>

        {expanded ? (
          <div className="mt-5 border-t border-[#ebe2d8] pt-5 text-sm leading-7 text-ink/72">
            <p>{room.subtitle}</p>
            <p className="mt-4">{room.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <span key={amenity} className="rounded-full border border-[#ddd1c0] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-stone">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-[#9b6a1f]">
            <PhoneCall className="h-4 w-4" />
            <span>{ui.directOfferHint}</span>
          </div>

          {hasDiscount ? (
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3 text-[#9b6a1f]">
                <span className="rounded bg-[#af7420] px-3 py-1 text-sm font-semibold text-white">-{discountPercent}%</span>
                <span className="text-lg line-through opacity-65">
                  {originalPrice.toLocaleString("en-US")} UZS
                </span>
              </div>
              <div className="font-display text-[2.7rem] leading-none text-[#a86916]">
                {perNightPrice.toLocaleString("en-US")} UZS
              </div>
            </div>
          ) : (
            <div className="font-display text-[2.7rem] leading-none text-[#a86916]">
              {perNightPrice.toLocaleString("en-US")} UZS
            </div>
          )}

          <div className="mt-2 text-sm tracking-[0.04em] text-stone">
            1 {lang === "uz" ? "kecha" : lang === "ru" ? "ночь" : "night"} / {guests} {ui.guests.toLowerCase()}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {room.is_available ? (
            <Link href={`/rooms/${room.slug}${resultHrefSuffix}`} className="booking-room-primary">
              {ui.roomCta}
            </Link>
          ) : (
            <>
              <div className="booking-room-soldout">
                <XCircle className="h-5 w-5" />
                <span>{ui.soldOut}</span>
              </div>
              <a href="#booking-search" className="booking-room-secondary">
                {ui.showDates}
              </a>
            </>
          )}

          <Link href={`/rooms/${room.slug}${resultHrefSuffix}`} className="booking-room-secondary">
            {ui.details}
          </Link>
        </div>

        {!room.is_available ? (
          <div className="mt-4 text-sm leading-7 text-[#8b4338]">{ui.soldOutHint}</div>
        ) : null}
      </div>
    </article>
  );
}

function RoomMeta({
  icon: Icon,
  label
}: {
  icon: typeof Users;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}

function getAmenityIcons(amenities: string[]) {
  const result: Array<typeof Wifi> = [];

  for (const amenity of amenities) {
    const lower = amenity.toLowerCase();
    const match = ROOM_CARD_ICONS.find((item) => item.match.some((pattern) => lower.includes(pattern)));
    if (match && !result.includes(match.icon)) {
      result.push(match.icon);
    }
    if (result.length === 5) {
      break;
    }
  }

  if (result.length === 0) {
    return [Wifi, BedDouble, Bath, Tv];
  }

  return result;
}

function getAdultLabel(lang: Language, count: number) {
  if (lang === "uz") {
    return `${count} kattalar`;
  }
  if (lang === "ru") {
    return `${count} взрослых`;
  }
  return `${count} adults`;
}

function getChildrenLabel(lang: Language, count: number) {
  if (lang === "uz") {
    return count === 0 ? "Bolalarsiz" : `${count} bolalar`;
  }
  if (lang === "ru") {
    return count === 0 ? "Без детей" : `${count} детей`;
  }
  return count === 0 ? "No children" : `${count} children`;
}
