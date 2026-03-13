"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { t, type Language } from "@/lib/i18n";

export function SiteChrome({ children, lang }: { children: React.ReactNode; lang: Language }) {
  const pathname = usePathname();
  const copy = t(lang);
  const nav = [
    { href: "/", label: copy.nav.home },
    { href: "/rooms", label: copy.nav.rooms },
    { href: "/account", label: copy.nav.account },
    { href: "/admin", label: copy.nav.admin }
  ];

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-50 border-b border-[#d8cfc2] bg-sand/95 backdrop-blur-xl">
        <div className="shell border-b border-[#d8cfc2] py-3 text-[10px] uppercase tracking-[0.34em] text-stone">
          <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div className="text-left">Olmos 74A, Tashkent</div>
            <Link href="/" className="justify-self-center font-display text-[28px] tracking-[0.22em] text-ink md:text-[34px]">
              DIYOR HOTEL
            </Link>
            <div className="flex items-center justify-end gap-5">
              <a href="tel:+9988858933333" className="transition hover:text-ink">+998 88 589 33 33</a>
              <LanguageSwitcher current={lang} />
            </div>
          </div>
        </div>
        <div className="shell py-4">
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.32em] text-stone">
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

      <footer className="mt-24 border-t border-[#d8cfc2] bg-[#f0e9df] py-16">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="section-label">DIYOR HOTEL</div>
            <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.98] text-ink">
              Calm city hospitality with an editorial, residence-style sense of luxury.
            </h2>
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
                <a href="https://t.me/diyor_tashkent_hotel" className="transition hover:text-ink">{copy.footer.telegram}</a>
                <a href="https://www.youtube.com/@Diyorhoteluz" className="transition hover:text-ink">{copy.footer.youtube}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
