import Image from "next/image";
import Link from "next/link";
import { ContactMapSection } from "@/components/contact-map-section";
import { getHotelSummary, type Room } from "@/lib/api";
import { localizeRooms, localizeServices } from "@/lib/content";
import { getLocale, t, type Language } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

const pageCopy = {
  en: {
    badge: "Official website",
    heroTitle: "Diyor Hotel & Spa Tashkent",
    heroDesc:
      "A direct booking experience for the real hotel: modern comfort, national hospitality, and a calmer stay in Tashkent.",
    aboutLabel: "About the hotel",
    aboutTitle: "Welcome to Diyor Tashkent Hotel.",
    aboutBody:
      "The hotel combines modern comfort, national hospitality, and a convenient location. Spacious rooms, practical layouts, and attentive service make it suitable for both rest and business travel.",
    stayLabel: "Stay",
    stayTitle: "Room categories from the existing property, presented in a more refined booking experience.",
    offersLabel: "Special offers",
    offersTitle: "The current commercial offers from the original hotel, restaged in a cleaner premium layout.",
    servicesTitle: "The core services from the current property, now presented with more clarity and hierarchy.",
    contactsLabel: "Contacts",
    contactsTitle: "Every direct contact point from the current hotel, kept clear and easy to reach.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    addressLabel: "Address",
    telegramLabel: "Telegram",
    guestRating: "Guest rating",
    adultsLabel: "Adults",
    childrenLabel: "Children",
    bookNow: "Book now",
    offers: [
      {
        title: "Long stay with breakfast",
        desc: "More nights, more value. A long-stay rate with breakfast for guests remaining in the city for an extended period.",
        image: "https://diyortashkenthotel.uz/img/2126cb8482ee8e68.webp"
      },
      {
        title: "Early booking with breakfast",
        desc: "A 12% discount when the stay is booked 10 days before arrival, including breakfast.",
        image: "https://diyortashkenthotel.uz/img/df9715710e83b8df.webp"
      },
      {
        title: "Early booking without breakfast",
        desc: "A 10% discount when the stay is booked 10 days before arrival without breakfast.",
        image: "https://diyortashkenthotel.uz/img/316f97faa86da67c.webp"
      }
    ]
  },
  uz: {
    badge: "Rasmiy veb-sayt",
    heroTitle: "Diyor Hotel & Spa Tashkent",
    heroDesc:
      "Haqiqiy mehmonxona uchun to'g'ridan-to'g'ri bron tajribasi: zamonaviy qulaylik, milliy mehmondo'stlik va Toshkentdagi sokinroq turar joy.",
    aboutLabel: "Mehmonxona haqida",
    aboutTitle: "Diyor Tashkent Hotel'ga xush kelibsiz.",
    aboutBody:
      "Mehmonxona zamonaviy qulaylik, milliy mehmondo'stlik va qulay joylashuvni birlashtiradi. Keng xonalar, amaliy reja va e'tiborli xizmat uni dam olish va xizmat safarlari uchun birdek mos qiladi.",
    stayLabel: "Turar joy",
    stayTitle: "Amaldagi mehmonxonadagi xona toifalari endi yanada nafis bron tajribasi bilan taqdim etiladi.",
    offersLabel: "Maxsus takliflar",
    offersTitle: "Asl mehmonxonadagi amaldagi takliflar endi tozaroq premium kompozitsiyada ko'rsatiladi.",
    servicesTitle: "Asl mehmonxonadagi asosiy xizmatlar endi aniqroq va tartibli ko'rinishda taqdim etiladi.",
    contactsLabel: "Kontaktlar",
    contactsTitle: "Mehmonxonaning amaldagi aloqa nuqtalari aniq va qulay shaklda qoldirildi.",
    phoneLabel: "Telefon",
    emailLabel: "Email",
    addressLabel: "Manzil",
    telegramLabel: "Telegram",
    guestRating: "Mehmon bahosi",
    adultsLabel: "Kattalar",
    childrenLabel: "Bolalar",
    bookNow: "Bandlov",
    offers: [
      {
        title: "Nonushta bilan uzoq turar joy",
        desc: "Ko'proq tun, ko'proq foyda. Shaharda uzoqroq qoladigan mehmonlar uchun nonushta bilan maxsus tarif.",
        image: "https://diyortashkenthotel.uz/img/2126cb8482ee8e68.webp"
      },
      {
        title: "Nonushta bilan erta bron",
        desc: "Kelishdan 10 kun oldin bron qilinsa, nonushta bilan 12% chegirma taqdim etiladi.",
        image: "https://diyortashkenthotel.uz/img/df9715710e83b8df.webp"
      },
      {
        title: "Nonushtasiz erta bron",
        desc: "Kelishdan 10 kun oldin bron qilinsa, nonushtasiz tarif uchun 10% chegirma beriladi.",
        image: "https://diyortashkenthotel.uz/img/316f97faa86da67c.webp"
      }
    ]
  },
  ru: {
    badge: "Официальный сайт",
    heroTitle: "Diyor Hotel & Spa Tashkent",
    heroDesc:
      "Прямое бронирование для реального отеля: современный комфорт, национальное гостеприимство и более спокойное проживание в Ташкенте.",
    aboutLabel: "Об отеле",
    aboutTitle: "Добро пожаловать в Diyor Tashkent Hotel.",
    aboutBody:
      "Отель сочетает современный комфорт, национальное гостеприимство и удобное расположение. Просторные номера, практичные планировки и внимательный сервис подходят как для отдыха, так и для деловых поездок.",
    stayLabel: "Проживание",
    stayTitle: "Категории номеров из действующего отеля, теперь показанные в более изысканном формате бронирования.",
    offersLabel: "Спецпредложения",
    offersTitle: "Текущие коммерческие предложения действующего отеля, переосмысленные в более чистой премиальной подаче.",
    servicesTitle: "Основные услуги текущего объекта теперь представлены с большей ясностью и иерархией.",
    contactsLabel: "Контакты",
    contactsTitle: "Все действующие контакты отеля сохранены и собраны в понятной форме.",
    phoneLabel: "Телефон",
    emailLabel: "Email",
    addressLabel: "Адрес",
    telegramLabel: "Telegram",
    guestRating: "Оценка гостей",
    adultsLabel: "Взрослые",
    childrenLabel: "Дети",
    bookNow: "Бронирование",
    offers: [
      {
        title: "Длительное проживание с завтраком",
        desc: "Больше ночей, больше выгоды. Специальный тариф с завтраком для гостей, которые остаются в городе надолго.",
        image: "https://diyortashkenthotel.uz/img/2126cb8482ee8e68.webp"
      },
      {
        title: "Раннее бронирование с завтраком",
        desc: "Скидка 12% при бронировании за 10 дней до заезда, включая завтрак.",
        image: "https://diyortashkenthotel.uz/img/df9715710e83b8df.webp"
      },
      {
        title: "Раннее бронирование без завтрака",
        desc: "Скидка 10% при бронировании за 10 дней до заезда без завтрака.",
        image: "https://diyortashkenthotel.uz/img/316f97faa86da67c.webp"
      }
    ]
  }
} as const;

const heroVideoSrc = "/hero-video.mp4?v=20260313";

const homeRoomPreviewUi = {
  en: {
    from: "from",
    details: "Details",
    otherTitle: "See other rooms",
    otherDesc: "Open the full room collection and browse every category in the compact card layout.",
    otherButton: "All rooms",
    available: "Available now",
    roomsCount: "rooms"
  },
  uz: {
    from: "narxi",
    details: "Batafsil",
    otherTitle: "Boshqa xonalarni ko'rish",
    otherDesc: "Barcha xona turlarini ko'rish va ularni qulay kartochkalarda tanlash uchun to'liq xonalar bo'limiga o'ting.",
    otherButton: "Xonalar bo'limi",
    available: "Hozir mavjud",
    roomsCount: "ta xona"
  },
  ru: {
    from: "от",
    details: "Подробнее",
    otherTitle: "Посмотреть другие номера",
    otherDesc: "Откройте полную коллекцию номеров и просматривайте все категории в удобном карточном формате.",
    otherButton: "Все номера",
    available: "Доступно сейчас",
    roomsCount: "номеров"
  }
} as const;

export default async function HomePage() {
  const lang = await getServerLanguage();
  const copy = t(lang).home;
  const ui = pageCopy[lang];
  const roomPreviewUi = homeRoomPreviewUi[lang];
  const summary = await getHotelSummary();
  const rooms = localizeRooms(summary.highlight_rooms, lang);
  const services = localizeServices(summary.services, lang);
  const featuredRooms = rooms.slice(0, 2);

  return (
    <div className="pb-12 sm:pb-16">
      <section className="relative overflow-hidden bg-[#14110d] text-white">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/diyor-hero-poster.webp"
            className="h-full w-full object-cover"
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="shell relative grid min-h-[70vh] gap-10 py-12 sm:min-h-[78vh] sm:py-16 lg:min-h-[86vh] lg:editorial-grid lg:items-end lg:py-24">
          <div className="max-w-4xl self-end pb-8">
            <div className="section-label text-white/70">{ui.badge}</div>
            <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[0.92] sm:text-5xl md:text-7xl lg:text-8xl">
              {ui.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 sm:text-base md:text-lg">
              {ui.heroDesc}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/rooms"
                className="border border-white bg-white px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-ink transition hover:bg-[#f1e8da] sm:text-sm"
              >
                {copy.explore}
              </Link>
              <a
                href={summary.telegram_url}
                className="border border-white/25 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-white/10 sm:text-sm"
              >
                {ui.telegramLabel}
              </a>
            </div>
          </div>

          <div className="glass-panel self-end border border-white/15 p-6 text-ink sm:p-7">
            <div className="section-label">{copy.quickSearch}</div>
            <h2 className="mt-3 max-w-sm font-display text-3xl leading-tight sm:text-4xl">{copy.findRoom}</h2>
            <form action="/booking" className="mt-8 space-y-4">
              <input
                name="checkIn"
                type="date"
                className="w-full border-b border-[#d6cab9] bg-transparent px-0 py-3 text-sm outline-none"
              />
              <input
                name="checkOut"
                type="date"
                className="w-full border-b border-[#d6cab9] bg-transparent px-0 py-3 text-sm outline-none"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-ink/68">
                  <span>{ui.adultsLabel}</span>
                  <select
                    name="adults"
                    defaultValue="2"
                    className="w-full border-b border-[#d6cab9] bg-transparent px-0 py-3 text-sm outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-ink/68">
                  <span>{ui.childrenLabel}</span>
                  <select
                    name="children"
                    defaultValue="0"
                    className="w-full border-b border-[#d6cab9] bg-transparent px-0 py-3 text-sm outline-none"
                  >
                    {[0, 1, 2, 3, 4].map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="mt-4 w-full border border-ink bg-ink px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-white transition hover:bg-[#2a251f] sm:text-sm">
                {ui.bookNow}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8cfc2] bg-white/70">
        <div className="shell grid gap-4 py-6 text-[11px] uppercase tracking-[0.24em] text-stone md:grid-cols-3 md:text-sm">
          <div>{summary.location}</div>
          <div className="text-ink">{summary.phone}</div>
          <div className="md:text-right">{summary.email}</div>
        </div>
      </section>

      <section className="shell mt-12 grid gap-10 sm:mt-16 lg:mt-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative min-h-[320px] overflow-hidden border border-[#d8cfc2] sm:min-h-[420px] lg:min-h-[560px]">
          <Image src="/diyor-about.webp" alt="Diyor Tashkent Hotel exterior" fill className="object-cover" />
        </div>
        <div className="card p-6 sm:p-8 md:p-10">
          <div className="section-label">{ui.aboutLabel}</div>
          <h2 className="mt-4 font-display text-3xl leading-none text-ink sm:text-4xl md:text-5xl">{ui.aboutTitle}</h2>
          <p className="mt-6 text-base leading-8 text-ink/72">{ui.aboutBody}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/rooms" className="border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721] sm:text-xs">
              {copy.viewAll}
            </Link>
            <a href={`tel:${summary.phone.replace(/\s+/g, "")}`} className="border border-[#d8cfc2] px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-ink transition hover:bg-[#ebe1d2] sm:text-xs">
              {ui.phoneLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="shell mt-12 grid gap-10 sm:mt-16 lg:mt-24 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{ui.stayLabel}</div>
          <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
            {ui.stayTitle}
          </h2>
        </div>
        <div className="space-y-5 border-t border-[#d8cfc2] pt-5 text-sm text-ink/72">
          <div className="section-label">{summary.name}</div>
          <p className="leading-7">{summary.location}</p>
          <p className="leading-7">{summary.phone}</p>
        </div>
      </section>

      {featuredRooms.length ? (
        <section className="shell mt-12 sm:mt-16 lg:mt-18">
          <div className="grid gap-5 xl:grid-cols-[1fr_1fr_0.78fr]">
            {featuredRooms.map((room) => (
              <HomePreviewRoomCard key={room.id} room={room} lang={lang} />
            ))}

            <div className="flex min-h-[320px] flex-col justify-between rounded-[22px] border border-[#ddd1c0] bg-[#16130f] p-6 text-white shadow-[0_18px_40px_rgba(19,15,10,0.18)] sm:min-h-[350px] sm:p-7">
              <div>
                <div className="section-label text-white/50">{ui.stayLabel}</div>
                <h3 className="mt-4 font-display text-3xl leading-[1.02] sm:text-4xl">
                  {roomPreviewUi.otherTitle}
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/72 sm:text-base">
                  {roomPreviewUi.otherDesc}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45">
                  <span>{rooms.length} {roomPreviewUi.roomsCount}</span>
                  <span>{summary.location}</span>
                </div>
                <Link
                  href="/rooms"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#15c954] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#11b84a]"
                >
                  {roomPreviewUi.otherButton}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell mt-12 grid gap-10 sm:mt-16 lg:mt-24 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{ui.offersLabel}</div>
          <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">{ui.offersTitle}</h2>
        </div>
        <div className="space-y-5 border-t border-[#d8cfc2] pt-5 text-sm text-ink/72">
          <p className="leading-7">{ui.offers[0].desc}</p>
        </div>
      </section>

      <section className="shell mt-12 grid gap-6 sm:mt-14 lg:grid-cols-3">
        {ui.offers.map((offer) => (
          <article key={offer.title} className="card overflow-hidden">
            <div className="relative h-[220px] sm:h-[280px] lg:h-[320px]">
              <Image src={offer.image} alt={offer.title} fill className="object-cover" />
            </div>
            <div className="grid gap-5 p-8">
              <div>
                <div className="section-label">{ui.offersLabel}</div>
                <h3 className="mt-4 font-display text-2xl leading-none text-ink sm:text-3xl lg:text-4xl">{offer.title}</h3>
              </div>
              <p className="text-base leading-8 text-ink/72">{offer.desc}</p>
              <div>
                <Link href="/rooms" className="border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721] sm:text-xs">
                  {copy.reserveOffer}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="shell mt-12 grid gap-10 sm:mt-16 lg:mt-24 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{copy.services}</div>
          <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">{ui.servicesTitle}</h2>
          <div className="mt-10 grid gap-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-start justify-between gap-6 border-b border-[#dbd1c4] pb-4">
                <div>
                  <div className="font-display text-2xl text-ink sm:text-3xl">{service.name}</div>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-ink/65">{service.short_description}</p>
                </div>
                <div className="pt-2 text-xs uppercase tracking-[0.24em] text-stone">0{service.id}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {summary.gallery.slice(0, 4).map((image, index) => (
            <div
              key={image}
              className={`relative overflow-hidden border border-[#d8cfc2] ${
                index === 0 ? "md:col-span-2 h-[240px] sm:h-[300px] lg:h-[360px]" : "h-[200px] sm:h-[240px]"
              }`}
            >
              <Image src={image} alt={`Gallery ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-12 border border-[#28221d] bg-[#1c1814] px-6 py-10 text-white sm:mt-16 sm:px-8 sm:py-12 md:px-12 lg:mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="section-label text-white/55">{copy.testimonials}</div>
            <h2 className="mt-4 max-w-lg font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">{copy.testimonialTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {summary.testimonials.map((review) => (
              <div key={review.id} className="border-l border-white/15 pl-5">
                <div className="section-label text-white/45">{ui.guestRating}</div>
                <div className="mt-3 font-display text-2xl text-champagne">{review.rating.toFixed(1)}</div>
                <h3 className="mt-4 font-display text-xl sm:text-2xl">{review.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/72">{review.comment}</p>
                <div className="mt-5 text-xs uppercase tracking-[0.24em] text-white/48">
                  {review.user.full_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell mt-12 sm:mt-16 lg:mt-24">
        <ContactMapSection
          lang={lang}
          summary={summary}
          eyebrow={ui.contactsLabel}
          title={ui.contactsTitle}
        />
      </section>
    </div>
  );
}

function HomePreviewRoomCard({
  room,
  lang
}: {
  room: Room;
  lang: Language;
}) {
  const ui = homeRoomPreviewUi[lang];
  const locale = getLocale(lang);

  return (
    <article className="overflow-hidden rounded-[22px] border border-[#ddd1c0] bg-white shadow-[0_18px_40px_rgba(37,31,24,0.08)]">
      <div className="relative h-[210px] overflow-hidden">
        <Image src={room.image_url} alt={room.title} fill className="object-cover" />
        <div className="absolute right-3 top-3 rounded-xl bg-white/92 p-2 shadow-md backdrop-blur-sm">
          <Image
            src="/diyor-logo.png"
            alt="Diyor Hotel logo"
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
          />
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="section-label">{room.view_label}</div>
        <h3 className="mt-3 min-h-[58px] font-display text-2xl leading-[1.02] text-ink sm:text-[2rem]">
          {room.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink/72">
          {room.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded-full border border-[#e2d7c8] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-stone"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#efe5d9] pt-5">
          <div>
            <div className="section-label">{ui.from}</div>
            <div className="mt-2 font-display text-3xl leading-none text-ink">
              {Number(room.display_price).toLocaleString(locale)} UZS
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#1e8751]">
              {ui.available}
            </div>
          </div>

          <Link
            href={`/rooms/${room.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-[#18140f] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2a241d]"
          >
            {ui.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
