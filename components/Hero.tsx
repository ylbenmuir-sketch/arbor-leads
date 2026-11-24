import Image from "next/image";
import { Clock, MonitorX, PhoneMissed, Star } from "lucide-react";
import { hero, marquee, problem, site } from "@/content";
import { CtaButton, Item, Reveal, SectionHead } from "./ui";

function Words({ text, start = 0, className = "" }: { text: string; start?: number; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="word-mask">
          <span className={`word ${className}`} style={{ "--i": start + i } as React.CSSProperties}>
            {w}
            {" "}
          </span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  // "More booked jobs. Less chasing leads." → two lines, second in sage.
  const [first, ...rest] = hero.headline.split(". ");
  const line1 = rest.length ? first + "." : first;
  const line2 = rest.join(". ");
  const n1 = line1.split(" ").length;

  return (
    <section id="top" className="relative overflow-hidden border-b-2 border-line pb-16 pt-32 md:pb-28 md:pt-48">
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
        <h1 className="display text-[clamp(2.9rem,10.5vw,8.75rem)]" aria-label={hero.headline}>
          <span className="block" aria-hidden="true">
            <Words text={line1} />
          </span>
          {line2 && (
            <span className="block" aria-hidden="true">
              <Words text={line2} start={n1} className="text-sage" />
            </span>
          )}
        </h1>
        <p
          className="fade-up mt-7 max-w-2xl text-xl leading-snug text-muted md:mt-9 md:text-2xl"
          style={{ "--d": "0.6s" } as React.CSSProperties}
        >
          {hero.subhead}
        </p>
        <div className="fade-up mt-9 md:mt-11" style={{ "--d": "0.75s" } as React.CSSProperties}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <CtaButton size="lg" arrow />
            <a href="#pricing" className="btn btn-outline btn-lg">
              {site.secondaryCta}
            </a>
          </div>
          <p className="mt-7 flex items-start gap-3 text-sm font-semibold text-muted md:text-base">
            <span className="mt-[0.45em] h-2 w-2 shrink-0 bg-sage" aria-hidden="true" />
            {hero.trustLine}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {marquee.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap text-base font-extrabold uppercase tracking-[0.08em] md:text-xl">
          <span className="px-6 md:px-9">{t}</span>
          <span className="h-2 w-2 rotate-45 bg-sage" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="grain overflow-hidden border-b-2 border-line bg-deep py-5 md:py-6">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}

const problemIcons = { phone: PhoneMissed, clock: Clock, site: MonitorX, star: Star };

export function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <SectionHead eyebrow={problem.eyebrow} title={problem.headline} />
      <Reveal as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-4">
        {problem.cards.map((c, i) => {
          const Icon = problemIcons[c.icon];
          return (
            <Item as="li" key={c.title} className="flex flex-col rounded-lg border-2 border-line bg-raised p-7 md:p-8">
              <div className="flex items-center justify-between">
                <Icon className="h-9 w-9 text-sage" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-sm font-bold tracking-[0.2em] text-muted" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-10 text-2xl font-extrabold leading-[1.08] tracking-[-0.03em] md:text-[1.7rem]">
                {c.title}
              </h3>
            </Item>
          );
        })}
      </Reveal>
    </section>
  );
}
