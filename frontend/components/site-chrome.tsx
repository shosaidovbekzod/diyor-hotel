"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { t, type Language } from "@/lib/i18n";

type MenuItem = {
  href: string;
  label: string;
  description: string;
};

const menuUi = {
  en: {
    trigger: "Menu",
    close: "Close",
    sections: "Sections",
    contact: "Direct line",
    address: "Address"
  },
  uz: {
    trigger: "Menyu",
    close: "Yopish",
    sections: "Bo'limlar",
    contact: "To'g'ridan-to'g'ri aloqa",
    address: "Manzil"
  },
  ru: {
    trigger: "Меню",
    close: "Закрыть",
    sections: "Разделы",
    contact: "Прямая линия",
    address: "Адрес"
  }
} as const;

function getActiveMenuHref(pathname: string) {
  if (pathname.startsWith("/rooms")) {
    return "/rooms";
  }
  if (pathname.startsWith("/booking")) {
    return "/booking";
  }
  if (pathname.startsWith("/account")) {
    return "/account";
  }
  if (pathname.startsWith("/admin")) {
    return "/admin";
  }
  return "/";
}

export function SiteChrome({ children, lang }: { children: React.ReactNode; lang: Language }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = t(lang);
  const ui = menuUi[lang];
  const bookingLabel = copy.nav.booking;
  const activeHref = getActiveMenuHref(pathname);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        href: "/",
        label: copy.nav.home,
        description:
          lang === "uz"
            ? "Mehmonxonaning asosiy sahifasi va asosiy takliflari."
            : lang === "ru"
              ? "Главная страница отеля и основные предложения."
              : "Main hotel page and core offers."
      },
      {
        href: "/rooms",
        label: copy.nav.rooms,
        description:
          lang === "uz"
            ? "Xonalar turlari, qulayliklar va narxlar."
            : lang === "ru"
              ? "Категории номеров, удобства и цены."
              : "Room categories, amenities, and pricing."
      },
      {
        href: "/booking",
        label: bookingLabel,
        description:
          lang === "uz"
            ? "Sanalarni tanlab bron oqimiga o'ting."
            : lang === "ru"
              ? "Выберите даты и перейдите к бронированию."
              : "Choose dates and enter the booking flow."
      },
      {
        href: "/account",
        label: copy.nav.account,
        description:
          lang === "uz"
            ? "Profil, bron tarixi va boshqaruv."
            : lang === "ru"
              ? "Профиль, история бронирований и управление."
              : "Profile, booking history, and controls."
      },
      {
        href: "/admin",
        label: copy.nav.admin,
        description:
          lang === "uz"
            ? "Admin panel va ichki boshqaruv."
            : lang === "ru"
              ? "Панель администратора и внутреннее управление."
              : "Admin panel and internal controls."
      }
    ],
    [bookingLabel, copy.nav.account, copy.nav.admin, copy.nav.home, copy.nav.rooms, lang]
  );

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
        <div className="shell py-3 text-[9px] uppercase tracking-[0.26em] text-stone sm:py-4 sm:text-[10px] sm:tracking-[0.34em]">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden min-w-[180px] md:block">Olmos 74A, Tashkent</div>
            <Link href="/" className="flex items-center gap-3 text-ink md:absolute md:left-1/2 md:-translate-x-1/2">
              <img
                src="/hotel-tashkent-logo.svg"
                alt="Hotel Tashkent logo"
                className="h-10 w-auto object-contain sm:h-12 md:h-14"
              />
              <span className="font-display text-[20px] tracking-[0.14em] sm:text-[24px] sm:tracking-[0.18em] md:text-[30px]">
                HOTEL TASHKENT
              </span>
            </Link>

            <div className="ml-auto flex flex-wrap items-center justify-end gap-3 sm:gap-5">
              <a href="tel:+9988858933333" className="hidden transition hover:text-ink lg:inline">
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
      </header>

      <div
        className={`fixed inset-0 z-[90] transition duration-300 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label={ui.close}
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/45 backdrop-blur-md"
        />

        <aside className="relative z-10 flex min-h-screen w-full max-w-[360px] flex-col bg-[#171412]/98 text-white shadow-[22px_0_70px_rgba(0,0,0,0.42)]">
          <div className="border-b border-white/10 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                <img
                  src="/hotel-tashkent-logo.svg"
                  alt="Hotel Tashkent logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-xl text-white/88 transition hover:bg-white/8"
              >
                ×
              </button>
            </div>
            <div className="mt-6 text-[10px] uppercase tracking-[0.34em] text-white/42">{ui.sections}</div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-8">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-[18px] border px-4 py-4 transition ${
                      active
                        ? "border-[#dfc188] bg-white/8 text-white"
                        : "border-white/8 text-white/82 hover:border-white/18 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base uppercase tracking-[0.08em]">{item.label}</span>
                      <span className={`text-lg ${active ? "text-[#dfc188]" : "text-white/35"}`}>›</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/58">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/10 p-6 text-sm leading-7 text-white/72 sm:p-8">
            <div className="text-[10px] uppercase tracking-[0.34em] text-white/40">{ui.contact}</div>
            <a href="tel:+9988858933333" className="mt-3 block text-lg text-white transition hover:text-[#dfc188]">
              +998 88 589 33 33
            </a>
            <div className="mt-6 text-[10px] uppercase tracking-[0.34em] text-white/40">{ui.address}</div>
            <div className="mt-3 text-white/78">{copy.footer.address}</div>
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="editorial-button mt-6 w-full justify-center"
            >
              {bookingLabel}
            </Link>
          </div>
        </aside>
      </div>

      <main>{children}</main>

      <footer className="mt-24 border-t border-[#d8cfc2] bg-[#f0e9df] py-12 sm:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="section-label">{copy.footer.title}</div>
            <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img
                src="/hotel-tashkent-logo.svg"
                alt="Hotel Tashkent logo"
                className="h-14 w-auto object-contain sm:h-16"
              />
              <h2 className="max-w-2xl font-display text-3xl leading-[0.98] text-ink sm:text-4xl">
                {copy.footer.tagline}
              </h2>
            </div>
          </div>
          <div className="grid gap-8 text-sm text-ink/75 md:grid-cols-2">
            <div className="border-t border-[#d8cfc2] pt-4">
              <div className="section-label">{copy.footer.visit}</div>
              <p className="mt-4 max-w-xs leading-7">{copy.footer.address}</p>
            </div>
            <div className="border-t border-[#d8cfc2] pt-4">
              <div className="section-label">{copy.footer.contact}</div>
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
