import Image from "next/image";
import { BookingForm } from "@/components/booking-form";
import { getReviews, getRoomBySlug } from "@/lib/api";
import { localizeRoom } from "@/lib/content";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

const detailCopy = {
  en: { rating: "Guest rating" },
  uz: { rating: "Mehmon bahosi" },
  ru: { rating: "Оценка гостей" }
} as const;

export default async function RoomDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const lang = await getServerLanguage();
  const copy = t(lang).rooms;
  const ui = detailCopy[lang];
  const room = localizeRoom(await getRoomBySlug(slug), lang);
  const reviews = await getReviews(room.id);
  const defaultCheckIn =
    typeof resolvedSearchParams.checkIn === "string" ? resolvedSearchParams.checkIn : "";
  const defaultCheckOut =
    typeof resolvedSearchParams.checkOut === "string" ? resolvedSearchParams.checkOut : "";
  const defaultGuestsCount = Math.max(
    1,
    Number(
      typeof resolvedSearchParams.guests === "string"
        ? resolvedSearchParams.guests
        : typeof resolvedSearchParams.adults === "string"
          ? resolvedSearchParams.adults
          : 2
    )
  );

  return (
    <div className="pb-12 sm:pb-16">
      <section className="border-b border-[#d8cfc2] bg-[#f2ece2]">
        <div className="shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="section-label">{copy.view}: {room.view_label}</div>
            <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[0.95] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              {room.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-ink/72 sm:text-lg">{room.description}</p>
          </div>
          <div className="grid gap-3 border-t border-[#d8cfc2] pt-5 text-[11px] uppercase tracking-[0.2em] text-stone sm:grid-cols-3 sm:text-xs sm:tracking-[0.22em] lg:border-0 lg:pt-0">
            <div>{room.capacity} {copy.guests}</div>
            <div>{room.size_sqm} m2</div>
            <div>{room.bed_type}</div>
          </div>
        </div>
      </section>

      <section className="shell mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {room.gallery.map((image, index) => (
            <div
              key={image}
              className={`relative overflow-hidden border border-[#d8cfc2] ${
                index === 0 ? "md:col-span-2 h-[240px] sm:h-[320px] md:h-[420px]" : "h-[200px] sm:h-[260px] md:h-[280px]"
              }`}
            >
              <Image src={image} alt={room.title} fill className="object-cover" />
            </div>
          ))}
        </div>
        <BookingForm
          roomId={room.id}
          lang={lang}
          defaultCheckIn={defaultCheckIn}
          defaultCheckOut={defaultCheckOut}
          defaultGuestsCount={defaultGuestsCount}
        />
      </section>

      <section className="shell mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-6 sm:p-8">
          <div className="section-label">{copy.amenities}</div>
          <div className="mt-6 grid gap-3">
            {room.amenities.map((amenity) => (
              <div key={amenity} className="border-b border-[#e4dacd] pb-3 text-sm uppercase tracking-[0.18em] text-stone">
                {amenity}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-label">{copy.reviews}</div>
              <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl">{copy.reviews}</h2>
            </div>
            <div className="text-right">
              <div className="section-label">{ui.rating}</div>
              <div className="mt-2 font-display text-3xl text-ink sm:text-4xl">{room.average_rating.toFixed(1)}</div>
            </div>
          </div>
          <div className="mt-8 space-y-5">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-[#e4dacd] pb-5 last:border-b-0 last:pb-0">
                <h3 className="font-display text-xl text-ink sm:text-2xl">{review.title}</h3>
                <p className="mt-3 text-sm leading-8 text-ink/72 sm:text-base">{review.comment}</p>
                <div className="mt-4 text-xs uppercase tracking-[0.24em] text-stone">{review.user.full_name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
