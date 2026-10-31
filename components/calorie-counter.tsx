"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { calculateFood, calorieDate, diaryStorageKey, entryCalories, foodNumber, meals, parseFoodNumber, readDiary, totalCalories, validDiaryDate, type DiaryEntry, type Food, type Meal } from "@/lib/nutrition";

type SearchResult = { foods: Food[]; total: number; offset: number; hasMore: boolean };
type Props = { initial: SearchResult; categories: { id: string; label: string; count: number }[]; initialDate: string; catalogueSize: number };
const gramPortion = { id: "gram", label: "گرم", grams: 1, basis: "weight", original: "gram" };

export default function CalorieCounter({ initial, categories, initialDate, catalogueSize }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [result, setResult] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [retry, setRetry] = useState(0);
  const [offset, setOffset] = useState(0);
  const [mode, setMode] = useState<"search" | "custom">("search");
  const [selected, setSelected] = useState<Food | null>(null);
  const [portionId, setPortionId] = useState("gram");
  const [amount, setAmount] = useState("1");
  const [meal, setMeal] = useState<Meal>("breakfast");
  const [date, setDate] = useState(initialDate);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [storageWritable, setStorageWritable] = useState(true);
  const [storageError, setStorageError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [clearPending, setClearPending] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customKcal, setCustomKcal] = useState("");
  const [customGrams, setCustomGrams] = useState("100");
  const editor = useRef<HTMLElement>(null);
  const quantityInput = useRef<HTMLInputElement>(null);
  const firstSearch = useRef(true);
  const searchGeneration = useRef(0);

  useEffect(() => {
    try { setEntries(readDiary(localStorage.getItem(diaryStorageKey))); }
    catch { setStorageWritable(false); setStorageError("ذخیره‌های این مرورگر قابل خواندن نیست یا دسترسی به حافظه بسته است. محاسبه فعلاً فقط در همین صفحه انجام می‌شود؛ ذخیرهٔ قبلی بازنویسی نمی‌شود."); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !storageWritable) return;
    try { localStorage.setItem(diaryStorageKey, JSON.stringify(entries)); }
    catch { setStorageWritable(false); setStorageError("مرورگر اجازهٔ ذخیره نمی‌دهد یا حافظه پر شده است. محاسبات فعلاً فقط تا وقتی صفحه باز است باقی می‌مانند."); }
  }, [entries, ready, storageWritable]);
  useEffect(() => {
    if (firstSearch.current && query === "" && category === "all" && retry === 0) { firstSearch.current = false; return; }
    firstSearch.current = false;
    const controller = new AbortController(); const generation = ++searchGeneration.current;
    setLoading(true); setSearchError("");
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/foods?q=${encodeURIComponent(query)}&category=${category}&offset=${offset}`, { signal: controller.signal });
        if (!response.ok) throw new Error("دریافت غذاها ممکن نشد. دوباره تلاش کنید.");
        const data = await response.json() as SearchResult;
        if (generation === searchGeneration.current) setResult(data);
      } catch (e) { if (!controller.signal.aborted) setSearchError(e instanceof Error ? e.message : "ارتباط برقرار نشد."); }
      finally { if (generation === searchGeneration.current && !controller.signal.aborted) setLoading(false); }
    }, 220);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, category, offset, retry]);
  useEffect(() => {
    if (!selected) return;
    quantityInput.current?.focus({ preventScroll: true });
    editor.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [selected]);

  const dayEntries = entries.filter(entry => entry.date === date);
  const total = totalCalories(dayEntries);
  const portion = selected?.portions.find(unit => unit.id === portionId);
  let preview: { grams: number; kcal: number } | undefined;
  if (selected && portion) { try { preview = calculateFood(selected.kcal100g, parseFoodNumber(amount), portion.grams); } catch { /* Display a validation message when the visitor submits. */ } }
  const dayLabel = new Intl.DateTimeFormat("fa-IR", { dateStyle: "long", timeZone: "Asia/Tehran" }).format(new Date(`${date}T12:00:00+03:30`));

  function chooseFood(food: Food) {
    setSelected(food); setPortionId(food.defaultPortion); setAmount("1"); setEditing(null); setError(""); setNotice("");
  }
  function changeDay(next: string) {
    if (!validDiaryDate(next)) return;
    setDate(next); setEditing(null); setClearPending(false); setNotice(""); setError("");
  }
  function saveEntry(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (!ready || !selected || !portion) return;
    if (entries.length >= 2000 && !editing) { setError("ظرفیت ذخیرهٔ این مرورگر پر شده؛ برای افزودن، یکی از موارد قبلی را حذف کنید."); return; }
    try {
      calculateFood(selected.kcal100g, parseFoodNumber(amount), portion.grams);
      const entry: DiaryEntry = { id: editing ?? crypto.randomUUID(), date, meal, foodName: selected.name, kcal100g: selected.kcal100g, amount: parseFoodNumber(amount), portion, ...(/^\d+$/.test(selected.id) ? { fdcId: selected.id } : {}) };
      setEntries(previous => editing ? previous.map(item => item.id === editing ? entry : item) : [...previous, entry]);
      setNotice(editing ? "مقدار غذا به‌روزرسانی شد." : `${selected.name} به ${meals.find(([id]) => id === meal)?.[1]} اضافه شد.`);
      setEditing(null);
    } catch (e) { setError(e instanceof Error ? e.message : "مقدار را بررسی کنید."); }
  }
  function editEntry(entry: DiaryEntry) {
    const portions = entry.portion.id === "gram" ? [gramPortion] : [entry.portion, gramPortion];
    setSelected({ id: entry.fdcId ?? `custom-${entry.id}`, name: entry.foodName, originalName: "", category: "other", kcal100g: entry.kcal100g, portions, defaultPortion: entry.portion.id, localized: true });
    setPortionId(entry.portion.id); setAmount(String(entry.amount)); setMeal(entry.meal); setEditing(entry.id); setError(""); setNotice("");
  }
  function useCustomFood(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const kcal = parseFoodNumber(customKcal), grams = parseFoodNumber(customGrams);
    if (!customName.trim() || customName.trim().length > 120 || !Number.isFinite(kcal) || kcal < 0 || !Number.isFinite(grams) || grams <= 0 || grams > 10000 || kcal / grams * 100 > 1000) { setError("نام، کالری و وزن مرجعِ درج‌شده روی برچسب را درست وارد کنید."); return; }
    const unit = { id: "label-serving", label: "سهم درج‌شده روی برچسب", grams, basis: "label", original: "label-serving" };
    chooseFood({ id: `custom-${crypto.randomUUID()}`, name: customName.trim(), originalName: "بر اساس اطلاعات برچسبی که وارد کرده‌اید", category: "other", kcal100g: kcal / grams * 100, portions: [gramPortion, unit], defaultPortion: unit.id, localized: true });
    setNotice("اطلاعات محصول از برچسب شما وارد شد؛ مقدار مصرف را مشخص کنید.");
  }

  return <div className="calorie-workspace" id="counter">
    <div className="calorie-daybar"><div><span className="calorie-kicker">دفتر غذایی شما</span><h2>امروز چه خوردی؟</h2><p>{dayLabel}</p></div><div className="calorie-date-controls"><label htmlFor="calorie-date">روز ثبت<input id="calorie-date" type="date" value={date} min="2000-01-01" max="2100-12-31" onChange={e => changeDay(e.target.value)} /></label><button type="button" className="calorie-quiet-button" onClick={() => changeDay(calorieDate())}>امروز</button></div></div>
    <div className="calorie-grid">
      <section className="calorie-glass calorie-search-panel" aria-labelledby="food-search-heading">
        <div className="calorie-panel-heading"><div><span className="calorie-step">۱ · انتخاب غذا</span><h3 id="food-search-heading">غذایت را پیدا کن.</h3></div><Icon name="search" size={26} /></div>
        <div className="calorie-mode-buttons" role="group" aria-label="روش افزودن غذا"><button type="button" aria-pressed={mode === "search"} onClick={() => { setMode("search"); setError(""); }}>جست‌وجوی غذا</button><button type="button" aria-pressed={mode === "custom"} onClick={() => { setMode("custom"); setError(""); }}>محصول با برچسب</button></div>
        {mode === "search" ? <>
          <label className="calorie-search-box" htmlFor="food-query"><Icon name="search" size={21} /><input id="food-query" type="search" maxLength={100} autoComplete="off" value={query} placeholder="مثلاً تخم‌مرغ، برنج، شیر یا rice…" onChange={e => { setQuery(e.target.value); setOffset(0); }} /><span className="sr-only">نام غذا به فارسی یا انگلیسی</span></label>
          <div className="calorie-quick-search" aria-label="جست‌وجوهای پرکاربرد">{["تخم‌مرغ", "برنج", "مرغ", "شیر", "سیب"].map(term => <button type="button" key={term} onClick={() => { setQuery(term); setCategory("all"); setOffset(0); }}>{term}</button>)}</div>
          <div className="calorie-categories" role="group" aria-label="گروه غذایی">{categories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setOffset(0); }}>{item.label}</button>)}</div>
          <p className="calorie-search-info" aria-live="polite">{loading ? "در حال جست‌وجو…" : `${foodNumber(result.total, 0)} نتیجه از ${foodNumber(catalogueSize, 0)} مادهٔ غذایی`}</p>
          {searchError ? <div className="calorie-inline-error" role="alert"><p>{searchError}</p><button type="button" onClick={() => setRetry(v => v + 1)}>تلاش دوباره</button></div> : <>
            <div className="calorie-results" aria-busy={loading}>{result.foods.map(food => <button type="button" className={`calorie-food-result ${selected?.id === food.id ? "is-selected" : ""}`} key={food.id} onClick={() => chooseFood(food)} aria-label={`انتخاب ${food.name}`}><span className="calorie-food-symbol"><Icon name={food.category === "drinks" ? "drop" : food.category === "fruits" || food.category === "vegetables" ? "leaf" : "bowl"} size={22} /></span><span className="calorie-food-name"><strong dir="auto">{food.name}</strong><small>در ۱۰۰ گرم بخش خوراکی</small></span><span className="calorie-food-energy"><b>{foodNumber(food.kcal100g)}</b><small>کیلوکالری</small></span><Icon name="plus" size={18} /></button>)}</div>
            {result.foods.length === 0 && <p className="calorie-empty-search">غذایی پیدا نشد. نام ساده‌تر یا نام انگلیسی را امتحان کن؛ برای غذای ترکیبی، اجزا را جدا ثبت کن یا اطلاعات برچسب را وارد کن.</p>}
            {(result.hasMore || offset > 0) && <div className="calorie-pagination"><button type="button" disabled={offset === 0 || loading} onClick={() => setOffset(v => Math.max(0, v - 24))}>قبلی</button><span>صفحهٔ {foodNumber(offset / 24 + 1, 0)}</span><button type="button" disabled={!result.hasMore || loading} onClick={() => setOffset(v => v + 24)}>بعدی</button></div>}
          </>}
          <p className="calorie-search-footnote">غذاهای پرکاربرد نام فارسی دارند؛ بانک گسترده با نام اصلی انگلیسی هم قابل جست‌وجو است.</p>
        </> : <form className="calorie-custom-form" onSubmit={useCustomFood}><p>اگر محصولت در بانک نیست، انرژی و وزنِ سهم را از روی برچسب تغذیه‌ای وارد کن. برای مثال، ۱۲۰ کیلوکالری در ۳۰ گرم.</p><label htmlFor="custom-food-name">نام محصول<input id="custom-food-name" required maxLength={120} value={customName} onChange={e => setCustomName(e.target.value)} placeholder="مثلاً بیسکویت من" /></label><div className="calorie-input-row"><label htmlFor="custom-food-kcal">انرژی برچسب (کیلوکالری)<input id="custom-food-kcal" required inputMode="decimal" value={customKcal} onChange={e => setCustomKcal(e.target.value)} placeholder="۱۲۰" /></label><label htmlFor="custom-food-grams">وزن همان سهم (گرم)<input id="custom-food-grams" required inputMode="decimal" value={customGrams} onChange={e => setCustomGrams(e.target.value)} /></label></div><button className="button button-green" type="submit">انتخاب این محصول<Icon name="arrow" size={18} /></button></form>}
      </section>
      <div className="calorie-right-column">
        <section ref={editor} className="calorie-glass calorie-portion-panel" aria-labelledby="portion-heading"><div className="calorie-panel-heading"><div><span className="calorie-step">۲ · مقدار مصرف</span><h3 id="portion-heading">چقدر خوردی؟</h3></div><Icon name="bowl" size={27} /></div>
          {selected ? <form onSubmit={saveEntry}>
            <div className="calorie-chosen-food"><strong dir="auto">{selected.name}</strong>{selected.localized && selected.originalName && <small lang={selected.id.startsWith("custom") ? "fa" : "en"} dir="auto">{selected.originalName}</small>}<span>{foodNumber(selected.kcal100g)} کیلوکالری در ۱۰۰ گرم</span></div>
            <div className="calorie-input-row"><label htmlFor="food-amount">مقدار<input ref={quantityInput} id="food-amount" required inputMode="decimal" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }} aria-describedby="portion-weight" /></label><label htmlFor="food-portion">واحد مصرف<select id="food-portion" value={portionId} onChange={e => setPortionId(e.target.value)}>{selected.portions.map(unit => <option key={unit.id} value={unit.id}>{unit.label}</option>)}</select></label></div>
            <p id="portion-weight" className="calorie-weight-note">هر {portion?.label}: حدود {foodNumber(portion?.grams ?? 0, 2)} گرم{portion?.basis === "cup/16" ? "؛ محاسبه‌شده از یک‌شانزدهم پیمانهٔ همین غذا" : portion?.basis === "tbsp/3" ? "؛ یک‌سوم قاشق غذاخوری همین غذا" : ""}.</p>
            {selected.note && <p className="calorie-food-note">{selected.note}</p>}
            <label className="calorie-meal-label" htmlFor="food-meal">وعده<select id="food-meal" value={meal} onChange={e => setMeal(e.target.value as Meal)}>{meals.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
            <div className="calorie-live-preview" aria-live="polite"><span>انرژی این مقدار</span><strong>{preview ? foodNumber(preview.kcal) : "—"}<small>کیلوکالری</small></strong><span>{preview ? `وزن مصرفی: حدود ${foodNumber(preview.grams, 2)} گرم` : "مقدار معتبر وارد کن."}</span></div>
            <button className="button button-green full-width" type="submit" disabled={!ready}>{editing ? "ذخیرهٔ تغییرات" : "افزودن به روز من"}<Icon name="plus" size={19} /></button>
            {editing && <button className="calorie-quiet-button" type="button" onClick={() => { setEditing(null); setNotice("ویرایش لغو شد."); }}>لغو ویرایش</button>}
            {!selected.id.startsWith("custom") && <a className="calorie-source-link" href={`https://fdc.nal.usda.gov/food-details/${selected.id}/nutrients`} target="_blank" rel="noopener noreferrer">مشاهدهٔ رکورد غذا در USDA<Icon name="arrow" size={15} /></a>}
          </form> : <div className="calorie-selection-empty"><span><Icon name="bowl" size={42} /></span><p>از لیست یک غذا انتخاب کن؛<br />بعد مقدارش را با گرم، عدد یا سهم موجود مشخص کن.</p></div>}
          {error && <p className="calorie-inline-error" role="alert">{error}</p>}<p className="calorie-notice" role="status">{notice}</p>
        </section>
        <aside className="calorie-total-panel" aria-labelledby="day-total-title"><div><span className="calorie-step">۳ · جمع روز شما</span><h3 id="day-total-title">هر لقمه، یک تصویر روشن‌تر.</h3></div><p className="calorie-grand-total"><strong data-testid="day-calories">{foodNumber(total, 0)}</strong><span>کیلوکالریِ ثبت‌شده</span></p><div className="calorie-meal-totals">{meals.map(([id,label]) => <div key={id}><span>{label}</span><strong>{foodNumber(totalCalories(dayEntries.filter(entry => entry.meal === id)), 0)}</strong></div>)}</div><p className="calorie-total-note">جمع همین مواردی که وارد کرده‌ای؛ نیاز روزانهٔ بدن یا هدف رژیمی شما نیست.</p></aside>
      </div>
    </div>
    <section className="calorie-glass calorie-diary" aria-labelledby="diary-title"><div className="calorie-panel-heading"><div><span className="calorie-step">بشقاب امروزت، به زبان عدد</span><h3 id="diary-title">غذاهای ثبت‌شدهٔ {dayLabel}</h3></div>{dayEntries.length > 0 && <button className="calorie-quiet-button" type="button" onClick={() => setClearPending(true)}><Icon name="trash" size={17} />پاک‌کردن این روز</button>}</div>
      {clearPending && <div className="calorie-clear-confirm" role="group" aria-label="تأیید پاک‌کردن روز"><p>موارد همین روز پاک شوند؟</p><button type="button" onClick={() => { setEntries(previous => previous.filter(entry => entry.date !== date)); setClearPending(false); setEditing(null); setNotice("موارد این روز پاک شدند."); }}>بله، پاک شوند</button><button type="button" onClick={() => setClearPending(false)}>انصراف</button></div>}
      {!ready ? <p>در حال خواندن ذخیرهٔ این مرورگر…</p> : dayEntries.length === 0 ? <div className="calorie-diary-empty"><Icon name="leaf" size={28} /><p>هنوز غذایی برای این روز ثبت نکرده‌ای.<br /><span>از یک تخم‌مرغ یا چند قاشق برنج شروع کن.</span></p></div> : <ul className="calorie-diary-list">{dayEntries.map(entry => <li key={entry.id}><span className="calorie-diary-food"><strong dir="auto">{entry.foodName}</strong><small>{meals.find(([id]) => id === entry.meal)?.[1]} · {foodNumber(entry.amount, 3)} {entry.portion.label} · حدود {foodNumber(entry.amount * entry.portion.grams, 2)} گرم</small></span><strong className="calorie-entry-kcal">{foodNumber(entryCalories(entry))}<small>کیلوکالری</small></strong><div className="calorie-entry-actions"><button type="button" aria-label={`ویرایش ${entry.foodName}`} onClick={() => editEntry(entry)}><Icon name="edit" size={19} /></button><button type="button" aria-label={`حذف ${entry.foodName}`} onClick={() => { setEntries(previous => previous.filter(item => item.id !== entry.id)); if (editing === entry.id) setEditing(null); setNotice(`${entry.foodName} حذف شد.`); }}><Icon name="trash" size={19} /></button></div></li>)}</ul>}
      <p className="calorie-device-note"><Icon name="lock" size={17} />ثبت‌های غذایی در همین مرورگر نگهداری می‌شوند و به سرور ارسال نمی‌شوند؛ با دستگاه‌های دیگر همگام نیستند.</p>{storageError && <p className="calorie-inline-error" role="alert">{storageError}</p>}
    </section>
  </div>;
}
