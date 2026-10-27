"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { services, timeSlots, faNumber, dateLabel, serviceName } from "@/lib/clinic-data";
import { availableDates, validateBooking, createRequestId } from "@/lib/booking";
import { contact } from "@/lib/brand";
import { appointmentWhatsAppMessage, appointmentWhatsAppUrl, type WhatsAppBooking } from "@/lib/whatsapp";
import Modal from "./modal";
import { Icon, type IconName } from "./icons";
type Tracked = { reference: string; service: string; date: string; time: string; status: string };
export default function BookingDialog({ initialService, trackingOnly, onClose }: { initialService: string; trackingOnly: boolean; onClose: () => void }) {
  const [mode, setMode] = useState(trackingOnly ? "track" : "book");
  const [step, setStep] = useState(0);
  const [service, setService] = useState(initialService);
  const [dates] = useState(() => availableDates());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [requestId] = useState(createRequestId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [savedBooking, setSavedBooking] = useState<WhatsAppBooking | null>(null);
  const [trackCode, setTrackCode] = useState("");
  const [record, setRecord] = useState<Tracked | null>(null);
  const [copied, setCopied] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);
  const reference = savedBooking?.reference ?? "";
  const stage = useRef<HTMLDivElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  useEffect(() => { stage.current?.focus(); }, [step, mode, reference]);
  useEffect(() => { if (error) errorMessage.current?.focus(); }, [error]);
  const selected = services.find(s => s.id === service) || services[0];
  async function submit(event: FormEvent) {
    event.preventDefault(); if (pending) return;
    setError("");
    const booking = mode === "book" ? validateBooking({ service, date, time, name, phone, city, consent, website, requestId }) : null;
    if (booking?.error) { setError(booking.error); return; }
    const submitted = booking?.data;
    setPending(true);
    try {
      const response = await fetch(mode === "track" ? "/api/appointments/track" : "/api/appointments", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(15000),
        body: JSON.stringify(submitted ?? { reference: trackCode, phone }),
      });
      const result = await response.json() as Tracked & { error?: string };
      if (!response.ok) throw new Error(result.error || "درخواست انجام نشد؛ دوباره تلاش کنید.");
      if (typeof result.reference !== "string") throw new Error("پاسخ سرور کامل نبود؛ دوباره تلاش کنید.");
      if (mode === "track") setRecord(result); else if (submitted) setSavedBooking({ ...submitted, reference: result.reference });
    } catch (e) { setError(e instanceof Error && e.name !== "TimeoutError" && e.name !== "TypeError" ? e.message : "ارتباط با سرور برقرار نشد. اطلاعات فرم حفظ شده؛ دوباره تلاش کنید."); }
    finally { setPending(false); }
  }
  async function copyCode() { try { await navigator.clipboard.writeText(reference); setCopied(true); } catch { setCopied(false); } }
  async function copyMessage() {
    if (!savedBooking) return;
    setError("");
    try { await navigator.clipboard.writeText(appointmentWhatsAppMessage(savedBooking)); setMessageCopied(true); }
    catch { setMessageCopied(false); setError("کپی خودکار انجام نشد؛ متن پیام آماده را باز کنید و آن را انتخاب و کپی کنید."); }
  }
  const switchMode = () => { setMode(v => v === "track" ? "book" : "track"); setError(""); setRecord(null); };
  return <Modal title={mode === "track" ? "پیگیری درخواست" : "درخواست ویزیت آنلاین پزشک"} onClose={onClose}>
    {savedBooking ? <div className="booking-success" ref={stage} tabIndex={-1}><span className="success-icon"><Icon name="check" size={34} /></span><h3>درخواست شما ثبت شد.</h3><p>کد پیگیری را نگه دارید. زمان و روش ویزیت آنلاین هنگام هماهنگی تأیید می‌شود. نوع خدمت و اعزام تیم درمانی، پس از ارزیابی پزشک مشخص خواهند شد.</p><div className="reference-code"><code dir="ltr">{reference}</code><button className="icon-button" onClick={copyCode} aria-label="کپی کد پیگیری"><Icon name={copied ? "check" : "copy"} size={19} /></button></div><span className="copy-status" aria-live="polite">{copied ? "کد کپی شد." : "برای کپی کد، روی آیکون بزنید."}</span><div className="booking-summary"><span>{serviceName(savedBooking.service)}</span><span>شهر / محدوده: {savedBooking.city}</span><span>{dateLabel(savedBooking.date, true)} · {faNumber(savedBooking.time)}</span><span className="status-pill"><span />در انتظار بررسی</span></div>
      <section className="booking-whatsapp" aria-labelledby="booking-whatsapp-title"><h4 id="booking-whatsapp-title">هماهنگی از طریق واتساپ</h4><p>پیام آماده شامل نام، شمارهٔ تماس، خدمت، شهر، زمان ترجیحی و کد پیگیری شماست. با دکمهٔ زیر، گفت‌وگو با شمارهٔ <bdi dir="ltr">{contact.phoneLabel}</bdi> باز می‌شود؛ پیام را از واتساپ خودتان ارسال کنید.</p><details><summary>مشاهدهٔ متن پیام آماده</summary><p className="whatsapp-message" dir="rtl">{appointmentWhatsAppMessage(savedBooking)}</p></details><a className="button button-green full-width" href={appointmentWhatsAppUrl(savedBooking)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">باز کردن واتساپ و ارسال درخواست<Icon name="arrow" size={18} /></a><p className="whatsapp-send-note">برای فرستادن پیام، در واتساپ دکمهٔ ارسال را بزنید. درخواست شما در سایت ذخیره شده است.</p><button type="button" className="text-link" onClick={copyMessage}><Icon name={messageCopied ? "check" : "copy"} size={16} />{messageCopied ? "متن پیام کپی شد" : "کپی متن پیام"}</button><span className="copy-status" aria-live="polite">{messageCopied ? "می‌توانید متن را در واتساپ جای‌گذاری کنید." : ""}</span>{error && <p ref={errorMessage} tabIndex={-1} className="form-error" role="alert">{error}</p>}</section>
      <button className="button button-outline full-width" onClick={onClose}>بستن و بازگشت به سایت</button></div> : <>
      <div className="booking-tabs" role="group" aria-label="ثبت یا پیگیری درخواست"><button type="button" disabled={pending} aria-pressed={mode === "book"} className={mode === "book" ? "selected" : ""} onClick={() => { if (mode !== "book") switchMode(); }}>درخواست جدید</button><button type="button" disabled={pending} aria-pressed={mode === "track"} className={mode === "track" ? "selected" : ""} onClick={() => { if (mode !== "track") switchMode(); }}>پیگیری درخواست</button></div>
      {mode === "track" ? <form onSubmit={submit} className="booking-form" aria-busy={pending}><p className="form-intro">کد پیگیری و همان شمارهٔ همراهی که ثبت کرده‌اید را وارد کنید.</p><label htmlFor="track-code">کد پیگیری<input disabled={pending} id="track-code" required value={trackCode} onChange={e => { setTrackCode(e.target.value.toUpperCase()); setRecord(null); }} placeholder="DRR-XXXXXXXXXX" dir="ltr" autoCapitalize="characters" maxLength={14} /></label><label htmlFor="track-phone">شمارهٔ همراه<input disabled={pending} id="track-phone" type="tel" required inputMode="tel" autoComplete="tel" value={phone} onChange={e => { setPhone(e.target.value); setRecord(null); }} placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" maxLength={20} /></label>{error && <p ref={errorMessage} tabIndex={-1} className="form-error" role="alert">{error}</p>}<button type="submit" className="button button-green full-width" disabled={pending}>{pending ? "در حال بررسی…" : "بررسی وضعیت درخواست"}<Icon name="search" size={18} /></button>{record && <div className="tracked-result" role="status"><span className="status-pill">{record.status === "confirmed" ? "تأیید شده" : record.status === "cancelled" ? "لغو شده" : "در انتظار بررسی و هماهنگی"}</span><h3>{serviceName(record.service)}</h3><p>{dateLabel(record.date, true)} · ساعت {faNumber(record.time)}</p><code dir="ltr">{record.reference}</code><small>آخرین وضعیت ثبت‌شدهٔ درخواست شما</small></div>}</form> : <>
        <ol className="booking-steps" aria-label="مراحل درخواست">{["انتخاب خدمت", "زمان ترجیحی", "اطلاعات شما"].map((label, index) => <li key={label} className={step >= index ? "current" : ""} aria-current={step === index ? "step" : undefined}><span>{step > index ? <Icon name="check" size={14} /> : faNumber(index + 1)}</span>{label}</li>)}</ol>
        <div ref={stage} tabIndex={-1} className="booking-stage">
        {step === 0 && <div className="booking-step"><p className="form-intro">موضوع درخواست را انتخاب کنید؛ شروع هر مسیر، ارزیابی پزشک است.</p><div className="booking-services care-booking-services" role="group" aria-label="انتخاب خدمت">{services.map(s => <button key={s.id} className={service === s.id ? "selected" : ""} aria-pressed={service === s.id} onClick={() => setService(s.id)}><Icon name={s.icon as IconName} size={24} /><span>{s.name}</span><span className="radio-dot" /></button>)}</div><div className="booking-path-note"><Icon name="video" size={21} /><div><strong>ابتدا ویزیت آنلاین پزشک</strong><p>{selected.note}</p></div></div><button className="button button-green full-width" onClick={() => { setStep(1); setError(""); }}>انتخاب زمان ترجیحی<Icon name="chevron" size={18} /></button></div>}
        {step === 1 && <div className="booking-step"><p className="form-intro">روز و ساعت ترجیحی خود را برای ارتباط با پزشک انتخاب کنید.</p><div className="date-options" role="group" aria-label="روز ترجیحی">{dates.map(d => <button key={d} className={date === d ? "selected" : ""} aria-pressed={date === d} onClick={() => setDate(d)}>{dateLabel(d)}</button>)}</div><h3 className="field-heading">ساعت ترجیحی <small>(به وقت تهران)</small></h3><div className="time-options" role="group" aria-label="ساعت ترجیحی">{timeSlots.map(t => <button key={t} dir="ltr" className={time === t ? "selected" : ""} aria-pressed={time === t} onClick={() => setTime(t)}>{faNumber(t)}</button>)}</div><p className="info-note"><Icon name="clock" size={17} />زمان ویزیت آنلاین پس از هماهنگی تأیید می‌شود؛ اعزام، مرحلهٔ بعد از ارزیابی پزشک است.</p><div className="step-actions"><button className="button button-outline" onClick={() => setStep(0)}>مرحلهٔ قبل</button><button className="button button-green" disabled={!date || !time} onClick={() => setStep(2)}>ادامه<Icon name="chevron" size={18} /></button></div></div>}
        {step === 2 && <form className="booking-form" onSubmit={submit} aria-busy={pending}><div className="mini-summary"><Icon name="video" size={19} /><div><strong>{selected.name}</strong><span>{dateLabel(date, true)} · ساعت {faNumber(time)}</span></div><button type="button" onClick={() => setStep(1)}>ویرایش</button></div><label htmlFor="booking-name">نام و نام خانوادگی<input disabled={pending} id="booking-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="نام کامل شما" required minLength={3} maxLength={80} /></label><label htmlFor="booking-phone">شمارهٔ همراه<input disabled={pending} id="booking-phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel" inputMode="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" required maxLength={20} /></label><label htmlFor="booking-city">شهر / محدودهٔ شما<input disabled={pending} id="booking-city" value={city} onChange={e => setCity(e.target.value)} autoComplete="address-level2" placeholder="مثلاً نام شهر و محله" required minLength={2} maxLength={80} /><small className="booking-city-note">برای بررسی محدودهٔ ارائهٔ خدمات؛ فعلاً نشانی دقیق منزل را وارد نکنید.</small></label><div className="honeypot" aria-hidden="true"><label>Website<input disabled={pending} tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label></div><label className="consent"><input disabled={pending} type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required /><span>با نگهداری اطلاعات این فرم برای بررسی و هماهنگی درخواست ویزیت و خدمت در منزل موافقم.</span></label>{error && <p ref={errorMessage} tabIndex={-1} className="form-error" role="alert">{error}</p>}<div className="step-actions"><button type="button" className="button button-outline" onClick={() => setStep(1)} disabled={pending}>مرحلهٔ قبل</button><button type="submit" className="button button-green" disabled={pending || !consent}>{pending ? "در حال ثبت…" : "ثبت درخواست ویزیت"}<Icon name="arrow" size={18} /></button></div><p className="secure-note"><Icon name="lock" size={14} />درخواست ارزیابی پزشک · دریافت کد پیگیری</p></form>}
        </div>
      </>}
    </>}
  </Modal>;
}
