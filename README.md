# Arbor Leads

Single-page marketing site for arborleads.co. Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Edit copy, prices and stats

Everything is in **`content.ts`**. Change it there and the page, SEO metadata and FAQ schema all update.

- Prices: `pricing.plans` (`regular`, `price`), `pricing.build`, `pricing.annualMonthsFree`
- Countdown date: `pricing.banner.deadline`
- About section: the headshot, stat tiles and testimonials stay hidden until you add real ones in `content.ts` (set a headshot `src`, set a stat `value` with `placeholder: false`, fill in a `quote` and `name`).
- Testimonials: fill in `about.testimonials` (leave `quote` empty to keep the placeholder slot)
- Headshot: put a photo in `public/images/` and set `about.headshot.src`

Colors are CSS variables at the top of `app/globals.css` (`--bg`, `--sage`, `--cream`, `--blaze`, …).

Logo files are in `public/logo/` (`logo-dark.svg`, `logo-light.svg`, `icon.svg`). Replace them to change the logo; also copy `icon.svg` to `app/icon.svg` and re-export `app/apple-icon.png` (180px) for the favicon.

## Leads and bookings

- **Audit form** → `POST /api/leads` (`app/api/leads/route.ts`): saves to the Supabase `leads` table and emails `LEAD_NOTIFY_EMAIL` via Resend, then builds their report in the background (Next.js `after()`).
- **"Who's Beating Me?" report** (`lib/server/report/`): Google Maps searches for "tree service {city}" and "tree removal {city}" plus "{business} {city}" via Serper.dev or DataForSEO (`data.ts`; pick with `DATA_PROVIDER`), mobile PageSpeed, Claude Haiku via AI Gateway writes the words (`write.ts`), and the email is rendered in `html.ts`. Tables in the email come straight from the data; the model only writes the sentences. It's emailed to the lead and copied to `LEAD_NOTIFY_EMAIL`. The Google Presence Score (0–100) at the top is calculated in code (`score.ts`), never by the AI, and saved in `reports.score` / `score_breakdown`. Competitors more than 30 miles from the searched city are left out. Every report is saved to the `reports` table (`status`: `building` → `sent` or `failed`, with the error in `raw_data->>'error'`). If it fails you get a "Report FAILED" email.
- **Cal.com** → `POST /api/webhooks/cal` (`app/api/webhooks/cal/route.ts`): on `BOOKING_CREATED`, verifies the signature, marks the lead `booked` (or creates one) and emails "New call booked".
- **Book a call buttons** use `NEXT_PUBLIC_BOOKING_URL`, with `?name=&email=` added once someone has submitted the form.
- Table SQL: `supabase/migrations/20261126000000_create_leads.sql`, then `20261126010000_create_reports.sql`, then `20261126020000_add_report_score.sql` (run them in the Supabase SQL Editor, in that order).

Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL` (comma-separate for several), `CAL_WEBHOOK_SECRET`, `NEXT_PUBLIC_BOOKING_URL`, `SERPER_API_KEY` (Google Maps data; or `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`), `DATA_PROVIDER` (optional: `serper` or `dataforseo`; defaults to Serper when `SERPER_API_KEY` is set), `AI_GATEWAY_API_KEY`, `PAGESPEED_API_KEY` (free from Google Cloud; without it the shared keyless quota is usually used up and the speed check is skipped), and optionally `LEAD_FROM_EMAIL` (e.g. `Arbor Leads <leads@arborleads.co>` once the domain is verified in Resend; without it, mail comes from Resend's test sender, which only delivers to your own Resend account email).

## Before launch

- Replace the placeholder stats, testimonials, headshot, and the `/privacy` and `/terms` pages.

## Photo credits

Photos from Unsplash (free license): Dmytro Glazunov, Richard Burlton, Dejan Zakic.
