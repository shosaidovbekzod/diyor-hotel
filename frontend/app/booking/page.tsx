import { ContactMapSection } from "@/components/contact-map-section";
import { BookingRoomSelection } from "@/components/booking-room-selection";
import { getHotelSummary, getRooms } from "@/lib/api";
import { localizeRooms } from "@/lib/content";
import { getServerLanguage } from "@/lib/i18n-server";

const bookingPageCopy = {
  en: {
    eyebrow: "Direct booking",
    title: "Choose the room category that fits your stay.",
    description:
      "This booking flow keeps the strongest ideas from the old site and upgrades them into a cleaner, more premium selection experience.",
    panelTitle: "Arrival, departure, and guest count",
    checkIn: "Check-in date",
    checkOut: "Check-out date",
    adults: "Adults",
    children: "Children",
    adultsHint: "Guests aged 12+",
    childrenHint: "Add children if needed",
    search: "Check availability",
    resultSummary: "Select dates, review room cards, compare direct rates, and move into a cleaner booking flow.",
    noResultsTitle: "No rooms match this stay yet.",
    noResultsBody: "Try a different date range or reduce the total number of guests.",
    invalidDates: "Check-out must be after check-in.",
    roomCta: "Select this room",
    details: "Open room details",
    perNight: "Per night",
    guests: "Guests",
    options: "room options",
    soldOut: "Sold out",
    soldOutHint: "This category is not open for the selected dates. Update the search range to view the next available stay.",
    bestRate: "Best direct rate available",
    directOffer: "Direct booking advantage",
    directOfferHint: "Direct website offer",
    directBookingTitle: "Book more confidently and with better control.",
    directBookingItems: [
      "Best available direct rate for the selected dates",
      "No intermediary between the guest and the hotel",
      "Guest details remain inside the hotel booking flow",
      "Cleaner room comparison before checkout"
    ],
    showDates: "View other dates",
    expand: "Expand details",
    collapse: "Collapse details",
    contactEyebrow: "Contacts",
    contactTitle: "Use the same direct contact points and map access from the current hotel website."
  },
  uz: {
    eyebrow: "To'g'ridan-to'g'ri bron",
    title: "Safaringizga mos xona toifasini tanlang.",
    description:
      "Bu booking oqimi eski saytdagi eng kuchli jihatlarni saqlab, ularni yanada toza va premium xona tanlash tajribasiga aylantiradi.",
    panelTitle: "Kelish, jo'nash va mehmonlar soni",
    checkIn: "Kelish sanasi",
    checkOut: "Jo'nash sanasi",
    adults: "Kattalar",
    children: "Bolalar",
    adultsHint: "12 yosh va undan katta mehmonlar",
    childrenHint: "Kerak bo'lsa bolalarni qo'shing",
    search: "Bandlovni tekshirish",
    resultSummary: "Sanalarni tanlang, xona kartalarini solishtiring, to'g'ridan-to'g'ri narxni ko'ring va yanada qulay bron oqimiga o'ting.",
    noResultsTitle: "Hozircha bu sanalarga mos xona topilmadi.",
    noResultsBody: "Boshqa sana oralig'ini tanlang yoki mehmonlar sonini kamaytiring.",
    invalidDates: "Jo'nash sanasi kelish sanasidan keyin bo'lishi kerak.",
    roomCta: "Shu xonani tanlash",
    details: "Xona batafsili",
    perNight: "Bir kecha",
    guests: "Mehmonlar",
    options: "xona varianti",
    soldOut: "Sotib bo'lingan",
    soldOutHint: "Tanlangan sanalarda bu toifa band. Qidiruv sanalarini o'zgartirib keyingi bo'sh muddatni ko'ring.",
    bestRate: "To'g'ridan-to'g'ri eng yaxshi narx",
    directOffer: "To'g'ridan-to'g'ri bron afzalligi",
    directOfferHint: "Saytdagi maxsus narx",
    directBookingTitle: "Ishonchliroq va qulayroq bron qiling.",
    directBookingItems: [
      "Tanlangan sanalar uchun eng yaxshi to'g'ridan-to'g'ri narx",
      "Mehmon bilan mehmonxona orasida vositachi yo'q",
      "Mijoz ma'lumotlari mehmonxona booking oqimida qoladi",
      "Checkout oldidan xonalarni aniqroq solishtirish mumkin"
    ],
    showDates: "Boshqa sanalarni ko'rish",
    expand: "Batafsil ochish",
    collapse: "Yopish",
    contactEyebrow: "Kontaktlar",
    contactTitle: "Amaldagi mehmonxona saytidagi shu aloqa nuqtalari va map kirishini yangi saytda ham saqladik."
  },
  ru: {
    eyebrow: "Прямое бронирование",
    title: "Выберите категорию номера под ваш формат поездки.",
    description:
      "Этот booking-поток сохраняет сильные стороны старого сайта и превращает их в более чистый и премиальный выбор номера.",
    panelTitle: "Дата заезда, выезда и количество гостей",
    checkIn: "Дата заезда",
    checkOut: "Дата выезда",
    adults: "Взрослые",
    children: "Дети",
    adultsHint: "Гости 12+",
    childrenHint: "Добавьте детей при необходимости",
    search: "Проверить наличие",
    resultSummary: "Выберите даты, сравните карточки номеров, посмотрите прямой тариф и перейдите к более удобному бронированию.",
    noResultsTitle: "На эти даты подходящих номеров пока нет.",
    noResultsBody: "Попробуйте изменить диапазон дат или уменьшить количество гостей.",
    invalidDates: "Дата выезда должна быть позже даты заезда.",
    roomCta: "Выбрать этот номер",
    details: "Открыть номер",
    perNight: "За ночь",
    guests: "Гостей",
    options: "вариантов",
    soldOut: "Распродано",
    soldOutHint: "На выбранные даты эта категория недоступна. Измените даты поиска, чтобы посмотреть свободные варианты.",
    bestRate: "Лучшая прямая цена",
    directOffer: "Преимущество прямого бронирования",
    directOfferHint: "Специальный тариф сайта",
    directBookingTitle: "Бронируйте увереннее и с лучшим контролем.",
    directBookingItems: [
      "Лучшая прямая цена на выбранные даты",
      "Между гостем и отелем нет посредника",
      "Данные гостя остаются внутри потока бронирования отеля",
      "Номера удобнее сравнивать до оформления"
    ],
    showDates: "Посмотреть другие даты",
    expand: "Открыть детали",
    collapse: "Скрыть детали",
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
  const validDates = defaultCheckIn < defaultCheckOut;

  const rooms = localizeRooms(
    await getRooms(
      validDates
        ? {
            guests,
            checkIn: defaultCheckIn,
            checkOut: defaultCheckOut
          }
        : undefined
    ),
    lang
  );

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
        </div>
      </section>

      <BookingRoomSelection
        lang={lang}
        ui={ui}
        rooms={rooms}
        defaultCheckIn={defaultCheckIn}
        defaultCheckOut={defaultCheckOut}
        adults={adults}
        children={children}
        guests={guests}
        validDates={validDates}
        resultHrefSuffix={resultHrefSuffix}
      />

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
