import { services, faqs } from "@/lib/clinic-data";
import { pageSchema, site } from "@/lib/site";
import { contact, founder } from "@/lib/brand";
import { upcomingServices } from "@/lib/upcoming-services";
import { Icon, type IconName } from "./icons";
import { BookingButton } from "./booking-provider";
import SiteFrame from "./site-frame";
import StructuredData from "./structured-data";

const careSteps = [
  { number: "۰۱", icon: "leaf", title: "مسیر خودتان را انتخاب کنید", text: "خدمت موردنظر و زمان ترجیحی تماس را ثبت کنید و کد پیگیری بگیرید." },
  { number: "۰۲", icon: "stethoscope", title: "نیاز شما بررسی می‌شود", text: "هدف و شرایط شما بررسی می‌شود؛ در خدمات درمانی، ارزیابی پزشک مبنای ادامهٔ مسیر است." },
  { number: "۰۳", icon: "check", title: "با هماهنگی، قدم بعدی را بردارید", text: "زمان، هزینه و شرایط برنامه یا خدمت، پیش از ارائه با شما هماهنگ و تأیید می‌شود." },
] as const;

export default function ClinicHome() {
  return <SiteFrame>
    <StructuredData data={pageSchema({ path: "/", title: site.title, description: site.description, questions: faqs })} />
    <main id="main" tabIndex={-1} className="personal-care-home">
      <section className="hero section" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-heading"><div className="eyebrow"><span className="tiny-line" />سلامت، با توجهی که شایستهٔ شماست</div><h1 id="hero-title">مراقبت حرفه‌ای،<br /><span className="word-gold">متناسب با شما.</span></h1></div>
          <figure className="hero-visual">
            <div className="hero-image-frame"><img src={founder.portrait} srcSet={founder.portraitSrcSet} sizes="(max-width: 640px) min(330px, 82vw), (max-width: 900px) 42vw, 440px" decoding="async" loading="eager" alt={`${founder.name}، ${founder.role}؛ پرترهٔ ویرایش‌شده با هوش مصنوعی`} width="1024" height="1280" fetchPriority="high" /></div>
            <div className="image-card"><span className="image-card-icon"><Icon name="stethoscope" size={28} /></span><div><a href={founder.path}>{founder.name}</a><small>{founder.role}</small></div><a className="portrait-about" href={founder.path} aria-label="آشنایی با دکتر عماد آزاده"><Icon name="arrow" size={20} /></a></div>
            <figcaption className="concept-caption">پرترهٔ دکتر عماد آزاده؛ ویرایش با هوش مصنوعی.</figcaption>
          </figure>
          <div className="hero-copy"><p className="hero-description">از برنامهٔ تغذیه و ورزش تا ویزیت پزشک و مراقبت در منزل؛ مسیر مناسب خودتان را انتخاب کنید. برای بررسی نیاز و هماهنگی خدمت، همراه شما هستیم.</p><div className="hero-buttons"><BookingButton>ثبت درخواست<Icon name="arrow" size={19} /></BookingButton><a className="button button-outline" href="#services">انتخاب مسیر مراقبت<Icon name="arrow-down" size={18} /></a></div><div className="hero-reassurance"><span><Icon name="check" size={16} />متناسب با شرایط شما</span><span><Icon name="lock" size={16} />ثبت و پیگیری آنلاین</span></div></div>
        </div>
        <div className="container hero-bottom"><span lang="en">PERSONAL CARE. THOUGHTFULLY DESIGNED.</span><a href="#services">مسیر مراقبت شما، از اینجا<Icon name="arrow-down" size={17} /></a><span className="hero-bottom-mark">DOCTOR RESOON</span></div>
      </section>
      <div className="values-strip"><div className="container values-inner"><span><Icon name="leaf" size={20} />تغذیه و ورزش</span><i /><span><Icon name="video" size={20} />ویزیت آنلاین پزشک</span><i /><span><Icon name="home" size={20} />تیم درمانی در منزل</span><i /><span><Icon name="shield" size={20} />واکسیناسیون و پیشگیری</span></div></div>
      <section className="section care-services" id="services" aria-labelledby="services-title"><div className="container">
        <div className="section-heading"><div><span className="eyebrow">چهار مسیر، با توجه به نیاز شما</span><h2 id="services-title">سلامت شما،<br />مسیر <em>مخصوص شما.</em></h2></div><p>برای هدف و شرایط خودتان، یک مسیر انتخاب کنید.<br />جزئیات را ببینید یا همین‌جا درخواست ثبت کنید.</p></div>
        <div className="services-grid">{services.map((service, index) => <article className={"service-card care-card care-" + service.id} key={service.id}>
          <div className="service-card-top"><span className="service-icon"><Icon name={service.icon as IconName} size={31} /></span><span className="card-index" lang="en">0{index + 1}</span></div><span className="service-english" lang="en">{service.english}</span><h3>{service.name}</h3><p>{service.description}</p><div className="service-card-actions"><BookingButton service={service.id} label={`ثبت درخواست ${service.name}`}>ثبت درخواست<Icon name="arrow" size={17} /></BookingButton><a className="service-details-link" href={`/services/${service.id}`} aria-label={`جزئیات ${service.name}`}>جزئیات خدمت<Icon name="chevron" size={16} /></a></div>
        </article>)}</div>
        <p className="service-disclaimer">ثبت درخواست، آغاز بررسی و هماهنگی است. زمان، هزینه و امکان ارائهٔ خدمت پیش از هماهنگی نهایی مشخص می‌شوند.</p>
        <section className="upcoming-services" id="upcoming" aria-labelledby="upcoming-title"><div className="upcoming-heading"><div><span className="eyebrow" lang="en">COMING SOON</span><h3 id="upcoming-title">به‌زودی در دکتر رسون</h3></div><p>دو مسیر تازه برای مراقبت از شما؛<br />جزئیات شروع ارائهٔ خدمات، همین‌جا اعلام می‌شود.</p></div><div className="upcoming-grid">{upcomingServices.map(service => <article className="upcoming-card" key={service.id}><span className="upcoming-icon"><Icon name={service.icon} size={27} /></span><div><div className="upcoming-card-heading"><h4>{service.name}</h4><span className="upcoming-status"><Icon name="clock" size={13} />به‌زودی</span></div><p>{service.description}</p></div></article>)}</div></section>
      </div></section>
      <section className="care-workflow-section" id="workflow" aria-labelledby="workflow-title"><div className="container"><div className="care-workflow-heading"><div><span className="eyebrow light" lang="en">YOUR NEXT STEP, MADE CLEAR</span><h2 id="workflow-title">شروعی ساده،<br /><em>مراقبتی با توجه.</em></h2></div><p>مسیر شما با یک درخواست شروع می‌شود. نیازتان را بررسی می‌کنیم و پیش از ارائهٔ برنامه یا خدمت، جزئیات با شما هماهنگ می‌شود.</p></div><ol className="care-steps">{careSteps.map(step => <li key={step.number}><div className="care-step-top"><span className="care-step-number">{step.number}</span><Icon name={step.icon} size={28} /></div><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><div className="care-workflow-bottom"><p><Icon name="phone" size={19} />پس از ثبت موفق، می‌توانید متن آمادهٔ درخواست را از واتساپ خودتان برای دکتر رسون بفرستید.</p><BookingButton className="button button-cream">مسیر خودم را شروع می‌کنم<Icon name="arrow" size={18} /></BookingButton></div></div></section>
      <section className="section care-team-section" id="medical-team" aria-labelledby="team-title"><div className="container philosophy-grid"><div className="philosophy-intro"><span className="eyebrow">آشنایی با دکتر رسون</span><h2 id="team-title">توجه به شما،<br />در <em>هر قدمِ مراقبت.</em></h2><div className="founder-byline"><strong>{founder.name}</strong><span>{founder.role}</span></div><p>دکتر رسون برای هماهنگی تغذیه و ورزش، ویزیت آنلاین، مراقبت در منزل و خدمات پیشگیرانه در کنار شماست. هر مسیر با شناخت نیاز و شرایط شما پیش می‌رود.</p><p>در خدمات درمانی، ارزیابی پزشک مبنای انتخاب مراقبت و تیم مناسب است؛ در مسیر تغذیه و ورزش، هدف و سبک زندگی شما در برنامه‌ریزی لحاظ می‌شود.</p><a className="text-link" href={founder.path}>بیشتر با دکتر رسون آشنا شوید<Icon name="arrow" size={19} /></a></div><div className="team-roles"><h3>مراقبت، متناسب با انتخاب شما</h3>{services.map(service => <div className="team-role" key={service.id}><span className="team-role-icon"><Icon name={service.icon as IconName} size={24} /></span><div><h4>{service.name}</h4><strong>{service.team}</strong><p>{service.note}</p></div></div>)}</div></div></section>
      <section className="section faq-section" id="faq" aria-labelledby="faq-title"><div className="container faq-grid"><div><span className="eyebrow">با آگاهی شروع کنید</span><h2 id="faq-title">پرسش‌های شما،<br /><em>پاسخ‌های روشن.</em></h2><p>دربارهٔ ثبت درخواست، برنامه‌ها<br />و هماهنگی خدمات بیشتر بدانید.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span className="faq-plus">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="contact-section" id="contact"><div className="container contact-inner"><div className="contact-symbol" aria-hidden="true"><Icon name="heart" size={36} /></div><div><span className="eyebrow">یک قدم برای مراقبت از خودتان</span><h2>مسیر مراقبت شما،<em> از همین‌جا شروع می‌شود.</em></h2><p>خدمت موردنظر را انتخاب کنید؛ برای ادامهٔ مسیر با شما هماهنگ می‌شود.</p></div><div className="contact-actions"><BookingButton>ثبت درخواست<Icon name="arrow" size={19} /></BookingButton><a className="contact-phone" href={contact.href} aria-label={`تماس با دکتر رسون: ${contact.phoneLabel}`}><Icon name="phone" size={18} /><bdi dir="ltr">{contact.phoneLabel}</bdi></a><a className="contact-page-link" href="/contact">راه‌های ارتباط با دکتر رسون</a></div></div></section>
    </main>
  </SiteFrame>;
}
