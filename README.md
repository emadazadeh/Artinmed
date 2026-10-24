# Artinmed — آرتین‌مد

A Persian, right-to-left aesthetics clinic website inspired by the warm cream, gold and emerald visual direction of Lemon Clinic. Built specifically for `emadazadeh/Artinmed`, with original branding, copy and an original illustrative portrait.

## Included

- Responsive landing page, six service descriptions and category filtering.
- Three-step appointment **requests**, with Persian dates, Iran phone-number normalization, server validation, explicit consent, persistent Cloudflare D1 records and a tracking reference.
- Request tracking requires both the reference and the matching mobile number. Submissions are requests, never advertised as confirmed appointments.
- Browser-only photo mirror: local JPG/PNG/WebP upload, brightness/warmth/saturation controls, before/after comparison and downloadable JPG. It does not simulate injectables, diagnose skin or predict treatment results. Photos are never uploaded.
- Accessible native dialogs, keyboard navigation, focus restoration, reduced-motion support and self-hosted Vazirmatn.

## Run

Requires Node 22.13+ and pnpm. The source includes the Vinext/Cloudflare Sites integration.

```sh
pnpm install --frozen-lockfile
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_same_rattler.sql
pnpm dev
```

Apply each local SQL migration once. `pnpm start` serves the production Worker locally after a build. Production and local D1 databases are separate. The Sites publisher provisions the `DB` binding and applies committed migrations during deployment.

```sh
pnpm typecheck
pnpm test
pnpm build
```

## Content and operations

Service copy is in `lib/clinic-data.ts`; the main layout and brand are in `components/clinic-home.tsx` and `components/icons.tsx`. Styling is in `app/globals.css`.

The source deliberately contains no invented physician biographies, testimonials, medical license numbers, treatment prices, telephone numbers or clinic addresses. Supply verified clinic details before a public launch. The generated model portrait is labeled as illustrative in the page. `robots` is set to no-index for the current private review deployment.

The initial deployment is private to its owner. It has a real request database; it does not send SMS, send emails or automatically confirm appointments. Requests remain `pending` until a clinic operator processes them. A staff scheduling dashboard and notification provider are not included in this version. Authorized operators can inspect the D1 `appointments` table through the hosting management tools. Do not expose that table or add an unprotected request-list endpoint.

The API enforces same-origin JSON writes, consent, known services, allowed dates/times, an idempotency key, and a limit of three submissions per mobile number in 24 hours. Tracking discloses only service, preferred date/time, reference and status, never a person's name or number. A production clinic should set its retention period and staff access policy before collecting patient requests publicly.

## Assets

- `public/images/hero.webp`: original generated illustrative portrait, optimized locally for this website. Generated with the built-in ImageGen tool. Prompt: “Premium editorial natural skincare portrait of an Iranian woman, modest ivory blouse, realistic skin texture, warm cream studio backdrop with soft leafy shadows; refined natural beauty, no text or logo.”
- `public/fonts/Vazirmatn.woff2`: Vazirmatn, distributed under the SIL Open Font License; see `public/fonts/OFL.txt`.
- Native SVG brand and interface icons are in the source. No Lemon Clinic logo, physician photo, reviews or contact details were reused.

The project contains no GitHub token or other application secret. Build output, local databases and environment files are ignored.
