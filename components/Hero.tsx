import { Fragment } from "react";
import Image from "next/image";
import { ArrowRight, Check, Globe, Phone, Search, Star } from "lucide-react";
import { caseStudy, hero, mapPack, marquee, pain, site } from "@/content";
import { CtaButton, Item, Reveal } from "./ui";

/* A made-up Google Maps "3-pack" for the search the headline talks about.
   Plain HTML/CSS, no Google branding, captioned "Example." */
function MapPack() {
  const t = mapPack.top;
  const stars = (cls: string) => (
    <span className={`flex gap-0.5 ${cls}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
      ))}
    </span>
  );
  return (
    <figure className="fade-up mx-auto w-full max-w-md max-md:w-[90%] lg:max-w-none" style={{ "--d": "0.9s" } as React.CSSProperties}>
      <div className="overflow-hidden rounded-lg border-2 border-cream bg-cream text-bg shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
        {/* search bar */}
        <div className="flex items-center gap-2.5 border-b-2 border-bg/10 px-3.5 py-2 md:px-4 md:py-3">
          <Search className="h-4 w-4 shrink-0 text-bg/60" strokeWidth={2.5} aria-hidden="true" />
          <span className="text-base font-semibold">{mapPack.query}</span>
        </div>

        {/* simple map tile */}
        <div className="relative h-20 overflow-hidden bg-[var(--cream-deep)] md:h-24 lg:h-36" aria-hidden="true">
          <span className="absolute -left-4 top-[58%] h-2.5 w-[120%] -rotate-6 bg-cream" />
          <span className="absolute left-[30%] -top-4 h-[140%] w-2.5 rotate-12 bg-cream" />
          <span className="absolute left-[68%] -top-4 h-[140%] w-1.5 -rotate-[20deg] bg-cream" />
          <span className="absolute left-[6%] top-[12%] h-9 w-20 rounded-sm bg-sage/45" />
          <span className="absolute right-[5%] bottom-[10%] h-8 w-16 rounded-sm bg-sage/45" />
          <span className="absolute left-[76%] top-[22%] h-3.5 w-3.5 rounded-full border-2 border-cream bg-bg/35" />
          <span className="absolute left-[16%] top-[66%] h-3.5 w-3.5 rounded-full border-2 border-cream bg-bg/35" />
          <span className="absolute left-[44%] top-[18%] flex h-10 w-11 items-center justify-center rounded-md border-2 border-bg bg-sage text-base font-extrabold text-bg shadow-[0_6px_14px_rgba(0,0,0,0.3)] lg:h-12 lg:w-14 lg:text-xl">
            {mapPack.marker}
          </span>
        </div>

        {/* results */}
        <ol className="p-2 md:p-2.5 lg:p-3">
          <li className="rounded-md border-2 border-forest bg-white px-3 py-2.5 md:px-3.5 md:py-3 lg:px-4 lg:py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-extrabold leading-tight tracking-[-0.02em] lg:text-xl">{t.name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm font-semibold text-bg/80">
                  <span className="font-extrabold text-bg">{t.rating}</span>
                  {stars("text-forest")}
                  <span>{t.count}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hours}</span>
                </p>
              </div>
              <span className="flex h-8 shrink-0 items-center rounded-sm bg-sage px-2 text-sm font-extrabold text-bg">{mapPack.marker}</span>
            </div>
            <div className="mt-3 flex gap-2 text-sm font-extrabold">
              <span className="flex items-center gap-1.5 rounded-md bg-forest px-3.5 py-2 text-cream">
                <Phone className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {t.call}
              </span>
              <span className="flex items-center gap-1.5 rounded-md border-2 border-forest px-3.5 py-1.5 text-forest">
                <Globe className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {t.website}
              </span>
            </div>
          </li>
          {mapPack.others.map((o) => (
            <li key={o} className="mt-1 flex items-center justify-between gap-3 rounded-md px-3 py-1.5 opacity-45 md:mt-2 md:px-3.5 md:py-2 lg:px-4 lg:py-2.5">
              <div>
                <p className="text-base font-bold leading-tight">{o}</p>
                <div className="mt-1.5">{stars("text-bg/40")}</div>
              </div>
              <span className="h-7 w-16 rounded-md bg-bg/15" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-2 text-right text-xs text-muted">{mapPack.caption}</figcaption>
    </figure>
  );
}

/** The one real number, linked to the case section. */
function ProofCard({ text, className = "" }: { text: string; className?: string }) {
  const g = caseStudy.giant;
  return (
    <a
      href={hero.proofHref}
      className={`group flex max-w-xl items-center gap-4 rounded-lg border-2 border-line bg-deep px-4 py-3 transition-colors duration-300 hover:border-sage md:px-5 md:py-4 ${className}`}
    >
      <span className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-cream md:text-5xl">
        {g.prefix}
        {g.value}
        {g.suffix}
      </span>
      <span className="text-sm font-semibold leading-snug text-cream md:text-base">{text}</span>
      <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-sage transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} aria-hidden="true" />
    </a>
  );
}

export function Hero() {
  // Everything before the highlight wraps normally; the highlighted words get their own line
  // and the orange underline.
  const cut = hero.headline.indexOf(hero.highlight);
  const lead = (cut < 0 ? hero.headline : hero.headline.slice(0, cut)).trim().split(" ");
  const hl = cut < 0 ? [] : hero.highlight.split(" ");
  const word = (w: string, i: number) => (
    <Fragment key={i}>
      <span className="word-mask">
        <span className="word" style={{ "--i": i } as React.CSSProperties}>
          {w}
        </span>
      </span>{" "}
    </Fragment>
  );
  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-32 md:pb-24 md:pt-44">
      {/* Darkened, desaturated forest photo, faded into the page background. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: "linear-gradient(to bottom, #000 35%, transparent 100%)" }}
        aria-hidden="true"
      >
        <Image
          src="/images/hero-forest.jpg"
          alt=""
          fill
          priority
          quality={55}
          sizes="100vw"
          className="object-cover opacity-[0.24] grayscale-[0.7]"
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 md:gap-10 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-14">
        {/* Phones: this block fills the first screen on its own (headline, one line, one button). */}
        <div className="max-md:flex max-md:min-h-[calc(100svh-9.5rem)] max-md:flex-col max-md:justify-center max-md:pb-[11svh]">
          <h1 className="display-hero" aria-label={hero.headline}>
            <span aria-hidden="true">
              {lead.map(word)}
              {hl.length > 0 && (
                <span className="block">
                  <span className="hl">{hl.map((w, i) => word(w, lead.length + i))}</span>
                </span>
              )}
            </span>
          </h1>
          <p
            className="fade-up mt-7 max-w-2xl text-[1.0625rem] leading-snug text-muted md:text-xl"
            style={{ "--d": "0.6s" } as React.CSSProperties}
          >
            <span className="md:hidden">{hero.subheadShort}</span>
            <span className="max-md:hidden">{hero.subhead}</span>
          </p>
          <div className="fade-up mt-8" style={{ "--d": "0.75s" } as React.CSSProperties}>
            <div id="hero-cta" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <CtaButton size="lg" arrow />
              <a href="#pricing" className="btn btn-outline btn-lg max-sm:!hidden">
                {site.secondaryCta}
              </a>
            </div>
            <p className="mt-3 text-sm font-semibold text-muted max-sm:text-center md:text-base">
              <span className="md:hidden">{hero.microShort}</span>
              <span className="max-md:hidden">{hero.micro}</span>
            </p>

            {/* desktop: proof strip and chips sit under the button */}
            <ProofCard text={hero.proofText} className="mt-8 max-md:!hidden" />
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-base font-bold text-cream max-md:hidden">
              {hero.chips.map((c) => (
                <li key={c} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 shrink-0 text-sage" strokeWidth={3} aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* desktop: fills the right half. phones: starts the second screen. */}
        <MapPack />

        {/* phones: proof strip moves below the map example, then one quiet row of trust points */}
        <div className="md:hidden">
          <ProofCard text={hero.proofTextShort} />
          <p className="mt-5 text-center text-[0.8125rem] font-semibold text-muted">{hero.chipsShort.join("  ·  ")}</p>
        </div>
      </div>
    </section>
  );
}

/* Cream-on-forest strip: the two guarantees and the two short offers. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marquee.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap text-sm font-extrabold uppercase tracking-[0.08em] md:text-lg">
          <span className="px-5 md:px-9">{t}</span>
          <span className="h-2 w-2 rotate-45 bg-cream" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="grain overflow-hidden bg-forest py-3.5 text-cream md:py-5">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* Pain band: full-bleed cream, no cards. One giant statement, three stacked lines. */
export function Pain() {
  return (
    <section className="on-cream bg-cream text-bg">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-32">
        <Reveal>
          <Item as="h2" className="display-xl max-w-6xl">
            {pain.headline}
          </Item>
        </Reveal>
        <Reveal as="ol" className="mt-9 space-y-6 md:mt-16 md:space-y-9 lg:ml-auto lg:max-w-4xl">
          {pain.lines.map((l) => (
            <Item as="li" key={l} className="flex gap-4 md:gap-7">
              <span className="mt-[0.55em] h-[3px] w-8 shrink-0 bg-blaze md:w-16" aria-hidden="true" />
              <span className="text-[1.4rem] font-extrabold leading-[1.12] tracking-[-0.03em] md:text-[2rem]">{l}</span>
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
