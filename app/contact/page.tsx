import { BookingButton, TrackingButton } from "@/components/booking-provider";
import { Icon } from "@/components/icons";
import SiteFrame from "@/components/site-frame";
import StructuredData from "@/components/structured-data";
import ContactChannels from "@/components/contact-channels";
import { contact } from "@/lib/brand";
import { pageMetadata, pageSchema } from "@/lib/site";

const title = "تماس و هماهنگی خدمات دکتر رسون";
const description = `ارتباط با دکتر رسون از طریق تلگرام doctorreson، اینستاگرام doctorreson.ir، واتساپ و تماس با ${contact.phoneLabel}؛ پرسش دربارهٔ خدمات، ثبت و پیگیری درخواست.`;
export const metadata = pageMetadata(title, description, "/contact");

export default function ContactPage() {
  return <SiteFrame>
    <StructuredData data={pageSchema({ path: "/contact", title, description })} />
    <main id="main" tabIndex={-1} className="section contact-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="مسیر صفحه"><a href="/">خانه</a><span aria-hidden="true">/</span><span aria-current="page">تماس با ما</span></nav>
        <div className="contact-page-heading"><span className="eyebrow">پرسش و هماهنگی خدمات</span><h1>با دکتر رسون <em>در ارتباط باشید.</em></h1><p>از تلگرام و واتساپ تا تماس و اینستاگرام؛ راهی را انتخاب کنید که برایتان راحت‌تر است.</p></div>
        <section className="contact-channel-section" aria-labelledby="channels-title"><h2 id="channels-title">راه‌های ارتباط با ما</h2><ContactChannels /></section>
        <section className="online-contact-card contact-online-request" aria-labelledby="online-contact-title"><span className="contact-card-icon"><Icon name="calendar" size={30} /></span><h2 id="online-contact-title">درخواست و پیگیری آنلاین</h2><p>برای درخواست جدید، خدمت، شهر و زمان ترجیحی تماس و هماهنگی را انتخاب کنید. پس از ثبت موفق، کد پیگیری دریافت می‌کنید.</p><BookingButton>ثبت درخواست<Icon name="arrow" size={18} /></BookingButton><TrackingButton className="text-link">پیگیری درخواست قبلی<Icon name="search" size={18} /></TrackingButton></section>
        <section className="contact-help" aria-labelledby="contact-help-title"><h2 id="contact-help-title">پیش از هماهنگی</h2><div><p>نوع خدمت و شهر خود را آماده داشته باشید. اگر درخواست قبلی دارید، کد پیگیری و همان شمارهٔ همراه ثبت‌شده برای پیگیری آنلاین لازم است.</p><p>ثبت درخواست، آغاز بررسی و هماهنگی است؛ زمان ویزیت، امکان ارائه در محدودهٔ شما و هزینه پیش از هماهنگی نهایی مشخص می‌شوند.</p></div><a className="text-link" href="/privacy">اطلاعات فرم و حریم خصوصی<Icon name="arrow" size={18} /></a></section>
      </div>
    </main>
  </SiteFrame>;
}
