import Image from "next/image";
import Link from "next/link";
import { Briefcase, CalendarRange, ChartLine, Gauge, Hammer, PhoneCall, Search } from "lucide-react";
import { about, analyzer, caseStudy, footer, site } from "@/content";
import Analyzer from "./Analyzer";
import Logo from "./Logo";
import { Counter, CtaButton, Item, Reveal, SectionHead } from "./ui";

/* ───────────── Recent website case (proof) ─────────────
   Real numbers from one client build. The client is never named.
   One giant number, then the rest as a compact strip. */
const changeIcons = [Search, Gauge, PhoneCall];
/* Card accents, in order: top border + big number color. */
const statStyles = [
  { border: "border-t-sage", num: "text-sage" },
  { border: "border-t-blaze", num: "text-blaze" },
  { border: "border-t-sage", num: "text-sage" },
  { border: "border-t-sage", num: "text-cream" },
];

/** "151 → 382" with the arrow picked out in sage. */
function BeforeAfterLine({ text }: { text: string }) {
  const parts = text.split("→");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && (
            <span className="text-sage" aria-hidden="true">
              →
            </span>
          )}
          {i > 0 && <span className="sr-only">to</span>}
          {part}
        </span>
      ))}
    </>
  );
}

const ticketIcons = { project: Briefcase, rebuild: Hammer, measured: CalendarRange, source: ChartLine };

export function CaseStudy() {
  const g = caseStudy.giant;
  return (
    <section id="case" className="grain relative overflow-hidden border-y-2 border-line bg-deep">
      {/* PHONES ONLY: one idea, one number. */}
      <Reveal className="relative px-5 py-20 md:hidden">
        <Item as="p" className="eyebrow mb-5">
          {caseStudy.phone.eyebrow}
        </Item>
        <Item as="h2" className="display-lg !text-[2.5rem]">
          {caseStudy.phone.headline}
        </Item>
        <Item className="relative mt-12">
          <div
            className="pointer-events-none absolute -left-16 top-1/2 h-[26rem] w-[150vw] -translate-y-1/2"
            style={{ background: "radial-gradient(closest-side, rgba(141,184,154,0.12), rgba(141,184,154,0))" }}
            aria-hidden="true"
          />
          <Counter
            to={g.value}
            prefix={g.prefix}
            suffix={g.suffix}
            decimals={g.decimals}
            className="relative -ml-1 block whitespace-nowrap text-[28vw] font-extrabold leading-[0.8] tracking-[-0.07em] text-sage"
          />
          <p className="relative mt-6 text-[2rem] font-extrabold leading-none tracking-[-0.03em] text-cream">{caseStudy.phone.line}</p>
          <p className="relative mt-3 text-2xl font-extrabold text-cream" style={{ fontVariantNumeric: "tabular-nums" }}>
            <BeforeAfterLine text={g.detail} />
          </p>
        </Item>
        <Item as="p" className="mt-12 border-l-[3px] border-sage pl-4 text-lg font-bold leading-snug text-cream">
          {caseStudy.phone.note}
        </Item>
        <Item as="p" className="mt-5 text-base leading-snug text-muted">
          {caseStudy.phone.how}
        </Item>
        <Item as="p" className="mt-5 text-[0.6875rem] leading-relaxed text-muted">
          {caseStudy.finePrint}
        </Item>
      </Reveal>

      {/* TABLET AND UP: the full case file. */}
      <div className="relative mx-auto max-w-7xl px-5 py-20 max-md:hidden md:px-8 md:py-28">
        {/* case-file header */}
        <Reveal className="max-w-4xl">
          <Item as="p" className="mb-4 md:mb-5">
            <span className="inline-block rounded-full border-2 border-blaze px-3 py-1.5 text-xs font-extrabold uppercase leading-none tracking-[0.16em] text-blaze">
              {caseStudy.tag}
            </span>
          </Item>
          <Item as="h2" className="display-lg">
            {caseStudy.headline}
          </Item>
          <Item as="p" className="mt-4 text-lg leading-snug text-cream md:mt-5 md:text-[1.35rem]">
            {caseStudy.sub}
          </Item>
        </Reveal>

        {/* project card: reads like a job ticket */}
        <Reveal className="mt-6 md:mt-9">
          <Item>
            <dl className="grid grid-cols-2 rounded-md border border-line bg-raised lg:grid-cols-4">
              {caseStudy.ticket.map((row, i) => {
                const Icon = ticketIcons[row.icon];
                return (
                  <div
                    key={row.label}
                    className={`flex gap-2.5 px-3.5 py-3 md:gap-3 md:px-5 md:py-4 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "max-lg:border-t max-lg:border-line" : ""} ${i === 2 ? "lg:border-l lg:border-line" : ""}`}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sage md:h-5 md:w-5" strokeWidth={2} aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-[0.6875rem] font-extrabold uppercase leading-none tracking-[0.16em] text-muted md:text-xs">{row.label}</dt>
                      <dd className="mt-1.5 text-sm font-bold leading-snug text-cream md:text-base">
                        <BeforeAfterLine text={row.value} />
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </Item>
        </Reveal>

        <div className="relative mt-8 md:mt-14">
          {/* soft sage glow behind the giant number */}
          <div
            className="pointer-events-none absolute -left-24 top-1/2 h-[34rem] w-[min(60rem,170vw)] -translate-y-1/2"
            style={{ background: "radial-gradient(closest-side, rgba(141,184,154,0.12), rgba(141,184,154,0))" }}
            aria-hidden="true"
          />
          <Reveal className="relative grid gap-x-10 gap-y-4 lg:grid-cols-[auto_1fr] lg:items-end">
            <Item>
              <span className="inline-block border-b-[3px] border-blaze pb-2 md:pb-3">
                <Counter
                  to={g.value}
                  prefix={g.prefix}
                  suffix={g.suffix}
                  decimals={g.decimals}
                  className="block whitespace-nowrap text-[clamp(6rem,27vw,12rem)] font-extrabold leading-[0.82] tracking-[-0.06em] text-sage"
                />
              </span>
            </Item>
            <Item className="lg:pb-3">
              <p className="max-w-xl text-2xl font-extrabold leading-[1.05] tracking-[-0.03em] text-cream md:text-[2.75rem]">{g.line}</p>
              <p className="mt-2 text-xl font-extrabold text-blaze md:mt-3 md:text-3xl" style={{ fontVariantNumeric: "tabular-nums" }}>
                <BeforeAfterLine text={g.detail} />
              </p>
            </Item>
          </Reveal>
        </div>

        {/* equal-height cards; the before → after line and label sit at the bottom */}
        <Reveal as="ul" className="relative mt-8 grid grid-cols-2 items-stretch gap-3 md:mt-16 md:gap-5 lg:grid-cols-4">
          {caseStudy.strip.map((s, i) => {
            const style = statStyles[i % statStyles.length];
            return (
              <Item
                as="li"
                key={s.text}
                className={`flex h-full flex-col rounded-md border border-t-4 border-line bg-raised p-3.5 transition-[translate] duration-300 hover:-translate-y-1 md:p-6 ${style.border}`}
              >
                <Counter
                  to={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                  className={`block whitespace-nowrap text-[2rem] font-extrabold leading-none tracking-[-0.04em] md:text-5xl ${style.num}`}
                />
                <p className="mb-3 mt-2 text-sm font-semibold leading-snug text-cream md:mt-3 md:text-base">{s.text}</p>
                <p className="mt-auto text-sm text-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
                  <BeforeAfterLine text={s.detail} />
                </p>
                <p className="mt-2.5 border-t border-line pt-2 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.16em] text-muted">
                  {caseStudy.cardLabel}
                </p>
              </Item>
            );
          })}
        </Reveal>

        <Reveal className="relative">
          <Item as="p" className="mt-4 max-w-4xl text-xs leading-relaxed text-muted md:text-sm">
            {caseStudy.finePrint}
          </Item>

          <Item as="p" className="mt-8 text-xs font-extrabold uppercase tracking-[0.18em] text-blaze md:mt-12">
            {caseStudy.changesLabel}
          </Item>
          <Item>
            <ul className="mt-3 flex flex-wrap gap-2 md:gap-3">
              {caseStudy.changes.map((c, i) => {
                const Icon = changeIcons[i % changeIcons.length];
                return (
                  <li key={c} className="flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-bold text-cream md:px-5 md:py-2.5 md:text-base">
                    <Icon className="h-4 w-4 shrink-0 text-sage md:h-5 md:w-5" strokeWidth={2} aria-hidden="true" />
                    {c}
                  </li>
                );
              })}
            </ul>
          </Item>
          <Item as="p" className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            {caseStudy.resultsNote}
          </Item>

          <Item className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 md:mt-10">
            <CtaButton size="lg" arrow />
            <p className="text-base font-semibold text-cream max-sm:text-center">{caseStudy.ctaNote}</p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Founder ─────────────
   Photo left (about 40%) and the story right on desktop; photo on top, story under it on phones.
   Stats and testimonials only render once real ones are added in content.ts. */
export function About() {
  const photo = about.headshot;
  const stats = about.stats.filter((s) => !s.placeholder && s.value > 0);
  const quotes = about.testimonials.filter((t) => t.quote && t.name);

  return (
    <section id="founder" className="max-md:bg-forest">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-8 md:grid-cols-[2fr_3fr] md:items-center md:gap-12 lg:gap-16">
          <Reveal>
            <Item>
              {/* From tablet up the caption hangs below the photo, so the photo itself centers on the text. */}
              <figure className="relative">
                {/* rounded 16px, 1px line border, a soft sage glow off the right edge */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-raised shadow-[28px_0_60px_-30px_rgba(141,184,154,0.45)]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1280px) 460px, (min-width: 768px) 38vw, calc(100vw - 40px)"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3 text-sm font-semibold text-cream/80 md:absolute md:top-full md:text-muted">{photo.caption}</figcaption>
              </figure>
            </Item>
          </Reveal>

          {/* The story. Under the photo on phones, beside it (vertically centered) from tablet up. */}
          <Reveal>
            <Item as="p" className="eyebrow mb-5 max-md:!text-cream">
              {about.eyebrow}
            </Item>
            {/* scales with the column so it holds two even lines from tablet up */}
            <Item as="h2" className="display-md md:!text-[clamp(2rem,3.4vw,3rem)]">
              {about.title}
            </Item>
            <div className="mt-7 space-y-6 md:mt-8">
              {about.copy.map((para) => (
                <Item as="p" key={para} className="text-lg leading-relaxed text-cream lg:text-xl">
                  {para}
                </Item>
              ))}
            </div>
            <Item as="p" className="mt-7 text-sm font-bold uppercase tracking-[0.14em] text-cream md:text-muted">
              {about.signature}
            </Item>
          </Reveal>
        </div>

        {/* pull quote: one big statement on its own (desktop only; the phone story already says it) */}
        <Reveal className="mt-16 border-y-2 border-cream py-12 max-md:hidden lg:mt-20">
          <Item>
            <blockquote className="display-lg mx-auto max-w-6xl text-center">&ldquo;{about.pullQuote}&rdquo;</blockquote>
          </Item>
        </Reveal>

        {stats.length > 0 && (
          <Reveal className="mt-12 grid divide-y-2 divide-line rounded-lg border-2 border-line sm:grid-flow-col sm:auto-cols-fr sm:divide-x-2 sm:divide-y-0 md:mt-20">
            {stats.map((s) => (
              <Item key={s.label} className="px-7 py-8 text-center">
                <p className="display text-6xl md:text-7xl">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-base font-semibold text-cream">{s.label}</p>
              </Item>
            ))}
          </Reveal>
        )}

        {quotes.length > 0 && (
          <Reveal as="ul" className="mt-5 grid gap-5 md:grid-cols-3">
            {quotes.map((t) => (
              <Item as="li" key={t.quote}>
                <figure className="flex h-full flex-col rounded-lg border-2 border-line bg-raised p-7">
                  <blockquote className="text-lg font-medium leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-auto pt-6 text-sm text-muted">
                    <span className="font-bold text-cream">{t.name}</span>
                    {t.company && <> · {t.company}</>}
                  </figcaption>
                </figure>
              </Item>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ───────────── Free audit: the final CTA every button points to ───────────── */
export function AnalyzerSection() {
  return (
    <section id="analyzer" className="relative border-t-2 border-line">
      <Reveal className="relative mx-auto max-w-5xl px-5 py-16 text-center md:px-8 md:py-28">
        <Item as="p" className="eyebrow mb-4 md:mb-5">
          {analyzer.eyebrow}
        </Item>
        <Item as="p" className="mx-auto mb-7 max-w-xl text-2xl font-extrabold leading-snug tracking-[-0.02em] text-cream max-md:hidden">
          {analyzer.vibe}
        </Item>
        <Item as="h2" className="display-xl">
          {analyzer.headline}
        </Item>
        <Item as="p" className="mx-auto mt-5 max-w-xl text-lg leading-snug text-muted md:mt-6 md:text-2xl">
          <span className="md:hidden">{analyzer.subShort}</span>
          <span className="max-md:hidden">{analyzer.sub}</span>
        </Item>
        <Item className="mx-auto mt-8 max-w-3xl md:mt-10">
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
      <div className="mx-auto max-w-7xl px-5 py-9 md:px-8 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-sm">
            <Link href="/" className="inline-block rounded-sm">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className="mt-4 text-base text-muted md:mt-5">{footer.line}</p>
            <a href={`mailto:${site.email}`} className="mt-1 inline-flex min-h-12 items-center font-bold text-cream underline-offset-4 hover:underline md:mt-3">
              {site.email}
            </a>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 md:flex-col md:items-end md:gap-1">
            {footer.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-12 items-center text-sm font-extrabold uppercase tracking-[0.14em] text-cream underline-offset-4 hover:text-sage hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t-2 border-line pt-3 text-sm text-muted md:mt-10 md:pt-6">
          <p>{footer.copyright}</p>
          <nav aria-label="Legal" className="flex gap-5">
            {footer.legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="inline-flex min-h-12 items-center font-semibold underline-offset-4 hover:text-cream hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
