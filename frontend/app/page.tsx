import Image from "next/image";
import Link from "next/link";
import { getHotelSummary } from "@/lib/api";
import { localizeRooms, localizeServices } from "@/lib/content";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

export default async function HomePage() {
  const lang = await getServerLanguage();
  const copy = t(lang).home;
  const summary = await getHotelSummary();
  const rooms = localizeRooms(summary.highlight_rooms, lang);
  const services = localizeServices(summary.services, lang);

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-[#171717] text-white">
        <div className="absolute inset-0">
          <Image src={summary.hero_image} alt={summary.name} fill className="object-cover opacity-35" />
        </div>
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="shell relative grid min-h-[82vh] items-end gap-10 py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]">
              {copy.badge}
            </div>
            <h1 className="font-display text-5xl leading-none md:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-2xl text-lg text-white/75">{copy.desc}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/rooms" className="rounded-full bg-champagne px-6 py-3 font-medium text-ink">{copy.explore}</Link>
              <a href={summary.telegram_url} className="rounded-full border border-white/20 px-6 py-3">{copy.telegram}</a>
            </div>
          </div>
          <div className="card p-6 text-ink">
            <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.quickSearch}</div>
            <h2 className="mt-2 font-display text-3xl">{copy.findRoom}</h2>
            <form action="/rooms" className="mt-6 space-y-4">
              <input name="checkIn" type="date" className="w-full rounded-2xl border border-ink/10 px-4 py-3" />
              <input name="checkOut" type="date" className="w-full rounded-2xl border border-ink/10 px-4 py-3" />
              <input name="guests" type="number" min={1} max={6} defaultValue={2} className="w-full rounded-2xl border border-ink/10 px-4 py-3" />
              <button className="w-full rounded-full bg-ink px-5 py-3 text-white">{copy.search}</button>
            </form>
          </div>
        </div>
      </section>

      <section className="shell -mt-12">
        <div className="card grid gap-6 p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.promotion}</div>
            <h2 className="mt-2 font-display text-4xl">{copy.promoTitle}</h2>
            <p className="mt-4 max-w-2xl text-ink/70">{copy.promoDesc}</p>
          </div>
          <div className="rounded-[24px] bg-[#171717] p-6 text-white">
            <div className="text-5xl font-display">299,000</div>
            <div className="mt-2 text-white/60">UZS per night</div>
            <Link href="/rooms/deluxe-city-room" className="mt-6 inline-block rounded-full bg-champagne px-5 py-3 text-ink">{copy.reserveOffer}</Link>
          </div>
        </div>
      </section>

      <section className="shell mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.rooms}</div>
            <h2 className="mt-2 font-display text-4xl">{copy.signature}</h2>
          </div>
          <Link href="/rooms" className="text-sm text-ink/60">{copy.viewAll}</Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} href={`/rooms/${room.slug}`} className="card overflow-hidden">
              <div className="relative h-72">
                <Image src={room.image_url} alt={room.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl">{room.title}</h3>
                  <div className="rounded-full bg-sand px-3 py-1 text-sm">{room.average_rating.toFixed(1)}</div>
                </div>
                <p className="mt-3 text-ink/65">{room.subtitle}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-ink/50">{copy.from}</span>
                  <span className="font-display text-3xl">{Number(room.display_price).toLocaleString("en-US")} UZS</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.services}</div>
          <h2 className="mt-2 font-display text-4xl">{copy.servicesTitle}</h2>
          <p className="mt-4 text-ink/70">{copy.servicesDesc}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.id} className="card p-5">
              <div className="text-sm uppercase tracking-[0.3em] text-champagne">{service.name}</div>
              <p className="mt-3 text-ink/70">{service.short_description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-20">
        <div className="grid gap-6 md:grid-cols-3">
          {summary.gallery.map((image, index) => (
            <div key={image} className={`relative h-72 overflow-hidden rounded-[28px] ${index === 0 ? "md:col-span-2" : ""}`}>
              <Image src={image} alt={`Gallery ${index + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-20">
        <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.testimonials}</div>
        <h2 className="mt-2 font-display text-4xl">{copy.testimonialTitle}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {summary.testimonials.map((review) => (
            <div key={review.id} className="card p-6">
              <div className="text-champagne">{Array.from({ length: review.rating }).map(() => "★")}</div>
              <h3 className="mt-4 font-display text-2xl">{review.title}</h3>
              <p className="mt-3 text-ink/70">{review.comment}</p>
              <div className="mt-5 text-sm text-ink/50">{review.user.full_name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
