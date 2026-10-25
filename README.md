# Doctor Resoon — دکتر رسون

مرجع اطلاعات کسب‌وکار: [doctor-resoon-brief.md](docs/doctor-resoon-brief.md)

دکتر رسون: ابتدا ویزیت آنلاین پزشک، سپس تعیین خدمت و هماهنگی تیم درمانی متناسب با نیاز بیمار.

## Current service lines

1. **Medical care at home:** online physician assessment; injections, IV therapy and other indicated home care are coordinated based on the physician's assessment.
2. **Vaccination:** requests for HPV or other needed vaccines, subject to individual assessment, availability, storage/transport requirements and suitability for home delivery of care.
3. **Botox at home:** initial assessment followed, when appropriate, by an in-person physician visit; the physician personally examines the patient and administers the injection.

The website presents Doctor Resoon as a medical team with a physician-led model. It contains no invented clinician biographies, license numbers, ratings, clinic address, region of coverage, prices, vaccine inventory or around-the-clock availability claims.

## Request flow

Visitors choose a service line, a preferred date/time for online physician contact, and provide name, mobile number and city. They receive a persistent request reference and can track it using the reference plus the matching mobile number.

A submission is an **assessment request**, not a confirmed consultation, a prescription or an automatic team dispatch. The method and final time of the online consultation, coverage and downstream care are coordinated by the team. Live video consultation, prescribing, staff dispatch, notifications and a staff dashboard are not implemented or represented as automated capabilities.

Only basic coordination information is collected by the form. It does not request diagnoses, medical records, photos or a street address. The prior beauty mirror and generic aesthetics service offering have been removed from the product.

## Data and migration

Cloudflare D1 stores requests in `appointments`. Migration `0001_useful_warhawk.sql` adds a nullable `city` column without altering or deleting earlier records. New requests require city information. Existing references and former service names remain readable through tracking; old service IDs cannot create new requests.

Requests enforce known service IDs, allowed preference dates/times, valid Iranian mobile numbers (including Persian/Arabic digits), consent, a honeypot, a request idempotency key and a limit of three requests per mobile number in 24 hours. Tracking never returns a person's name, mobile number or city.

## Development

Requires Node 22.13+ and pnpm. The project uses Vinext with the maintained Cloudflare Sites integration.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

For a fresh local D1 database, apply each committed SQL migration in order, once:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_same_rattler.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_useful_warhawk.sql
pnpm dev
```

For an existing local database, apply only pending migrations. Sites applies pending hosted migrations when publishing. Keep `.openai/hosting.json` and the existing Site identity. Deployment remains owner-private and the page is no-index for review.

## Source map

- `components/clinic-home.tsx`: physician-led landing page and three service lines.
- `lib/clinic-data.ts`: service descriptions, FAQ and legacy tracking names.
- `components/booking-dialog.tsx`: assessment request and tracking UI.
- `lib/booking.ts`: validation, phone normalization and Tehran dates.
- `app/api/appointments/`: persistent request and tracking handlers.
- `db/schema.ts` and `drizzle/`: data model and append-only migrations.
- `app/globals.css`: responsive Persian layout, cream/emerald/gold identity.

## Assets and clinical copy

`public/images/home-care.webp` is a generated illustrative image, not an actual physician or patient. Created with the built-in ImageGen tool and optimized for the site. Prompt: “An Iranian physician in emerald scrubs listening to a mature female patient in a calm cream-and-green domestic living room; tablet, natural light, no procedures, no text or logos; vertical editorial healthcare photograph.”

Vazirmatn is self-hosted under the SIL Open Font License in `public/fonts/OFL.txt`. Brand and UI icons are native SVG.

The site gives no individualized treatment, dosing or vaccine schedule advice. Clinical copy keeps vaccine selection and suitability conditional on assessment and includes transport/storage checks. Reference sources:

- WHO, HPV vaccine delivery guidance: https://iris.who.int/items/f927e154-96e7-4151-8853-c0b18c5a40c6
- FDA, botulinum toxin products and qualified healthcare providers: https://www.fda.gov/news-events/press-announcements/fda-warns-companies-over-illegal-marketing-botox-and-related-products

No GitHub token or application secret is stored in the project.
