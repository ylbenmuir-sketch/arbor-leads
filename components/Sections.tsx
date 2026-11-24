import Image from "next/image";
import Link from "next/link";
import { Check, Globe, MapPin, Star, UserRound } from "lucide-react";
import { about, analyzer, comparison, footer, guarantee, ownership, site } from "@/content";
import Analyzer from "./Analyzer";
import Logo from "./Logo";
import { Counter, Item, PlaceholderTag, Reveal, SectionHead } from "./ui";

/* ───────────── Comparison (light section) ─────────────
   Arbor Leads vs typical agency vs doing it yourself.
   Built as an ARIA table on a CSS grid so the row label can sit
   above its three cells on phones. */
export function Comparison() {
  const { columns, rows } = comparison;
  const cols = "grid grid-cols-3 md:grid-cols-[1fr_1.25fr_1fr_1fr]";
  return (
    <section className="on-cream bg-cream text-bg">
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
        <SectionHead title={comparison.headline} center />
        <Reveal className="mt-12 md:mt-16">
          <Item>
            <div role="table" aria-label={comparison.headline} className="overflow-hidden rounded-lg border-2 border-bg">
              <div role="row" className={cols}>
                <span role="columnheader" className="hidden border-b-2 border-bg md:block" />
                <span role="columnheader" className="border-b-2 border-bg bg-bg px-3 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-cream md:px-6 md:py-5 md:text-lg">
                  {columns.us}
                </span>
                <span role="columnheader" className="border-b-2 border-bg px-3 py-4 text-sm font-extrabold uppercase tracking-[0.06em] md:px-6 md:py-5 md:text-base">
                  {columns.agency}
                </span>
                <span role="columnheader" className="border-b-2 border-l-2 border-bg border-l-bg/15 px-3 py-4 text-sm font-extrabold uppercase tracking-[0.06em] md:px-6 md:py-5 md:text-base">
                  {columns.diy}
                </span>
              </div>
              {rows.map((r, i) => {
                const line = i < rows.length - 1 ? "border-b-2 border-b-bg/15" : "";
                return (
                  <div role="row" key={r.label} className={cols}>
                    <span
                      role="rowheader"
                      className={`col-span-3 bg-bg/[0.07] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] md:col-span-1 md:bg-transparent md:px-6 md:py-5 md:text-sm ${line} max-md:border-b-0`}
                    >
                      {r.label}
                    </span>
                    <span role="cell" className={`flex gap-2 bg-bg px-3 py-4 text-sm font-extrabold leading-snug text-cream md:gap-3 md:px-6 md:py-5 md:text-lg ${i < rows.length - 1 ? "border-b-2 border-line" : ""}`}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage md:h-5 md:w-5" strokeWidth={3} aria-hidden="true" />
                      {r.us}
                    </span>
                    <span role="cell" className={`px-3 py-4 text-sm leading-snug md:px-6 md:py-5 md:text-base ${line}`}>
                      {r.agency}
                    </span>
                    <span role="cell" className={`border-l-2 border-l-bg/15 px-3 py-4 text-sm leading-snug md:px-6 md:py-5 md:text-base ${line}`}>
                      {r.diy}
                    </span>
                  </div>
                );
              })}
            </div>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Guarantee: flat panel + one dark card ───────────── */
export function Guarantee() {
  return (
    <section className="px-3 pt-24 md:px-6 md:pt-36">
      <div className="grain relative mx-auto max-w-[90rem] overflow-hidden rounded-lg border-2 border-forest bg-forest text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal>
            <Item as="p" className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-cream">
              {guarantee.eyebrow}
            </Item>
            <Item as="h2" className="display text-[clamp(2.5rem,6vw,4.75rem)]">
              {guarantee.headline}
            </Item>
            <Item as="p" className="mt-7 max-w-xl border-t-2 border-cream/30 pt-6 text-lg font-medium leading-relaxed md:text-xl">
              {guarantee.note}
            </Item>
          </Reveal>

          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {guarantee.items.map((g, i) => (
              <Item
                key={g.label}
                className={`flex flex-col rounded-lg border-2 p-6 md:p-8 ${
                  i === 0 ? "border-cream/40 bg-transparent" : "border-deep bg-deep shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]"
                }`}
              >
                <p className={`text-xs font-bold uppercase tracking-[0.22em] ${i === 0 ? "text-cream" : "text-sage"}`}>{g.label}</p>
                <p className="mt-5 text-2xl font-extrabold leading-[1.1] tracking-[-0.03em] md:text-[1.75rem]">{g.text}</p>
              </Item>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Ownership ───────────── */
const ownershipIcons = [Globe, MapPin, Star];

export function Ownership() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-24 md:px-8 md:pt-36">
      <div className="grid gap-10 border-y-2 border-line py-14 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <Reveal>
          <Item as="p" className="eyebrow mb-5">
            {ownership.eyebrow}
          </Item>
          <Item as="h2" className="display text-[clamp(2.25rem,5vw,3.75rem)]">
            {ownership.headline}
          </Item>
        </Reveal>
        <Reveal>
          <Item as="p" className="text-xl leading-relaxed text-cream md:text-2xl">
            {ownership.body}
          </Item>
          <Item>
            <ul className="mt-7 flex flex-wrap gap-3">
              {ownership.points.map((p, i) => {
                const Icon = ownershipIcons[i % ownershipIcons.length];
                return (
                  <li key={p} className="flex items-center gap-2.5 rounded-md border-2 border-line bg-raised px-4 py-2.5 text-base font-bold">
                    <Icon className="h-5 w-5 text-sage" strokeWidth={2} aria-hidden="true" />
                    {p}
                  </li>
                );
              })}
            </ul>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── About ───────────── */
export function About() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <Reveal>
          <Item>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border-2 border-line bg-raised lg:max-w-none">
              {about.headshot.src ? (
                <Image src={about.headshot.src} alt={about.headshot.alt} fill sizes="(max-width: 1024px) 384px, 480px" className="object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <UserRound className="h-24 w-24 text-line" strokeWidth={1.25} aria-hidden="true" />
                  <PlaceholderTag>{about.headshot.placeholderText}</PlaceholderTag>
                </div>
              )}
            </div>
          </Item>
        </Reveal>
        <Reveal>
          <Item as="p" className="eyebrow mb-5">
            {about.eyebrow}
          </Item>
          <Item as="h2" className="display text-[clamp(2.25rem,5.5vw,4.25rem)]">
            {about.title}
          </Item>
          <Item as="p" className="mt-7 text-xl leading-relaxed text-muted md:text-2xl">
            {about.copy}
          </Item>
          <Item as="p" className="mt-6 text-xl font-extrabold tracking-tight text-sage">
            {about.signature}
          </Item>
        </Reveal>
      </div>

      {/* stat strip */}
      <Reveal className="mt-16 grid divide-y-2 divide-line rounded-lg border-2 border-line sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0 md:mt-24">
        {about.stats.map((s) => (
          <Item key={s.label} className="px-7 py-8 text-center">
            <p className="display text-6xl md:text-7xl">
              {s.placeholder ? <span className="text-muted/60">000</span> : <Counter to={s.value} suffix={s.suffix} />}
            </p>
            <p className="mt-2 text-base font-semibold text-cream">{s.label}</p>
            {s.placeholder && (
              <p className="mt-2">
                <PlaceholderTag>{about.placeholderTag}</PlaceholderTag>
              </p>
            )}
          </Item>
        ))}
      </Reveal>

      {/* testimonial slots */}
      <Reveal as="ul" className="mt-5 grid gap-5 md:grid-cols-3">
        {about.testimonials.map((t, i) => (
          <Item as="li" key={i}>
            {t.quote ? (
              <figure className="flex h-full flex-col rounded-lg border-2 border-line bg-raised p-7">
                <blockquote className="text-lg font-medium leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-auto pt-6 text-sm text-muted">
                  <span className="font-bold text-cream">{t.name}</span>
                  {t.company && <> · {t.company}</>}
                </figcaption>
              </figure>
            ) : (
              <div className="flex h-full min-h-40 flex-col items-start justify-center gap-3 rounded-lg border-2 border-dashed border-line p-7">
                <PlaceholderTag>{about.placeholderTag}</PlaceholderTag>
                <p className="text-base text-muted">{about.testimonialPlaceholder}</p>
              </div>
            )}
          </Item>
        ))}
      </Reveal>
    </section>
  );
}

/* ───────────── Free analyzer (the section every CTA points to) ───────────── */
export function AnalyzerSection() {
  return (
    <section id="analyzer" className="relative">
      <Reveal className="relative mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-36">
        <Item as="p" className="eyebrow mb-5">
          {analyzer.eyebrow}
        </Item>
        <Item as="h2" className="display text-[clamp(2.5rem,7.5vw,5.5rem)]">
          {analyzer.headline}
        </Item>
        <Item as="p" className="mx-auto mt-6 max-w-xl text-xl text-muted md:text-2xl">
          {analyzer.sub}
        </Item>
        <Item className="mx-auto mt-10 max-w-3xl">
          <Analyzer />
        </Item>
      </Reveal>
    </section>
  );
}

/* ───────────── Footer ───────────── */
export function Footer() {
  return (
    <footer className="grain border-t-2 border-line bg-deep">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-block rounded-sm">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className="mt-5 text-base text-muted">{footer.line}</p>
            <a href={`mailto:${site.email}`} className="mt-3 inline-flex min-h-11 items-center font-bold text-cream underline-offset-4 hover:underline">
              {site.email}
            </a>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-1 md:items-end">
            {footer.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-11 items-center text-sm font-extrabold uppercase tracking-[0.14em] text-cream underline-offset-4 hover:text-sage hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t-2 border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <nav aria-label="Legal" className="flex gap-5">
            {footer.legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:text-cream hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
