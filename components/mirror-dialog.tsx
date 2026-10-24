"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Modal from "./modal";
import { Icon } from "./icons";
import { faNumber } from "@/lib/clinic-data";
const presets = [{ name: "طبیعی", light: 104, warmth: 3, saturation: 103 }, { name: "نور ملایم", light: 111, warmth: 0, saturation: 96 }, { name: "رنگ گرم", light: 103, warmth: 20, saturation: 111 }];
export default function MirrorDialog({ onClose }: { onClose: () => void }) {
  const [source, setSource] = useState("/images/hero.webp");
  const [custom, setCustom] = useState(false);
  const [light, setLight] = useState(104);
  const [warmth, setWarmth] = useState(3);
  const [saturation, setSaturation] = useState(103);
  const [split, setSplit] = useState(50);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const objectUrl = useRef<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const filter = `brightness(${light}%) sepia(${warmth}%) saturate(${saturation}%)`;
  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return; setError("");
    if (!/image\/(jpeg|png|webp)/.test(file.type)) { setError("عکس را با فرمت JPG، PNG یا WebP انتخاب کنید. برای عکس‌های HEIC، ابتدا نسخهٔ JPG بگیرید."); event.target.value = ""; return; }
    if (file.size > 8 * 1024 * 1024) { setError("حجم عکس باید کمتر از ۸ مگابایت باشد."); event.target.value = ""; return; }
    const nextUrl = URL.createObjectURL(file);
    const img = new Image(); img.src = nextUrl;
    try {
      await img.decode();
      if (img.naturalWidth * img.naturalHeight > 40000000) throw new Error("large");
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = nextUrl; setSource(nextUrl); setCustom(true); setSplit(50);
    } catch { URL.revokeObjectURL(nextUrl); setError("این عکس قابل پردازش نیست یا ابعاد آن بیش از حد بزرگ است؛ یک عکس کوچک‌تر انتخاب کنید."); }
    event.target.value = "";
  }
  async function download() {
    setDownloading(true); setError("");
    try {
      const image = new Image(); image.src = source; await image.decode();
      const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas"); canvas.width = Math.round(image.naturalWidth * scale); canvas.height = Math.round(image.naturalHeight * scale);
      const context = canvas.getContext("2d"); if (!context) throw new Error();
      if (!("filter" in context)) throw new Error();
      context.filter = filter; context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.93)); if (!blob) throw new Error();
      const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "artinmed-visual-preview.jpg"; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch { setError("ذخیرهٔ تصویر در این مرورگر ممکن نشد. می‌توانید از پیش‌نمایش عکس بگیرید."); }
    finally { setDownloading(false); }
  }
  return <Modal title="آینهٔ زیبایی شما" onClose={onClose} wide><div className="mirror-tool"><div className="mirror-canvas-column"><div className="comparison" dir="ltr"><img src={source} alt={custom ? "عکس انتخابی شما، نسخهٔ اصلی" : "عکس نمونه برای تجربهٔ آینه"} /><div className="comparison-effect" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}><img src={source} alt="نسخهٔ نمایشی با تنظیم نور و رنگ" style={{ filter }} /></div><span className="compare-label compare-original">اصلی</span><span className="compare-label compare-edit">پیش‌نمایش</span><span className="compare-line" style={{ left: `${split}%` }}><span>↔</span></span><input type="range" min="2" max="98" value={split} onChange={e => setSplit(Number(e.target.value))} className="compare-slider" aria-label="مقایسهٔ عکس اصلی و پیش‌نمایش" /></div><p className="comparison-hint">دستگیره را جابه‌جا کنید و دو تصویر را مقایسه کنید.</p>{!custom && <span className="sample-label">در حال نمایش عکس نمونه</span>}</div><div className="mirror-controls"><p className="form-intro">عکس خودتان را انتخاب کنید و با نور و رنگ بازی کنید.</p><input type="file" ref={input} accept="image/jpeg,image/png,image/webp" onChange={upload} hidden /><button className="upload-button" onClick={() => input.current?.click()}><Icon name="upload" size={25} /><strong>{custom ? "انتخاب عکس دیگر" : "انتخاب عکس از دستگاه"}</strong><small>JPG / PNG / WebP · حداکثر ۸ مگابایت</small></button><div className="mirror-presets" role="group" aria-label="حالت‌های آماده">{presets.map(p => <button key={p.name} aria-pressed={light === p.light && warmth === p.warmth && saturation === p.saturation} onClick={() => { setLight(p.light); setWarmth(p.warmth); setSaturation(p.saturation); }}>{p.name}</button>)}</div><label className="range-control" htmlFor="light-control"><span>روشنایی<output>{faNumber(light)}٪</output></span><input id="light-control" type="range" min="80" max="125" value={light} onChange={e => setLight(Number(e.target.value))} /></label><label className="range-control" htmlFor="warm-control"><span>گرمای رنگ<output>{faNumber(warmth)}٪</output></span><input id="warm-control" type="range" min="0" max="35" value={warmth} onChange={e => setWarmth(Number(e.target.value))} /></label><label className="range-control" htmlFor="saturation-control"><span>شادابی رنگ<output>{faNumber(saturation)}٪</output></span><input id="saturation-control" type="range" min="70" max="135" value={saturation} onChange={e => setSaturation(Number(e.target.value))} /></label><div className="mirror-tool-actions"><button className="button button-green" disabled={downloading} onClick={download}><Icon name="download" size={18} />{downloading ? "در حال ذخیره…" : "ذخیرهٔ تصویر"}</button><button className="icon-button reset-button" aria-label="بازنشانی تنظیمات" onClick={() => { setLight(100); setWarmth(0); setSaturation(100); setSplit(50); }}><Icon name="refresh" size={20} /></button></div>{error && <p role="alert" className="form-error">{error}</p>}<p className="mirror-privacy"><Icon name="lock" size={16} />عکس شما به سرور ارسال نمی‌شود.</p><p className="mirror-tool-warning">این ابزار فقط نور و رنگ را تغییر می‌دهد و شبیه‌سازی تزریق، تشخیص پزشکی یا پیش‌بینی نتیجهٔ درمان نیست.</p></div></div></Modal>;
}
