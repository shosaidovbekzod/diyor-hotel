"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { t, type Language } from "@/lib/i18n";

type MenuItem = {
  href: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

const menuUi = {
  en: {
    trigger: "Menu",
    close: "Close",
    welcome: "Welcome to",
    navigate: "Navigate",
    contact: "Direct line",
    address: "Address",
    openPage: "Open page",
    items: {
      home: {
        eyebrow: "Arrival",
        title: "DIYOR Hotel",
        description:
          "A composed city stay in Tashkent with direct booking, elegant rooms, and hotel service designed to feel personal.",
        image: "/diyor-hero-poster.webp"
      },
      rooms: {
        eyebrow: "Collection",
        title: "Rooms",
        description:
          "Review signature room types, compare layouts, and move straight into the reservation flow without leaving the hotel site.",
        image: "/diyor-about.webp"
      },
      booking: {
        eyebrow: "Reservation",
        title: "Book your stay",
        description:
          "Confirm dates, guests, and stay preferences in one clean booking flow with direct hotel pricing.",
        image: "/diyor-hero-poster.webp"
      },
      account: {
        eyebrow: "Guest area",
        title: "Account",
        description:
          "Keep your profile ready, review reservations, and manage booking history from a dedicated guest cabinet.",
        image: "/diyor-about.webp"
      },
      admin: {
        eyebrow: "Operations",
        title: "Admin",
        description:
          "Monitor bookings, room inventory, arrivals, and staff-facing hotel operations from the control panel.",
        image: "/diyor-hero-poster.webp"
      }
    }
  },
  uz: {
    trigger: "Menyu",
    close: "Yopish",
    welcome: "Xush kelibsiz",
    navigate: "Bo'limlar",
    contact: "To'g'ridan-to'g'ri aloqa",
    address: "Manzil",
    openPage: "Sahifani ochish",
    items: {
      home: {
        eyebrow: "Kelish",
        title: "DIYOR Hotel",
        description:
          "Toshkentdagi sokin va nafis turar joy tajribasi shu yerdan boshlanadi: to'g'ridan-to'g'ri bron, chiroyli xonalar va e'tiborli xizmat.",
        image: "/diyor-hero-poster.webp"
      },
      rooms: {
        eyebrow: "To'plam",
        title: "Xonalar",
        description:
          "Asosiy xona turlarini ko'ring, rejalarni solishtiring va mehmonxonaning o'z saytida qolgan holda bron oqimiga o'ting.",
        image: "/diyor-about.webp"
      },
      booking: {
        eyebrow: "Bandlov",
        title: "Turar joyni bron qiling",
        description:
          "Sana, mehmonlar soni va istaklarni bitta toza booking jarayonida tasdiqlang va to'g'ridan-to'g'ri mehmonxona narxidan foydalaning.",
        image: "/diyor-hero-poster.webp"
      },
      account: {
        eyebrow: "Mehmon hududi",
        title: "Kabinet",
        description:
          "Profilingizni tayyor saqlang, bronlaringizni ko'ring va turar joy tarixini bitta qulay kabinetdan boshqaring.",
        image: "/diyor-about.webp"
      },
      admin: {
        eyebrow: "Boshqaruv",
        title: "Admin",
        description:
          "Bronlar, xona inventari, kelishlar va ichki operatsiyalarni admin nazorat panelidan kuzating.",
        image: "/diyor-hero-poster.webp"
      }
    }
  },
  ru: {
    trigger: "Меню",
    close: "Закрыть",
    welcome: "Welcome to",
    navigate: "Navigate",
    contact: "Direct line",
    address: "Address",
    openPage: "Open page",
    items: {
      home: {
        eyebrow: "Arrival",
        title: "DIYOR Hotel",
        description:
          "A composed city stay in Tashkent with direct booking, elegant rooms, and hotel service designed to feel personal.",
        image: "/diyor-hero-poster.webp"
      },
      rooms: {
        eyebrow: "Collection",
        title: "Rooms",
        description:
          "Review signature room types, compare layouts, and move straight into the reservation flow without leaving the hotel site.",
        image: "/diyor-about.webp"
      },
      booking: {
        eyebrow: "Reservation",
        title: "Book your stay",
        description:
          "Confirm dates, guests, and stay preferences in one clean booking flow with direct hotel pricing.",
        image: "/diyor-hero-poster.webp"
      },
      account: {
        eyebrow: "Guest area",
        title: "Account",
        description:
          "Keep your profile ready, review reservations, and manage booking history from a dedicated guest cabinet.",
        image: "/diyor-about.webp"
      },
      admin: {
        eyebrow: "Operations",
        title: "Admin",
        description:
          "Monitor bookings, room inventory, arrivals, and staff-facing hotel operations from the control panel.",
        image: "/diyor-hero-poster.webp"
      }
    }
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
  const bookingLabel = {
    en: "Book now",
    uz: "Bandlov",
    ru: "Р‘СЂРѕРЅРёСЂРѕРІР°РЅРёРµ"
  }[lang];
  const currentMenuHref = getActiveMenuHref(pathname);
  const [previewHref, setPreviewHref] = useState(currentMenuHref);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        href: "/",
        label: copy.nav.home,
        eyebrow: ui.items.home.eyebrow,
        title: ui.items.home.title,
        description: ui.items.home.description,
        image: ui.items.home.image
      },
      {
        href: "/rooms",
        label: copy.nav.rooms,
        eyebrow: ui.items.rooms.eyebrow,
        title: ui.items.rooms.title,
        description: ui.items.rooms.description,
        image: ui.items.rooms.image
      },
      {
        href: "/booking",
        label: bookingLabel,
        eyebrow: ui.items.booking.eyebrow,
        title: ui.items.booking.title,
        description: ui.items.booking.description,
        image: ui.items.booking.image
      },
      {
        href: "/account",
        label: copy.nav.account,
        eyebrow: ui.items.account.eyebrow,
        title: ui.items.account.title,
        description: ui.items.account.description,
        image: ui.items.account.image
      },
      {
        href: "/admin",
        label: copy.nav.admin,
        eyebrow: ui.items.admin.eyebrow,
        title: ui.items.admin.title,
        description: ui.items.admin.description,
        image: ui.items.admin.image
      }
    ],
    [bookingLabel, copy.nav.account, copy.nav.admin, copy.nav.home, copy.nav.rooms, ui.items.account, ui.items.admin, ui.items.booking, ui.items.home, ui.items.rooms]
  );

  const preview = menuItems.find((item) => item.href === previewHref) ?? menuItems[0];
  const previewIndex = Math.max(
    0,
    menuItems.findIndex((item) => item.href === preview.href)
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setPreviewHref(currentMenuHref);
  }, [currentMenuHref, menuOpen]);

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
          <div className="border-b border-[#d8cfc2] pb-1 text-ink">
            {menuItems.find((item) => item.href === currentMenuHref)?.label ?? copy.nav.home}
          </div>
          <div className="hidden items-center gap-6 md:flex">
            {menuItems.map((item) => {
              const active = currentMenuHref === item.href;
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
        className={`fixed inset-0 z-[90] transition duration-500 ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative grid min-h-screen lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="flex flex-col bg-[#171616]/96 text-white">
            <div className="border-b border-white/10 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <img
                    src="/diyor-logo.png"
                    alt="Diyor Tashkent Hotel logo"
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
              <div className="mt-6 text-[10px] uppercase tracking-[0.34em] text-white/42">{ui.navigate}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const active = preview.href === item.href;
                  const current = currentMenuHref === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      onMouseEnter={() => setPreviewHref(item.href)}
                      onFocus={() => setPreviewHref(item.href)}
                      className={`group flex items-center justify-between border-b border-white/8 py-4 text-base uppercase tracking-[0.08em] transition sm:text-lg ${
                        active ? "text-white" : "text-white/82 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`text-lg transition ${
                          current ? "translate-x-0 text-[#dfc188]" : "translate-x-0 text-white/28 group-hover:translate-x-1 group-hover:text-[#dfc188]"
                        }`}
                      >
                        ›
                      </span>
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
            </div>
          </aside>

          <section className="relative min-h-[52vh] overflow-hidden lg:min-h-screen">
            <img
              src={preview.image}
              alt={preview.title}
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                menuOpen ? "scale-100" : "scale-105"
              }`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.58)_34%,rgba(14,13,11,0.18)_100%)]" />
            <div className="absolute inset-y-0 left-[42%] hidden w-px bg-white/34 lg:block" />
            <div className="absolute inset-y-0 left-[70%] hidden w-px bg-white/24 xl:block" />
            <div className="absolute right-8 top-8 text-sm uppercase tracking-[0.26em] text-white/86">
              {lang.toUpperCase()}
            </div>

            <div className="relative flex min-h-[52vh] items-center lg:min-h-screen">
              <div className="shell w-full">
                <div className="max-w-[760px] px-2 py-12 sm:px-6 lg:px-12">
                  <div className="text-[10px] uppercase tracking-[0.34em] text-white/58">{preview.eyebrow}</div>
                  <div className="mt-8 font-display text-4xl italic leading-none text-white/92 sm:text-5xl md:text-6xl">
                    {ui.welcome}
                  </div>
                  <h2 className="mt-3 font-display text-6xl leading-[0.9] text-white sm:text-7xl md:text-[6.8rem]">
                    {preview.title}
                  </h2>
                  <p className="mt-8 max-w-xl text-base leading-8 text-white/88 sm:text-lg">
                    {preview.description}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <Link
                      href={preview.href}
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex min-w-[200px] items-center justify-center bg-white px-7 py-4 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-[#f5ecdf]"
                    >
                      {ui.openPage}
                    </Link>
                    <Link
                      href="/booking"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex min-w-[200px] items-center justify-center border border-white/35 bg-black/12 px-7 py-4 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm transition hover:bg-black/20"
                    >
                      {bookingLabel}
                    </Link>
                  </div>

                  <div className="mt-12 flex items-center gap-5 text-white/92">
                    <span className="text-4xl leading-none">‹</span>
                    <span className="text-xl tracking-[0.2em]">
                      {previewIndex + 1} / {menuItems.length}
                    </span>
                    <span className="text-4xl leading-none">›</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
