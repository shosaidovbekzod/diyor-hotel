import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Baby, CalendarDays, Sparkles, Users } from "lucide-react";
import { ContactMapSection } from "@/components/contact-map-section";
import { getHotelSummary, getRooms } from "@/lib/api";
import { localizeRooms } from "@/lib/content";
import { getServerLanguage } from "@/lib/i18n-server";

const bookingPageCopy = {
  en: {
    eyebrow: "Direct booking",
    title: "Choose your dates, configure the room, and move into the cleanest booking flow on the site.",
    description:
      "The old website's booking logic is preserved here with a clearer interface: arrival, departure, adults, children, then live room options for the selected stay.",
    panelTitle: "Arrival, departure, and guest count",
    checkIn: "Check-in date",
    checkOut: "Check-out date",
    adults: "Adults",
    children: "Children",
    adultsHint: "Guests aged 12+",
    childrenHint: "Add children if needed",
    search: "Check availability",
    recommended: "Available room selection",
    results: "Matching stays for your dates",
    resultSummary: "Direct booking, flexible room categories, and live availability from the current property.",
    noResultsTitle: "No rooms match this stay yet.",
    noResultsBody: "Try a different date range or reduce the total number of guests.",
    invalidDates: "Check-out must be after check-in.",
    roomCta: "Book this room",
    details: "View room",
    perNight: "Per night",
    guests: "Guests",
    options: "options",
    contactEyebrow: "Contacts",
    contactTitle: "Use the same direct contact points and map access from the current hotel website."
  },
  uz: {
    eyebrow: "To'g'ridan-to'g'ri bron",
    title: "Sanalarni tanlang, xona tarkibini belgilang va saytdagi eng toza bron jarayoniga o'ting.",
    description:
      "Eski saytdagi booking mantiqi shu yerda aniqroq interfeys bilan saqlandi: kelish, jo'nash, kattalar, bolalar va so'ng mos xonalar natijasi.",
    panelTitle: "Kelish, jo'nash va mehmonlar soni",
    checkIn: "Kelish sanasi",
    checkOut: "Jo'nash sanasi",
    adults: "Kattalar",
    children: "Bolalar",
    adultsHint: "12 yosh va undan katta",
    childrenHint: "Kerak bo'lsa bolalarni qo'shing",
    search: "Bandlovni tekshirish",
    recommended: "Mavjud xona tanlovi",
    results: "Siz tanlagan sanalarga mos turar joylar",
    resultSummary: "To'g'ridan-to'g'ri bron, moslashuvchan xona toifalari va amaldagi mehmonxonadan jonli mavjudlik.",
    noResultsTitle: "Hozircha bu sanalarga mos xona topilmadi.",
    noResultsBody: "Boshqa sanalarni sinab ko'ring yoki umumiy mehmonlar sonini kamaytiring.",
    invalidDates: "Jo'nash sanasi kelish sanasidan keyin bo'lishi kerak.",
    roomCta: "Shu xonani bron qilish",
    details: "Xonani ko'rish",
    perNight: "Bir kecha",
    guests: "Mehmonlar",
    options: "variant",
    contactEyebrow: "Kontaktlar",
    contactTitle: "Amaldagi mehmonxona saytidagi shu aloqa nuqtalari va map kirishini yangi saytda ham saqladik."
  },
  ru: {
    eyebrow: "Прямое бронирование",
    title: "Выберите даты, настройте состав гостей и используйте новую чистую версию привычного бронирования.",
    description:
      "Логика бронирования со старого сайта сохранена здесь в более понятном интерфейсе: заезд, выезд, взрослые, дети и затем подбор подходящих номеров.",
    panelTitle: "Дата заезда, выезда и количество гостей",
    checkIn: "Дата заезда",
    checkOut: "Дата выезда",
    adults: "Взрослые",
    children: "Дети",
    adultsHint: "Гости 12+",
    childrenHint: "Добавьте детей при необходимости",
    search: "Проверить наличие",
    recommended: "Доступные категории номеров",
    results: "Подходящие варианты на выбранные даты",
    resultSummary: "Прямое бронирование, гибкие категории номеров и живая доступность из текущего объекта.",
    noResultsTitle: "На эти даты подходящих номеров пока нет.",
    noResultsBody: "Попробуйте изменить диапазон дат или уменьшить общее количество гостей.",
    invalidDates: "Дата выезда должна быть позже даты заезда.",
    roomCta: "Забронировать этот номер",
    details: "Открыть номер",
    perNight: "За ночь",
    guests: "Гости",
    options: "вариантов",
    contactEyebrow: "Контакты",
    contactTitle: "На новой версии сайта сохранены те же прямые контакты и карта, что и на текущем сайте отеля."
  }
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDateValue(value: string | string[] | undefined, fallback: string) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;
}

function parseNumberValue(value: string | string[] | undefined, fallback: number, min: number, max: number) {
  if (typeof value !== "string") {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? clamp(parsed, min, max) : fallback;
}

function getAdultLabel(lang: keyof typeof bookingPageCopy, count: number) {
  if (lang === "uz") {
    return `${count} kattalar`;
  }
  if (lang === "ru") {
    return `${count} взрослых`;
  }
  return `${count} adults`;
}

function getChildrenLabel(lang: keyof typeof bookingPageCopy, count: number) {
  if (lang === "uz") {
    return count === 0 ? "Bolalarsiz" : `${count} bolalar`;
  }
  if (lang === "ru") {
    return count === 0 ? "Без детей" : `${count} детей`;
  }
  return count === 0 ? "No children" : `${count} children`;
}

export default async function BookingPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const lang = await getServerLanguage();
  const ui = bookingPageCopy[lang];
  const summary = await getHotelSummary();
  const params = await searchParams;

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  const defaultCheckIn = parseDateValue(params.checkIn, toIsoDate(today));
  const defaultCheckOut = parseDateValue(params.checkOut, toIsoDate(tomorrow));
  const adults = parseNumberValue(params.adults, 2, 1, 12);
  const children = parseNumberValue(params.children, 0, 0, 6);
  const guests = parseNumberValue(params.guests, adults + children, 1, 18);
  const hasSearch = Boolean(params.checkIn || params.checkOut || params.adults || params.children || params.guests);
  const validDates = defaultCheckIn < defaultCheckOut;

  const rooms = localizeRooms(
    await getRooms(
      hasSearch && validDates
        ? {
            availableOnly: true,
            guests,
            checkIn: defaultCheckIn,
            checkOut: defaultCheckOut
          }
        : { availableOnly: true }
    ),
    lang
  );

  const resultsTitle = hasSearch && validDates ? ui.results : ui.recommended;
  const resultHrefSuffix = `?checkIn=${defaultCheckIn}&checkOut=${defaultCheckOut}&guests=${guests}&adults=${adults}&children=${children}`;

  return (
    <div className="pb-16">
      <section className="border-b border-[#d8cfc2] bg-[#efe6da]">
        <div className="shell grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="section-label">{ui.eyebrow}</div>
            <h1 className="mt-5 max-w-5xl font-display text-6xl leading-[0.94] text-ink md:text-7xl">
              {ui.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/72">{ui.description}</p>
          </div>

          <div className="grid gap-px border border-[#d8cfc2] bg-[#d8cfc2] md:grid-cols-3">
            <MetricCard icon={<CalendarDays className="h-4 w-4" />} label={ui.checkIn} value={defaultCheckIn} />
            <MetricCard icon={<Users className="h-4 w-4" />} label={ui.adults} value={getAdultLabel(lang, adults)} />
            <MetricCard icon={<Baby className="h-4 w-4" />} label={ui.children} value={getChildrenLabel(lang, children)} />
          </div>
        </div>
      </section>

      <section className="shell mt-12">
        <form action="/booking" className="editorial-panel p-8 md:p-10">
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
              <input
                type="date"
                name="checkIn"
                defaultValue={defaultCheckIn}
                className="editorial-input"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{ui.checkOut}</span>
              <input
                type="date"
                name="checkOut"
                defaultValue={defaultCheckOut}
                className="editorial-input"
                required
              />
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
            <button className="editorial-button h-[52px] self-start px-8 mt-7 xl:mt-0">
              {ui.search}
            </button>
          </div>

          {!validDates ? (
            <div className="mt-6 border border-[#e3c9c2] bg-[#f7eae6] px-5 py-4 text-sm text-[#8b4338]">
              {ui.invalidDates}
            </div>
          ) : null}
        </form>
      </section>

      <section className="shell mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8cfc2] pb-5">
          <div>
            <div className="section-label">{ui.eyebrow}</div>
            <h2 className="mt-4 font-display text-5xl leading-none text-ink">{resultsTitle}</h2>
          </div>
          <div className="inline-flex items-center gap-2 border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-stone">
            <Sparkles className="h-4 w-4" />
            {rooms.length} {ui.options}
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="editorial-panel mt-8 p-8 md:p-10">
            <h3 className="font-display text-4xl text-ink">{ui.noResultsTitle}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">{ui.noResultsBody}</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8">
            {rooms.map((room) => (
              <article
                key={room.id}
                className="grid gap-8 border-b border-[#d8cfc2] pb-10 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-[360px] overflow-hidden border border-[#d8cfc2]">
                  <Image src={room.image_url} alt={room.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-stone">
                      <span>{room.view_label}</span>
                      <span>{room.size_sqm} m2</span>
                      <span>{room.capacity} {ui.guests}</span>
                    </div>
                    <h3 className="mt-4 font-display text-5xl leading-none text-ink">{room.title}</h3>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-ink/72">{room.description}</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      {room.amenities.slice(0, 5).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full border border-[#ddd1c0] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-stone"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-[#d8cfc2] pt-6">
                    <div>
                      <div className="section-label">{ui.perNight}</div>
                      <div className="mt-3 font-display text-5xl text-ink">
                        {Number(room.display_price).toLocaleString("en-US")} UZS
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/rooms/${room.slug}${resultHrefSuffix}`}
                        className="editorial-button"
                      >
                        {ui.roomCta}
                      </Link>
                      <Link
                        href={`/rooms/${room.slug}`}
                        className="editorial-button-secondary"
                      >
                        {ui.details}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="shell mt-24">
        <ContactMapSection
          lang={lang}
          summary={summary}
          eyebrow={ui.contactEyebrow}
          title={ui.contactTitle}
        />
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/80 p-6">
      <div className="section-label flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className="mt-4 font-display text-3xl text-ink">{value}</div>
    </div>
  );
}
