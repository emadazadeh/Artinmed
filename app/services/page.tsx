import { BookingButton } from "@/components/booking-provider";
import { Icon, type IconName } from "@/components/icons";
import SiteFrame from "@/components/site-frame";
import StructuredData from "@/components/structured-data";
import { services } from "@/lib/clinic-data";
import { pageMetadata, pageSchema } from "@/lib/site";
import { upcomingServices } from "@/lib/upcoming-services";

const title = "خدمات دکتر رسون؛ تغذیه، ویزیت آنلاین و مراقبت در منزل";
const description = "خدمات دکتر رسون را مقایسه کنید: برنامه تغذیه و ورزش، ویزیت آنلاین پزشک، سرم‌تراپی و تیم درمانی در منزل، واکسیناسیون؛ جزئیات و ثبت درخواست هر خدمت.";
const questions = [
  ["برای شروع کدام خدمت را انتخاب کنم؟", "برای افزایش یا کاهش وزن و تناسب اندام، مسیر تغذیه و ورزش را انتخاب کنید. برای گفت‌وگو با پزشک، ویزیت آنلاین؛ برای بررسی مراقبت، تزریقات یا سرم‌تراپی در خانه، خدمات منزل؛ و برای بررسی نیاز به واکسن، مسیر واکسیناسیون مناسب موضوع درخواست شماست."],
  ["چگونه هزینه و امکان ارائهٔ خدمت را بدانم؟", "هزینه، زمان و امکان ارائه به نوع خدمت و شرایط شما بستگی دارد. پس از ثبت درخواست، جزئیات پیش از هماهنگی نهایی مشخص می‌شوند. برای پرسش دربارهٔ شرایط هم می‌توانید از صفحهٔ تماس با دکتر رسون اقدام کنید."],
  ["آیا خدمات زیبایی و نمونه‌گیری هم قابل درخواست‌اند؟", "هنوز خیر. آزمایش خون و نمونه‌گیری در منزل و خدمات زیبایی شامل مزوتراپی، بوتاکس و PRP در منزل در بخش به‌زودی هستند و در فرم درخواست فعال نشده‌اند."],
] as const;

export const metadata = pageMetadata(title, description, "/services");

export default function ServicesPage() {
  return <SiteFrame>
    <StructuredData data={pageSchema({ path: "/services", title, description, questions })} />
    <main id="main" tabIndex={-1}>
      <section className="section services-directory"><div className="container">
        <nav className="breadcrumbs" aria-label="مسیر صفحه"><a href="/">خانه</a><span aria-hidden="true">/</span><span aria-current="page">خدمات دکتر رسون</span></nav>
        <div className="directory-heading"><span className="eyebrow">چهار مسیر فعال برای مراقبت از شما</span><h1>خدمات دکتر رسون</h1><p>از برنامهٔ تغذیه و ورزش تا ویزیت آنلاین پزشک و مراقبت در منزل، مسیر متناسب با نیازتان را انتخاب کنید. پیش از ثبت درخواست، جزئیات هر خدمت و مراحل هماهنگی را بخوانید.</p></div>
        <div className="directory-grid">{services.map(service => <article className="directory-card" key={service.id}>
          <span className="service-icon"><Icon name={service.icon as IconName} size={30} /></span>
          <h2><a href={`/services/${service.id}`}>{service.name}</a></h2><p>{service.description}</p>
          <ul>{service.areas.map(area => <li key={area}>{area}</li>)}</ul>
          <p className="directory-note">{service.note}</p>
          <div className="directory-actions"><a className="text-link" href={`/services/${service.id}`}>راهنمای این خدمت<Icon name="arrow" size={18} /></a><BookingButton className="button button-green button-small" service={service.id} label={`ثبت درخواست ${service.name}`}>ثبت درخواست</BookingButton></div>
        </article>)}</div>
        <section className="upcoming-services" aria-labelledby="directory-upcoming"><div className="upcoming-heading"><div><span className="eyebrow" lang="en">COMING SOON</span><h2 id="directory-upcoming">خدمات در دست توسعه</h2></div><p>این خدمات هنوز قابل ثبت درخواست نیستند.</p></div><div className="upcoming-grid">{upcomingServices.map(service => <article className="upcoming-card" key={service.id}><span className="upcoming-icon"><Icon name={service.icon} size={27} /></span><div><div className="upcoming-card-heading"><h3>{service.name}</h3><span className="upcoming-status">به‌زودی</span></div><p>{service.description}</p></div></article>)}</div></section>
      </div></section>
      <section className="section faq-section" aria-labelledby="directory-faq"><div className="container faq-grid"><div><span className="eyebrow">انتخاب خدمت و هماهنگی</span><h2 id="directory-faq">پیش از ثبت درخواست</h2><p>برای پرسش دربارهٔ شرایط، <a className="text-link" href="/contact">با دکتر رسون در ارتباط باشید.</a></p></div><div className="faq-list">{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span className="faq-plus">+</span></summary><p>{answer}</p></details>)}</div></div></section>
    </main>
  </SiteFrame>;
}
