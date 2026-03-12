import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";
import { getServerLanguage } from "@/lib/i18n-server";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIYOR HOTEL - TASHKENT",
  description: "Luxury hotel booking platform for DIYOR HOTEL in Tashkent."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getServerLanguage();

  return (
    <html lang={lang}>
      <body>
        <SiteChrome lang={lang}>{children}</SiteChrome>
      </body>
    </html>
  );
}
