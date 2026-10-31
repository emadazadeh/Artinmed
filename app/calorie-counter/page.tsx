import CalorieCounter from "@/components/calorie-counter";
import { BookingButton } from "@/components/booking-provider";
import { Icon } from "@/components/icons";
import SiteFrame from "@/components/site-frame";
import StructuredData from "@/components/structured-data";
import { catalogCategories, foodCatalog, nutritionSource, searchFoods } from "@/lib/food-catalog";
import { calculateFood, calorieDate, foodNumber } from "@/lib/nutrition";
import { pageMetadata, pageSchema, site } from "@/lib/site";
import "./calorie-counter.css";

const title = "کالری‌شمار غذا؛ محاسبه کالری با گرم، قاشق و تعداد";
const description = "امروز چقدر غذا خوردی؟ در کالری‌شمار دکتر رسون غذا را جست‌وجو کن، مقدار مصرف را با گرم، قاشق یا تعداد وارد کن و کالری هر وعده و جمع روزت را ببین.";
const questions = [
  ["کالری غذا چگونه محاسبه می‌شود؟", "انرژیِ هر ۱۰۰ گرم در وزن مصرفی شما ضرب و بر ۱۰۰ تقسیم می‌شود. در این ابزار، کالری همان کیلوکالری یا kcal روی برچسب‌های غذایی است. جمع نهایی، مجموع غذاهای ثبت‌شده است؛ نیاز روزانه یا برنامهٔ رژیم شما نیست."],
  ["یک قاشق برنج با یک قاشق روغن چه فرقی دارد؟", "وزن قاشق به غذا بستگی دارد. ابزار برای هر غذا، وزن همان سهم را نشان می‌دهد. اگر دادهٔ قاشق موجود نباشد ولی وزن پیمانهٔ آن غذا وجود داشته باشد، قاشق غذاخوری از یک‌شانزدهم پیمانه محاسبه و مشخص می‌شود. این مقدار برای قاشق سرصاف است؛ قاشق پُر و قاشق‌های خانگی متفاوت‌اند."],
  ["غذای خام را انتخاب کنم یا پخته؟", "همان حالتی را انتخاب کنید که وزن یا مقدارش را اندازه گرفته‌اید؛ وزن برنج خام با برنج پخته یکسان نیست. برای برنج ساده، روغن، کره و افزودنی‌ها را جدا ثبت کنید. وزن‌ها برای بخش خوراکی غذا هستند؛ پوسته و استخوانِ غیرخوراکی را حساب نکنید."],
  ["آیا همهٔ غذاها و برندهای ایرانی در بانک هستند؟", `بانک شامل ${foodNumber(nutritionSource.records, 0)} رکورد از مجموعهٔ USDA SR Legacy است؛ غذاهای پرکاربرد نام فارسی دارند و بقیه با نام اصلی انگلیسی قابل جست‌وجو هستند. این مجموعه همهٔ برندها و دستورهای ایرانی را پوشش نمی‌دهد. برای محصول بسته‌بندی، اطلاعات برچسب را وارد کنید؛ برای غذای خانگی، مواد و افزودنی‌ها را جدا حساب کنید.`],
  ["اطلاعات از کجا آمده و چقدر دقیق است؟", "منبع، مجموعهٔ نهایی SR Legacy از USDA FoodData Central، انتشار آوریل ۲۰۱۸ است. وزن سهم‌ها از همان داده‌ها آمده و موارد تبدیل‌شده مشخص شده‌اند. اعداد برآوردی‌اند؛ دستور پخت، مقدار روغن، اندازهٔ سهم و برند می‌توانند نتیجه را تغییر دهند. برای محصول مشخص، برچسب همان بسته ملاک مناسب‌تری است."],
  ["دفتر غذایی من کجا ذخیره می‌شود؟", "ثبت‌های غذایی فقط در حافظهٔ همین مرورگر ذخیره می‌شوند و به سرور دکتر رسون ارسال نمی‌شوند. با دستگاه دیگر همگام نیستند و ممکن است با پاک‌کردن داده‌های مرورگر حذف شوند. اگر مرورگر اجازهٔ ذخیره ندهد، ابزار این موضوع را اعلام می‌کند."],
] as const;
export const metadata = pageMetadata(title, description, "/calorie-counter");

export default function CalorieCounterPage() {
  const egg = foodCatalog.find(food => food.id === "173424")!;
  const rice = foodCatalog.find(food => food.id === "168878")!;
  const eggUnit = egg.portions.find(unit => unit.id === egg.defaultPortion)!;
  const riceUnit = rice.portions.find(unit => unit.id === rice.defaultPortion)!;
  const sample = calculateFood(egg.kcal100g, 1, eggUnit.grams).kcal + calculateFood(rice.kcal100g, 5, riceUnit.grams).kcal;
  const schema = pageSchema({ path: "/calorie-counter", title, description, questions });
  const url = `${site.url}/calorie-counter`;
  const page = schema["@graph"].find(node => node["@type"] === "WebPage")!;
  page.mainEntity = { "@id": `${url}#app` };
  schema["@graph"].push({ "@type": "WebApplication", "@id": `${url}#app`, name: "کالری‌شمار دکتر رسون", url, description, applicationCategory: "HealthApplication", operatingSystem: "Web", inLanguage: "fa-IR", isAccessibleForFree: true, publisher: { "@id": `${site.url}/#organization` } });
  return <SiteFrame mobileBooking={false}>
    <StructuredData data={schema} />
    <main id="main" tabIndex={-1} className="calorie-counter-page">
      <section className="calorie-hero"><div className="container">
        <nav className="breadcrumbs" aria-label="مسیر صفحه"><a href="/">خانه</a><span aria-hidden="true">/</span><span aria-current="page">کالری‌شمار</span></nav>
        <div className="calorie-hero-grid"><div className="calorie-hero-copy"><span className="calorie-kicker">کالری‌شمار دکتر رسون</span><h1>امروز، چقدر<br /><em>انرژی خورده‌ای؟</em></h1><p>یک تخم‌مرغ، چند قاشق برنج یا یک لیوان شیر؛ غذایت را پیدا کن، مقدارش را بگو و جمع کالری روزت را ببین.</p><div className="calorie-hero-actions"><a className="button button-cream" href="#counter">شروع کالری‌شماری<Icon name="arrow-down" size={19} /></a><a className="calorie-hero-source" href="#calorie-sources">منبع داده‌ها و روش محاسبه</a></div><div className="calorie-hero-facts"><span><Icon name="search" size={17} />{foodNumber(nutritionSource.records, 0)} مادهٔ غذایی</span><span><Icon name="bowl" size={18} />گرم، قاشق و تعداد</span><span><Icon name="lock" size={17} />بدون ثبت‌نام</span></div></div>
        <div className="calorie-hero-visual" aria-label="نمونهٔ محاسبه برای یک تخم‌مرغ آب‌پز بزرگ و پنج قاشق سرصاف برنج سفید بدون روغن"><span className="calorie-orbit calorie-orbit-one" /><span className="calorie-orbit calorie-orbit-two" /><div className="calorie-example-plate"><div className="calorie-example-core"><span>فقط یک نمونه</span><strong>{foodNumber(sample, 0)}</strong><span>کیلوکالری</span><small>۱ تخم‌مرغ آب‌پز بزرگ<br />+ ۵ قاشق سرصاف برنج</small></div></div><span className="calorie-floating-label calorie-floating-egg"><Icon name="bowl" size={20} />هر مقدار، حساب خودش.</span><span className="calorie-floating-label calorie-floating-source"><Icon name="check" size={17} />بر پایهٔ داده‌های USDA</span></div></div>
      </div></section>
      <section className="calorie-tool-section"><div className="container"><CalorieCounter initial={searchFoods()} categories={catalogCategories} initialDate={calorieDate()} catalogueSize={nutritionSource.records} /></div></section>
      <section className="section calorie-method" id="calorie-sources" aria-labelledby="calorie-method-title"><div className="container"><div className="section-heading"><div><span className="eyebrow">اعداد روشن، با منبع مشخص</span><h2 id="calorie-method-title">از اندازهٔ سهم،<br />تا <em>جمع کالری.</em></h2></div><p>این ابزار برای شناخت مقدار مصرف است.<br />نتیجه‌ها برآوردند؛ یک نسخهٔ غذایی شخصی نیستند.</p></div><div className="calorie-method-grid"><article><Icon name="bowl" size={29} /><h3>همان چیزی که خورده‌ای</h3><p>خام یا پخته بودن را درست انتخاب کن. مقدار روغن، کره، سس و سایر افزودنی‌ها را هم جدا حساب کن.</p></article><article><Icon name="drop" size={29} /><h3>هر سهم، وزن خودش را دارد</h3><p>زیر واحد انتخابی، وزن مرجع را می‌بینی. پیمانه، لیوان و قاشق واقعی ممکن است متفاوت باشند؛ با داشتن وزن، گزینهٔ گرم را انتخاب کن.</p></article><article><Icon name="search" size={29} /><h3>یک بانک واقعی، قابل دریافت</h3><p>داده‌های USDA FoodData Central، مجموعهٔ SR Legacy آوریل ۲۰۱۸؛ دریافت‌شده در ۳۱ اکتبر ۲۰۲۶. هر غذا پیوند منبع خودش را دارد.</p><a href="https://fdc.nal.usda.gov/download-datasets/" target="_blank" rel="noopener noreferrer">منبع USDA<Icon name="arrow" size={16} /></a><a href="/data/calorie-foods.csv" download>دانلود بانک کالری (CSV)<Icon name="download" size={16} /></a></article></div></div></section>
      <section className="section faq-section" aria-labelledby="calorie-faq-title"><div className="container faq-grid"><div><span className="eyebrow">پیش از محاسبه، بیشتر بدان</span><h2 id="calorie-faq-title">پرسش‌های رایج<br />دربارهٔ <em>کالری‌شمار.</em></h2></div><div className="faq-list">{questions.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span className="faq-plus">+</span></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="calorie-nutrition-cta"><div className="container"><div><span className="eyebrow">از شناخت غذا تا برنامهٔ متناسب با شما</span><h2>عددها را دیدی؛<br /><em>برای قدم بعدی، همراهت هستیم.</em></h2><p>برای برنامهٔ تغذیه و ورزش متناسب با هدف، شرایط سلامت و سبک زندگی‌ات درخواست بده.</p></div><div><BookingButton service="nutrition-fitness">درخواست برنامهٔ شخصی<Icon name="arrow" size={18} /></BookingButton><a className="text-link" href="/services/nutrition-fitness">آشنایی با برنامهٔ تغذیه و ورزش</a></div></div></section>
    </main>
  </SiteFrame>;
}
