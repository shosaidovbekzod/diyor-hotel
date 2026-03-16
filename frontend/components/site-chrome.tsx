"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { t, type Language } from "@/lib/i18n";

export function SiteChrome({ children, lang }: { children: React.ReactNode; lang: Language }) {
  const pathname = usePathname();
  const copy = t(lang);
  const bookingLabel = {
    en: "Book now",
    uz: "Bandlov",
    ru: "Бронирование"
  }[lang];
  const nav = [
    { href: "/", label: copy.nav.home },
    { href: "/rooms", label: copy.nav.rooms },
    { href: "/account", label: copy.nav.account },
    { href: "/admin", label: copy.nav.admin }
  ];

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-50 border-b border-[#d8cfc2] bg-sand/95 backdrop-blur-xl">
        <div className="shell border-b border-[#d8cfc2] py-3 text-[9px] uppercase tracking-[0.26em] text-stone sm:py-4 sm:text-[10px] sm:tracking-[0.34em]">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="text-center md:text-left">Olmos 74A, Tashkent</div>
            <Link href="/" className="justify-self-center flex items-center gap-3 text-ink">
              <img src="/diyor-logo.webp" alt="Diyor Tashkent Hotel logo" className="h-10 w-auto sm:h-12 md:h-14" />
              <span className="font-display text-[20px] tracking-[0.14em] sm:text-[24px] sm:tracking-[0.18em] md:text-[30px]">
                DIYOR HOTEL
              </span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:justify-end">
              <a href="tel:+9988858933333" className="transition hover:text-ink">+998 88 589 33 33</a>
              <LanguageSwitcher current={lang} />
              <Link
                href="/booking"
                className="border border-ink bg-ink px-4 py-2.5 text-[9px] uppercase tracking-[0.24em] text-white transition hover:bg-[#2a241d] sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.28em]"
              >
                {bookingLabel}
              </Link>
            </div>
          </div>
        </div>
        <div className="shell py-3 sm:py-4">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.22em] text-stone sm:gap-x-8 sm:gap-y-3 sm:text-[11px] sm:tracking-[0.32em]">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b pb-1 transition ${
                    active ? "border-ink text-ink" : "border-transparent hover:border-[#bfae95] hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-[#d8cfc2] bg-[#f0e9df] py-12 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="section-label">DIYOR HOTEL</div>
            <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img src="/diyor-logo.webp" alt="Diyor Tashkent Hotel logo" className="h-14 w-auto sm:h-16" />
              <h2 className="max-w-2xl font-display text-3xl leading-[0.98] text-ink sm:text-4xl">
                {copy.footer.tagline}
              </h2>
            </div>
          </div>
          <div className="grid gap-8 text-sm text-ink/75 md:grid-cols-2">
            <div className="border-t border-[#d8cfc2] pt-4">
              <div className="section-label">Visit</div>
              <p className="mt-4 max-w-xs leading-7">{copy.footer.address}</p>
            </div>
            <div className="border-t border-[#d8cfc2] pt-4">
              <div className="section-label">Contact</div>
              <div className="mt-4 flex flex-col gap-3">
                <a href="tel:+9988858933333" className="transition hover:text-ink">+998 88 589 33 33</a>
                <a href="mailto:receptiondiyorhotel@gmail.com" className="transition hover:text-ink">receptiondiyorhotel@gmail.com</a>
                <a href="https://t.me/diyor_hoteln11" className="transition hover:text-ink">{copy.footer.telegram}</a>
                <a href="https://www.youtube.com/@Diyorhoteluz" className="transition hover:text-ink">{copy.footer.youtube}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
