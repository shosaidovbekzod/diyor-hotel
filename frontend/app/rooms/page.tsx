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
      <section className="shell pt-8 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="section-label">{copy.eyebrow}</div>
            <h1 className="mt-3 font-display text-3xl leading-[0.98] text-ink sm:text-4xl">{copy.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.24em] text-stone">
            <span className="rounded-full border border-[#ddd2c4] bg-white/80 px-3 py-2">
              {rooms.length} {copy.results}
            </span>
            <span className="rounded-full border border-[#ddd2c4] bg-white/80 px-3 py-2">
              {availableCount} {copy.availableCount}
            </span>
          </div>
        </div>

        {(checkIn || checkOut || guests || minPrice || maxPrice || availableOnly) && datesValid ? (
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.22em] text-stone">
            {checkIn ? <span className="rounded-full border border-[#ddd2c4] bg-[#f7f2ea] px-3 py-2">{copy.checkIn}: {checkIn}</span> : null}
            {checkOut ? <span className="rounded-full border border-[#ddd2c4] bg-[#f7f2ea] px-3 py-2">{copy.checkOut}: {checkOut}</span> : null}
            {guests !== undefined ? <span className="rounded-full border border-[#ddd2c4] bg-[#f7f2ea] px-3 py-2">{copy.guests}: {guests}</span> : null}
            {minPrice !== undefined ? <span className="rounded-full border border-[#ddd2c4] bg-[#f7f2ea] px-3 py-2">{copy.minPrice}: {minPrice}</span> : null}
            {maxPrice !== undefined ? <span className="rounded-full border border-[#ddd2c4] bg-[#f7f2ea] px-3 py-2">{copy.maxPrice}: {maxPrice}</span> : null}
            {availableOnly ? <span className="rounded-full border border-[#ddd2c4] bg-[#f7f2ea] px-3 py-2">{copy.availableOnly}</span> : null}
          </div>
        ) : null}

        {!datesValid ? (
          <div className="mt-4 rounded-[18px] border border-[#e3c9c2] bg-[#f7eae6] px-5 py-4 text-sm text-[#8b4338]">
            {copy.invalidDates}
          </div>
        ) : null}

        <p className="mt-6 text-sm italic text-stone">{cardUi.pricesNote}</p>

        <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#cabba8_transparent]">
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
    <article className="w-[180px] min-w-[180px] flex-none snap-start overflow-hidden rounded-[16px] border border-[#dfe6ea] bg-white p-2.5 shadow-[0_10px_22px_rgba(37,63,95,0.1)] sm:w-[190px] sm:min-w-[190px] xl:w-[196px] xl:min-w-[196px]">
      <div className="relative overflow-hidden rounded-[12px]">
        <div className="relative h-[118px]">
          <Image src={room.image_url} alt={room.title} fill className="object-cover" />
        </div>

        <div className="absolute right-2 top-2 rounded-xl bg-white/92 p-1.5 shadow-md backdrop-blur-sm">
          <Image
            src="/hotel-tashkent-logo.svg"
            alt="Hotel Tashkent logo"
            width={34}
            height={34}
            className="h-8 w-8 object-contain"
          />
        </div>

        <div className="absolute bottom-2 right-2 rounded-md bg-white/95 px-2 py-1 text-[9px] font-medium text-ink shadow-sm">
          +{photoCount} {cardUi.photoCount}
        </div>
      </div>

      <div className="px-1 pb-1 pt-3">
        <h2 className="min-h-[38px] text-[0.93rem] font-semibold leading-[1.1] text-[#182538] line-clamp-2">
          {room.title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-[#0aa4d0]">
          <span>{room.average_rating.toFixed(1)}</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Circle
                key={`${room.id}-score-${index}`}
                className={`h-3 w-3 ${
                  index < reviewDots ? "fill-[#0f9f55] text-[#0f9f55]" : "fill-[#d6e0e6] text-[#d6e0e6]"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#415a73]">
            ({room.reviews_count.toLocaleString(locale)} {cardUi.reviews})
          </span>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-y-1 text-[10px] text-[#4b657d]">
          {displayedAmenities.slice(0, 3).map((amenity) => (
            <div key={amenity} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-[#0aa4d0]" />
              <span className="line-clamp-1">{amenity}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1.5 text-[10px] text-[#31485f]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3 w-3 text-[#0aa4d0]" />
            <span className="line-clamp-1">{cardUi.openingLabel}: {room.view_label || room.bed_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-[#0aa4d0]" />
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

        <details className="group mt-3 rounded-[14px] border border-[#e6edf2] bg-[#fbfdff]">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-[14px] px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1a3045] transition hover:bg-[#f0f7fb] [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{cardUi.detailsToggle}</span>
            <span className="hidden group-open:inline">{cardUi.detailsHide}</span>
          </summary>

          <div className="border-t border-[#e6edf2] px-3 py-3">
            <p className="text-[11px] leading-5 text-ink/72">{room.description}</p>
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

            <div className="mt-4 grid gap-2">
              <Link href={detailHref} className="editorial-button w-full justify-center px-4 py-2.5 text-[10px]">
                {cardUi.openRoom}
              </Link>
              <Link href={`/booking${detailHref.includes("?") ? detailHref.slice(detailHref.indexOf("?")) : ""}`} className="editorial-button-secondary w-full justify-center px-4 py-2.5 text-[10px]">
                {cardUi.bookRoom}
              </Link>
            </div>
          </div>
        </details>

        <div className="mt-3">
          <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-stone">{cardUi.fromLabel}</div>
          <Link
            href={detailHref}
            className={`inline-flex w-full items-center justify-between rounded-full px-3.5 py-2.5 text-[10px] font-semibold text-white transition ${
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
