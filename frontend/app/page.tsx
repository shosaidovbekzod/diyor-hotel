import Image from "next/image";
import Link from "next/link";
import { getHotelSummary } from "@/lib/api";
import { localizeRooms, localizeServices } from "@/lib/content";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

const editorialCopy = {
  en: {
    roomsTitle: "Spacious stays with a quiet, residential sense of luxury.",
    roomsDesc:
      "Every room is composed with soft light, restrained materials, and the kind of calm rhythm expected from a premium city hotel.",
    servicesTitle: "Wellness rituals and all-day hospitality, composed with quiet confidence.",
    ratingLabel: "Guest rating"
  },
  uz: {
    roomsTitle: "Keng turar joylar sokin, uyday premium kayfiyat bilan yaratilgan.",
    roomsDesc:
      "Har bir xona yumshoq yorug'lik, vazmin materiallar va premium shahar mehmonxonasiga xos tinch muhit asosida tuzilgan.",
    servicesTitle: "Wellness marosimlari va kun bo'yi mehmondo'stlik ishonchli sokinlik bilan uyg'unlashgan.",
    ratingLabel: "Mehmon bahosi"
  },
  ru: {
    roomsTitle: "Просторные номера с тихим, почти резиденциальным ощущением роскоши.",
    roomsDesc:
      "Каждый номер построен на мягком свете, сдержанных материалах и том спокойном ритме, которого ждут от премиального городского отеля.",
    servicesTitle: "Wellness-ритуалы и гостеприимство на весь день, собранные с тихой уверенностью.",
    ratingLabel: "Оценка гостей"
  }
} as const;

export default async function HomePage() {
  const lang = await getServerLanguage();
  const copy = t(lang).home;
  const editorial = editorialCopy[lang];
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
            poster={summary.hero_image}
            className="h-full w-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="shell relative grid min-h-[86vh] gap-10 py-16 lg:editorial-grid lg:items-end lg:py-24">
          <div className="max-w-4xl self-end pb-8">
            <div className="section-label text-white/70">{copy.badge}</div>
            <h1 className="mt-6 max-w-4xl font-display text-6xl leading-[0.92] md:text-8xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/76 md:text-lg">
              {copy.desc}
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
                {copy.telegram}
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
          <div className="text-ink">{copy.promoTitle}</div>
          <div className="md:text-right">{summary.phone}</div>
        </div>
      </section>

      <section className="shell mt-20 grid gap-12 lg:editorial-grid lg:items-start">
        <div>
          <div className="section-label">{copy.rooms}</div>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink">
            {editorial.roomsTitle}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink/72">
            {editorial.roomsDesc}
          </p>
        </div>
        <div className="space-y-5 border-t border-[#d8cfc2] pt-5 text-sm text-ink/72">
          <div className="flex items-center justify-between">
            <span className="section-label">{copy.promotion}</span>
            <span className="font-display text-3xl text-ink">299,000 UZS</span>
          </div>
          <p className="leading-7">{copy.promoDesc}</p>
          <Link
            href="/rooms/deluxe-city-room"
            className="inline-flex border border-[#cbb99a] px-6 py-3 text-xs uppercase tracking-[0.24em] text-ink transition hover:bg-[#ebe1d2]"
          >
            {copy.reserveOffer}
          </Link>
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
                  {Number(leadRoom.display_price).toLocaleString("en-US")}
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
          <div className="section-label">{copy.services}</div>
          <h2 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ink">
            {editorial.servicesTitle}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink/72">{copy.servicesDesc}</p>
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
                <div className="section-label text-white/45">{editorial.ratingLabel}</div>
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
    </div>
  );
}
