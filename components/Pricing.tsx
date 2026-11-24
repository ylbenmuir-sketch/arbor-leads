"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { pricing } from "@/content";
import { Check, CtaButton, Item, Reveal, SectionHead } from "./ui";

const usd = (n: number) => "$" + n.toLocaleString("en-US");

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(pricing.banner.deadline).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  if (left === 0) return <span className="font-bold">{pricing.banner.ended}</span>;

  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    { v: Math.floor(s / 86400), l: "days" },
    { v: Math.floor((s % 86400) / 3600), l: "hrs" },
    { v: Math.floor((s % 3600) / 60), l: "min" },
    { v: s % 60, l: "sec" },
  ];
  const label = left === null ? "" : `${parts[0].v} days, ${parts[1].v} hours, ${parts[2].v} minutes left`;

  return (
    <div className="flex gap-2" role="timer" aria-label={label}>
      {parts.map((p) => (
        <div key={p.l} className="w-14 rounded-xl bg-black px-1 py-2 text-center text-white md:w-16" aria-hidden="true">
          <div className="text-2xl font-extrabold leading-none tracking-tight md:text-3xl" style={{ fontVariantNumeric: "tabular-nums" }}>
            {left === null ? "––" : String(p.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-white/60">{p.l}</div>
        </div>
      ))}
    </div>
  );
}

/** Regular price with a red line that draws across it on scroll. */
function Struck({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-xl font-bold text-white/60">
      <s className="no-underline">{children}</s>
      <m.span
        className="absolute -inset-x-1 top-1/2 h-[2.5px] origin-left -rotate-6 rounded-full bg-[#ff5a4d]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.55, delay: 0.5, ease: [0.6, 0, 0.2, 1] }}
        aria-hidden="true"
      />
    </span>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const paidMonths = 12 - pricing.annualMonthsFree;

  return (
    <section id="pricing" className="border-t border-line bg-[#0d0d0d]">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <SectionHead eyebrow={pricing.eyebrow} title={pricing.headline} center />

        <Reveal className="mt-10 md:mt-14">
          {/* year-end banner + countdown */}
          <Item className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-accent px-6 py-6 text-center text-black md:flex-row md:px-9 md:text-left">
            <p className="text-xl font-bold leading-tight md:text-2xl">
              <span className="font-extrabold uppercase tracking-tight">{pricing.banner.title}</span> —{" "}
              {pricing.banner.text}
            </p>
            <Countdown />
          </Item>

          {/* website build */}
          <Item className="mt-5 rounded-3xl border border-line bg-panel p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="eyebrow !text-white/60">{pricing.build.title}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <div className="rounded-2xl border-2 border-accent bg-accent/10 px-5 py-3.5">
                  <span className="text-2xl font-extrabold tracking-tight text-accent md:text-3xl">
                    {pricing.build.primary.price}
                  </span>{" "}
                  <span className="text-base font-semibold text-white/85">{pricing.build.primary.detail}</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-white/50">{pricing.build.or}</span>
                <div className="px-1 py-1">
                  <span className="text-lg font-extrabold tracking-tight">{pricing.build.secondary.price}</span>
                  <span className="text-base text-mute">, {pricing.build.secondary.detail}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-mute md:text-right">{pricing.build.note}</p>
          </Item>

          {/* monthly / annual toggle */}
          <Item className="mt-10 flex justify-center">
            <div role="group" aria-label="Billing period" className="inline-flex rounded-full border border-line bg-panel p-1.5">
              {[
                { on: false, label: pricing.toggle.monthly },
                { on: true, label: pricing.toggle.annual },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={annual === o.on}
                  onClick={() => setAnnual(o.on)}
                  className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-base font-bold transition-colors duration-200 ${
                    annual === o.on ? "bg-white text-black" : "text-white/75 hover:text-white"
                  }`}
                >
                  {o.label}
                  {o.on && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${annual ? "bg-black text-accent" : "bg-accent/15 text-accent"}`}>
                      {pricing.toggle.annualNote}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Item>
        </Reveal>

        {/* plans */}
        <Reveal as="ul" className="mt-8 grid items-stretch gap-5 lg:grid-cols-3">
          {pricing.plans.map((p) => {
            const price = annual ? p.price * paidMonths : p.price;
            const regular = annual ? p.regular * 12 : p.regular;
            const unit = annual ? pricing.perYear : pricing.perMonth;
            return (
              <Item as="li" key={p.name} className={p.featured ? "lg:-my-4" : ""}>
                <m.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={`relative flex h-full flex-col rounded-3xl p-7 md:p-9 ${
                    p.featured
                      ? "gradient-border shadow-[0_0_80px_-20px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
                      : "border border-line bg-panel"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3.5 left-7 rounded-full bg-accent px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-black md:left-9">
                      {pricing.featuredBadge}
                    </span>
                  )}
                  <h3 className="text-3xl font-extrabold tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-base text-mute">{p.blurb}</p>

                  <div className="mt-7">
                    <p className="flex items-center gap-2.5 text-sm font-semibold text-white/60">
                      {pricing.regularLabel}
                      <Struck>
                        {usd(regular)}
                        {unit}
                      </Struck>
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <span className="sr-only">{pricing.yearEndLabel}: </span>
                      <span className="display text-6xl md:text-7xl" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {usd(price)}
                      </span>
                      <span className="text-xl font-bold text-white/70">
                        {unit} {p.priceSuffix}
                      </span>
                    </p>
                    <p className="mt-2 min-h-6 text-sm font-bold text-accent">
                      {annual
                        ? `${pricing.toggle.annualNote} — ${pricing.saveLabel.toLowerCase()} ${usd(p.price * pricing.annualMonthsFree)}`
                        : `${pricing.yearEndLabel} — ${pricing.saveLabel.toLowerCase()} ${usd(p.regular - p.price)}/mo`}
                    </p>
                  </div>

                  <ul className="mb-9 mt-7 space-y-3.5 border-t border-line pt-7">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 text-base font-medium leading-snug text-white/90">
                        <Check className="mt-0.5 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <CtaButton full variant={p.featured ? "primary" : "outline"} />
                  </div>
                </m.div>
              </Item>
            );
          })}
        </Reveal>

        {/* trust row */}
        <Reveal as="ul" className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 md:mt-16">
          {pricing.trust.map((t) => (
            <Item as="li" key={t} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-bold md:text-base">
              <Check className="!h-4 !w-4 text-accent" />
              {t}
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
