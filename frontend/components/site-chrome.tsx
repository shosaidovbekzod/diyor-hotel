"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/40 bg-[#171717]/85 text-white backdrop-blur-xl">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/" className="font-display text-xl tracking-[0.25em]">
            DIYOR HOTEL
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={lang} />
            <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className="relative rounded-full px-4 py-2 text-white/80 transition hover:text-white">
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-champagne"
                        transition={{ type: "spring", stiffness: 260, damping: 24 }}
                      />
                    )}
                    <span className={`relative z-10 ${active ? "text-ink" : ""}`}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-20 border-t border-ink/10 py-10 text-sm text-ink/70">
        <div className="shell flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-lg text-ink">{copy.footer.title}</div>
            <div>{copy.footer.address}</div>
          </div>
          <div className="flex flex-col gap-1 md:items-end">
            <a href="tel:+9988858933333" className="hover:text-ink">+998 88 589 33 33</a>
            <a href="https://t.me/diyor_tashkent_hotel" className="hover:text-ink">{copy.footer.telegram}</a>
            <a href="https://www.youtube.com/@Diyorhoteluz" className="hover:text-ink">{copy.footer.youtube}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
