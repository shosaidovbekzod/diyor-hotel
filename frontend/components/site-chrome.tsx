"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { t, type Language } from "@/lib/i18n";

const menuUi = {
  en: {
    trigger: "Menu",
    close: "Close",
    welcome: "Welcome to",
    spotlight:
      "A quieter stay in Tashkent with direct booking, elegant rooms, and hotel service that feels personal.",
    quickLabel: "Navigate",
    contactLabel: "Call us",
    addressLabel: "Location"
  },
  uz: {
    trigger: "Menyu",
    close: "Yopish",
    welcome: "Xush kelibsiz",
    spotlight:
      "Toshkentdagi sokin, nafis va to'g'ridan-to'g'ri bron qilinadigan turar joy tajribasi shu yerdan boshlanadi.",
    quickLabel: "Bo'limlar",
    contactLabel: "Qo'ng'iroq",
    addressLabel: "Manzil"
  },
  ru: {
    trigger: "Меню",
    close: "Закрыть",
    welcome: "Welcome to",
    spotlight:
      "A quieter stay in Tashkent with direct booking, elegant rooms, and hotel service that feels personal.",
    quickLabel: "Navigate",
    contactLabel: "Call us",
    addressLabel: "Location"
  }
} as const;

export function SiteChrome({ children, lang }: { children: React.ReactNode; lang: Language }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = t(lang);
  const ui = menuUi[lang];
  const bookingLabel = {
    en: "Book now",
    uz: "Bandlov",
    ru: "Р‘СЂРѕРЅРёСЂРѕРІР°РЅРёРµ"
  }[lang];
  const nav = [
    { href: "/", label: copy.nav.home },
    { href: "/rooms", label: copy.nav.rooms },
    { href: "/account", label: copy.nav.account },
    { href: "/admin", label: copy.nav.admin }
  ];
  const activeLabel = nav.find((item) => item.href === pathname)?.label ?? copy.nav.home;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-50 border-b border-[#d8cfc2] bg-sand/95 backdrop-blur-xl">
        <div className="shell border-b border-[#d8cfc2] py-3 text-[9px] uppercase tracking-[0.26em] text-stone sm:py-4 sm:text-[10px] sm:tracking-[0.34em]">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="text-center md:text-left">Olmos 74A, Tashkent</div>
            <Link href="/" className="justify-self-center flex items-center gap-3 text-ink">
              <img
                src="/diyor-logo.png"
                alt="Diyor Tashkent Hotel logo"
                className="h-10 w-auto object-contain sm:h-12 md:h-14"
              />
              <span className="font-display text-[20px] tracking-[0.14em] sm:text-[24px] sm:tracking-[0.18em] md:text-[30px]">
                DIYOR HOTEL
              </span>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:justify-end">
              <a href="tel:+9988858933333" className="transition hover:text-ink">
                +998 88 589 33 33
              </a>
              <LanguageSwitcher current={lang} />
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="inline-flex items-center gap-3 border border-[#d8cfc2] px-4 py-2.5 text-[9px] uppercase tracking-[0.24em] text-ink transition hover:bg-white/70 sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.28em]"
              >
                <span className="flex flex-col gap-1">
                  <span className="h-px w-4 bg-current" />
                  <span className="h-px w-4 bg-current" />
                  <span className="h-px w-4 bg-current" />
                </span>
                <span>{ui.trigger}</span>
              </button>
              <Link
                href="/booking"
                className="border border-ink bg-ink px-4 py-2.5 text-[9px] uppercase tracking-[0.24em] text-white transition hover:bg-[#2a241d] sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.28em]"
              >
                {bookingLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="shell flex items-center justify-between py-3 text-[9px] uppercase tracking-[0.22em] text-stone sm:py-4 sm:text-[11px] sm:tracking-[0.32em]">
          <div className="border-b border-[#d8cfc2] pb-1 text-ink">{activeLabel}</div>
          <div className="hidden items-center gap-6 md:flex">
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
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[80] transition duration-500 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0">
          <img
            src="/diyor-about.webp"
            alt="DIYOR Hotel menu background"
            className={`h-full w-full object-cover transition duration-700 ${
              menuOpen ? "scale-100" : "scale-105"
            }`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.48)_0%,rgba(15,12,10,0.32)_30%,rgba(15,12,10,0.74)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(219,179,109,0.18),transparent_38%)]" />
        </div>

        <div className="relative flex min-h-screen flex-col">
          <div className="shell flex items-center justify-between py-6 text-white sm:py-8">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <img
                src="/diyor-logo.png"
                alt="Diyor Tashkent Hotel logo"
                className="h-12 w-auto object-contain sm:h-16"
              />
              <span className="font-display text-xl tracking-[0.18em] sm:text-2xl md:text-3xl">DIYOR HOTEL</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-3 border border-white/40 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white backdrop-blur-sm transition hover:bg-white/16 sm:px-5 sm:py-3"
            >
              <span>{ui.close}</span>
              <span className="text-base leading-none">+</span>
            </button>
          </div>

          <div className="shell flex flex-1 items-center">
            <div className="grid w-full gap-10 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div
                className={`max-w-2xl text-white transition duration-700 ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
              >
                <div className="font-display text-4xl italic leading-none text-white/88 sm:text-5xl md:text-6xl">
                  {ui.welcome}
                </div>
                <div className="mt-3 font-display text-6xl uppercase leading-[0.9] tracking-[0.08em] sm:text-7xl md:text-8xl">
                  DIYOR
                </div>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/78 sm:text-base sm:leading-8">
                  {ui.spotlight}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/booking"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex min-w-[170px] items-center justify-center bg-white px-6 py-4 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-[#f4ede4]"
                  >
                    {bookingLabel}
                  </Link>
                </div>
              </div>

              <div
                className={`grid gap-6 text-white transition delay-75 duration-700 ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {nav.map((item, index) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`group border border-white/18 bg-white/8 p-5 backdrop-blur-sm transition hover:border-[#e2c38d] hover:bg-black/18 sm:p-6 ${
                          active ? "border-[#e2c38d] bg-black/20" : ""
                        }`}
                      >
                        <div className="text-[10px] uppercase tracking-[0.34em] text-white/56">
                          0{index + 1} / {ui.quickLabel}
                        </div>
                        <div className="mt-4 font-display text-3xl text-white sm:text-4xl">{item.label}</div>
                      </Link>
                    );
                  })}
                </div>

                <div className="grid gap-4 border-t border-white/15 pt-6 text-sm leading-7 text-white/78 md:grid-cols-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.34em] text-white/50">{ui.contactLabel}</div>
                    <a
                      href="tel:+9988858933333"
                      className="mt-3 block text-lg text-white transition hover:text-[#f2d39d]"
                    >
                      +998 88 589 33 33
                    </a>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.34em] text-white/50">{ui.addressLabel}</div>
                    <div className="mt-3 text-lg text-white/88">{copy.footer.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main>{children}</main>

      <footer className="mt-24 border-t border-[#d8cfc2] bg-[#f0e9df] py-12 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="section-label">DIYOR HOTEL</div>
            <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img
                src="/diyor-logo.png"
                alt="Diyor Tashkent Hotel logo"
                className="h-14 w-auto object-contain sm:h-16"
              />
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
                <a href="tel:+9988858933333" className="transition hover:text-ink">
                  +998 88 589 33 33
                </a>
                <a href="mailto:receptiondiyorhotel@gmail.com" className="transition hover:text-ink">
                  receptiondiyorhotel@gmail.com
                </a>
                <a href="https://t.me/diyor_hoteln11" className="transition hover:text-ink">
                  {copy.footer.telegram}
                </a>
                <a href="https://www.youtube.com/@Diyorhoteluz" className="transition hover:text-ink">
                  {copy.footer.youtube}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
