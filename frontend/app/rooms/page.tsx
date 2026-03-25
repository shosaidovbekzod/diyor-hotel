import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check, Circle, Users } from "lucide-react";
import { getRooms, type Room, type RoomSearchFilters } from "@/lib/api";
import { localizeRooms } from "@/lib/content";
import { getLocale, type Language, t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

const roomsCardUi = {
  en: {
    pricesNote: "All prices are shown per room per night.",
    photoCount: "photos",
    fromLabel: "from",
    availableNow: "Available now",
    soldOut: "Temporarily unavailable",
    detailsToggle: "Show details",
    detailsHide: "Hide details",
    openingLabel: "Stay format",
    reviews: "reviews",
    openRoom: "Open room page",
    bookRoom: "Book room",
    advisor: "Guest score"
  },
  uz: {
    pricesNote: "Barcha narxlar bir xona uchun bir kechaga ko'rsatilgan.",
    photoCount: "ta rasm",
    fromLabel: "narxi",
    availableNow: "Hozir mavjud",
    soldOut: "Hozircha mavjud emas",
    detailsToggle: "Batafsil",
    detailsHide: "Yopish",
    openingLabel: "Turar formati",
    reviews: "ta sharh",
    openRoom: "Xona sahifasi",
    bookRoom: "Bron qilish",
    advisor: "Mehmon bahosi"
  },
  ru: {
    pricesNote: "Все цены указаны за номер за одну ночь.",
    photoCount: "фото",
    fromLabel: "от",
    availableNow: "Доступно сейчас",
    soldOut: "Временно недоступно",
    detailsToggle: "Подробнее",
    detailsHide: "Скрыть",
    openingLabel: "Формат проживания",
    reviews: "отзывов",
    openRoom: "Страница номера",
    bookRoom: "Забронировать",
    advisor: "Оценка гостей"
  }
} as const;

function parseDateValue(value: string | string[] | undefined) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function parseNumberValue(value: string | string[] | undefined) {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function RoomsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = await getServerLanguage();
  const copy = t(lang).rooms;
  const cardUi = roomsCardUi[lang];
  const params = await searchParams;

  const minPrice = parseNumberValue(params.minPrice);
  const maxPrice = parseNumberValue(params.maxPrice);
  const guests = parseNumberValue(params.guests);
  const checkIn = parseDateValue(params.checkIn);
  const checkOut = parseDateValue(params.checkOut);
  const availableOnly = params.availableOnly === "on" || params.availableOnly === "true";
  const datesValid = !checkIn || !checkOut || checkIn < checkOut;

  const filters: RoomSearchFilters = {};
  if (minPrice !== undefined) {
    filters.minPrice = minPrice;
  }
  if (maxPrice !== undefined) {
    filters.maxPrice = maxPrice;
  }
  if (guests !== undefined) {
    filters.guests = guests;
  }
  if (availableOnly) {
    filters.availableOnly = true;
  }
  if (checkIn && checkOut && datesValid) {
    filters.checkIn = checkIn;
    filters.checkOut = checkOut;
  }

  const rooms = localizeRooms(await getRooms(Object.keys(filters).length ? filters : undefined), lang);
  const availableCount = rooms.filter((room) => room.is_available).length;
  const detailQuery = new URLSearchParams();
  if (checkIn) {
    detailQuery.set("checkIn", checkIn);
  }
  if (checkOut) {
    detailQuery.set("checkOut", checkOut);
  }
  if (guests !== undefined) {
    detailQuery.set("guests", String(guests));
  }
  const detailQueryString = detailQuery.toString();

  return (
    <div className="pb-12 sm:pb-16">
      <section className="border-b border-[#d8cfc2] bg-[#efe7dc]">
        <div className="shell grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="section-label">{copy.eyebrow}</div>
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[0.95] text-ink sm:text-5xl md:text-6xl">
              {copy.title}
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-8 text-ink/72 sm:text-base">{copy.desc}</p>
        </div>
      </section>

      <section className="shell mt-8 sm:mt-10">
        <form className="editorial-panel rounded-[24px] border border-[#ddd2c4] bg-white/92 p-5 sm:p-7" action="/rooms">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#ddd2c4] pb-5">
            <div>
              <div className="section-label">{copy.filtersTitle}</div>
              <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">{copy.filtersTitle}</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.24em] text-stone">
              <span className="border border-[#ddd2c4] px-3 py-2">{rooms.length} {copy.results}</span>
              <span className="border border-[#ddd2c4] px-3 py-2">{availableCount} {copy.availableCount}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_0.7fr_0.8fr_0.8fr_auto]">
            <label className="space-y-2 text-sm text-ink/72">
              <span>{copy.checkIn}</span>
              <input type="date" name="checkIn" defaultValue={checkIn} className="editorial-input" />
            </label>
            <label className="space-y-2 text-sm text-ink/72">
              <span>{copy.checkOut}</span>
              <input type="date" name="checkOut" defaultValue={checkOut} className="editorial-input" />
            </label>
            <label className="space-y-2 text-sm text-ink/72">
              <span>{copy.guests}</span>
              <input type="number" name="guests" min={1} max={12} defaultValue={guests} className="editorial-input" />
            </label>
            <label className="space-y-2 text-sm text-ink/72">
              <span>{copy.minPrice}</span>
              <input type="number" name="minPrice" min={0} step={10000} defaultValue={minPrice} className="editorial-input" />
            </label>
            <label className="space-y-2 text-sm text-ink/72">
              <span>{copy.maxPrice}</span>
              <input type="number" name="maxPrice" min={0} step={10000} defaultValue={maxPrice} className="editorial-input" />
            </label>
            <button className="editorial-button h-[50px] w-full xl:w-auto xl:px-8">{copy.apply}</button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-3 text-sm text-ink/72">
              <input type="checkbox" name="availableOnly" defaultChecked={availableOnly} className="h-4 w-4" />
              <span>{copy.availableOnly}</span>
            </label>
            <Link href="/rooms" className="editorial-button-secondary">
              {copy.reset}
            </Link>
          </div>

          {!datesValid ? (
            <div className="mt-5 rounded-[18px] border border-[#e3c9c2] bg-[#f7eae6] px-5 py-4 text-sm text-[#8b4338]">
              {copy.invalidDates}
            </div>
          ) : null}
        </form>
      </section>

      <section className="shell mt-10 sm:mt-12">
        <p className="text-center text-sm italic text-stone">{cardUi.pricesNote}</p>

        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#cabba8_transparent]">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              lang={lang}
              detailHref={`/rooms/${room.slug}${detailQueryString ? `?${detailQueryString}` : ""}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function RoomCard({
  room,
  lang,
  detailHref
}: {
  room: Room;
  lang: Language;
  detailHref: string;
}) {
  const locale = getLocale(lang);
  const cardUi = roomsCardUi[lang];
  const reviewDots = Math.min(Math.max(Math.round(room.average_rating), 3), 5);
  const displayedAmenities = room.amenities.slice(0, 6);
  const photoCount = room.gallery.length || 1;

  return (
    <article className="w-[228px] min-w-[228px] flex-none snap-start overflow-hidden rounded-[18px] border border-[#dfe6ea] bg-white p-3 shadow-[0_10px_26px_rgba(37,63,95,0.11)] sm:w-[236px] sm:min-w-[236px] xl:w-[220px] xl:min-w-[220px]">
      <div className="relative overflow-hidden rounded-[12px]">
        <div className="relative h-[148px]">
          <Image src={room.image_url} alt={room.title} fill className="object-cover" />
        </div>

        <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-[#16b2d6] text-center text-[8px] font-semibold uppercase leading-tight text-white shadow-md">
          DIYOR
        </div>

        <div className="absolute bottom-3 right-3 rounded-md bg-white/95 px-2 py-1 text-[10px] font-medium text-ink shadow-sm">
          +{photoCount} {cardUi.photoCount}
        </div>
      </div>

      <div className="px-1 pb-2 pt-4">
        <h2 className="min-h-[44px] text-[1.06rem] font-semibold leading-[1.08] text-[#182538]">
          {room.title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#0aa4d0]">
          <span>{room.average_rating.toFixed(1)}</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Circle
                key={`${room.id}-score-${index}`}
                className={`h-3.5 w-3.5 ${
                  index < reviewDots ? "fill-[#0f9f55] text-[#0f9f55]" : "fill-[#d6e0e6] text-[#d6e0e6]"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#415a73]">
            ({room.reviews_count.toLocaleString(locale)} {cardUi.reviews})
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-y-1.5 text-[11px] text-[#4b657d]">
          {displayedAmenities.slice(0, 4).map((amenity) => (
            <div key={amenity} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 shrink-0 text-[#0aa4d0]" />
              <span className="line-clamp-1">{amenity}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 text-[11px] text-[#31485f]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-[#0aa4d0]" />
            <span className="line-clamp-1">{cardUi.openingLabel}: {room.view_label || room.bed_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-[#0aa4d0]" />
            <span>{room.capacity} {t(lang).rooms.guests}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#0f9f55]">●</span>
            <span>{cardUi.advisor}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Circle
                  key={`${room.id}-advisor-${index}`}
                  className={`h-3 w-3 ${
                    index < reviewDots ? "fill-[#2cc67c] text-[#2cc67c]" : "fill-[#d6e0e6] text-[#d6e0e6]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <details className="group mt-4 rounded-[16px] border border-[#e6edf2] bg-[#fbfdff]">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-[16px] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1a3045] transition hover:bg-[#f0f7fb] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{cardUi.detailsToggle}</span>
            <span className="hidden group-open:inline">{cardUi.detailsHide}</span>
          </summary>

          <div className="border-t border-[#e6edf2] px-4 py-4">
            <p className="text-sm leading-6 text-ink/72">{room.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#dde5eb] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-stone">
                {room.size_sqm} m2
              </span>
              <span className="rounded-full border border-[#dde5eb] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-stone">
                {room.bed_type}
              </span>
              <span className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] ${
                room.is_available ? "bg-[#ebf8f0] text-[#187b49]" : "bg-[#f3ece8] text-[#8b4338]"
              }`}>
                {room.is_available ? cardUi.availableNow : cardUi.soldOut}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              <Link href={detailHref} className="editorial-button w-full justify-center">
                {cardUi.openRoom}
              </Link>
              <Link href={`/booking${detailHref.includes("?") ? detailHref.slice(detailHref.indexOf("?")) : ""}`} className="editorial-button-secondary w-full justify-center">
                {cardUi.bookRoom}
              </Link>
            </div>
          </div>
        </details>

        <div className="mt-4">
          <div className="mb-2 text-xs uppercase tracking-[0.16em] text-stone">{cardUi.fromLabel}</div>
          <Link
            href={detailHref}
            className={`inline-flex w-full items-center justify-between rounded-full px-4 py-3 text-[11px] font-semibold text-white transition ${
              room.is_available ? "bg-[#15c954] hover:bg-[#11b84a]" : "bg-[#a9bac4] hover:bg-[#9aacb6]"
            }`}
          >
            <span>{Number(room.display_price).toLocaleString(locale)} UZS</span>
            <span>{cardUi.detailsToggle} ›</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
