"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Circle,
  Tv,
  Users,
  UtensilsCrossed,
  Wifi,
  XCircle
} from "lucide-react";
import type { Room } from "@/lib/api";
import { getLocale, type Language } from "@/lib/i18n";

type RoomSort = "recommended" | "price-asc" | "price-desc" | "space-desc";

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
    staySummary: string;
    sortLabel: string;
    recommended: string;
    priceLowHigh: string;
    priceHighLow: string;
    largestSpace: string;
    availableOnly: string;
    availableSummary: string;
    soldOutSummary: string;
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

type SelectionCopy = {
  compactTitle: string;
  compactBody: string;
  swipeHint: string;
  showRates: string;
  hideRates: string;
  directRate: string;
  directRateBody: string;
  totalStay: string;
  quantity: string;
  quantityZero: string;
  quantityOne: string;
  continueBooking: string;
  openDetails: string;
  included: string;
  bestChoice: string;
  staySummary: string;
  guestsLine: string;
  datesLine: string;
  roomType: string;
  availableOffers: string;
  tripAdvisor: string;
  fromLabel: string;
};

const selectionUi: Record<Language, SelectionCopy> = {
  en: {
    compactTitle: "Select room category",
    compactBody: "Compare categories quickly and swipe across room cards before opening the full details.",
    swipeHint: "Swipe horizontally to compare rooms",
    showRates: "Show prices",
    hideRates: "Hide prices",
    directRate: "Direct flexible rate",
    directRateBody: "The direct hotel website rate for your selected stay.",
    totalStay: "Total stay",
    quantity: "Rooms",
    quantityZero: "0 rooms",
    quantityOne: "1 room",
    continueBooking: "Book now",
    openDetails: "Details",
    included: "Included",
    bestChoice: "Direct rate available",
    staySummary: "Stay summary",
    guestsLine: "Guests",
    datesLine: "Dates",
    roomType: "Room type",
    availableOffers: "offers available",
    tripAdvisor: "TripAdvisor",
    fromLabel: "from"
  },
  uz: {
    compactTitle: "Xona toifasini tanlang",
    compactBody: "Xona kartalarini tez solishtiring va to‘liq ma’lumotni ochishdan oldin yonma-yon ko‘rib chiqing.",
    swipeHint: "Xonalarni ko‘rish uchun yon tomonga suring",
    showRates: "Narxlarni ko‘rsatish",
    hideRates: "Narxlarni yopish",
    directRate: "To‘g‘ridan-to‘g‘ri moslashuvchan tarif",
    directRateBody: "Tanlangan muddat uchun mehmonxona saytining to‘g‘ridan-to‘g‘ri narxi.",
    totalStay: "Umumiy turar narxi",
    quantity: "Xonalar",
    quantityZero: "0 ta xona",
    quantityOne: "1 ta xona",
    continueBooking: "Bron qilish",
    openDetails: "Batafsil",
    included: "Ichiga kiradi",
    bestChoice: "To‘g‘ridan-to‘g‘ri tarif mavjud",
    staySummary: "Safar xulosasi",
    guestsLine: "Mehmonlar",
    datesLine: "Sanalar",
    roomType: "Xona turi",
    availableOffers: "ta taklif mavjud",
    tripAdvisor: "TripAdvisor",
    fromLabel: "narxi"
  },
  ru: {
    compactTitle: "Выберите категорию номера",
    compactBody: "Быстро сравнивайте категории и листайте карточки по горизонтали перед открытием полной информации.",
    swipeHint: "Листайте по горизонтали, чтобы выбрать номер",
    showRates: "Показать цены",
    hideRates: "Скрыть цены",
    directRate: "Гибкий прямой тариф",
    directRateBody: "Прямой тариф сайта отеля на выбранный период проживания.",
    totalStay: "Стоимость проживания",
    quantity: "Номера",
    quantityZero: "0 номеров",
    quantityOne: "1 номер",
    continueBooking: "Забронировать",
    openDetails: "Подробнее",
    included: "Включено",
    bestChoice: "Прямой тариф доступен",
    staySummary: "Сводка по проживанию",
    guestsLine: "Гости",
    datesLine: "Даты",
    roomType: "Тип номера",
    availableOffers: "доступно предложений",
    tripAdvisor: "TripAdvisor",
    fromLabel: "от"
  }
};

const ROOM_CARD_ICONS = [
  { match: ["wifi"], icon: Wifi },
  { match: ["breakfast", "nonushta", "завтрак"], icon: UtensilsCrossed },
  { match: ["smart tv", "tv"], icon: Tv },
  { match: ["bathroom", "hammom", "ванная"], icon: Bath },
  { match: ["bed", "karavot", "кровать"], icon: BedDouble }
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
  const locale = getLocale(lang);
  const copy = selectionUi[lang];
  const [sortBy, setSortBy] = useState<RoomSort>("recommended");
  const [availableOnly, setAvailableOnly] = useState(false);

  const nights = useMemo(
    () => Math.max(getNightsBetween(defaultCheckIn, defaultCheckOut), 1),
    [defaultCheckIn, defaultCheckOut]
  );

  const roomStats = useMemo(() => {
    const available = rooms.filter((room) => room.is_available).length;
    return {
      available,
      soldOut: Math.max(rooms.length - available, 0)
    };
  }, [rooms]);

  const visibleRooms = useMemo(() => {
    const filtered = availableOnly ? rooms.filter((room) => room.is_available) : [...rooms];
    const sorted = [...filtered];

    if (sortBy === "price-asc") {
      sorted.sort((left, right) => Number(left.display_price) - Number(right.display_price));
      return sorted;
    }
    if (sortBy === "price-desc") {
      sorted.sort((left, right) => Number(right.display_price) - Number(left.display_price));
      return sorted;
    }
    if (sortBy === "space-desc") {
      sorted.sort((left, right) => right.size_sqm - left.size_sqm);
      return sorted;
    }

    sorted.sort((left, right) => {
      if (left.is_available !== right.is_available) {
        return left.is_available ? -1 : 1;
      }
      if (left.is_featured !== right.is_featured) {
        return left.is_featured ? -1 : 1;
      }
      return Number(left.display_price) - Number(right.display_price);
    });

    return sorted;
  }, [availableOnly, rooms, sortBy]);

  return (
    <>
      <section className="shell mt-8 sm:mt-10">
        <form
          id="booking-search"
          action="/booking"
          className="editorial-panel overflow-hidden rounded-[26px] border border-[#ded2c3] bg-white/92"
        >
          <div className="border-b border-[#e6dccf] px-5 py-5 sm:px-7 sm:py-6 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="section-label">{ui.eyebrow}</div>
                <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">{ui.panelTitle}</h2>
              </div>
              <div className="max-w-xl text-sm leading-7 text-ink/68">{ui.resultSummary}</div>
            </div>
          </div>

          <div className="grid gap-4 px-5 py-5 sm:px-7 sm:py-6 md:px-8 xl:grid-cols-[1fr_1fr_0.9fr_0.9fr_auto] xl:items-end">
            <label className="space-y-2 text-sm text-ink/72">
              <span>{ui.checkIn}</span>
              <input type="date" name="checkIn" defaultValue={defaultCheckIn} className="editorial-input" required />
            </label>
            <label className="space-y-2 text-sm text-ink/72">
              <span>{ui.checkOut}</span>
              <input type="date" name="checkOut" defaultValue={defaultCheckOut} className="editorial-input" required />
            </label>
            <label className="space-y-2 text-sm text-ink/72">
              <span>{ui.adults}</span>
              <select name="adults" defaultValue={String(adults)} className="editorial-input">
                {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>
                    {getAdultLabel(lang, count)}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-ink/72">
              <span>{ui.children}</span>
              <select name="children" defaultValue={String(children)} className="editorial-input">
                {Array.from({ length: 7 }, (_, index) => index).map((count) => (
                  <option key={count} value={count}>
                    {getChildrenLabel(lang, count)}
                  </option>
                ))}
              </select>
            </label>
            <button className="editorial-button h-[50px] w-full xl:w-auto xl:px-8">{ui.search}</button>
          </div>

          {!validDates ? (
            <div className="border-t border-[#e6dccf] bg-[#f8ebe7] px-5 py-4 text-sm text-[#8b4338] sm:px-7 md:px-8">
              {ui.invalidDates}
            </div>
          ) : null}
        </form>
      </section>

      <section className="shell mt-8 sm:mt-10">
        <div className="overflow-hidden rounded-[26px] border border-[#ded2c3] bg-white shadow-[0_20px_50px_rgba(35,31,25,0.05)]">
          <div className="grid gap-5 border-b border-[#e6dccf] px-5 py-5 sm:px-7 sm:py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_220px_220px] lg:items-end">
            <div>
              <div className="section-label">{copy.staySummary}</div>
              <h3 className="mt-4 font-display text-3xl text-ink sm:text-4xl">{copy.compactTitle}</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/68">{copy.compactBody}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.22em] text-stone sm:text-[11px]">
                <span className="border border-[#ddd2c3] px-3 py-2">{formatDateLabel(defaultCheckIn, locale)}</span>
                <span className="border border-[#ddd2c3] px-3 py-2">{formatDateLabel(defaultCheckOut, locale)}</span>
                <span className="border border-[#ddd2c3] px-3 py-2">
                  {adults} / {children} / {guests}
                </span>
              </div>
            </div>

            <label className="space-y-2 text-sm text-ink/72">
              <span>{ui.sortLabel}</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as RoomSort)}
                className="editorial-input"
              >
                <option value="recommended">{ui.recommended}</option>
                <option value="price-asc">{ui.priceLowHigh}</option>
                <option value="price-desc">{ui.priceHighLow}</option>
                <option value="space-desc">{ui.largestSpace}</option>
              </select>
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-3 border-b border-[#ddd2c3] pb-4 text-sm text-ink/72">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(event) => setAvailableOnly(event.target.checked)}
                  className="h-4 w-4"
                />
                <span>{ui.availableOnly}</span>
              </label>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.22em] text-stone">
                <span className="border border-[#ddd2c3] px-3 py-2">{visibleRooms.length} {ui.options}</span>
                <span className="border border-[#ddd2c3] px-3 py-2">{roomStats.available} {ui.availableSummary}</span>
                <span className="border border-[#ddd2c3] px-3 py-2">{roomStats.soldOut} {ui.soldOutSummary}</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-stone sm:px-7 md:px-8">
            {copy.swipeHint}
          </div>

          {visibleRooms.length === 0 ? (
            <div className="px-5 pb-8 sm:px-7 md:px-8 md:pb-10">
              <div className="rounded-[22px] border border-[#ddd2c3] bg-[#fbf7f1] p-6">
                <h4 className="font-display text-3xl text-ink">{ui.noResultsTitle}</h4>
                <p className="mt-4 text-sm leading-7 text-ink/68">{ui.noResultsBody}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto px-5 pb-6 sm:px-7 md:px-8 md:pb-8">
              <div className="grid auto-cols-[minmax(300px,340px)] grid-flow-col gap-5 pb-2 sm:auto-cols-[minmax(320px,360px)] lg:auto-cols-[minmax(340px,380px)]">
                {visibleRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    lang={lang}
                    locale={locale}
                    ui={ui}
                    copy={copy}
                    nights={nights}
                    resultHrefSuffix={resultHrefSuffix}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function RoomCard({
  room,
  lang,
  locale,
  ui,
  copy,
  nights,
  resultHrefSuffix
}: {
  room: Room;
  lang: Language;
  locale: string;
  ui: BookingRoomSelectionProps["ui"];
  copy: SelectionCopy;
  nights: number;
  resultHrefSuffix: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState(room.is_available ? 1 : 0);
  const images = room.gallery.length ? room.gallery : [room.image_url];
  const perNightPrice = Number(room.display_price);
  const originalPrice = Number(room.price_per_night);
  const totalStayPrice = perNightPrice * nights;
  const hasDiscount = originalPrice > perNightPrice;
  const discountPercent = hasDiscount
    ? Math.max(1, Math.round(((originalPrice - perNightPrice) / originalPrice) * 100))
    : 0;
  const detailHref = buildDetailHref(room.slug, resultHrefSuffix, selectedRooms);
  const amenityIcons = getAmenityIcons(room.amenities);
  const breakfastIncluded = hasAmenity(room.amenities, ["breakfast", "nonushta", "завтрак"]);
  const reviewDots = Math.min(Math.max(Math.round(room.average_rating), 3), 5);
  const availableOffers = room.is_available ? Math.max(1, nights) : 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#dde1e8] bg-white shadow-[0_14px_34px_rgba(22,39,72,0.12)]">
      <div className="relative m-3 h-[190px] overflow-hidden rounded-[16px] bg-[#f5efe5]">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[#7d7d7d] shadow-sm">
          {amenityIcons.map((Icon, index) => (
            <Icon key={`${room.id}-${index}`} className="h-3.5 w-3.5" />
          ))}
        </div>

        <Image
          src={images[imageIndex]}
          alt={`${copy.roomType}: ${room.title}`}
          fill
          className="object-cover"
        />

        {images.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/18 px-3 py-2 backdrop-blur-sm">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setImageIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  imageIndex === index ? "bg-[#596bd7]" : "bg-white/85"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4">
        <h3 className="min-h-[64px] text-[1.75rem] font-semibold leading-[1.05] text-[#1f2b3e]">
          {room.title}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-[#00a1cf]">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={`${room.id}-star-${index}`} className="text-[13px] leading-none">
              ★
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-[#28455f]">
          <Users className="h-4 w-4 text-[#00a36c]" />
          <span>
            {availableOffers} {copy.availableOffers}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-[#28455f]">
          <span className="text-[#00a36c]">☏</span>
          <span>{copy.tripAdvisor}:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Circle
                key={`${room.id}-dot-${index}`}
                className={`h-3.5 w-3.5 ${
                  index < reviewDots ? "fill-[#35c98c] text-[#35c98c]" : "fill-[#d9e2e6] text-[#d9e2e6]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[20px] border border-[#e6edf2] bg-[#fbfdff] p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-stone">{copy.fromLabel}</div>
          {hasDiscount ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[#9b6a1f]">
              <span className="rounded bg-[#af7420] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                -{discountPercent}%
              </span>
              <span className="text-sm line-through opacity-65">
                {originalPrice.toLocaleString(locale)} UZS
              </span>
            </div>
          ) : null}
          <div className="mt-2 font-display text-3xl leading-none text-[#1f2b3e]">
            {perNightPrice.toLocaleString(locale)} UZS
          </div>
          <div className="mt-2 text-sm leading-7 text-stone">
            {copy.totalStay}: {totalStayPrice.toLocaleString(locale)} UZS
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0ea6cf] px-5 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#0994ba]"
        >
          {expanded ? copy.hideRates : copy.showRates}
        </button>

        {expanded ? (
          <div className="mt-4 rounded-[20px] border border-[#e3edf4] bg-[#fffdfa] p-4">
            <div className="font-display text-2xl text-ink">{copy.directRate}</div>
            <p className="mt-2 text-sm leading-7 text-ink/68">{copy.directRateBody}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ebf7e9] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[#236239]">
                <CheckCircle2 className="h-4 w-4" />
                {copy.bestChoice}
              </span>
              {breakfastIncluded ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-stone">
                  <UtensilsCrossed className="h-4 w-4" />
                  {copy.included}
                </span>
              ) : null}
            </div>

            <label className="mt-4 block space-y-2 text-sm text-ink/72">
              <span>{copy.quantity}</span>
              <select
                value={selectedRooms}
                onChange={(event) => setSelectedRooms(Number(event.target.value))}
                disabled={!room.is_available}
                className="w-full rounded-2xl border border-[#ddd2c3] bg-white px-4 py-3 text-sm text-ink outline-none"
              >
                <option value={0}>{copy.quantityZero}</option>
                <option value={1}>{copy.quantityOne}</option>
              </select>
            </label>

            {room.is_available ? (
              <Link
                href={selectedRooms > 0 ? detailHref : `/rooms/${room.slug}${resultHrefSuffix}`}
                className={`mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#0ea6cf] px-5 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#0994ba] ${selectedRooms < 1 ? "pointer-events-none opacity-50" : ""}`}
              >
                {copy.continueBooking}
              </Link>
            ) : (
              <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#eef1f4] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#70767e]">
                <XCircle className="h-5 w-5" />
                <span>{ui.soldOut}</span>
              </div>
            )}
          </div>
        ) : null}

        <Link
          href={`/rooms/${room.slug}${resultHrefSuffix}`}
          className="mt-4 inline-flex items-center justify-center text-sm uppercase tracking-[0.18em] text-ink/72 transition hover:text-ink"
        >
          {copy.openDetails}
        </Link>
      </div>
    </article>
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

function hasAmenity(amenities: string[], terms: string[]) {
  return amenities.some((amenity) => {
    const value = amenity.toLowerCase();
    return terms.some((term) => value.includes(term));
  });
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

function getNightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  if (Number.isNaN(diff) || diff <= 0) {
    return 0;
  }
  return Math.round(diff / 86400000);
}

function formatDateLabel(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function buildDetailHref(slug: string, baseQuery: string, selectedRooms: number) {
  if (!baseQuery) {
    return `/rooms/${slug}${selectedRooms > 0 ? `?rooms=${selectedRooms}` : ""}`;
  }

  const separator = baseQuery.includes("?") ? "&" : "?";
  return `/rooms/${slug}${baseQuery}${selectedRooms > 0 ? `${separator}rooms=${selectedRooms}` : ""}`;
}
