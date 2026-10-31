# دکتر رسون / Doctor Resoon

مرجع خدمات فعلی: [شرح کسب‌وکار](docs/doctor-resoon-brief.md). تحقیق، جهت طراحی و شواهد بررسی: [بازطراحی ۲۷ اکتبر](docs/redesign-2026-10-27.md).

## Active service lines

1. Personalized nutrition and exercise programs (`nutrition-fitness`).
2. Online physician consultation (`online-consultation`).
3. Home therapy and coordinated medical team visits (`medical-care`).
4. Vaccination and preventive care (`vaccination`).

Blood tests/home sample collection and home aesthetics (mesotherapy, Botox, PRP) are **coming soon** and cannot create bookings. Existing Botox records still track by reference and phone; its former service URL redirects to the upcoming section.

The site collects name, mobile number, city, service and preferred contact time. D1 persists requests and returns a reference. Visitors can preview and open a prepared message to the owner's WhatsApp and press Send themselves. Submission is a coordination request, not a confirmed appointment, automatic program, video call, prescription or dispatch. No clinician credentials, coverage, prices, hours, inventory or guaranteed results are invented.

## Calorie counter

`/calorie-counter` offers food search, portions, per-meal totals and a date-based local diary in the existing liquid glass theme. The pinned USDA SR Legacy catalogue contains 7,793 calorie records, with 79 commonly used Persian names and aliases; the extended catalogue retains original English names. Household portions keep their source gram weights; derived spoons are disclosed. Visitors can also enter a product's label calories and serving grams. Daily entries remain in browser localStorage and are never sent to the server. Search uses the local read-only `/api/foods` catalogue; no nutrition API key or runtime third-party lookup is required. Downloadable CSV: `/data/calorie-foods.csv`.

See [sources, import procedure and verification](docs/calorie-counter.md). This is an educational intake calculator, not a personalized energy target or a fifth booking service.

## Development

Node 22.13+ and pnpm 11.25.0. Vinext, React, Cloudflare Workers, D1 and Drizzle.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Apply committed SQL migrations once to a fresh local D1 before testing forms; preserve existing databases. No schema change is needed for the new service lines. Booking validates active IDs, future preference dates, phone normalization, consent, honeypot, idempotency and per-phone quota. Tracking returns no name, phone or city.

## Hosting and SEO

The existing public Site is https://doctor-resoon.cometolive34.chatgpt.site. Preserve `.openai/hosting.json`, its project ID, DB binding and audience. The owner's separate Cloudflare deployment has its own database; data is not transferred automatically. See [Cloudflare deployment](docs/cloudflare-deployment.md).

See [SEO implementation and verification](docs/seo-2026-10-27.md). `/services` is the crawlable directory for the four active lines. `lib/site.ts` is the origin and metadata source. The sitemap derives all active service routes. Public content renders on the server; booking loads on interaction. The liquid glass theme has opaque fallbacks and respects reduced motion/transparency. Images have responsive WebP variants and versioned filenames. The founder portrait is AI-edited from the owner's photographs; visible captions disclose the edit.

## Source map

- `lib/clinic-data.ts`: active services, names and FAQ; legacy names for tracking.
- `lib/upcoming-services.ts`: non-bookable upcoming lines.
- `lib/service-guides.ts`: service pages and FAQ metadata.
- `components/clinic-home.tsx`: homepage and direct service selection.
- `components/booking-dialog.tsx`: booking, tracking and WhatsApp success state.
- `lib/whatsapp.ts`: encoded message and destination from owner-supplied contact.
- `lib/brand.ts`: confirmed founder/contact information and portrait source set.
- `lib/site.ts`: canonical URLs, sitemap paths and JSON-LD.
- `app/liquid-glass.css`: glass controls, premium home layout and accessibility fallbacks.
- `db/`, `drizzle/`, `app/api/appointments/`: persistent requests and data access.

No token or application secret is stored in the source or deployment archive.

The public Search Console verification response at `/google5b4ed26796eb34ea.html` must keep its exact URL and content. `app/google5b4ed26796eb34ea.html/route.ts` serves it directly, avoiding the managed static host's `.html` redirects. Publishing this response prepares ownership verification; the owner must complete Verify in Search Console.
