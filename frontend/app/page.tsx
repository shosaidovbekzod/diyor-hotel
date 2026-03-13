import Image from "next/image";
import Link from "next/link";
import { getHotelSummary } from "@/lib/api";
import { localizeRooms, localizeServices } from "@/lib/content";
import { t } from "@/lib/i18n";
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

export default async function HomePage() {
  const lang = await getServerLanguage();
  const copy = t(lang).home;
  const ui = pageCopy[lang];
  const summary = await getHotelSummary();
  const rooms = localizeRooms(summary.highlight_rooms, lang);
  const services = localizeServices(summary.services, lang);
  const leadRoom = rooms[0];
  const supportingRooms = rooms.slice(1);

  return (
    <div className="pb-16">
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
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="shell relative grid min-h-[86vh] gap-10 py-16 lg:editorial-grid lg:items-end lg:py-24">
          <div className="max-w-4xl self-end pb-8">
            <div className="section-label text-white/70">{ui.badge}</div>
            <h1 className="mt-6 max-w-4xl font-display text-6xl leading-[0.92] md:text-8xl">
              {ui.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/76 md:text-lg">
              {ui.heroDesc}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/rooms"
                className="border border-white bg-white px-7 py-3 text-sm uppercase tracking-[0.22em] text-ink transition hover:bg-[#f1e8da]"
              >
                {copy.explore}
              </Link>
              <a
                href={summary.telegram_url}
                className="border border-white/25 px-7 py-3 text-sm uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
              >
                {ui.telegramLabel}
              </a>
            </div>
          </div>

          <div className="glass-panel self-end border border-white/15 p-7 text-ink">
            <div className="section-label">{copy.quickSearch}</div>
            <h2 className="mt-3 max-w-sm font-display text-4xl leading-tight">{copy.findRoom}</h2>
            <form action="/rooms" className="mt-8 space-y-4">
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
              <input
                name="guests"
                type="number"
                min={1}
                max={6}
                defaultValue={2}
                className="w-full border-b border-[#d6cab9] bg-transparent px-0 py-3 text-sm outline-none"
              />
              <button className="mt-4 w-full border border-ink bg-ink px-6 py-4 text-sm uppercase tracking-[0.22em] text-white transition hover:bg-[#2a251f]">
                {copy.search}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8cfc2] bg-white/70">
        <div className="shell grid gap-5 py-6 text-sm uppercase tracking-[0.24em] text-stone md:grid-cols-3">
          <div>{summary.location}</div>
          <div className="text-ink">{summary.phone}</div>
          <div className="md:text-right">receptiondiyorhotel@gmail.com</div>
        </div>
      </section>

      <section className="shell mt-20 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative min-h-[560px] overflow-hidden border border-[#d8cfc2]">
          <Image src="/diyor-about.webp" alt="Diyor Tashkent Hotel exterior" fill className="object-cover" />
        </div>
        <div className="card p-8 md:p-10">
          <div className="section-label">{ui.aboutLabel}</div>
          <h2 className="mt-4 font-display text-5xl leading-none text-ink">{ui.aboutTitle}</h2>
          <p className="mt-6 text-base leading-8 text-ink/72">{ui.aboutBody}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/rooms" className="border border-ink bg-ink px-7 py-3 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721]">
              {copy.viewAll}
            </Link>
            <a href={`tel:${summary.phone.replace(/\s+/g, "")}`} className="border border-[#d8cfc2] px-7 py-3 text-xs uppercase tracking-[0.24em] text-ink transition hover:bg-[#ebe1d2]">
              {ui.phoneLabel}
            </a>
          </div>
        </div>
      </section>

      <section className="shell mt-24 grid gap-12 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{ui.stayLabel}</div>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink">
            {ui.stayTitle}
          </h2>
        </div>
        <div className="space-y-5 border-t border-[#d8cfc2] pt-5 text-sm text-ink/72">
          <div className="section-label">{summary.name}</div>
          <p className="leading-7">{summary.location}</p>
          <p className="leading-7">{summary.phone}</p>
        </div>
      </section>

      {leadRoom ? (
        <section className="shell mt-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="relative min-h-[540px] overflow-hidden border border-[#d8cfc2]">
            <Image src={leadRoom.image_url} alt={leadRoom.title} fill className="object-cover" />
          </div>
          <div className="card p-8 md:p-10">
            <div className="section-label">{copy.signature}</div>
            <h3 className="mt-4 font-display text-5xl leading-none text-ink">{leadRoom.title}</h3>
            <p className="mt-5 text-base leading-8 text-ink/72">{leadRoom.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {leadRoom.amenities.slice(0, 5).map((amenity) => (
                <span key={amenity} className="rounded-full border border-[#ddd1c0] px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone">
                  {amenity}
                </span>
              ))}
            </div>
            <div className="mt-10 flex items-end justify-between gap-6 border-t border-[#e6ddd2] pt-6">
              <div>
                <div className="section-label">{copy.from}</div>
                <div className="mt-2 font-display text-5xl text-ink">
                  {Number(leadRoom.display_price).toLocaleString("en-US")} UZS
                </div>
              </div>
              <Link
                href={`/rooms/${leadRoom.slug}`}
                className="border border-ink bg-ink px-7 py-3 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721]"
              >
                {copy.viewAll}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="shell mt-20 grid gap-6 lg:grid-cols-2">
        {supportingRooms.map((room) => (
          <Link key={room.id} href={`/rooms/${room.slug}`} className="card overflow-hidden">
            <div className="relative h-[360px]">
              <Image src={room.image_url} alt={room.title} fill className="object-cover" />
            </div>
            <div className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="section-label">{room.view_label}</div>
                <h3 className="mt-4 font-display text-4xl text-ink">{room.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-8 text-ink/72">{room.subtitle}</p>
              </div>
              <div className="text-left md:text-right">
                <div className="section-label">{copy.from}</div>
                <div className="mt-3 font-display text-4xl text-ink">
                  {Number(room.display_price).toLocaleString("en-US")} UZS
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="shell mt-24 grid gap-12 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{ui.offersLabel}</div>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink">{ui.offersTitle}</h2>
        </div>
        <div className="space-y-5 border-t border-[#d8cfc2] pt-5 text-sm text-ink/72">
          <p className="leading-7">{ui.offers[0].desc}</p>
        </div>
      </section>

      <section className="shell mt-14 grid gap-6 lg:grid-cols-3">
        {ui.offers.map((offer) => (
          <article key={offer.title} className="card overflow-hidden">
            <div className="relative h-[320px]">
              <Image src={offer.image} alt={offer.title} fill className="object-cover" />
            </div>
            <div className="grid gap-5 p-8">
              <div>
                <div className="section-label">{ui.offersLabel}</div>
                <h3 className="mt-4 font-display text-4xl leading-none text-ink">{offer.title}</h3>
              </div>
              <p className="text-base leading-8 text-ink/72">{offer.desc}</p>
              <div>
                <Link href="/rooms" className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721]">
                  {copy.reserveOffer}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="shell mt-24 grid gap-12 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{copy.services}</div>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink">{ui.servicesTitle}</h2>
          <div className="mt-10 grid gap-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-start justify-between gap-6 border-b border-[#dbd1c4] pb-4">
                <div>
                  <div className="font-display text-3xl text-ink">{service.name}</div>
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
                index === 0 ? "md:col-span-2 h-[360px]" : "h-[240px]"
              }`}
            >
              <Image src={image} alt={`Gallery ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-24 border border-[#28221d] bg-[#1c1814] px-8 py-12 text-white md:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="section-label text-white/55">{copy.testimonials}</div>
            <h2 className="mt-4 max-w-lg font-display text-5xl leading-tight">{copy.testimonialTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {summary.testimonials.map((review) => (
              <div key={review.id} className="border-l border-white/15 pl-5">
                <div className="section-label text-white/45">{ui.guestRating}</div>
                <div className="mt-3 font-display text-2xl text-champagne">{review.rating.toFixed(1)}</div>
                <h3 className="mt-4 font-display text-2xl">{review.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/72">{review.comment}</p>
                <div className="mt-5 text-xs uppercase tracking-[0.24em] text-white/48">
                  {review.user.full_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell mt-24 grid gap-12 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{ui.contactsLabel}</div>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink">{ui.contactsTitle}</h2>
        </div>
        <div className="grid gap-5 border-t border-[#d8cfc2] pt-5 text-sm leading-8 text-ink/72 md:grid-cols-2">
          <div>
            <div className="section-label">{ui.phoneLabel}</div>
            <a href={`tel:${summary.phone.replace(/\s+/g, "")}`} className="mt-3 block text-ink hover:text-stone">
              {summary.phone}
            </a>
          </div>
          <div>
            <div className="section-label">{ui.emailLabel}</div>
            <a href="mailto:receptiondiyorhotel@gmail.com" className="mt-3 block text-ink hover:text-stone">
              receptiondiyorhotel@gmail.com
            </a>
          </div>
          <div>
            <div className="section-label">{ui.addressLabel}</div>
            <div className="mt-3 text-ink">{summary.location}</div>
          </div>
          <div>
            <div className="section-label">{ui.telegramLabel}</div>
            <a href={summary.telegram_url} className="mt-3 block text-ink hover:text-stone">
              {summary.telegram_url}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
