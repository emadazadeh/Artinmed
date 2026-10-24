import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "آرتین‌مد | زیبایی به ظرافت علم",
  description: "آرتین‌مد؛ آشنایی با خدمات پوست و زیبایی، آینهٔ تعاملی و ثبت درخواست مشاوره و نوبت آنلاین.",
  applicationName: "Artinmed",
  robots: { index: false, follow: false },
  openGraph: { title: "آرتین‌مد | زیبایی به ظرافت علم", description: "فضایی برای انتخاب آگاهانه و زیبایی طبیعی شما.", locale: "fa_IR", type: "website" },
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
