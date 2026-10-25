"use client";

import { lazy, Suspense, useCallback, useState } from "react";
import { services, faqs } from "@/lib/clinic-data";
import { Brand, Icon, type IconName } from "./icons";
import Modal from "./modal";

const BookingDialog = lazy(() => import("./booking-dialog"));

const careSteps = [
  { number: "۰۱", icon: "video", title: "ویزیت آنلاین پزشک", text: "شرایط و نیاز بیمار در گفت‌وگو با پزشک بررسی می‌شود." },
  { number: "۰۲", icon: "stethoscope", title: "تعیین برنامه و تیم درمانی", text: "نوع خدمت و ترکیب تیم اعزامی بر اساس ارزیابی پزشک مشخص می‌شود." },
  { number: "۰۳", icon: "home", title: "هماهنگی مراقبت در منزل", text: "در صورت مناسب بودن شرایط، زمان و تیم ارائهٔ خدمت هماهنگ می‌شوند." },
] as const;

export default function ClinicHome() {
  const [menu, setMenu] = useState(false);
  const [booking, setBooking] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);
  const [detail, setDetail] = useState<typeof services[number] | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const closeBooking = useCallback(() => { setBooking(null); setTracking(false); }, []);
  const closeDetail = useCallback(() => setDetail(null), []);
  const openBooking = (service = "medical-care") => { setBooking(service); setMenu(false); };
  const showTracking = () => { setTracking(true); setMenu(false); };

  return <div className="home-care-page">
    <a className="skip-link" href="#main">رفتن به محتوای اصلی</a>
    <div className="announcement">
      <Icon name="stethoscope" size={15} />
      <span>پزشک‌محور؛ از ویزیت آنلاین تا مراقبت در منزل</span>
      <span className="announcement-en" lang="en">PHYSICIAN-LED HOME CARE</span>
    </div>
    <header className="site-header" id="home">
      <div className="container nav-shell">
        <Brand />
        <nav className="desktop-nav" aria-label="منوی اصلی">
          <a className="active" href="#home">خانه</a>
          <a href="#services">خدمات در منزل</a>
          <a href="#workflow">مسیر دریافت خدمت</a>
          <a href="#medical-team">رویکرد پزشکی ما</a>
          <a href="#faq">پرسش‌های شما</a>
        </nav>
        <div className="nav-actions">
          <button className="button button-green button-small" onClick={() => openBooking()}>
            <Icon name="video" size={18} /><span>درخواست ویزیت آنلاین</span>
          </button>
          <button className="menu-button icon-button" aria-label={menu ? "بستن منو" : "باز کردن منو"} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(v => !v)}>
            <Icon name={menu ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {menu && <nav className="mobile-nav" id="mobile-nav" aria-label="منوی موبایل">
        <a href="#services" onClick={() => setMenu(false)}>خدمات در منزل</a>
        <a href="#workflow" onClick={() => setMenu(false)}>مسیر دریافت خدمت</a>
        <a href="#medical-team" onClick={() => setMenu(false)}>رویکرد پزشکی ما</a>
        <a href="#faq" onClick={() => setMenu(false)}>پرسش‌های شما</a>
        <button onClick={showTracking}>پیگیری درخواست</button>
      </nav>}
    </header>

    <main id="main">
      <section className="hero section" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="tiny-line" />ابتدا ویزیت پزشک، سپس اعزام هدفمند</div>
            <h1 id="hero-title">مراقبت در منزل،<br />با <span className="word-gold">راهبری پزشک</span><span className="title-dot">.</span></h1>
            <p className="hero-description">ابتدا آنلاین با پزشک ویزیت می‌شوید. سپس، بر اساس نیاز شما و نظر پزشک، تیم درمانی مناسب برای خدمات در منزل هماهنگ می‌شود.</p>
            <div className="hero-buttons">
              <button className="button button-green" onClick={() => openBooking()}>درخواست ویزیت آنلاین<Icon name="arrow" size={19} /></button>
              <a className="button button-outline" href="#services">آشنایی با خدمات<Icon name="arrow-down" size={18} /></a>
            </div>
            <div className="hero-note">
              <span className="note-icon"><Icon name="shield" size={19} /></span>
              <p>هر اعزام، پس از ارزیابی پزشکی.<span>تزریقات و سرم‌تراپی، در صورت نیاز و با نظر پزشک</span></p>
            </div>
          </div>
          <div className="hero-visual">
            <span className="orbit orbit-one" /><span className="orbit orbit-two" />
            <div className="hero-image-frame">
              <img src="/images/home-care.webp" alt="تصویر مفهومی گفت‌وگوی پزشک با بیمار در محیط خانه" width="1024" height="1280" fetchPriority="high" />
              <span className="image-side-caption" lang="en">MEDICAL CARE, AROUND YOU.</span>
            </div>
            <div className="hero-seal" aria-hidden="true"><Icon name="home" size={27} /><span>پزشک‌محور<br />متناسب با شما</span></div>
            <div className="image-card">
              <span className="image-card-icon"><Icon name="stethoscope" size={25} /></span>
              <div>پزشک، نقطهٔ شروع مراقبت.<small>ویزیت آنلاین و هماهنگی تیم درمانی</small></div>
            </div>
            <span className="concept-caption">تصویر مفهومی؛ پزشک یا بیمار واقعی دکتر رسون نیست.</span>
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
            <div><span className="eyebrow">THREE PATHS. ONE MEDICAL APPROACH.</span><h2 id="services-title">سه مسیر خدمت،<br className="mobile-break" /> یک رویکرد <em>پزشکی.</em></h2></div>
            <p>از ارزیابی اولیه تا انتخاب تیم مناسب؛<br />هر مسیر با نظر پزشک پیش می‌رود.</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => <button className={"service-card care-card care-" + service.id} key={service.id} onClick={() => setDetail(service)}>
              <div className="service-card-top"><span className="service-icon"><Icon name={service.icon as IconName} size={34} /></span><span className="card-index" lang="en">0{index + 1}</span></div>
              <span className="service-english" lang="en">{service.english}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className="card-bottom"><span>جزئیات و درخواست ویزیت</span><span className="circle-arrow"><Icon name="arrow" size={18} /></span></span>
            </button>)}
          </div>
          <p className="service-disclaimer">نوع خدمت، امکان ارائه در منزل و تیم اعزامی پس از ارزیابی پزشک و بررسی محدودهٔ شما مشخص می‌شوند.</p>
        </div>
      </section>

      <section className="care-workflow-section" id="workflow" aria-labelledby="workflow-title">
        <div className="container">
          <div className="care-workflow-heading">
            <div><span className="eyebrow light">FROM ASSESSMENT TO HOME CARE</span><h2 id="workflow-title">ابتدا <em>ارزیابی پزشک.</em><br />سپس، اعزامِ متناسب.</h2></div>
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
            <button className="button button-cream" onClick={() => openBooking()}>از ویزیت آنلاین شروع کنید<Icon name="video" size={19} /></button>
          </div>
        </div>
      </section>

      <section className="section care-team-section" id="medical-team" aria-labelledby="team-title">
        <div className="container philosophy-grid">
          <div className="philosophy-intro">
            <span className="eyebrow">A MEDICAL TEAM, BUILT AROUND YOU</span>
            <h2 id="team-title">پشت هر اعزام،<br />یک <em>تصمیم پزشکی.</em></h2>
            <p>دکتر رسون یک تیم پزشکی با مدل ویزیت آنلاین و مراقبت در منزل است. اول نیاز بیمار مشخص می‌شود؛ بعد خدمت و فرد مناسب برای انجام آن انتخاب می‌شوند.</p>
            <p>در مسیر بوتاکس، حضور شخص پزشک بخش اصلی خدمت است؛ معاینه و تزریق را خود پزشک انجام می‌دهد.</p>
            <button className="text-link" onClick={() => openBooking()}>درخواست ارزیابی پزشک<Icon name="arrow" size={19} /></button>
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
          <div><span className="eyebrow">BEFORE YOU BEGIN</span><h2 id="faq-title">پیش از شروع،<br /><em>بیشتر بدانید.</em></h2><p>دربارهٔ ویزیت، اعزام و شرایط<br />دریافت خدمات در منزل.</p></div>
          <div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span className="faq-plus">+</span></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-inner">
          <div className="contact-symbol" aria-hidden="true"><Icon name="stethoscope" size={42} /></div>
          <div><span className="eyebrow">START WITH YOUR PHYSICIAN</span><h2>مراقبت مناسب،<em> از ویزیت پزشک شروع می‌شود.</em></h2><p>خدمت، شهر و زمان ترجیحی را ثبت کنید تا برای ویزیت آنلاین و بررسی درخواست هماهنگی شود.</p></div>
          <button className="button button-green" onClick={() => openBooking()}>درخواست ویزیت آنلاین<Icon name="arrow" size={19} /></button>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand"><Brand light /><p>ویزیت آنلاین پزشک؛ مراقبت متناسب در منزل.</p></div>
        <div className="footer-links"><a href="#services">خدمات در منزل</a><a href="#workflow">مسیر دریافت خدمت</a><a href="#faq">پرسش‌های متداول</a><button onClick={showTracking}>پیگیری درخواست</button></div>
        <div className="footer-note"><Icon name="shield" size={24} /><p>هر خدمت، متناسب با ارزیابی پزشکی.<small>ثبت درخواست به معنی اعزام فوری یا تأیید نهایی نیست.</small></p></div>
      </div>
      <div className="container care-scope-note">این سامانه برای خدمات غیراورژانسی است. در وضعیت اورژانسی، برای رسیدگی فوری با اورژانس تماس بگیرید.</div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} دکتر رسون. تمامی حقوق محفوظ است.</span>
        <button onClick={() => setPrivacy(true)}>حریم خصوصی</button>
        <span lang="en">MEDICAL CARE, AROUND YOU</span>
      </div>
    </footer>

    <div className="mobile-booking">
      <button className="button button-green" onClick={() => openBooking()}><Icon name="video" size={19} />درخواست ویزیت آنلاین<Icon name="arrow" size={18} /></button>
      <button className="mobile-track" onClick={showTracking} aria-label="پیگیری درخواست"><Icon name="search" size={22} /></button>
    </div>

    <Suspense fallback={<div className="modal-loading" role="status">در حال آماده‌سازی فرم…</div>}>
      {(booking !== null || tracking) && <BookingDialog initialService={booking || "medical-care"} trackingOnly={tracking} onClose={closeBooking} />}
    </Suspense>

    {detail && <Modal title={detail.name} onClose={closeDetail}>
      <div className="service-detail">
        <span className="detail-icon"><Icon name={detail.icon as IconName} size={45} /></span>
        <p>{detail.details}</p>
        <ul>{detail.areas.map(area => <li key={area}><Icon name="check" size={18} />{area}</li>)}</ul>
        <div className="info-note"><Icon name="stethoscope" size={19} />{detail.note}</div>
        <button className="button button-green full-width" onClick={() => { openBooking(detail.id); setDetail(null); }}>درخواست ویزیت برای این خدمت<Icon name="arrow" size={18} /></button>
      </div>
    </Modal>}
    {privacy && <Modal title="حریم خصوصی شما" onClose={() => setPrivacy(false)}>
      <div className="privacy-content">
        <Icon name="lock" size={40} />
        <p>نام، شمارهٔ همراه، شهر، نوع خدمت و زمان ترجیحی شما، با رضایتتان برای بررسی و هماهنگی درخواست نگهداری می‌شوند. مشاهدهٔ وضعیت درخواست به کد پیگیری و شمارهٔ همراه ثبت‌شده نیاز دارد.</p>
        <p>در فرم اولیه، نیازی به ارسال پروندهٔ پزشکی، عکس، اطلاعات بیماری یا نشانی دقیق منزل نیست. اطلاعات بالینی و روش ارتباط با پزشک در مرحلهٔ هماهنگی مشخص می‌شوند.</p>
      </div>
    </Modal>}
  </div>;
}
