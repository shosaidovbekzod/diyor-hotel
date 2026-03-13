import Image from "next/image";
import { BookingForm } from "@/components/booking-form";
import { getReviews, getRoomBySlug } from "@/lib/api";
import { localizeRoom } from "@/lib/content";
import { t } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n-server";

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getServerLanguage();
  const copy = t(lang).rooms;
  const room = localizeRoom(await getRoomBySlug(slug), lang);
  const reviews = await getReviews(room.id);

  return (
    <div className="shell py-14">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.view}: {room.view_label}</div>
          <h1 className="mt-2 font-display text-5xl">{room.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-ink/70">{room.description}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {room.gallery.map((image) => (
              <div key={image} className="relative h-72 overflow-hidden rounded-[28px]">
                <Image src={image} alt={room.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <BookingForm roomId={room.id} pricePerNight={Number(room.display_price)} lang={lang} />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.amenities}</div>
          <div className="mt-5 grid gap-3">
            {room.amenities.map((amenity) => (
              <div key={amenity} className="rounded-2xl bg-sand px-4 py-3">{amenity}</div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-ink/45">{copy.reviews}</div>
              <h2 className="mt-2 font-display text-3xl">{copy.reviews}</h2>
            </div>
            <div className="rounded-full bg-sand px-4 py-2 text-sm">{room.average_rating.toFixed(1)} / 5</div>
          </div>
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-ink/10 p-5">
                <div className="text-champagne">{Array.from({ length: review.rating }).map(() => "★")}</div>
                <h3 className="mt-2 font-medium">{review.title}</h3>
                <p className="mt-2 text-ink/70">{review.comment}</p>
                <div className="mt-3 text-sm text-ink/50">{review.user.full_name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
