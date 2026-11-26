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

- **Audit form** → `POST /api/leads` (`app/api/leads/route.ts`): saves to the Supabase `leads` table and emails `LEAD_NOTIFY_EMAIL` via Resend.
- **Cal.com** → `POST /api/webhooks/cal` (`app/api/webhooks/cal/route.ts`): on `BOOKING_CREATED`, verifies the signature, marks the lead `booked` (or creates one) and emails "New call booked".
- **Book a call buttons** use `NEXT_PUBLIC_BOOKING_URL`, with `?name=&email=` added once someone has submitted the form.
- Table SQL: `supabase/migrations/20261126000000_create_leads.sql` (run it in the Supabase SQL Editor).

Env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL` (comma-separate for several), `CAL_WEBHOOK_SECRET`, `NEXT_PUBLIC_BOOKING_URL`, and optionally `LEAD_FROM_EMAIL` (e.g. `Arbor Leads <leads@arborleads.co>` once the domain is verified in Resend; without it, mail comes from Resend's test sender, which only delivers to your own Resend account email).

## Before launch

- The audit score in `components/Analyzer.tsx` is still a mock generated from the URL. Hook up a real analysis.
- Replace the placeholder stats, testimonials, headshot, and the `/privacy` and `/terms` pages.

## Photo credits

Photos from Unsplash (free license): Dmytro Glazunov, Richard Burlton, Dejan Zakic.
