import type { ReactNode } from "react";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { HotelSummary } from "@/lib/api";
import type { Language } from "@/lib/i18n";

const contactCopy = {
  en: {
    openAlways: "Open 24/7",
    phone: "Phone",
    email: "Email",
    address: "Address",
    route: "Direct booking and location"
  },
  uz: {
    openAlways: "24/7 ishlaydi",
    phone: "Telefon",
    email: "Email",
    address: "Manzil",
    route: "To'g'ridan-to'g'ri bron va lokatsiya"
  },
  ru: {
    openAlways: "Работает 24/7",
    phone: "Телефон",
    email: "Email",
    address: "Адрес",
    route: "Прямое бронирование и локация"
  }
} as const;

type ContactMapSectionProps = {
  lang: Language;
  summary: HotelSummary;
  eyebrow: string;
  title: string;
};

export function ContactMapSection({ lang, summary, eyebrow, title }: ContactMapSectionProps) {
  const copy = contactCopy[lang];

  return (
    <section className="grid overflow-hidden border border-[#d8cfc2] bg-[#15120f] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-8 bg-[#3f4044] p-8 text-white md:p-10">
        <div>
          <div className="section-label text-white/45">{eyebrow}</div>
          <h2 className="mt-4 max-w-xl font-display text-5xl leading-tight">{title}</h2>
        </div>

        <ContactRow
          icon={<Phone className="h-7 w-7" strokeWidth={1.8} />}
          label={copy.phone}
          primary={<a href={`tel:${summary.phone.replace(/\s+/g, "")}`}>{summary.phone}</a>}
          secondary={copy.openAlways}
        />
        <ContactRow
          icon={<Mail className="h-7 w-7" strokeWidth={1.8} />}
          label={copy.email}
          primary={<a href={`mailto:${summary.email}`}>{summary.email}</a>}
          secondary={copy.openAlways}
        />
        <ContactRow
          icon={<MapPin className="h-7 w-7" strokeWidth={1.8} />}
          label={copy.address}
          primary={<span>{summary.location}</span>}
        />
      </div>

      <div className="relative min-h-[520px] bg-[#ebe2d3]">
        <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 bg-white/92 px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-stone shadow-sm">
          <Clock3 className="h-4 w-4" strokeWidth={1.8} />
          {copy.route}
        </div>
        <iframe
          src={summary.map_embed_url}
          title={`${summary.name} map`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full min-h-[520px] w-full border-0"
        />
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  primary,
  secondary
}: {
  icon: ReactNode;
  label: string;
  primary: ReactNode;
  secondary?: string;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr] items-start gap-6">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-white/70 text-white">
        {icon}
      </div>
      <div className="pt-2">
        <div className="text-sm text-white/72">{label}</div>
        <div className="mt-2 text-[1.15rem] leading-8 text-white">{primary}</div>
        {secondary ? <div className="mt-1 text-sm text-white/72">{secondary}</div> : null}
      </div>
    </div>
  );
}
