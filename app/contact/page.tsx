import { BookingButton, TrackingButton } from "@/components/booking-provider";
import { Icon } from "@/components/icons";
import SiteFrame from "@/components/site-frame";
import StructuredData from "@/components/structured-data";
import { contact } from "@/lib/brand";
import { pageMetadata, pageSchema } from "@/lib/site";

const title = "تماس با دکتر رسون";
const description = `تماس با دکتر رسون با شمارهٔ ${contact.phoneLabel} برای پرسش دربارهٔ خدمات و هماهنگی؛ یا ثبت و پیگیری آنلاین درخواست ویزیت پزشک و مراقبت در منزل.`;
export const metadata = pageMetadata(title, description, "/contact");

export default function ContactPage() {
  return <SiteFrame>
    <StructuredData data={pageSchema({ path: "/contact", title, description })} />
    <main id="main" tabIndex={-1} className="section contact-page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="مسیر صفحه"><a href="/">خانه</a><span aria-hidden="true">/</span><span aria-current="page">تماس با ما</span></nav>
        <div className="contact-page-heading"><span className="eyebrow">پرسش و هماهنگی خدمات</span><h1>با دکتر رسون <em>در ارتباط باشید.</em></h1><p>برای پرسش دربارهٔ خدمات و هماهنگی درخواست، تماس بگیرید یا مسیر آنلاین را انتخاب کنید.</p></div>
        <div className="contact-options-grid">
          <section className="phone-contact-card" aria-labelledby="phone-contact-title"><span className="contact-card-icon"><Icon name="phone" size={30} /></span><h2 id="phone-contact-title">تماس برای هماهنگی</h2><p>شمارهٔ تماس دکتر رسون</p><a className="contact-number" href={contact.href} aria-label={`تماس با دکتر رسون: ${contact.phoneLabel}`}><bdi dir="ltr">{contact.phoneLabel}</bdi><Icon name="arrow" size={24} /></a><span className="contact-card-note">برای پرسش دربارهٔ نوع خدمت، بررسی محدوده و هماهنگی درخواست</span></section>
          <section className="online-contact-card" aria-labelledby="online-contact-title"><span className="contact-card-icon"><Icon name="video" size={30} /></span><h2 id="online-contact-title">درخواست و پیگیری آنلاین</h2><p>برای درخواست جدید، خدمت، شهر و زمان ترجیحی ارتباط با پزشک را انتخاب کنید. پس از ثبت موفق، کد پیگیری دریافت می‌کنید.</p><BookingButton>درخواست ویزیت آنلاین<Icon name="arrow" size={18} /></BookingButton><TrackingButton className="text-link">پیگیری درخواست قبلی<Icon name="search" size={18} /></TrackingButton></section>
        </div>
        <section className="contact-help" aria-labelledby="contact-help-title"><h2 id="contact-help-title">پیش از هماهنگی</h2><div><p>نوع خدمت و شهر خود را آماده داشته باشید. اگر درخواست قبلی دارید، کد پیگیری و همان شمارهٔ همراه ثبت‌شده برای پیگیری آنلاین لازم است.</p><p>ثبت درخواست، آغاز بررسی و هماهنگی است؛ زمان ویزیت، امکان ارائه در محدودهٔ شما و هزینه پیش از هماهنگی نهایی مشخص می‌شوند.</p></div><a className="text-link" href="/privacy">اطلاعات فرم و حریم خصوصی<Icon name="arrow" size={18} /></a></section>
      </div>
    </main>
  </SiteFrame>;
}
