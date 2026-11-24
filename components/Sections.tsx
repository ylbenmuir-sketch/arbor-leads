import Image from "next/image";
import Link from "next/link";
import { about, comparison, finalCta, footer, guarantee, site } from "@/content";
import Analyzer from "./Analyzer";
import Logo from "./Logo";
import { Check, Counter, Item, PlaceholderTag, Reveal, SectionHead } from "./ui";

/* ───────────── 9. Comparison table ───────────── */
export function Comparison() {
  const { columns, rows } = comparison;
  return (
    <section className="mx-auto max-w-5xl px-5 py-24 md:px-8 md:py-36">
      <SectionHead title={comparison.headline} center />
      <Reveal className="mt-12 md:mt-16">
        <Item>
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <caption className="sr-only">{comparison.headline}</caption>
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[34%]" />
              <col className="w-[40%]" />
            </colgroup>
            <thead>
              <tr>
                <td />
                <th scope="col" className="px-3 pb-4 align-bottom text-sm font-bold leading-tight text-white/60 md:px-6 md:text-lg">
                  {columns.them}
                </th>
                <th scope="col" className="rounded-t-3xl border-x-2 border-t-2 border-accent bg-accent/[0.08] px-3 pb-4 pt-5 align-bottom text-base font-extrabold uppercase tracking-tight text-accent md:px-6 md:text-2xl">
                  {columns.us}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const last = i === rows.length - 1;
                return (
                  <tr key={r.label}>
                    <th scope="row" className="border-t border-line py-4 pr-2 align-top text-sm font-semibold text-white/75 md:py-6 md:text-lg">
                      {r.label}
                    </th>
                    <td className="border-t border-line px-3 py-4 align-top text-sm text-white/60 md:px-6 md:py-6 md:text-lg">
                      {r.them}
                    </td>
                    <td
                      className={`border-x-2 border-t border-accent border-t-accent/20 bg-accent/[0.08] px-3 py-4 align-top text-sm font-extrabold md:px-6 md:py-6 md:text-xl ${
                        last ? "rounded-b-3xl border-b-2" : ""
                      }`}
                    >
                      <span className="flex gap-2 md:gap-3">
                        <Check className="mt-px !h-4 !w-4 text-accent md:mt-0.5 md:!h-6 md:!w-6" />
                        {r.us}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Item>
      </Reveal>
    </section>
  );
}

/* ───────────── 10. Guarantee ───────────── */
export function Guarantee() {
  return (
    <section className="px-3 md:px-6">
      <div className="relative mx-auto max-w-[90rem] overflow-hidden rounded-[2rem] bg-accent text-black md:rounded-[3rem]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <Item as="p" className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em]">
              {guarantee.eyebrow}
            </Item>
            <Item as="h2" className="display text-[clamp(2.5rem,6.5vw,5.25rem)]">
              {guarantee.headline}
            </Item>
            <Item as="p" className="mt-7 max-w-2xl text-lg font-medium leading-relaxed md:text-xl">
              {guarantee.body}
            </Item>
            <Item as="p" className="mt-6 max-w-2xl border-t border-black/25 pt-5 text-sm font-medium leading-relaxed text-black/80">
              {guarantee.smallPrint}
            </Item>
          </Reveal>

          <Reveal>
            <Item>
              <p className="mb-3 inline-block rounded-full border border-dashed border-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {guarantee.exampleLabel}
              </p>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {guarantee.reports.map((r, i) => (
                  <div
                    key={r.title}
                    className={`rounded-2xl p-4 md:p-6 ${
                      i === 0 ? "bg-black/10 text-black" : "bg-black text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                    }`}
                  >
                    <p className={`text-sm font-extrabold uppercase tracking-widest ${i === 0 ? "text-black/70" : "text-accent"}`}>
                      {r.title}
                    </p>
                    <dl className="mt-4 space-y-4">
                      {r.metrics.map((mt) => (
                        <div key={mt.label}>
                          <dt className={`text-xs font-semibold ${i === 0 ? "text-black/70" : "text-white/65"}`}>{mt.label}</dt>
                          <dd className="text-3xl font-extrabold leading-none tracking-tight md:text-4xl">
                            <Counter to={mt.value} prefix={mt.prefix} />
                            {mt.suffix && <span className="text-sm font-bold opacity-60">{mt.suffix}</span>}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </Item>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 11. About ───────────── */
export function About() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
        <Reveal>
          <Item>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-panel lg:max-w-none">
              {about.headshot.src ? (
                <Image src={about.headshot.src} alt={about.headshot.alt} fill sizes="(max-width: 1024px) 384px, 480px" className="object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 border-2 border-dashed border-amber-300/40 text-center">
                  <svg viewBox="0 0 64 64" className="h-24 w-24 text-white/20" fill="currentColor" aria-hidden="true">
                    <circle cx="32" cy="22" r="13" />
                    <path d="M6 62c0-15 11.600-24 26-24s26 9 26 24z" />
                  </svg>
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
          <Item as="p" className="mt-7 text-xl leading-relaxed text-white/85 md:text-2xl">
            {about.copy}
          </Item>
          <Item as="p" className="mt-6 text-xl font-extrabold tracking-tight text-accent">
            {about.signature}
          </Item>
        </Reveal>
      </div>

      {/* stat strip */}
      <Reveal className="mt-16 grid divide-y divide-line rounded-3xl border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:mt-24">
        {about.stats.map((s) => (
          <Item key={s.label} className="px-7 py-8 text-center">
            <p className="display text-6xl md:text-7xl">
              {s.placeholder ? <span className="text-white/25">000</span> : <Counter to={s.value} suffix={s.suffix} />}
            </p>
            <p className="mt-2 text-base font-semibold text-white/80">{s.label}</p>
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
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-panel p-7">
                <blockquote className="text-lg font-medium leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-auto pt-6 text-sm text-mute">
                  <span className="font-bold text-white">{t.name}</span>
                  {t.company && <> · {t.company}</>}
                </figcaption>
              </figure>
            ) : (
              <div className="flex h-full min-h-40 flex-col items-start justify-center gap-3 rounded-3xl border-2 border-dashed border-white/15 p-7">
                <PlaceholderTag>{about.placeholderTag}</PlaceholderTag>
                <p className="text-base text-white/60">{about.testimonialPlaceholder}</p>
              </div>
            )}
          </Item>
        ))}
      </Reveal>
    </section>
  );
}

/* ───────────── 13. Final CTA ───────────── */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div
        className="pointer-events-none absolute left-1/2 top-full h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[130px]"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
      <Reveal className="relative mx-auto max-w-5xl px-5 py-28 text-center md:px-8 md:py-44">
        <Item as="h2" className="display text-[clamp(2.75rem,9vw,7rem)]">
          {finalCta.headline}
        </Item>
        <Item as="p" className="mx-auto mt-6 max-w-xl text-xl text-white/80 md:text-2xl">
          {finalCta.sub}
        </Item>
        <Item className="mx-auto mt-10 max-w-3xl text-left">
          <Analyzer />
        </Item>
      </Reveal>
    </section>
  );
}

/* ───────────── 14. Footer ───────────── */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-mute">{site.tagline}</p>
        </div>
        <a href={`mailto:${site.email}`} className="text-lg font-bold underline-offset-4 hover:text-accent hover:underline">
          {site.email}
        </a>
        <div className="flex flex-col gap-2 text-sm text-mute md:items-end">
          <nav aria-label="Legal" className="flex gap-5">
            {footer.links.map((l) => (
              <Link key={l.href} href={l.href} className="py-1 font-semibold underline-offset-4 hover:text-white hover:underline">
                {l.label}
              </Link>
            ))}
          </nav>
          <p>
            © {new Date().getFullYear()} {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
