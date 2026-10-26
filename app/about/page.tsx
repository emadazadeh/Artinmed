import { BookingButton } from "@/components/booking-provider";
import { Icon, type IconName } from "@/components/icons";
import SiteFrame from "@/components/site-frame";
import StructuredData from "@/components/structured-data";
import { contact, founder } from "@/lib/brand";
import { services } from "@/lib/clinic-data";
import { pageMetadata, pageSchema } from "@/lib/site";

const title = "دکتر عماد آزاده، مدیر و مؤسس دکتر رسون";
const description = "با دکتر عماد آزاده، مدیر و مؤسس دکتر رسون، و مدل پزشک‌محور این مجموعه برای ویزیت آنلاین و هماهنگی مراقبت پزشکی در منزل آشنا شوید.";
export const metadata = pageMetadata(title, description, founder.path);

export default function AboutPage() {
  return <SiteFrame>
    <StructuredData data={pageSchema({ path: founder.path, title, description })} />
    <main id="main" tabIndex={-1}>
      <section className="section founder-section">
        <div className="container">
          <nav className="breadcrumbs" aria-label="مسیر صفحه"><a href="/">خانه</a><span aria-hidden="true">/</span><span aria-current="page">دربارهٔ دکتر رسون</span></nav>
          <div className="founder-grid">
            <div className="founder-copy"><span className="eyebrow">آشنایی با مدیر و مؤسس</span><h1>{founder.name}</h1><p className="founder-role">{founder.role}</p><p className="founder-intro">دکتر عماد آزاده، مدیر و مؤسس دکتر رسون است. دکتر رسون با مدل پزشک‌محور فعالیت می‌کند: ابتدا نیاز بیمار در ویزیت آنلاین بررسی می‌شود؛ سپس، بر اساس ارزیابی پزشک، برای خدمت و تیم درمانی مناسب هماهنگی انجام می‌شود.</p><p>این رویکرد، مبنای هر سه مسیر خدمات پزشکی، واکسیناسیون و بوتاکس در منزل است. در مسیر بوتاکس، معاینه و تزریق را خود پزشک انجام می‌دهد.</p><div className="founder-actions"><BookingButton>درخواست ویزیت آنلاین<Icon name="video" size={18} /></BookingButton><a className="button button-outline" href="/contact">ارتباط با دکتر رسون<Icon name="phone" size={18} /></a></div></div>
            <figure className="founder-portrait"><div><img src={founder.portrait} srcSet="/images/emad-azadeh-480.webp 480w, /images/emad-azadeh-768.webp 768w, /images/emad-azadeh-1024.webp 1024w" sizes="(max-width: 640px) 85vw, (max-width: 900px) 40vw, 420px" alt={`${founder.name}، ${founder.role}`} width="1024" height="1280" fetchPriority="high" decoding="async" /></div><figcaption>{founder.portraitCaption}</figcaption></figure>
          </div>
        </div>
      </section>
      <section className="section about-approach" aria-labelledby="approach-title"><div className="container"><div className="section-heading"><div><span className="eyebrow">رویکرد دکتر رسون</span><h2 id="approach-title">مراقبت، متناسب با <em>نیاز شما.</em></h2></div><p>از ارزیابی اولیه تا هماهنگی خدمت در منزل،<br />تصمیم دربارهٔ نیاز درمانی با پزشک است.</p></div><div className="approach-grid">
        <article><Icon name="video" size={28} /><h3>ابتدا ارزیابی پزشک</h3><p>انتخاب خدمت در فرم، شروع بررسی است. نیاز بیمار و مناسب بودن مراقبت در منزل در ویزیت پزشک ارزیابی می‌شوند.</p></article>
        <article><Icon name="stethoscope" size={28} /><h3>خدمت و تیم متناسب</h3><p>نوع خدمت و ترکیب تیم اعزامی بر اساس ارزیابی پزشک تعیین می‌شوند؛ تزریقات و سرم‌تراپی هم به بررسی پزشکی نیاز دارند.</p></article>
        <article><Icon name="phone" size={28} /><h3>هماهنگی پیش از ارائه</h3><p>زمان، امکان ارائه در محدودهٔ شما و هزینه پیش از هماهنگی نهایی مشخص می‌شوند. ثبت فرم، نوبت قطعی یا اعزام فوری نیست.</p></article>
      </div></div></section>
      <section className="section about-services" aria-labelledby="about-services-title"><div className="container"><h2 id="about-services-title">مسیرهای دریافت خدمت</h2><div className="about-service-links">{services.map(service => <a key={service.id} href={`/services/${service.id}`}><Icon name={service.icon as IconName} size={25} /><span>{service.name}</span><Icon name="arrow" size={18} /></a>)}</div><p className="about-contact-line">برای پرسش دربارهٔ خدمات و هماهنگی، <a href={contact.href}>با <bdi dir="ltr">{contact.phoneLabel}</bdi> تماس بگیرید.</a></p></div></section>
    </main>
  </SiteFrame>;
}
