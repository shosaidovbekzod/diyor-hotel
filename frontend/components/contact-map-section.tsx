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
      <div className="grid gap-8 bg-[#3f4044] p-6 text-white sm:p-8 md:p-10">
        <div>
          <div className="section-label text-white/45">{eyebrow}</div>
          <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
        </div>

        <ContactRow
          icon={<Phone className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />}
          label={copy.phone}
          primary={<a href={`tel:${summary.phone.replace(/\s+/g, "")}`}>{summary.phone}</a>}
          secondary={copy.openAlways}
        />
        <ContactRow
          icon={<Mail className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />}
          label={copy.email}
          primary={<a href={`mailto:${summary.email}`}>{summary.email}</a>}
          secondary={copy.openAlways}
        />
        <ContactRow
          icon={<MapPin className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />}
          label={copy.address}
          primary={<span>{summary.location}</span>}
        />
      </div>

      <div className="relative min-h-[360px] bg-[#ebe2d3] sm:min-h-[420px] lg:min-h-[520px]">
        <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 bg-white/92 px-3 py-2 text-[9px] uppercase tracking-[0.24em] text-stone shadow-sm sm:left-5 sm:top-5 sm:px-4 sm:py-3 sm:text-[10px] sm:tracking-[0.3em]">
          <Clock3 className="h-4 w-4" strokeWidth={1.8} />
          {copy.route}
        </div>
        <iframe
          src={summary.map_embed_url}
          title={`${summary.name} map`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full min-h-[360px] w-full border-0 sm:min-h-[420px] lg:min-h-[520px]"
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
    <div className="grid grid-cols-[56px_1fr] items-start gap-5 sm:grid-cols-[72px_1fr] sm:gap-6">
      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/70 text-white sm:h-[72px] sm:w-[72px]">
        {icon}
      </div>
      <div className="pt-2">
        <div className="text-sm text-white/72">{label}</div>
        <div className="mt-2 text-base leading-7 text-white sm:text-[1.15rem] sm:leading-8">{primary}</div>
        {secondary ? <div className="mt-1 text-sm text-white/72">{secondary}</div> : null}
      </div>
    </div>
  );
}
