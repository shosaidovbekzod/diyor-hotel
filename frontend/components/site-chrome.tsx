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
        <div className="shell py-3 text-[11px] uppercase tracking-[0.28em] text-stone">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>DIYOR HOTEL - TASHKENT</div>
            <div className="flex items-center gap-5">
              <a href="tel:+9988858933333" className="transition hover:text-ink">+998 88 589 33 33</a>
              <LanguageSwitcher current={lang} />
            </div>
          </div>
        </div>
        <div className="shell py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="font-display text-4xl tracking-[0.18em] text-ink">
              DIYOR
            </Link>
            <nav className="flex flex-wrap gap-5 text-sm uppercase tracking-[0.28em] text-stone">
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
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-[#d8cfc2] bg-[#efe8dd] py-14">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="section-label">DIYOR HOTEL</div>
            <h2 className="mt-4 max-w-xl font-display text-4xl text-ink">
              Premium hospitality in Tashkent, shaped around calm stays and restorative service.
            </h2>
          </div>
          <div className="grid gap-6 text-sm text-ink/75 md:grid-cols-2">
            <div>
              <div className="section-label">Visit</div>
              <p className="mt-3 max-w-xs">{copy.footer.address}</p>
            </div>
            <div>
              <div className="section-label">Contact</div>
              <div className="mt-3 flex flex-col gap-2">
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
