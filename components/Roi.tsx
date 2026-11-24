"use client";

import { useId, useState } from "react";
import { howItWorks, roi } from "@/content";
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

/* Light section: cream background, dark text, forest accents. */
export function RoiCalculator() {
  const [job, setJob] = useState(roi.jobSize.default);
  const [jobs, setJobs] = useState(roi.extraJobs.default);
  const month = job * jobs;
  const usd = (n: number) => "$" + n.toLocaleString("en-US");

  return (
    <section className="on-cream bg-cream text-bg">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <SectionHead eyebrow={roi.eyebrow} title={roi.headline} />
        <Reveal className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-2">
          <Item className="flex flex-col justify-center gap-10 rounded-lg border-2 border-bg bg-white/60 p-7 md:p-10">
            <Slider label={roi.jobSize.label} value={job} onChange={setJob} min={roi.jobSize.min} max={roi.jobSize.max} step={roi.jobSize.step} format={usd} />
            <Slider label={roi.extraJobs.label} value={jobs} onChange={setJobs} min={roi.extraJobs.min} max={roi.extraJobs.max} step={roi.extraJobs.step} format={(n) => String(n)} />
          </Item>
          <Item className="grain flex flex-col justify-center rounded-lg border-2 border-bg bg-bg p-7 text-cream md:p-10">
            <p className="text-xl font-bold md:text-2xl" aria-live="polite" aria-atomic="true">
              <span className="sr-only">
                {roi.resultLead} {usd(month)} {roi.resultMonth} — {usd(month * 12)} {roi.resultYear}
              </span>
              <span aria-hidden="true">
                {roi.resultLead}
                <span className="display my-1 block text-[clamp(3.5rem,11vw,6.5rem)] text-sage">
                  <SpringNumber value={month} prefix="$" />
                </span>
                {roi.resultMonth} —{" "}
                <span className="font-extrabold">
                  <SpringNumber value={month * 12} prefix="$" />
                </span>{" "}
                {roi.resultYear}
              </span>
            </p>
            <p className="mt-8 border-t-2 border-line pt-5 text-lg font-extrabold md:text-xl">{roi.footnote}</p>
            <p className="mt-2 text-sm text-muted">{roi.disclaimer}</p>
          </Item>
        </Reveal>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <SectionHead eyebrow={howItWorks.eyebrow} title={howItWorks.headline} />
        <Reveal as="ol" className="mt-12 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {howItWorks.steps.map((s, i) => (
            <Item as="li" key={s.title} className="relative border-t-4 border-line pt-7">
              <span className="absolute -top-1 left-0 h-1 w-16 bg-sage" aria-hidden="true" />
              <span className="display block text-7xl text-sage md:text-8xl" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="mt-5 text-2xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-3xl">{s.title}</h3>
              <p className="mt-3 text-lg text-muted">{s.body}</p>
            </Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
