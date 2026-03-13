import Image from "next/image";
import Link from "next/link";
import { getRooms } from "@/lib/api";
import { localizeRooms } from "@/lib/content";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

export default async function RoomsPage() {
  const lang = await getServerLanguage();
  const copy = t(lang).rooms;
  const rooms = localizeRooms(await getRooms(), lang);

  return (
    <div className="pb-16">
      <section className="border-b border-[#d8cfc2] bg-[#efe7dc]">
        <div className="shell grid gap-8 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="section-label">{copy.eyebrow}</div>
            <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.95] text-ink md:text-7xl">
              {copy.title}
            </h1>
          </div>
          <p className="max-w-xl text-base leading-8 text-ink/72">{copy.desc}</p>
        </div>
      </section>

      <section className="shell mt-14 grid gap-10">
        {rooms.map((room, index) => (
          <article
            key={room.id}
            className={`grid gap-8 border-b border-[#d8cfc2] pb-12 ${
              index % 2 === 0 ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-[0.95fr_1.05fr]"
            }`}
          >
            <div className={`relative min-h-[520px] overflow-hidden border border-[#d8cfc2] ${index % 2 !== 0 ? "lg:order-2" : ""}`}>
              <Image src={room.image_url} alt={room.title} fill className="object-cover" />
            </div>
            <div className={`flex flex-col justify-between ${index % 2 !== 0 ? "lg:order-1" : ""}`}>
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-stone">
                  <span>{room.view_label}</span>
                  <span className="h-1 w-1 rounded-full bg-[#b8a791]" />
                  <span>{room.size_sqm} m2</span>
                  <span className="h-1 w-1 rounded-full bg-[#b8a791]" />
                  <span>{room.capacity} {copy.guests}</span>
                </div>
                <h2 className="mt-5 max-w-2xl font-display text-5xl leading-none text-ink">
                  {room.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-ink/72">{room.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {room.amenities.slice(0, 6).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full border border-[#ddd1c0] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-stone"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-[#ddd1c0] pt-7">
                <div className="flex flex-wrap items-end justify-between gap-5">
                  <div>
                    <div className="section-label">{copy.perNight}</div>
                    <div className="mt-3 font-display text-5xl text-ink">
                      {Number(room.display_price).toLocaleString("en-US")} UZS
                    </div>
                    <div className={`mt-4 inline-flex border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                      room.is_available ? "bg-[#24312b] text-white" : "bg-[#ead7d3] text-[#8b4338]"
                    }`}>
                      {room.is_available ? copy.available : copy.unavailable}
                    </div>
                  </div>
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="border border-ink bg-ink px-7 py-3 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721]"
                  >
                    {copy.details}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
