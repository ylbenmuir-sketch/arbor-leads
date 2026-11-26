# Arbor Leads

Single-page marketing site for arborleads.co. Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
npm run lint     # ESLint
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

- **Audit form** (two steps, `components/Analyzer.tsx`) → `POST /api/leads` (`app/api/leads/route.ts`). Step 1 "Find your business" uses Google Places Autocomplete (`components/places.ts`, `PlaceSearch.tsx`; needs `NEXT_PUBLIC_GOOGLE_MAPS_KEY`, otherwise typed fields) and saves a `partial` lead. Step 2 (name, email, optional phone) fills in the same row (`new`), emails `LEAD_NOTIFY_EMAIL` via Resend, then builds their report in the background (Next.js `after()`). The picked listing's `place_id` is used to find them in the map results.
- **Follow-up emails** (`lib/server/followups.ts`, `app/api/cron/followups/route.ts`): daily Vercel Cron (`vercel.json`, 15:00 UTC) sends day 2 / 5 / 10 emails to leads who got a report and haven't booked. Off unless `FOLLOWUP_ENABLED=true` and `LEAD_FROM_EMAIL` are set (it logs what it would send). Stops on booking or unsubscribe (`/unsubscribe`, `POST /api/unsubscribe`). Sent emails are in the `lead_followups` table.
- **Leads dashboard** at `/admin` (password `ADMIN_PASSWORD`): leads, status, score, report link, follow-ups.
- **"Who's Beating Me?" report** (`lib/server/report/`): Google Maps searches for "tree service {city}" and "tree removal {city}" plus "{business} {city}" via Serper.dev or DataForSEO (`data.ts`; pick with `DATA_PROVIDER`), mobile PageSpeed, Claude Haiku via AI Gateway writes the words (`write.ts`), and the email is rendered in `html.ts`. Tables in the email come straight from the data; the model only writes the sentences. It's emailed to the lead and copied to `LEAD_NOTIFY_EMAIL`. The Google Presence Score (0–100) at the top is calculated in code (`score.ts`), never by the AI, and saved in `reports.score` / `score_breakdown`. Competitors more than 30 miles from the searched city are left out. Every report is saved to the `reports` table (`status`: `building` → `sent` or `failed`, with the error in `raw_data->>'error'`). If it fails you get a "Report FAILED" email.
- **Cal.com** → `POST /api/webhooks/cal` (`app/api/webhooks/cal/route.ts`): on `BOOKING_CREATED`, verifies the signature, marks the lead `booked` (or creates one) and emails "New call booked".
- **Book a call buttons** use `NEXT_PUBLIC_BOOKING_URL`, with `?name=&email=` added once someone has submitted the form.
- Table SQL: `supabase/migrations/20261126000000_create_leads.sql`, then `20261126010000_create_reports.sql`, then `20261126020000_add_report_score.sql`, then `20261126030000_two_step_form.sql`, then `20261126040000_followups.sql` (run them in the Supabase SQL Editor, in that order).

Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL` (comma-separate for several), `CAL_WEBHOOK_SECRET`, `NEXT_PUBLIC_BOOKING_URL`, `SERPER_API_KEY` (Google Maps data; or `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`), `DATA_PROVIDER` (optional: `serper` or `dataforseo`; defaults to Serper when `SERPER_API_KEY` is set), `AI_GATEWAY_API_KEY`, `PAGESPEED_API_KEY` (free from Google Cloud; without it the shared keyless quota is usually used up and the speed check is skipped), `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (Places API New + Maps JavaScript API, restricted to the site's domains), `CRON_SECRET`, `ADMIN_PASSWORD`, `FOLLOWUP_ENABLED` (`true` to actually send follow-ups), and optionally `LEAD_FROM_EMAIL` (e.g. `Arbor Leads <leads@arborleads.co>` once the domain is verified in Resend; without it, mail comes from Resend's test sender, which only delivers to your own Resend account email).

## Before launch

- Replace the placeholder stats, testimonials, headshot, and the `/privacy` and `/terms` pages.

## Photo credits

Photos from Unsplash (free license): Dmytro Glazunov, Richard Burlton, Dejan Zakic.
