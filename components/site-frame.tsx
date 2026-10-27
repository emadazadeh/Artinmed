import type { ReactNode } from "react";
import { services } from "@/lib/clinic-data";
import { contact, founder } from "@/lib/brand";
import { BookingButton, BookingProvider, TrackingButton } from "./booking-provider";
import { Brand, Icon } from "./icons";
import SiteHeader from "./site-header";

export default function SiteFrame({ children }: { children: ReactNode }) {
  return <BookingProvider><div className="home-care-page">
    <a className="skip-link" href="#main">رفتن به محتوای اصلی</a>
    <div className="announcement"><Icon name="stethoscope" size={15} /><span>تغذیه و ورزش، ویزیت پزشک و مراقبت در منزل</span><span className="announcement-en" lang="en">PERSONAL CARE, BUILT AROUND YOU</span></div>
    <SiteHeader />
    {children}
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand"><Brand light /><p>مراقبت حرفه‌ای، متناسب با شما.</p><a className="footer-founder" href={founder.path}>{founder.name} · مدیر و مؤسس</a></div>
        <nav className="footer-links" aria-label="پیوندهای سایت"><a href="/services">همهٔ خدمات دکتر رسون</a>{services.map(service => <a key={service.id} href={`/services/${service.id}`}>{service.name}</a>)}<a href={founder.path}>دربارهٔ دکتر رسون</a><a href="/contact">تماس با ما</a><TrackingButton>پیگیری درخواست</TrackingButton></nav>
        <div className="footer-contact"><a className="footer-phone" href={contact.href} aria-label={`تماس با دکتر رسون: ${contact.phoneLabel}`}><Icon name="phone" size={21} /><bdi dir="ltr">{contact.phoneLabel}</bdi></a><span>تماس برای هماهنگی و پرسش دربارهٔ خدمات</span><div className="footer-note"><Icon name="shield" size={22} /><p>هر مسیر، متناسب با نیاز شما.<small>ثبت درخواست به معنی اعزام فوری یا تأیید نهایی نیست.</small></p></div></div>
      </div>
      <div className="container care-scope-note">این سامانه برای خدمات غیراورژانسی است. در وضعیت اورژانسی، برای رسیدگی فوری با اورژانس تماس بگیرید.</div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} دکتر رسون. تمامی حقوق محفوظ است.</span><a href="/privacy">حریم خصوصی</a><span lang="en">MEDICAL CARE, AROUND YOU</span></div>
    </footer>
    <div className="mobile-booking"><BookingButton><Icon name="calendar" size={19} />ثبت درخواست<Icon name="arrow" size={18} /></BookingButton><TrackingButton className="mobile-track" label="پیگیری درخواست"><Icon name="search" size={22} /></TrackingButton></div>
  </div></BookingProvider>;
}
