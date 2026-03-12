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
    <div className="shell py-14">
      <div className="max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.eyebrow}</div>
        <h1 className="mt-2 font-display text-5xl">{copy.title}</h1>
        <p className="mt-4 text-ink/70">{copy.desc}</p>
      </div>
      <div className="mt-10 grid gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="card grid overflow-hidden lg:grid-cols-[360px_1fr]">
            <div className="relative min-h-72">
              <Image src={room.image_url} alt={room.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl">{room.title}</h2>
                  <p className="mt-2 text-ink/65">{room.subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-ink/50">{copy.perNight}</div>
                  <div className="font-display text-4xl">{Number(room.display_price).toLocaleString("en-US")} UZS</div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-sm text-ink/60">
                <span className="rounded-full bg-sand px-3 py-2">{room.capacity} {copy.guests}</span>
                <span className="rounded-full bg-sand px-3 py-2">{room.size_sqm} m2</span>
                <span className="rounded-full bg-sand px-3 py-2">{room.bed_type}</span>
                <span className={`rounded-full px-3 py-2 ${room.is_available ? "bg-olive text-white" : "bg-red-100 text-red-700"}`}>
                  {room.is_available ? copy.available : copy.unavailable}
                </span>
              </div>
              <p className="mt-5 max-w-3xl text-ink/70">{room.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {room.amenities.slice(0, 6).map((amenity) => (
                  <span key={amenity} className="rounded-full border border-ink/10 px-3 py-2 text-sm">{amenity}</span>
                ))}
              </div>
              <Link href={`/rooms/${room.slug}`} className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-white">
                {copy.details}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
