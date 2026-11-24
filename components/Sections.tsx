import Image from "next/image";
import Link from "next/link";
import { Award, Briefcase, CalendarRange, ChartLine, Check, Gauge, Hammer, KeyRound, MapPinned, Megaphone, MessageSquareText, MonitorSmartphone, PhoneCall, Search } from "lucide-react";
import { about, analyzer, caseStudy, comparison, footer, guarantee, pillars, site } from "@/content";
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
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-28">
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

/* ───────────── How we grow you: three pillars ─────────────
   Each pillar carries a plan badge so nothing implies a plan includes more than it does. */
const pillarIcons = { site: MonitorSmartphone, map: MapPinned, ads: Megaphone };
const badge = "inline-block rounded-sm border-2 border-sage px-2 py-1 text-xs font-extrabold uppercase leading-none tracking-[0.1em] text-cream";

export function Pillars() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-28">
        <SectionHead eyebrow={pillars.eyebrow} title={pillars.headline} />

        <Reveal as="ol" className="mt-8 grid gap-3 md:mt-16 lg:grid-cols-3 lg:gap-0">
          {pillars.items.map((p, i) => {
            const Icon = pillarIcons[p.icon];
            return (
              <Item
                as="li"
                key={p.title}
                className={`flex flex-col rounded-lg border-2 border-line bg-raised p-5 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-10 lg:py-2 ${
                  i > 0 ? "lg:border-l-2" : "lg:pl-0"
                } ${i === pillars.items.length - 1 ? "lg:pr-0" : ""}`}
              >
                <div className="flex items-center justify-between lg:items-start">
                  <span className="text-5xl font-extrabold leading-[0.8] tracking-[-0.05em] text-cream lg:text-[7.5rem]" aria-hidden="true">
                    {i + 1}
                  </span>
                  <Icon className="h-9 w-9 text-sage lg:h-14 lg:w-14" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold leading-[1.05] tracking-[-0.03em] lg:mt-9 lg:text-4xl">{p.title}</h3>
                <p className="mb-4 mt-2 text-base leading-snug text-muted lg:mb-7 lg:mt-4 lg:text-lg lg:leading-relaxed">{p.body}</p>
                <p className="mt-auto">
                  <span className={badge}>{p.tag}</span>
                </p>
              </Item>
            );
          })}
        </Reveal>

        <Reveal className="mt-3 lg:mt-16">
          <Item className="flex flex-col gap-3 rounded-lg border-2 border-line bg-raised px-5 py-4 md:flex-row md:items-center md:gap-5 md:px-7 md:py-5">
            <MessageSquareText className="hidden h-8 w-8 shrink-0 text-sage md:block" strokeWidth={1.75} aria-hidden="true" />
            <p className="text-base font-semibold leading-snug text-cream md:text-xl">{pillars.also.text}</p>
            <p className="shrink-0 md:ml-auto">
              <span className={badge}>{pillars.also.tag}</span>
            </p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Comparison (light section) ─────────────
   Arbor Leads vs tree-service marketing agencies vs doing it yourself. No competitor is named.
   The Arbor Leads column is filled forest. Built as an ARIA table on a CSS grid so the row label can sit
   above its three cells on phones. */
export function Comparison() {
  const { columns, rows } = comparison;
  // Phones show two columns (us vs. agency); the do-it-yourself column joins from 640px up.
  const cols = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1fr_1.25fr_1fr_1fr]";
  return (
    <section className="on-cream bg-cream text-bg">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-28">
        <SectionHead title={comparison.headline} center size="md" />
        <Reveal className="mt-8 md:mt-14">
          <Item as="p" className="mb-3 rounded-lg bg-forest px-5 py-4 text-center text-lg font-extrabold leading-snug tracking-[-0.02em] text-cream md:mb-4 md:px-8 md:py-6 md:text-2xl">
            {comparison.callout}
          </Item>
          <Item>
            <div role="table" aria-label={comparison.headline} className="overflow-hidden rounded-lg border-2 border-bg">
              <div role="row" className={cols}>
                <span role="columnheader" className="hidden border-b-2 border-bg md:block" />
                <span role="columnheader" className="border-b-2 border-bg bg-forest px-3 py-4 text-sm font-extrabold uppercase tracking-[0.08em] text-cream md:px-6 md:py-5 md:text-lg">
                  {columns.us}
                </span>
                <span role="columnheader" className="border-b-2 border-bg px-3 py-4 text-xs font-extrabold uppercase leading-snug tracking-[0.06em] sm:text-sm md:px-6 md:py-5 md:text-base">
                  {columns.agency}
                </span>
                <span role="columnheader" className="border-b-2 border-l-2 border-bg border-l-bg/15 max-sm:hidden px-3 py-4 text-sm font-extrabold uppercase tracking-[0.06em] md:px-6 md:py-5 md:text-base">
                  {columns.diy}
                </span>
              </div>
              {rows.map((r, i) => {
                const line = i < rows.length - 1 ? "border-b-2 border-b-bg/15" : "";
                return (
                  <div role="row" key={r.label} className={cols}>
                    <span
                      role="rowheader"
                      className={`col-span-2 bg-bg/[0.07] sm:col-span-3 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] md:col-span-1 md:bg-transparent md:px-6 md:py-5 md:text-sm ${line} max-md:border-b-0`}
                    >
                      {r.label}
                    </span>
                    <span role="cell" className={`flex gap-2 bg-forest px-3 py-3 font-extrabold leading-snug text-cream md:gap-3 md:px-6 md:py-5 ${r.big ? "items-center text-xl tracking-[-0.03em] md:text-[2rem]" : "text-sm md:text-lg"} ${i < rows.length - 1 ? "border-b-2 border-cream/20" : ""}`}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cream md:h-5 md:w-5" strokeWidth={3} aria-hidden="true" />
                      {r.us}
                    </span>
                    <span role="cell" className={`px-3 py-3 text-sm leading-snug md:px-6 md:py-5 md:text-base ${line}`}>
                      {r.agency}
                    </span>
                    <span role="cell" className={`border-l-2 border-l-bg/15 px-3 py-3 max-sm:hidden text-sm leading-snug md:px-6 md:py-5 md:text-base ${line}`}>
                      {r.diy}
                    </span>
                  </div>
                );
              })}
            </div>
          </Item>
          <Item as="p" className="mt-4 text-xs leading-relaxed text-bg/70 md:text-sm">
            {comparison.finePrint}
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Guarantee (forest) ─────────────
   The two promises as stamped certificates, then the "you're never trapped" ownership row. */
export function Guarantee() {
  return (
    <section className="grain bg-forest text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-28">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Item as="p" className="eyebrow mb-4 !text-cream md:mb-5">
            {guarantee.eyebrow}
          </Item>
          <Item as="h2" className="display-lg">
            {guarantee.headline}
          </Item>
        </Reveal>

        <Reveal as="ol" className="mt-8 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-8">
          {guarantee.items.map((g, i) => (
            <Item
              as="li"
              key={g.text}
              className={`relative rounded-lg border-4 border-cream bg-deep p-6 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)] md:p-10 ${
                i % 2 ? "md:rotate-[0.5deg]" : "md:-rotate-[0.5deg]"
              }`}
            >
              {/* inner dashed rule, like a printed certificate */}
              <span className="pointer-events-none absolute inset-1.5 rounded-[3px] border border-dashed border-cream/35" aria-hidden="true" />
              <div className="flex items-start justify-between">
                <span className="text-6xl font-extrabold leading-[0.8] tracking-[-0.05em] text-cream md:text-8xl" aria-hidden="true">
                  {i + 1}
                </span>
                <Award className="h-12 w-12 text-sage md:h-16 md:w-16" strokeWidth={1.4} aria-hidden="true" />
              </div>
              <p className="mt-5 text-[1.6rem] font-extrabold leading-[1.05] tracking-[-0.035em] md:mt-8 md:text-[2.5rem]">{g.text}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-muted md:mt-6">
                {guarantee.stamp}
                {g.planNote && <span className="text-cream"> · {g.planNote}</span>}
              </p>
            </Item>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-8 max-w-4xl md:mt-14">
          <Item as="p" className="text-center text-lg font-medium leading-snug md:text-2xl">
            {guarantee.note}
          </Item>
          <Item className="mt-7 flex items-start gap-4 border-t-2 border-cream/30 pt-6 md:mt-10 md:gap-6 md:pt-8">
            <KeyRound className="mt-1 h-8 w-8 shrink-0 text-cream md:h-11 md:w-11" strokeWidth={1.75} aria-hidden="true" />
            <p className="text-lg leading-snug md:text-2xl">
              <span className="font-extrabold">{guarantee.ownership.lead}</span> {guarantee.ownership.body}
            </p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── About ─────────────
   The headshot, stats and testimonials only render once real ones are added in content.ts. */
export function About() {
  const photo = about.headshot.src;
  const stats = about.stats.filter((s) => !s.placeholder && s.value > 0);
  const quotes = about.testimonials.filter((t) => t.quote && t.name);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-28">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <Item as="p" className="eyebrow mb-4 md:mb-5">
            {about.eyebrow}
          </Item>
          <Item as="h2" className="display-lg">
            {about.title}
          </Item>
          {photo && (
            <Item className="mt-8">
              <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border-2 border-line bg-raised">
                <Image src={photo} alt={about.headshot.alt} fill sizes="384px" className="object-cover" />
              </div>
            </Item>
          )}
        </Reveal>
        <Reveal className="border-l-4 border-sage pl-5 md:pl-8">
          {about.copy.map((para, i) => (
            <Item as="p" key={para} className={`text-lg leading-snug text-cream md:text-xl md:leading-relaxed ${i > 0 ? "mt-4 md:mt-5" : ""}`}>
              {para}
            </Item>
          ))}
          <Item as="p" className="mt-5 text-base font-extrabold uppercase tracking-[0.1em] text-muted">
            {about.signature}
          </Item>
        </Reveal>
      </div>

      {/* pull quote: one big statement on its own */}
      <Reveal className="mt-12 border-y-2 border-cream py-8 md:mt-20 md:py-14">
        <Item>
          <blockquote className="display-xl mx-auto max-w-6xl md:text-center">&ldquo;{about.pullQuote}&rdquo;</blockquote>
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
        <Item as="p" className="mx-auto mb-5 max-w-xl text-lg font-extrabold leading-snug tracking-[-0.02em] text-cream md:mb-7 md:text-2xl">
          {analyzer.vibe}
        </Item>
        <Item as="h2" className="display-xl">
          {analyzer.headline}
        </Item>
        <Item as="p" className="mx-auto mt-5 max-w-xl text-lg leading-snug text-muted md:mt-6 md:text-2xl">
          {analyzer.sub}
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
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="inline-block rounded-sm">
              <Logo className="h-9 w-auto" />
            </Link>
            <p className="mt-5 text-base text-muted">{footer.line}</p>
            <a href={`mailto:${site.email}`} className="mt-3 inline-flex min-h-12 items-center font-bold text-cream underline-offset-4 hover:underline">
              {site.email}
            </a>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-1 md:items-end">
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
        <div className="mt-10 flex flex-col gap-3 border-t-2 border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
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
