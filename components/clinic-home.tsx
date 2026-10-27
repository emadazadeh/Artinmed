import { services, faqs } from "@/lib/clinic-data";
import { pageSchema, site } from "@/lib/site";
import { contact, founder } from "@/lib/brand";
import { upcomingServices } from "@/lib/upcoming-services";
import { Icon, type IconName } from "./icons";
import { BookingButton } from "./booking-provider";
import SiteFrame from "./site-frame";
import StructuredData from "./structured-data";

const careSteps = [
  { number: "۰۱", icon: "video", title: "ویزیت آنلاین پزشک", text: "شرایط و نیاز بیمار در گفت‌وگو با پزشک بررسی می‌شود." },
  { number: "۰۲", icon: "stethoscope", title: "تعیین برنامه و تیم درمانی", text: "نوع خدمت و ترکیب تیم اعزامی بر اساس ارزیابی پزشک مشخص می‌شود." },
  { number: "۰۳", icon: "home", title: "هماهنگی مراقبت در منزل", text: "در صورت مناسب بودن شرایط، زمان و تیم ارائهٔ خدمت هماهنگ می‌شوند." },
] as const;

export default function ClinicHome() {
  return <SiteFrame>
    <StructuredData data={pageSchema({ path: "/", title: site.title, description: site.description, questions: faqs })} />
    <main id="main" tabIndex={-1}>
      <section className="hero section" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-heading">
            <div className="eyebrow"><span className="tiny-line" />ابتدا ویزیت پزشک، سپس اعزام هدفمند</div>
            <h1 id="hero-title">مراقبت در منزل،<br />با <span className="word-gold">راهبری پزشک</span><span className="title-dot">.</span></h1>
          </div>
          <div className="hero-visual">
            <span className="orbit orbit-one" /><span className="orbit orbit-two" />
            <div className="hero-image-frame">
              <img src={founder.portrait} srcSet="/images/emad-azadeh-480.webp 480w, /images/emad-azadeh-768.webp 768w, /images/emad-azadeh-1024.webp 1024w" sizes="(max-width: 640px) min(310px, 82vw), (max-width: 900px) 42vw, 440px" decoding="async" loading="eager" alt={`${founder.name}، ${founder.role}؛ پرترهٔ ویرایش‌شده با هوش مصنوعی`} width="1024" height="1280" fetchPriority="high" />
              <span className="image-side-caption" lang="en">MEDICAL CARE, AROUND YOU.</span>
            </div>
            <div className="hero-seal" aria-hidden="true"><Icon name="home" size={27} /><span>پزشک‌محور<br />متناسب با شما</span></div>
            <div className="image-card">
              <span className="image-card-icon"><Icon name="stethoscope" size={25} /></span>
              <div><a href={founder.path}>{founder.name}</a><small>{founder.role}</small></div>
            </div>
            <span className="concept-caption">پرترهٔ دکتر عماد آزاده؛ ویرایش با هوش مصنوعی.</span>
          </div>
          <div className="hero-copy">
            <p className="hero-description">در دکتر رسون، ابتدا آنلاین با پزشک ویزیت می‌شوید. سپس، بر اساس نیاز شما و نظر پزشک، تیم درمانی مناسب برای خدمات در منزل هماهنگ می‌شود.</p>
            <div className="hero-buttons">
              <BookingButton className="button button-green">درخواست ویزیت آنلاین<Icon name="arrow" size={19} /></BookingButton>
              <a className="button button-outline" href="#services">آشنایی با خدمات<Icon name="arrow-down" size={18} /></a>
            </div>
            <div className="hero-note">
              <span className="note-icon"><Icon name="shield" size={19} /></span>
              <p>هر اعزام، پس از ارزیابی پزشکی.<span>تزریقات و سرم‌تراپی، در صورت نیاز و با نظر پزشک</span></p>
            </div>
          </div>
        </div>
        <div className="container hero-bottom">
          <span lang="en">PHYSICIAN FIRST. CARE AT HOME.</span>
          <a href="#workflow">مسیر دریافت خدمت را ببینید<Icon name="arrow-down" size={17} /></a>
          <span className="hero-bottom-mark">DOCTOR RESOON <i>+</i> HOME CARE</span>
        </div>
      </section>

      <div className="values-strip">
        <div className="container values-inner">
          <span><Icon name="video" size={20} />ویزیت آنلاین پزشک</span><i />
          <span><Icon name="stethoscope" size={20} />تیم متناسب با نیاز بیمار</span><i />
          <span><Icon name="syringe" size={20} />واکسیناسیون با ارزیابی پزشکی</span><i />
          <span><Icon name="shield" size={20} />بوتاکس توسط خود پزشک</span>
        </div>
      </div>

      <section className="section care-services" id="services" aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow" lang="en">THREE PATHS. ONE MEDICAL APPROACH.</span><h2 id="services-title">سه مسیر خدمت،<br className="mobile-break" /> یک رویکرد <em>پزشکی.</em></h2></div>
            <p>از ارزیابی اولیه تا انتخاب تیم مناسب؛<br />هر مسیر با نظر پزشک پیش می‌رود.</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => <a href={`/services/${service.id}`} className={"service-card care-card care-" + service.id} key={service.id}>
              <div className="service-card-top"><span className="service-icon"><Icon name={service.icon as IconName} size={34} /></span><span className="card-index" lang="en">0{index + 1}</span></div>
              <span className="service-english" lang="en">{service.english}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className="card-bottom"><span>راهنمای خدمت و درخواست ویزیت</span><span className="circle-arrow"><Icon name="arrow" size={18} /></span></span>
            </a>)}
          </div>
          <p className="service-disclaimer">نوع خدمت، امکان ارائه در منزل و تیم اعزامی پس از ارزیابی پزشک و بررسی محدودهٔ شما مشخص می‌شوند.</p>
          <section className="upcoming-services" aria-labelledby="upcoming-title">
            <div className="upcoming-heading"><div><span className="eyebrow">در برنامهٔ توسعهٔ دکتر رسون</span><h3 id="upcoming-title">مسیرهای بعدی مراقبت</h3></div><p>اطلاعات و شرایط دریافت این خدمات پس از نهایی‌شدن، در همین بخش اعلام می‌شوند.</p></div>
            <div className="upcoming-grid">{upcomingServices.map(service => <article className="upcoming-card" key={service.id}><span className="upcoming-icon"><Icon name={service.icon} size={25} /></span><div><div className="upcoming-card-heading"><h4>{service.name}</h4><span className="upcoming-status"><Icon name="clock" size={13} />به‌زودی</span></div><p>{service.description}</p></div></article>)}</div>
          </section>
        </div>
      </section>

      <section className="care-workflow-section" id="workflow" aria-labelledby="workflow-title">
        <div className="container">
          <div className="care-workflow-heading">
            <div><span className="eyebrow light" lang="en">FROM ASSESSMENT TO HOME CARE</span><h2 id="workflow-title">ابتدا <em>ارزیابی پزشک.</em><br />سپس، اعزامِ متناسب.</h2></div>
            <p>در دکتر رسون، انتخاب خدمت در فرم، آغاز بررسی است. تصمیم دربارهٔ نیاز درمانی، مناسب بودن مراقبت در منزل و ترکیب تیم اعزامی با پزشک است.</p>
          </div>
          <ol className="care-steps">
            {careSteps.map(step => <li key={step.number}>
              <div className="care-step-top"><span className="care-step-number">{step.number}</span><Icon name={step.icon} size={30} /></div>
              <h3>{step.title}</h3><p>{step.text}</p>
            </li>)}
          </ol>
          <div className="care-workflow-bottom">
            <p><Icon name="shield" size={19} />در صورت نیاز به معاینهٔ حضوری یا مراجعه به مرکز درمانی، مسیر مناسب توسط پزشک پیشنهاد می‌شود.</p>
            <BookingButton className="button button-cream">از ویزیت آنلاین شروع کنید<Icon name="video" size={19} /></BookingButton>
          </div>
        </div>
      </section>

      <section className="section care-team-section" id="medical-team" aria-labelledby="team-title">
        <div className="container philosophy-grid">
          <div className="philosophy-intro">
            <span className="eyebrow" lang="en">A MEDICAL TEAM, BUILT AROUND YOU</span>
            <h2 id="team-title">پشت هر اعزام،<br />یک <em>تصمیم پزشکی.</em></h2>
            <div className="founder-byline"><strong>{founder.name}</strong><span>{founder.role}</span></div>
            <p>دکتر رسون یک تیم پزشکی با مدل ویزیت آنلاین و مراقبت در منزل است. اول نیاز بیمار مشخص می‌شود؛ بعد خدمت و فرد مناسب برای انجام آن انتخاب می‌شوند.</p>
            <p>در مسیر بوتاکس، حضور شخص پزشک بخش اصلی خدمت است؛ معاینه و تزریق را خود پزشک انجام می‌دهد.</p>
            <a className="text-link" href={founder.path}>آشنایی با مؤسس و رویکرد دکتر رسون<Icon name="arrow" size={19} /></a>
          </div>
          <div className="team-roles">
            <h3>برای هر خدمت، تیم مناسب آن</h3>
            {services.map(service => <div className="team-role" key={service.id}>
              <span className="team-role-icon"><Icon name={service.icon as IconName} size={25} /></span>
              <div><h4>{service.name}</h4><strong>{service.team}</strong><p>{service.note}</p></div>
            </div>)}
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div><span className="eyebrow" lang="en">BEFORE YOU BEGIN</span><h2 id="faq-title">پیش از شروع،<br /><em>بیشتر بدانید.</em></h2><p>دربارهٔ ویزیت، اعزام و شرایط<br />دریافت خدمات در منزل.</p></div>
          <div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span className="faq-plus">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-inner">
          <div className="contact-symbol" aria-hidden="true"><Icon name="stethoscope" size={42} /></div>
          <div><span className="eyebrow" lang="en">START WITH YOUR PHYSICIAN</span><h2>مراقبت مناسب،<em> از ویزیت پزشک شروع می‌شود.</em></h2><p>خدمت، شهر و زمان ترجیحی را ثبت کنید تا برای ویزیت آنلاین و بررسی درخواست هماهنگی شود.</p></div>
          <div className="contact-actions"><BookingButton className="button button-green">درخواست ویزیت آنلاین<Icon name="arrow" size={19} /></BookingButton><a className="contact-phone" href={contact.href} aria-label={`تماس با دکتر رسون: ${contact.phoneLabel}`}><Icon name="phone" size={18} /><bdi dir="ltr">{contact.phoneLabel}</bdi></a><a className="contact-page-link" href="/contact">راه‌های ارتباط با دکتر رسون</a></div>
        </div>
      </section>
    </main>
  </SiteFrame>;
}
