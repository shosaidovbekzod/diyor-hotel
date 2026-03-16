import Image from "next/image";
import Link from "next/link";
import { getRooms, type RoomSearchFilters } from "@/lib/api";
import { localizeRooms } from "@/lib/content";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

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

  const hasFilters = Object.keys(filters).length > 0;
  const rooms = localizeRooms(await getRooms(hasFilters ? filters : undefined), lang);
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
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[0.95] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-8 text-ink/72 sm:text-base">{copy.desc}</p>
        </div>
      </section>

      <section className="shell mt-10 sm:mt-12">
        <form action="/rooms" className="editorial-panel p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#d8cfc2] pb-5">
            <div>
              <div className="section-label">{copy.filtersTitle}</div>
              <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">{copy.filtersTitle}</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-stone">
                {rooms.length} {copy.results}
              </div>
              <div className="border border-[#d8cfc2] px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-stone">
                {availableCount} {copy.availableCount}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-[0.9fr_0.9fr_0.8fr_0.8fr_0.7fr_0.7fr]">
            <label className="space-y-2 text-sm text-ink/70">
              <span>{copy.checkIn}</span>
              <input type="date" name="checkIn" defaultValue={checkIn} className="editorial-input" />
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{copy.checkOut}</span>
              <input type="date" name="checkOut" defaultValue={checkOut} className="editorial-input" />
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{copy.guests}</span>
              <input
                type="number"
                name="guests"
                min={1}
                max={12}
                defaultValue={guests}
                className="editorial-input"
              />
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{copy.minPrice}</span>
              <input
                type="number"
                name="minPrice"
                min={0}
                step={10000}
                defaultValue={minPrice}
                className="editorial-input"
              />
            </label>
            <label className="space-y-2 text-sm text-ink/70">
              <span>{copy.maxPrice}</span>
              <input
                type="number"
                name="maxPrice"
                min={0}
                step={10000}
                defaultValue={maxPrice}
                className="editorial-input"
              />
            </label>
            <label className="flex items-end gap-3 border-b border-[#d8cfc2] pb-4 text-sm text-ink/72">
              <input type="checkbox" name="availableOnly" defaultChecked={availableOnly} className="h-4 w-4" />
              <span>{copy.availableOnly}</span>
            </label>
          </div>

          {!datesValid ? (
            <div className="mt-6 border border-[#e3c9c2] bg-[#f7eae6] px-5 py-4 text-sm text-[#8b4338]">
              {copy.invalidDates}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="editorial-button">{copy.apply}</button>
            <Link href="/rooms" className="editorial-button-secondary">
              {copy.reset}
            </Link>
          </div>
        </form>
      </section>

      <section className="shell mt-12 grid gap-10 sm:mt-14">
        {rooms.map((room, index) => (
          <article
            key={room.id}
            className={`grid gap-8 border-b border-[#d8cfc2] pb-12 ${
              index % 2 === 0 ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-[0.95fr_1.05fr]"
            }`}
          >
            <div className={`relative min-h-[320px] overflow-hidden border border-[#d8cfc2] sm:min-h-[420px] lg:min-h-[520px] ${index % 2 !== 0 ? "lg:order-2" : ""}`}>
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
                <h2 className="mt-5 max-w-2xl font-display text-3xl leading-none text-ink sm:text-4xl lg:text-5xl">
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
                    <div className="mt-3 font-display text-3xl text-ink sm:text-4xl lg:text-5xl">
                      {Number(room.display_price).toLocaleString("en-US")} UZS
                    </div>
                    <div className={`mt-4 inline-flex border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                      room.is_available ? "bg-[#24312b] text-white" : "bg-[#ead7d3] text-[#8b4338]"
                    }`}>
                      {room.is_available ? copy.available : copy.unavailable}
                    </div>
                  </div>
                  <Link
                    href={`/rooms/${room.slug}${detailQueryString ? `?${detailQueryString}` : ""}`}
                    className="border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-white transition hover:bg-[#2c2721] sm:text-xs"
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
