import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingButton } from "@/components/booking-provider";
import { Icon, type IconName } from "@/components/icons";
import SiteFrame from "@/components/site-frame";
import StructuredData from "@/components/structured-data";
import { services } from "@/lib/clinic-data";
import { serviceGuides } from "@/lib/service-guides";
import { pageMetadata, pageSchema } from "@/lib/site";

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service: id } = await params;
  const service = services.find(service => service.id === id);
  if (!service) return { title: "خدمت پیدا نشد", robots: { index: false } };
  const guide = serviceGuides[service.id];
  return pageMetadata(guide.title, guide.description, `/services/${service.id}`);
}

export default async function ServicePage({ params }: Props) {
  const { service: id } = await params;
  const service = services.find(service => service.id === id);
  if (!service) notFound();
  const guide = serviceGuides[service.id];
  return <SiteFrame>
    <StructuredData data={pageSchema({ path: `/services/${service.id}`, title: guide.title, description: guide.description, serviceId: service.id, questions: guide.questions })} />
    <main id="main" tabIndex={-1}>
      <section className="service-hero section">
        <div className="container">
          <nav className="breadcrumbs" aria-label="مسیر صفحه"><a href="/">خانه</a><span aria-hidden="true">/</span><a href="/#services">خدمات در منزل</a><span aria-hidden="true">/</span><span aria-current="page">{service.name}</span></nav>
          <div className="service-hero-grid">
            <div><span className="eyebrow" lang="en">{service.english}</span><h1>{guide.title}</h1><p className="service-lead">{guide.intro}</p><BookingButton service={service.id}>درخواست ویزیت برای این خدمت<Icon name="arrow" size={19} /></BookingButton><p className="request-note">ثبت درخواست، آغاز ارزیابی و هماهنگی است؛ نوبت قطعی یا اعزام فوری ایجاد نمی‌کند.</p></div>
            <aside className="service-overview" aria-label="خلاصهٔ مسیر خدمت"><span className="service-overview-icon"><Icon name={service.icon as IconName} size={42} /></span><h2>مسیر دریافت این خدمت</h2><ul>{service.areas.map(area => <li key={area}><Icon name="check" size={18} />{area}</li>)}</ul><p><Icon name="stethoscope" size={20} />{service.note}</p></aside>
          </div>
        </div>
      </section>
      <section className="section service-guide" aria-labelledby="guide-title"><div className="container service-content-grid">
        <div><span className="eyebrow">پیش از تصمیم‌گیری</span><h2 id="guide-title">این خدمت چگونه هماهنگ می‌شود؟</h2><p>{service.details}</p><h3>{guide.preparationTitle}</h3><ul className="preparation-list">{guide.preparation.map(item => <li key={item}>{item}</li>)}</ul></div>
        <aside className="service-coordination"><Icon name="video" size={30} /><h3>از گفت‌وگو با پزشک شروع کنید</h3><p>خدمت، شهر و زمان ترجیحی را ثبت کنید. پس از ثبت موفق، کد پیگیری دریافت می‌کنید و می‌توانید با کد و شمارهٔ همراه، وضعیت درخواست را ببینید.</p><a href="/#workflow" className="text-link">آشنایی با مراحل دریافت خدمت<Icon name="arrow" size={18} /></a><a href="/privacy" className="privacy-link">اطلاعات فرم چگونه استفاده می‌شوند؟</a></aside>
      </div></section>
      <section className="section faq-section" aria-labelledby="service-faq-title"><div className="container faq-grid"><div><span className="eyebrow">پرسش‌های مربوط به این خدمت</span><h2 id="service-faq-title">پیش از ثبت درخواست،<br /><em>بیشتر بدانید.</em></h2></div><div className="faq-list">{guide.questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span className="faq-plus">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="section related-services" aria-labelledby="related-title"><div className="container"><h2 id="related-title">مسیرهای دیگر مراقبت در منزل</h2><div className="related-grid">{services.filter(other => other.id !== service.id).map(other => <a href={`/services/${other.id}`} key={other.id}><Icon name={other.icon as IconName} size={25} /><div><h3>{other.name}</h3><p>{other.description}</p></div><Icon name="arrow" size={19} /></a>)}</div></div></section>
    </main>
  </SiteFrame>;
}
