"use client";

import { useEffect, useRef, useState } from "react";
import { Brand, Icon } from "./icons";
import { BookingButton, TrackingButton } from "./booking-provider";

const links = [["/services", "خدمات دکتر رسون"], ["/calorie-counter", "کالری‌شمار"], ["/#workflow", "مسیر دریافت خدمت"], ["/about", "دربارهٔ دکتر رسون"], ["/contact", "تماس با ما"]] as const;

export default function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenu(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);

  return <header className="site-header" id="home">
    <div className="container nav-shell">
      <Brand />
      <nav className="desktop-nav" aria-label="منوی اصلی">{links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
      <div className="nav-actions">
        <TrackingButton className="nav-tracking"><Icon name="search" size={17} /><span>پیگیری درخواست</span></TrackingButton>
        <BookingButton className="button button-green button-small" label="ثبت درخواست"><Icon name="calendar" size={18} /><span>ثبت درخواست</span></BookingButton>
        <button ref={menuButton} type="button" className="menu-button icon-button" aria-label={menu ? "بستن منو" : "باز کردن منو"} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(value => !value)}><Icon name={menu ? "close" : "menu"} /></button>
      </div>
    </div>
    {menu && <nav className="mobile-nav" id="mobile-nav" aria-label="منوی موبایل" onClick={() => setMenu(false)}>
      {links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      <TrackingButton>پیگیری درخواست</TrackingButton>
      <a href="/privacy">حریم خصوصی</a>
    </nav>}
  </header>;
}
