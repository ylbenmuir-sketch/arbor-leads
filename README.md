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
- Placeholders: anything with `placeholder: true` shows a yellow "Placeholder" tag. Fill in the real value and set it to `false`.
- Testimonials: fill in `about.testimonials` (leave `quote` empty to keep the placeholder slot)
- Headshot: put a photo in `public/images/` and set `about.headshot.src`

Accent color is one variable: `--accent` in `app/globals.css`.

## Before launch

- `components/Analyzer.tsx` has a marked `TODO(backend)`. The score is a mock generated from the URL and the form only logs to the console. Hook up a real analysis and lead capture.
- Replace the placeholder stats, testimonials, headshot, and the `/privacy` and `/terms` pages.

## Photo credits

Mockup photos from Unsplash (free license): Dmytro Glazunov, Richard Burlton.
