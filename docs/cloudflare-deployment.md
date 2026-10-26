# انتشار مستقل در حساب Cloudflare مالک

این مسیر برای Worker و پایگاه دادهٔ حساب Cloudflare مالک است. سایت فعلی در Sites همچنان مستقل است؛ داده‌های آن خودکار به حساب جدید منتقل نمی‌شوند.

## ساخت پایگاه داده

در Cloudflare از مسیر **Storage & databases → D1 → Create database** یک دیتابیس با نام `doctor-resoon-db` بسازید و مقدار **Database ID** آن را کپی کنید. شناسهٔ Account ID جایگزین این مقدار نیست.

در تنظیمات Build این متغیرها را وارد کنید:

| نام | مقدار |
| --- | --- |
| `NODE_VERSION` | `24` |
| `PNPM_VERSION` | `11.25.0` |
| `CLOUDFLARE_D1_DATABASE_ID` | Database ID واقعی از D1 |
| `CLOUDFLARE_D1_DATABASE_NAME` | اختیاری؛ اگر نام دیتابیس متفاوت است. مقدار پیش‌فرض `doctor-resoon-db` است. |

توکن ساخت و انتشار را اتصال بومی Cloudflare به مخزن مدیریت می‌کند. متغیر Database ID باید هنگام **Build** در دسترس باشد تا در تنظیم خروجی Worker ثبت شود.

## فیلدهای انتشار مخزن

| فیلد | مقدار |
| --- | --- |
| Project name | `doctor-resoon` |
| Build command | `pnpm run build` |
| Deploy command | `pnpm run deploy:cloudflare` |
| Preview command | `pnpm exec wrangler preview --config dist/server/wrangler.json` |
| Root directory | خالی؛ ریشهٔ مخزن |
| Production branch | `improve/seo-and-patient-experience` تا زمانی که تغییرات در `main` ادغام شوند |

فرمان Deploy ابتدا تطبیق شناسهٔ D1 با خروجی Build را بررسی می‌کند، مهاجرت‌های اجرا‌نشدهٔ پوشهٔ `drizzle` را با Wrangler اعمال می‌کند و پس از موفقیت، Worker و فایل‌های عمومی را منتشر می‌کند. جدول `d1_migrations` مانع اجرای دوبارهٔ مهاجرت‌های قبلی می‌شود. خطای مهاجرت، مرحلهٔ انتشار را متوقف می‌کند.

برای بررسی محلیِ بستهٔ انتشار بدون تغییر دیتابیس ابری یا انتشار Worker:

```sh
CLOUDFLARE_D1_DATABASE_ID=<database-id> pnpm build
CLOUDFLARE_D1_DATABASE_ID=<database-id> pnpm deploy:cloudflare --dry-run
```

فرمان Preview از قابلیت Cloudflare Previews استفاده می‌کند. این فرمان، مسیر انتشار اصلی و اعمال مهاجرت‌های production را اجرا نمی‌کند؛ تنظیم منابع و طرح دیتابیس محیط Preview را جداگانه در Cloudflare مدیریت کنید.

## بررسی انجام‌شده

TypeScript و ۱۶ آزمون موفق بودند. ساخت با یک شناسهٔ آزمایشی و اجرای `--dry-run` بستهٔ Worker و اتصال `DB` را بررسی کرد و هیچ مهاجرت یا انتشار ابری انجام نداد. دو فایل SQL روی D1 محلی اجرا شدند و اجرای دوبارهٔ فرمان مهاجرت، «No migrations to apply» برگرداند. حالت ساخت پیش‌فرض Sites نیز جداگانه بررسی شد.

پس از تعیین دامنهٔ اصلی جدید، نشانی `lib/site.ts` باید به‌روزرسانی شود تا canonical، نقشهٔ سایت و اطلاعات اشتراک‌گذاری به همان دامنه اشاره کنند. نام، محدوده و داده‌های قبلی سایت موجود را از روی انتشار جدید حدس نزنید.
