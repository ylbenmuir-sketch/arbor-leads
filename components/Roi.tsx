"use client";

import { useId, useState } from "react";
import { FileChartColumn, MapPinned, MessageSquareText, MonitorSmartphone, Star, Wrench } from "lucide-react";
import { offer, roi } from "@/content";
import { Item, Reveal, SectionHead, SpringNumber } from "./ui";

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-base font-bold md:text-lg">
          {label}
        </label>
        <output htmlFor={id} className="text-3xl font-extrabold tracking-tight md:text-4xl" style={{ fontVariantNumeric: "tabular-nums" }}>
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-xs font-bold text-bg/70">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

/* Light section on the deeper cream tone, so it reads differently from the offer list above it. */
export function RoiCalculator() {
  const [job, setJob] = useState(roi.jobSize.default);
  const [jobs, setJobs] = useState(roi.extraJobs.default);
  const month = job * jobs;
  const usd = (n: number) => "$" + n.toLocaleString("en-US");

  return (
    <section className="on-cream border-t-2 border-bg/15 bg-[var(--cream-deep)] text-bg">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-28">
        <SectionHead eyebrow={roi.eyebrow} title={roi.headline} />
        <Reveal className="mt-8 grid gap-4 md:mt-14 md:gap-5 lg:grid-cols-2">
          <Item className="flex flex-col justify-center gap-6 rounded-lg border-2 border-bg bg-cream p-5 md:gap-10 md:p-10">
            <Slider label={roi.jobSize.label} value={job} onChange={setJob} min={roi.jobSize.min} max={roi.jobSize.max} step={roi.jobSize.step} format={usd} />
            <Slider label={roi.extraJobs.label} value={jobs} onChange={setJobs} min={roi.extraJobs.min} max={roi.extraJobs.max} step={roi.extraJobs.step} format={(n) => String(n)} />
          </Item>
          <Item className="grain flex flex-col justify-center rounded-lg border-2 border-bg bg-bg p-5 text-cream md:p-10">
            <p className="text-xl font-bold md:text-2xl" aria-live="polite" aria-atomic="true">
              <span className="sr-only">
                {roi.resultLead} {usd(month)} {roi.resultMonth} — {usd(month * 12)} {roi.resultYear}
              </span>
              <span aria-hidden="true">
                {roi.resultLead}
                <span className="display my-1 block text-[clamp(3.5rem,11vw,6.5rem)] text-cream">
                  <SpringNumber value={month} prefix="$" />
                </span>
                {roi.resultMonth} —{" "}
                <span className="font-extrabold">
                  <SpringNumber value={month * 12} prefix="$" />
                </span>{" "}
                {roi.resultYear}
              </span>
            </p>
            <p className="mt-6 border-t-2 border-line pt-5 text-lg font-extrabold leading-snug md:mt-8 md:text-2xl">{roi.note}</p>
            <p className="mt-2 text-sm text-muted">{roi.disclaimer}</p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

const offerIcons = {
  site: MonitorSmartphone,
  map: MapPinned,
  text: MessageSquareText,
  star: Star,
  wrench: Wrench,
  report: FileChartColumn,
};

/* "What you get": a plain ruled list (no cards), a big closing line, and the 3-step strip. */
export function OfferStack() {
  return (
    <section className="on-cream bg-cream text-bg">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-28">
        <SectionHead eyebrow={offer.eyebrow} title={offer.headline} />

        <Reveal as="ul" className="mt-8 grid border-t-[3px] border-bg md:mt-14 md:grid-cols-2 md:gap-x-14">
          {offer.items.map((it) => {
            const Icon = offerIcons[it.icon];
            return (
              <Item as="li" key={it.text} className="flex items-center gap-4 border-b-2 border-bg/15 py-3.5 md:gap-5 md:py-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-forest text-cream md:h-14 md:w-14">
                  <Icon className="h-5 w-5 md:h-7 md:w-7" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="text-[1.0625rem] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-2xl">{it.text}</span>
              </Item>
            );
          })}
        </Reveal>

        <Reveal className="mt-9 md:mt-16">
          <Item as="p" className="display-lg max-w-5xl">
            <span className="text-forest">{offer.closing.lead}</span> {offer.closing.text}
          </Item>
          <Item>
            <ol className="mt-8 grid overflow-hidden rounded-lg border-2 border-bg bg-bg text-cream md:mt-12 md:grid-cols-3">
              {offer.steps.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center gap-4 px-5 py-3.5 md:px-7 md:py-6 ${
                    i > 0 ? "border-t-2 border-line md:border-l-2 md:border-t-0" : ""
                  }`}
                >
                  <span className="text-3xl font-extrabold leading-none tracking-[-0.04em] text-sage md:text-5xl" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="sr-only">Step {i + 1}:</span>
                  <span className="text-lg font-extrabold leading-tight tracking-[-0.02em] md:text-2xl">{s}</span>
                </li>
              ))}
            </ol>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}
