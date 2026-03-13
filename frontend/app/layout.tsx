import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { getServerLanguage } from "@/lib/i18n-server";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "DIYOR HOTEL - TASHKENT",
  description: "Luxury hotel booking platform for DIYOR HOTEL in Tashkent."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getServerLanguage();

  return (
    <html lang={lang}>
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <SiteChrome lang={lang}>{children}</SiteChrome>
      </body>
    </html>
  );
}
