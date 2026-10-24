import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "آرتین‌مد | ویزیت آنلاین پزشک و خدمات پزشکی در منزل",
  description: "ابتدا ویزیت آنلاین پزشک، سپس اعزام تیم درمانی متناسب با نیاز بیمار؛ خدمات پزشکی، واکسیناسیون و بوتاکس در منزل توسط پزشک.",
  applicationName: "Artinmed",
  robots: { index: false, follow: false },
  openGraph: { title: "آرتین‌مد | مراقبت در منزل با راهبری پزشک", description: "ویزیت آنلاین و هماهنگی تیم درمانی برای مراقبت در منزل، واکسیناسیون و بوتاکس توسط پزشک.", locale: "fa_IR", type: "website" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head><link rel="preload" href="/fonts/Vazirmatn.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head>
      <body>{children}</body>
    </html>
  );
}
