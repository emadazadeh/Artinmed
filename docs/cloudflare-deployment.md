# انتشار مستقل در حساب Cloudflare مالک

این مسیر برای Worker و پایگاه دادهٔ حساب Cloudflare مالک است. سایت فعلی در Sites همچنان مستقل است؛ داده‌های آن خودکار به حساب جدید منتقل نمی‌شوند.

## ساخت پایگاه داده

دیتابیس ساخته‌شده توسط مالک با نام `doctor-resoon-db` و شناسهٔ `a919358a-81e0-4f54-8c86-bdd1a414f936` در `cloudflare.database.json` ثبت شده است. این شناسه، شناسهٔ عمومی منبع است و توکن دسترسی نیست.

برای استفاده در حساب یا دیتابیس دیگری، فایل تنظیم را به نام و Database ID همان دیتابیس تغییر دهید. ساخت دیتابیس در Cloudflare از مسیر **Storage & databases → D1 → Create database** انجام می‌شود. شناسهٔ Account ID جایگزین Database ID نیست.

در تنظیمات Build این متغیرها را وارد کنید:

| نام | مقدار |
| --- | --- |
| `NODE_VERSION` | `24` |
| `PNPM_VERSION` | `11.25.0` |
| `CLOUDFLARE_D1_DATABASE_ID` | اختیاری؛ برای جایگزین‌کردن شناسهٔ ثبت‌شده در فایل تنظیم |
| `CLOUDFLARE_D1_DATABASE_NAME` | اختیاری؛ برای جایگزین‌کردن نام دیتابیس ثبت‌شده |

توکن ساخت و انتشار را اتصال بومی Cloudflare به مخزن مدیریت می‌کند. ثبت متغیر Database ID برای انتشار همین پروژه الزامی نیست؛ فرمان Deploy آن را از فایل تنظیم می‌خواند. اگر از متغیر برای تغییر شناسه استفاده می‌کنید، مقدار آن را هنگام Build و Deploy یکسان تنظیم کنید.

## فیلدهای انتشار مخزن

| فیلد | مقدار |
| --- | --- |
| Project name | `doctor-resoon` |
| Build command | `pnpm run build` |
| Deploy command | `pnpm run deploy:cloudflare` |
| Preview command | `pnpm exec wrangler preview --config dist/server/wrangler.json` |
| Root directory | خالی؛ ریشهٔ مخزن |
| Production branch | `main` |

فرمان Deploy ابتدا شناسهٔ واقعی D1 را بررسی می‌کند و یک تنظیم مستقل در `dist/server/cloudflare-deploy.json` می‌سازد. در این تنظیم، شناسهٔ نمونهٔ managed به شناسهٔ دیتابیس مالک تبدیل می‌شود؛ یک شناسهٔ واقعیِ متفاوت در خروجی Build پذیرفته نمی‌شود. سپس مهاجرت‌های اجرا‌نشدهٔ پوشهٔ `drizzle` با Wrangler اعمال می‌شوند و پس از موفقیت، Worker و فایل‌های عمومی منتشر می‌شوند. جدول `d1_migrations` مانع اجرای دوبارهٔ مهاجرت‌های قبلی می‌شود. خطای مهاجرت، مرحلهٔ انتشار را متوقف می‌کند.

## رفع خطای تنظیمات Build

اگر لاگ `Executing user build command: pnpm run deploy:cloudflare` را نشان می‌دهد، فرمان انتشار به‌جای فرمان ساخت اجرا شده است. فیلد **Build command** باید `pnpm run build` و فیلد **Deploy command** باید `pnpm run deploy:cloudflare` باشد.

خطای `Missing script: deploy:cloudflare` یعنی commit انتخاب‌شده، اسکریپت انتشار جدید را ندارد. شاخهٔ production را روی `main` قرار دهید و یک Build جدید از آخرین commit شروع کنید.

پس از ذخیرهٔ تنظیمات جدید، یک Build از آخرین commit شاخهٔ `main` شروع کنید. طبق [راهنمای تنظیمات Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#build-settings)، Retry تنظیمات موجود در زمان تلاش مجدد را به کار می‌برد. برای رفع `Missing script` نیز باید کد انتخاب‌شده شامل اسکریپت جدید انتشار باشد.

برای بررسی محلیِ بستهٔ انتشار بدون تغییر دیتابیس ابری یا انتشار Worker:

```sh
pnpm build
pnpm deploy:cloudflare --dry-run
```

برای انتشار اولیه، Preview builds را خاموش نگه دارید. فرمان Preview از قابلیت Cloudflare Previews استفاده می‌کند و مسیر تنظیم production را اجرا نمی‌کند؛ هنگام فعال‌کردن آن، اتصال و طرح دیتابیس محیط Preview را جداگانه در Cloudflare تنظیم کنید.

## بررسی انجام‌شده

TypeScript و ۱۸ آزمون موفق بودند. ساخت و اجرای `--dry-run` بدون متغیر دستی دیتابیس، بستهٔ Worker و اتصال `DB` به دیتابیس ثبت‌شدهٔ مالک را بررسی کرد و هیچ مهاجرت یا انتشار ابری انجام نداد. تنظیم managed در فایل ساخت اصلی حفظ شد و فقط فایل مستقل انتشار به شناسهٔ مالک اشاره کرد. دو فایل SQL پیش‌تر روی D1 محلی اجرا شدند و اجرای دوبارهٔ فرمان مهاجرت، «No migrations to apply» برگرداند.

پس از تعیین دامنهٔ اصلی جدید، نشانی `lib/site.ts` باید به‌روزرسانی شود تا canonical، نقشهٔ سایت و اطلاعات اشتراک‌گذاری به همان دامنه اشاره کنند. نام، محدوده و داده‌های قبلی سایت موجود را از روی انتشار جدید حدس نزنید.
