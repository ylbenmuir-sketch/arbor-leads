import { hero, marquee, problem } from "@/content";
import Analyzer from "./Analyzer";
import { Counter, Item, PlaceholderTag, Reveal, SectionHead } from "./ui";

/** Big tree-ring motif behind the hero. */
function Rings() {
  const rings = Array.from({ length: 13 }, (_, i) => 46 + i * 44 + (i % 3) * 7);
  return (
    <svg
      viewBox="-640 -640 1280 1280"
      className="pointer-events-none absolute -right-[38%] -top-[18%] h-[130%] min-h-[720px] w-auto opacity-70 md:-right-[12%]"
      style={{ maskImage: "radial-gradient(closest-side, #000 20%, transparent 100%)" }}
      fill="none"
      aria-hidden="true"
    >
      {rings.map((r, i) => (
        <ellipse
          key={r}
          rx={r}
          ry={r * (0.94 + (i % 4) * 0.015)}
          stroke={i === 4 ? "var(--accent)" : "#fff"}
          strokeOpacity={i === 4 ? 0.5 : 0.09}
          strokeWidth={i === 4 ? 2 : 1.5}
          transform={`rotate(${i * 17})`}
        />
      ))}
    </svg>
  );
}

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
  // "More tree jobs. Zero extra work." → two lines, second in the accent color.
  const [first, ...rest] = hero.headline.split(". ");
  const line1 = rest.length ? first + "." : first;
  const line2 = rest.join(". ");
  const n1 = line1.split(" ").length;

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44">
      <Rings />
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full opacity-[0.13] blur-[120px]"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <h1 className="display text-[clamp(3.1rem,11.5vw,9.5rem)]" aria-label={hero.headline}>
          <span className="block" aria-hidden="true">
            <Words text={line1} />
          </span>
          {line2 && (
            <span className="block" aria-hidden="true">
              <Words text={line2} start={n1} className="text-accent" />
            </span>
          )}
        </h1>
        <p
          className="fade-up mt-7 max-w-2xl text-xl leading-snug text-white/80 md:mt-9 md:text-2xl"
          style={{ "--d": "0.55s" } as React.CSSProperties}
        >
          {hero.subhead}
        </p>
        <div className="fade-up mt-8 max-w-3xl md:mt-10" style={{ "--d": "0.7s" } as React.CSSProperties}>
          <Analyzer id="analyzer" />
          <p className="mt-5 flex items-start gap-2.5 text-sm font-semibold text-white/75 md:text-base">
            <span className="mt-[0.45em] h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
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
        <li key={t} className="flex items-center whitespace-nowrap text-lg font-extrabold uppercase tracking-tight md:text-2xl">
          <span className="px-6 md:px-9">{t}</span>
          <span className="text-accent" aria-hidden="true">•</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-line py-5 md:py-6">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}

export function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <SectionHead eyebrow={problem.eyebrow} title={problem.headline} />
      <Reveal as="ul" className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
        {problem.cards.map((c, i) => (
          <Item as="li" key={c.title} className="flex flex-col rounded-3xl border border-line bg-panel p-7 md:p-9">
            <span className="text-sm font-bold text-white/40">0{i + 1}</span>
            <h3 className="mt-5 text-2xl font-extrabold leading-[1.05] tracking-tight md:text-3xl">{c.title}</h3>
            <p className="mt-3 text-lg text-mute">{c.body}</p>
            <div className="mt-auto pt-9">
              <Counter to={c.stat.value} suffix={c.stat.suffix} className="display block text-6xl text-accent" />
              <p className="mt-2 text-sm font-semibold text-white/80">{c.stat.label}</p>
              {c.stat.placeholder && (
                <p className="mt-2">
                  <PlaceholderTag>{problem.placeholderNote}</PlaceholderTag>
                </p>
              )}
            </div>
          </Item>
        ))}
      </Reveal>
    </section>
  );
}
