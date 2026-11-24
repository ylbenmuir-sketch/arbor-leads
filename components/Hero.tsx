import { Fragment } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { caseStudy, hero, marquee, pain, site } from "@/content";
import { CtaButton, Item, Reveal } from "./ui";

export function Hero() {
  // Find the highlighted words inside the headline so they can get the orange underline.
  const words = hero.headline.split(" ");
  const hl = hero.highlight.split(" ");
  const start = words.findIndex((_, i) => hl.every((h, j) => words[i + j] === h));
  const end = start < 0 ? 0 : start + hl.length;
  const word = (w: string, i: number) => (
    <Fragment key={i}>
      <span className="word-mask">
        <span className="word" style={{ "--i": i } as React.CSSProperties}>
          {w}
        </span>
      </span>{" "}
    </Fragment>
  );
  const g = caseStudy.giant;

  return (
    <section id="top" className="relative overflow-hidden pb-12 pt-32 md:pb-24 md:pt-52">
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

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <h1 className="display-xl max-w-6xl" aria-label={hero.headline}>
          <span aria-hidden="true">
            {start < 0 ? (
              words.map(word)
            ) : (
              <>
                {words.slice(0, start).map(word)}
                <span className="hl">{words.slice(start, end).map((w, i) => word(w, start + i))}</span>
                {words.slice(end).map((w, i) => word(w, end + i))}
              </>
            )}
          </span>
        </h1>
        <p
          className="fade-up mt-5 max-w-2xl text-[1.0625rem] leading-snug text-muted md:mt-8 md:text-2xl"
          style={{ "--d": "0.6s" } as React.CSSProperties}
        >
          {hero.subhead}
        </p>
        <div className="fade-up mt-6 md:mt-10" style={{ "--d": "0.75s" } as React.CSSProperties}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <CtaButton size="lg" arrow />
            <a href="#pricing" className="btn btn-outline btn-lg max-sm:!hidden">
              {site.secondaryCta}
            </a>
          </div>
          <p className="mt-3 text-sm font-semibold text-muted max-sm:text-center md:text-base">{hero.micro}</p>

          {/* proof strip: the one real number, linked to the case section */}
          <a
            href={hero.proofHref}
            className="group mt-6 flex max-w-xl items-center gap-4 rounded-lg border-2 border-line bg-deep px-4 py-3 transition-colors duration-300 hover:border-sage md:mt-9 md:px-5 md:py-4"
          >
            <span className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-cream md:text-5xl">
              {g.prefix}
              {g.value}
              {g.suffix}
            </span>
            <span className="text-sm font-semibold leading-snug text-cream md:text-base">{hero.proofText}</span>
            <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-sage transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} aria-hidden="true" />
          </a>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-cream md:text-base">
            {hero.chips.map((c) => (
              <li key={c} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0 text-sage" strokeWidth={3} aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
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
