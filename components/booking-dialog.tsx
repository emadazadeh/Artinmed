"use client";
import { useState, type FormEvent } from "react";
import { services, timeSlots, faNumber, dateLabel } from "@/lib/clinic-data";
import { availableDates, normalizePhone, createRequestId } from "@/lib/booking";
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
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [requestId] = useState(createRequestId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [trackCode, setTrackCode] = useState("");
  const [record, setRecord] = useState<Tracked | null>(null);
  const [copied, setCopied] = useState(false);
  const selected = services.find(s => s.id === service) || services[5];
  async function submit(event: FormEvent) {
    event.preventDefault(); if (pending) return;
    setError("");
    if (mode === "book" && !/^09\d{9}$/.test(normalizePhone(phone))) { setError("شمارهٔ همراه را بررسی کنید؛ شماره باید ۱۱ رقم و با ۰۹ شروع شود."); return; }
    setPending(true);
    try {
      const response = await fetch(mode === "track" ? "/api/appointments/track" : "/api/appointments", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(15000),
        body: JSON.stringify(mode === "track" ? { reference: trackCode, phone } : { service, date, time, name, phone, consent, website, requestId }),
      });
      const result = await response.json() as Tracked & { error?: string };
      if (!response.ok) throw new Error(result.error || "درخواست انجام نشد؛ دوباره تلاش کنید.");
      if (typeof result.reference !== "string") throw new Error("پاسخ سرور کامل نبود؛ دوباره تلاش کنید.");
      if (mode === "track") setRecord(result); else setReference(result.reference);
    } catch (e) { setError(e instanceof Error && e.name !== "TimeoutError" && e.name !== "TypeError" ? e.message : "ارتباط با سرور برقرار نشد. اطلاعات فرم حفظ شده؛ دوباره تلاش کنید."); }
    finally { setPending(false); }
  }
  async function copyCode() { try { await navigator.clipboard.writeText(reference); setCopied(true); } catch { setCopied(false); } }
  const switchMode = () => { setMode(v => v === "track" ? "book" : "track"); setError(""); setRecord(null); };
  return <Modal title={mode === "track" ? "پیگیری درخواست" : "شروع یک حس خوب"} onClose={onClose}>
    {reference ? <div className="booking-success"><span className="success-icon"><Icon name="check" size={34} /></span><h3>درخواست شما ثبت شد.</h3><p>کد پیگیری را نگه دارید. روز و ساعت انتخابی، ترجیح شماست و پس از هماهنگی کلینیک قطعی می‌شود.</p><div className="reference-code"><code dir="ltr">{reference}</code><button className="icon-button" onClick={copyCode} aria-label="کپی کد پیگیری"><Icon name={copied ? "check" : "copy"} size={19} /></button></div><span className="copy-status" aria-live="polite">{copied ? "کد کپی شد." : "برای کپی کد، روی آیکون بزنید."}</span><div className="booking-summary"><span>{selected.name}</span><span>{dateLabel(date, true)} · {faNumber(time)}</span><span className="status-pill"><span />در انتظار بررسی</span></div><button className="button button-green full-width" onClick={onClose}>بستن و بازگشت به سایت</button></div> : <>
      <div className="booking-tabs" role="group" aria-label="ثبت یا پیگیری درخواست"><button className={mode === "book" ? "selected" : ""} onClick={() => { if (mode !== "book") switchMode(); }}>درخواست جدید</button><button className={mode === "track" ? "selected" : ""} onClick={() => { if (mode !== "track") switchMode(); }}>پیگیری درخواست</button></div>
      {mode === "track" ? <form onSubmit={submit} className="booking-form"><p className="form-intro">کد پیگیری و همان شمارهٔ همراهی که ثبت کرده‌اید را وارد کنید.</p><label htmlFor="track-code">کد پیگیری<input id="track-code" required value={trackCode} onChange={e => { setTrackCode(e.target.value); setRecord(null); }} placeholder="ART-XXXXXXXXXX" dir="ltr" autoCapitalize="characters" maxLength={14} /></label><label htmlFor="track-phone">شمارهٔ همراه<input id="track-phone" required inputMode="tel" autoComplete="tel" value={phone} onChange={e => { setPhone(e.target.value); setRecord(null); }} placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" maxLength={20} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="button button-green full-width" disabled={pending}>{pending ? "در حال بررسی…" : "بررسی وضعیت درخواست"}<Icon name="search" size={18} /></button>{record && <div className="tracked-result" role="status"><span className="status-pill">{record.status === "confirmed" ? "تأیید شده" : record.status === "cancelled" ? "لغو شده" : "در انتظار بررسی و هماهنگی"}</span><h3>{services.find(s => s.id === record.service)?.name}</h3><p>{dateLabel(record.date, true)} · ساعت {faNumber(record.time)}</p><code dir="ltr">{record.reference}</code><small>آخرین وضعیت ثبت‌شدهٔ درخواست شما</small></div>}</form> : <>
        <ol className="booking-steps" aria-label="مراحل درخواست">{["انتخاب خدمت", "زمان ترجیحی", "اطلاعات شما"].map((label, index) => <li key={label} className={step >= index ? "current" : ""} aria-current={step === index ? "step" : undefined}><span>{step > index ? <Icon name="check" size={14} /> : faNumber(index + 1)}</span>{label}</li>)}</ol>
        {step === 0 && <div className="booking-step"><p className="form-intro">دوست دارید از کجا شروع کنیم؟</p><div className="booking-services" role="group" aria-label="انتخاب خدمت">{services.map(s => <button key={s.id} className={service === s.id ? "selected" : ""} aria-pressed={service === s.id} onClick={() => setService(s.id)}><Icon name={s.icon as IconName} size={24} /><span>{s.name}</span><span className="radio-dot" /></button>)}</div><button className="button button-green full-width" onClick={() => { setStep(1); setError(""); }}>انتخاب زمان ترجیحی<Icon name="chevron" size={18} /></button></div>}
        {step === 1 && <div className="booking-step"><p className="form-intro">یک روز و ساعت ترجیحی انتخاب کنید.</p><div className="date-options" role="group" aria-label="روز ترجیحی">{dates.map(d => <button key={d} className={date === d ? "selected" : ""} aria-pressed={date === d} onClick={() => setDate(d)}>{dateLabel(d)}</button>)}</div><h3 className="field-heading">ساعت ترجیحی <small>(به وقت تهران)</small></h3><div className="time-options" role="group" aria-label="ساعت ترجیحی">{timeSlots.map(t => <button key={t} dir="ltr" className={time === t ? "selected" : ""} aria-pressed={time === t} onClick={() => setTime(t)}>{faNumber(t)}</button>)}</div><p className="info-note"><Icon name="clock" size={17} />این زمان‌ها پیشنهادی هستند؛ نوبت نهایی نیاز به تأیید دارد.</p><div className="step-actions"><button className="button button-outline" onClick={() => setStep(0)}>مرحلهٔ قبل</button><button className="button button-green" disabled={!date || !time} onClick={() => setStep(2)}>ادامه<Icon name="chevron" size={18} /></button></div></div>}
        {step === 2 && <form className="booking-form" onSubmit={submit}><div className="mini-summary"><Icon name="calendar" size={19} /><div><strong>{selected.name}</strong><span>{dateLabel(date, true)} · ساعت {faNumber(time)}</span></div><button type="button" onClick={() => setStep(1)}>ویرایش</button></div><label htmlFor="booking-name">نام و نام خانوادگی<input id="booking-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="نام کامل شما" required minLength={3} maxLength={80} /></label><label htmlFor="booking-phone">شمارهٔ همراه<input id="booking-phone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" autoComplete="tel" inputMode="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" required maxLength={20} /></label><div className="honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label></div><label className="consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} required /><span>با نگهداری نام و شمارهٔ تماس برای بررسی و هماهنگی این درخواست موافقم.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="step-actions"><button type="button" className="button button-outline" onClick={() => setStep(1)} disabled={pending}>مرحلهٔ قبل</button><button type="submit" className="button button-green" disabled={pending || !consent}>{pending ? "در حال ثبت…" : "ثبت درخواست"}<Icon name="arrow" size={18} /></button></div><p className="secure-note"><Icon name="lock" size={14} />بدون پرداخت آنلاین · دریافت کد پیگیری</p></form>}
      </>}
    </>}
  </Modal>;
}
