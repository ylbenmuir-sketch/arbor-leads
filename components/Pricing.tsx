"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, Check, ChevronDown, ShieldCheck } from "lucide-react";
import { guarantee, pricing, roi } from "@/content";
import { goToAnalyzer } from "./Providers";
import { CtaButton, Item, Reveal, SectionHead, ease } from "./ui";

const usd = (n: number) => "$" + n.toLocaleString("en-US");

/** Milliseconds until the pricing deadline (null until the browser has loaded). */
function useTimeLeft() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(pricing.deadline).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return left;
}

/** Desktop: four boxes. */
function Countdown({ left }: { left: number | null }) {
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
        <div key={p.l} className="w-16 rounded-md border-2 border-line bg-bg px-1 py-2 text-center" aria-hidden="true">
          <div className="text-3xl font-extrabold leading-none tracking-tight" style={{ fontVariantNumeric: "tabular-nums" }}>
            {left === null ? "––" : String(p.v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest text-muted">{p.l}</div>
        </div>
      ))}
    </div>
  );
}

/** Phones: one row inside the sale tag, e.g. "Ends Dec 31 · 37d 13h left". */
function CountdownRow({ left }: { left: number | null }) {
  if (left === 0) return <>{pricing.ended}</>;
  const s = Math.floor((left ?? 0) / 1000);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {pricing.endsShort}
      {left !== null && ` · ${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${pricing.leftShort}`}
    </span>
  );
}

/** Regular price with an orange line that draws across it on scroll. */
function Struck({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-xl font-bold text-muted">
      <s className="no-underline">{children}</s>
      <m.span
        className="absolute -inset-x-1 top-1/2 h-[3px] origin-left -rotate-6 bg-blaze"
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
  // Phones: which plans have their full feature list open.
  const [open, setOpen] = useState<string[]>([]);
  const left = useTimeLeft();
  const paidMonths = 12 - pricing.annualMonthsFree;

  return (
    <section id="pricing" className="grain overflow-x-clip bg-deep">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 md:px-8 md:py-28">
        <SectionHead
          eyebrow={pricing.eyebrow}
          title={pricing.headline}
          sub={
            <>
              {/* phones: the calculator is hidden, so its payoff line lives here */}
              <span className="md:hidden">{roi.note}</span>
              <span className="max-md:hidden">{pricing.sub}</span>
            </>
          }
          center
        />

        <Reveal className="mt-6 md:mt-14">
          {/* year-end sale tag + countdown */}
          <Item>
            {/* phones: tag and countdown in one small block */}
            <p className="rounded-sm bg-blaze px-3 py-2 text-center text-[0.8125rem] font-extrabold uppercase leading-snug tracking-[0.05em] text-bg md:hidden">
              <span className="block">{pricing.saleTagShort}</span>
              <span className="block">
                <CountdownRow left={left} />
              </span>
            </p>
            <div className="hidden items-center justify-between gap-5 rounded-lg border-2 border-line bg-raised px-7 py-5 md:flex">
              <p className="rounded-sm bg-blaze px-3.5 py-2 text-base font-extrabold uppercase leading-snug tracking-[0.06em] text-bg">
                {pricing.saleTag}
              </p>
              <Countdown left={left} />
            </div>
          </Item>

          {/* monthly / annual toggle */}
          <Item className="mt-3 flex justify-center md:mt-10">
            <div role="group" aria-label="Billing period" className="inline-flex rounded-lg border-2 border-line bg-raised p-1 md:p-1.5">
              {[
                { on: false, label: pricing.toggle.monthly },
                { on: true, label: pricing.toggle.annual },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={annual === o.on}
                  onClick={() => setAnnual(o.on)}
                  className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-md px-3 text-[0.8125rem] font-extrabold uppercase tracking-[0.05em] sm:px-5 sm:text-base transition-colors duration-300 ${
                    annual === o.on ? "bg-cream text-bg" : "text-muted hover:text-cream"
                  }`}
                >
                  {o.label}
                  {o.on && (
                    <span className={`rounded-sm px-2 py-0.5 text-xs font-extrabold bg-forest text-cream`}>
                      {pricing.toggle.annualNote}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Item>
        </Reveal>

        {/* plans: a swipeable row on phones (Most Popular first), a 3-up grid on desktop */}
        <Reveal
          as="ul"
          className="no-scrollbar -mx-5 mt-2 flex snap-x snap-mandatory items-stretch gap-3.5 overflow-x-auto px-5 pb-3 pt-5 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-6 lg:pt-8"
        >
          {pricing.plans.map((p) => {
            // Annual = pay for 10 months, shown as the per-month price.
            const yearly = p.price * paidMonths;
            const price = annual ? Math.round(yearly / 12) : p.price;
            return (
              <Item
                as="li"
                key={p.name}
                className={`w-[84%] shrink-0 snap-center sm:w-[56%] lg:w-auto ${p.featured ? "max-lg:order-first lg:z-10 lg:scale-[1.04]" : ""}`}
              >
                <m.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease }}
                  className={`relative flex h-full flex-col rounded-lg bg-raised p-5 md:p-9 ${
                    p.featured ? "border-2 border-t-[6px] border-cream border-t-blaze" : "border-2 border-line"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-5 left-6 rounded-sm bg-cream px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-bg md:left-9">
                      {pricing.featuredBadge}
                    </span>
                  )}
                  <h3 className="text-3xl font-extrabold tracking-[-0.03em]">{p.name}</h3>
                  <p className="mt-1 text-base text-muted">{p.blurb}</p>

                  <div className="mt-4 md:mt-7">
                    <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.12em] text-muted">
                      {pricing.regularLabel}
                      <Struck>
                        {usd(p.regular)}
                        {pricing.perMonth}
                      </Struck>
                    </p>
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <span className="sr-only">Now </span>
                      <span className="display text-[3.25rem] md:text-7xl" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {usd(price)}
                      </span>
                      <span className="text-xl font-bold text-muted">
                        {pricing.perMonth} {p.priceSuffix}
                      </span>
                    </p>
                    <p className="mt-2 min-h-5 text-sm font-bold text-cream">
                      {annual
                        ? `${pricing.billedYearly} (${usd(yearly)}) · ${pricing.toggle.annualNote}`
                        : pricing.billedMonthly}
                    </p>
                  </div>

                  {/* Phones show the first few features and a toggle; tablets and up show them all. */}
                  <ul id={`features-${p.name}`} className="mt-4 space-y-2 border-t-2 border-line pt-4 md:mb-9 md:mt-7 md:space-y-3.5 md:pt-7">
                    {p.features.map((f, i) => (
                      <li
                        key={f}
                        className={`flex gap-3 text-base font-medium leading-snug text-cream ${
                          i >= pricing.featuresShown && !open.includes(p.name) ? "max-md:hidden" : ""
                        }`}
                      >
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-sage" strokeWidth={3} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.features.length > pricing.featuresShown ? (
                    <button
                      type="button"
                      aria-expanded={open.includes(p.name)}
                      aria-controls={`features-${p.name}`}
                      onClick={() => setOpen((o) => (o.includes(p.name) ? o.filter((n) => n !== p.name) : [...o, p.name]))}
                      className="mb-2 flex min-h-12 cursor-pointer items-center gap-1.5 self-start text-sm font-bold text-cream underline underline-offset-4 md:hidden"
                    >
                      {open.includes(p.name) ? pricing.seeLess : pricing.seeAll}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open.includes(p.name) ? "rotate-180" : ""}`} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  ) : (
                    <div className="mb-5 md:hidden" />
                  )}

                  <div className="mt-auto">
                    {/* Scrolls to the free audit form with this plan pre-selected. */}
                    <CtaButton full variant={p.featured ? "blaze" : "forest"} label={`${pricing.planCta} ${p.name}`} plan={p.name} />
                  </div>
                </m.div>
              </Item>
            );
          })}
        </Reveal>
        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted lg:hidden">
          {pricing.swipeHint} <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </p>

        <Reveal className="mt-3 md:mt-8">
          {/* guarantee strip (on phones it joins "Two ways to start" below as one card) */}
          <Item className="flex items-center gap-4 rounded-lg border-2 border-cream bg-raised px-4 py-3 max-md:rounded-b-none max-md:border-b-0 md:gap-6 md:px-7 md:py-5">
            <ShieldCheck className="h-9 w-9 shrink-0 text-sage md:h-11 md:w-11" strokeWidth={1.75} aria-hidden="true" />
            <ul className="grid gap-1.5 text-[0.9375rem] font-extrabold leading-snug tracking-[-0.01em] md:grid-cols-2 md:gap-8 md:text-xl">
              {guarantee.items.map((g) => (
                <li key={g.text}>
                  {g.text}
                  {g.planNote && <span className="block text-sm font-bold text-muted md:text-base">{g.planNote}</span>}
                </li>
              ))}
            </ul>
          </Item>

          {/* setup options */}
          <Item className="rounded-lg border-2 border-line bg-raised px-4 py-3 max-md:rounded-t-none max-md:border-cream max-md:border-t-line md:mt-5 md:p-7">
            <div className="flex flex-col gap-2 md:gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
              <p className="eyebrow">{pricing.setup.title}</p>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
                {/* TODO: when Cal.com booking is live, these open booking instead of the audit form. */}
                {pricing.setup.options.map((o, i) => (
                  <div key={o.id} className="contents">
                    {i > 0 && (
                      <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-muted max-md:hidden">{pricing.setup.or}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => goToAnalyzer(undefined, o.id)}
                      className="group flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-md border-2 border-line bg-bg px-3.5 py-1.5 text-left leading-snug md:py-2.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-blaze md:px-5 md:py-3.5"
                    >
                      <span>
                        <span className="text-base font-extrabold text-cream md:text-2xl">{o.price}</span>{" "}
                        <span className="text-sm text-muted md:text-base">{o.detail}</span>
                      </span>
                      <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-colors duration-200 group-hover:text-cream" strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Item>

          {/* PHONES ONLY: the guarantee section is hidden there, so ownership and the honest note sit here once. */}
          <Item className="mt-7 md:hidden">
            {guarantee.ownershipShort.map((l, i) => (
              <p key={l} className={i === 0 ? "text-[1.3rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-cream" : "mt-2 text-base leading-snug text-cream"}>
                {l}
              </p>
            ))}
            <p className="mt-4 text-sm leading-snug text-muted">{guarantee.note}</p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}
