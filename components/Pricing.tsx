"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { Check } from "lucide-react";
import { pricing } from "@/content";
import { CtaButton, Item, Reveal, SectionHead, ease } from "./ui";

const usd = (n: number) => "$" + n.toLocaleString("en-US");

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(pricing.deadline).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  if (left === 0) return <span className="font-bold">{pricing.ended}</span>;

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
        <div key={p.l} className="w-14 rounded-md border-2 border-line bg-bg px-1 py-2 text-center md:w-16" aria-hidden="true">
          <div className="text-2xl font-extrabold leading-none tracking-tight md:text-3xl" style={{ fontVariantNumeric: "tabular-nums" }}>
            {left === null ? "––" : String(p.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-muted">{p.l}</div>
        </div>
      ))}
    </div>
  );
}

/** Regular price with a line that draws across it on scroll. */
function Struck({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-xl font-bold text-muted">
      <s className="no-underline">{children}</s>
      <m.span
        className="absolute -inset-x-1 top-1/2 h-[3px] origin-left -rotate-6 bg-cream"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.8, delay: 0.5, ease }}
        aria-hidden="true"
      />
    </span>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const paidMonths = 12 - pricing.annualMonthsFree;

  return (
    <section id="pricing" className="grain border-y-2 border-line bg-deep">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <SectionHead eyebrow={pricing.eyebrow} title={pricing.headline} center />

        <Reveal className="mt-10 md:mt-14">
          {/* year-end sale tag + countdown */}
          <Item className="flex flex-col items-center justify-between gap-5 rounded-lg border-2 border-line bg-raised px-5 py-5 text-center md:flex-row md:px-7 md:text-left">
            <p className="rounded-sm bg-blaze px-3.5 py-2 text-sm font-extrabold uppercase leading-snug tracking-[0.06em] text-bg md:text-base">
              {pricing.saleTag}
            </p>
            <Countdown />
          </Item>

          {/* monthly / annual toggle */}
          <Item className="mt-10 flex justify-center">
            <div role="group" aria-label="Billing period" className="inline-flex rounded-lg border-2 border-line bg-raised p-1.5">
              {[
                { on: false, label: pricing.toggle.monthly },
                { on: true, label: pricing.toggle.annual },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={annual === o.on}
                  onClick={() => setAnnual(o.on)}
                  className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-md px-5 text-base font-extrabold uppercase tracking-[0.05em] transition-colors duration-300 ${
                    annual === o.on ? "bg-cream text-bg" : "text-muted hover:text-cream"
                  }`}
                >
                  {o.label}
                  {o.on && (
                    <span className={`rounded-sm px-2 py-0.5 text-xs font-extrabold ${annual ? "bg-forest text-cream" : "bg-forest text-cream"}`}>
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
            // Annual = pay for 10 months, shown as the per-month price.
            const yearly = p.price * paidMonths;
            const price = annual ? Math.round(yearly / 12) : p.price;
            return (
              <Item as="li" key={p.name} className={p.featured ? "lg:-my-4" : ""}>
                <m.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease }}
                  className={`relative flex h-full flex-col rounded-lg p-7 md:p-9 ${
                    p.featured ? "border-[3px] border-sage bg-raised" : "border-2 border-line bg-raised"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-4 left-7 rounded-sm bg-sage px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-bg md:left-9">
                      {pricing.featuredBadge}
                    </span>
                  )}
                  <h3 className="text-3xl font-extrabold tracking-[-0.03em]">{p.name}</h3>
                  <p className="mt-1 text-base text-muted">{p.blurb}</p>

                  <div className="mt-7">
                    <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.12em] text-muted">
                      {pricing.regularLabel}
                      <Struck>
                        {usd(p.regular)}
                        {pricing.perMonth}
                      </Struck>
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <span className="sr-only">Now </span>
                      <span className="display text-6xl md:text-7xl" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {usd(price)}
                      </span>
                      <span className="text-xl font-bold text-muted">
                        {pricing.perMonth} {p.priceSuffix}
                      </span>
                    </p>
                    <p className="mt-2 min-h-6 text-sm font-bold text-sage">
                      {annual
                        ? `${pricing.billedYearly} (${usd(yearly)}) · ${pricing.toggle.annualNote}`
                        : pricing.billedMonthly}
                    </p>
                  </div>

                  <ul className="mb-9 mt-7 space-y-3.5 border-t-2 border-line pt-7">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 text-base font-medium leading-snug text-cream">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-sage" strokeWidth={3} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <CtaButton full variant={p.featured ? "blaze" : "forest"} />
                  </div>
                </m.div>
              </Item>
            );
          })}
        </Reveal>

        {/* setup options */}
        <Reveal className="mt-10 md:mt-14">
          <Item className="rounded-lg border-2 border-line bg-raised p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <p className="eyebrow">{pricing.setup.title}</p>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
                {pricing.setup.options.map((o, i) => (
                  <div key={o.price} className="contents">
                    {i > 0 && (
                      <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-muted">{pricing.setup.or}</span>
                    )}
                    <p className="rounded-md border-2 border-line bg-bg px-5 py-3.5">
                      <span className="text-xl font-extrabold tracking-tight text-cream md:text-2xl">{o.price}</span>{" "}
                      <span className="text-base text-muted">{o.detail}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Item>
        </Reveal>

        {/* trust row */}
        <Reveal as="ul" className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {pricing.trust.map((t) => (
            <Item as="li" key={t} className="flex items-center gap-2 rounded-md border-2 border-line px-4 py-2.5 text-sm font-bold md:text-base">
              <Check className="h-4 w-4 shrink-0 text-sage" strokeWidth={3} aria-hidden="true" />
              {t}
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
