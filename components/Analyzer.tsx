"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Check, CircleCheck, Flag, X } from "lucide-react";
import { analyzer as copy } from "@/content";
import { Counter, ease } from "./ui";

type Stage = "idle" | "scanning" | "done";

/** Same URL always gets the same mock score (31–58). */
function mockScore(url: string) {
  const clean = url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
  let h = 2166136261;
  for (let i = 0; i < clean.length; i++) h = Math.imul(h ^ clean.charCodeAt(i), 16777619);
  return 31 + (Math.abs(h) % 28);
}

const swap = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.45, ease },
};

const inputClass =
  "w-full min-h-14 rounded-md border-2 border-sage/50 bg-bg px-4 py-3.5 text-base text-cream focus:border-sage focus:outline-none";

export default function Analyzer() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("idle");
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  // Set when a "Start with <plan>" pricing button sends someone here.
  const [plan, setPlan] = useState("");

  useEffect(() => {
    const onPlan = (e: Event) => {
      setPlan((e as CustomEvent<string>).detail ?? "");
      setStage((s) => (s === "done" ? "idle" : s));
    };
    window.addEventListener("arbor:plan", onPlan);
    return () => window.removeEventListener("arbor:plan", onPlan);
  }, []);

  // Scanning sequence: tick through the steps, then show the score.
  useEffect(() => {
    if (stage !== "scanning") return;
    const per = reduce ? 250 : 800;
    if (step >= copy.scanSteps.length) {
      const t = setTimeout(() => setStage("done"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), per);
    return () => clearTimeout(t);
  }, [stage, step, reduce]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const website = String(data.get("website") ?? "").trim();
    const mock = mockScore(website);
    const lead = {
      businessName: String(data.get("business") ?? ""),
      website,
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      plan: String(data.get("plan") ?? ""),
      mockScore: mock,
      submittedAt: new Date().toISOString(),
    };
    // ────────────────────────────────────────────────────────────────
    // TODO(backend): REPLACE THIS WITH THE REAL BACKEND.
    //   1. POST `lead` to your API route / CRM / email tool.
    //   2. Run the real business analysis and email the report.
    //   3. The score shown below is a MOCK generated from the URL —
    //      swap `mockScore()` for the real result before launch.
    // ────────────────────────────────────────────────────────────────
    console.log("[Arbor Leads] New analysis request (not sent anywhere yet):", lead);
    setUrl(website);
    setScore(mock);
    setStep(0);
    setStage("scanning");
  }

  const ring = 2 * Math.PI * 52;
  const fields = [
    { name: "business", label: copy.fields.business, type: "text", auto: "organization", mode: "text" as const },
    { name: "website", label: copy.fields.website, type: "text", auto: "url", mode: "url" as const },
    { name: "email", label: copy.fields.email, type: "email", auto: "email", mode: "email" as const },
    { name: "phone", label: copy.fields.phone, type: "tel", auto: "tel", mode: "tel" as const },
  ];

  return (
    <div data-audit-form className="rounded-lg border-2 border-line bg-raised p-5 text-left sm:p-8" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "idle" && (
          <m.form key="idle" {...swap} onSubmit={submit}>
            <input type="hidden" name="plan" value={plan} />
            {plan && (
              <p className="mb-4 flex items-center justify-between gap-3 rounded-md border-2 border-line bg-bg py-1 pl-4 pr-1 text-base text-muted">
                <span>
                  {copy.planLabel} <span className="font-extrabold text-cream">{plan}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPlan("")}
                  aria-label={`${copy.planClear} ${plan}`}
                  className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted hover:text-cream"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name}>
                  <label htmlFor={`${uid}-${f.name}`} className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-cream">
                    {f.label}
                  </label>
                  <input
                    id={`${uid}-${f.name}`}
                    name={f.name}
                    type={f.type}
                    inputMode={f.mode}
                    autoComplete={f.auto}
                    autoCapitalize={f.name === "business" ? "words" : "none"}
                    spellCheck={false}
                    required
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-blaze btn-lg mt-5 w-full">
              {copy.button}
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {copy.consent.text}{" "}
              <Link href="/privacy" className="font-bold text-cream underline underline-offset-2">
                {copy.consent.link}
              </Link>
              .
            </p>
          </m.form>
        )}

        {stage === "scanning" && (
          <m.div key="scan" {...swap} className="py-4">
            <p className="truncate text-base text-muted">
              Checking <span className="font-bold text-cream">{url}</span>
            </p>
            <div className="relative mt-4 h-1.5 overflow-hidden rounded-sm bg-line">
              <div
                className="absolute inset-y-0 w-1/3 bg-sage"
                style={{ animation: reduce ? undefined : "scan 1.4s ease-in-out infinite" }}
              />
            </div>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {copy.scanSteps.map((label, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li
                    key={label}
                    className={`flex items-center gap-3 text-lg font-bold transition-opacity duration-500 ${
                      done || active ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 ${
                        done ? "border-sage bg-sage text-bg" : active ? "border-sage" : "border-line"
                      }`}
                    >
                      {done && <Check className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ul>
          </m.div>
        )}

        {stage === "done" && (
          <m.div key="done" {...swap}>
            <div className="flex items-start gap-4 border-b-2 border-line pb-6">
              <CircleCheck className="mt-0.5 h-8 w-8 shrink-0 text-sage" strokeWidth={2} aria-hidden="true" />
              <p className="text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">{copy.success}</p>
            </div>

            <div className="mt-6 grid gap-7 md:grid-cols-[auto_1fr] md:items-center">
              <div className="flex items-center gap-5">
                <div className="relative h-32 w-32 shrink-0">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" strokeWidth="10" />
                    <m.circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="var(--sage)"
                      strokeWidth="10"
                      strokeDasharray={ring}
                      initial={{ strokeDashoffset: ring }}
                      animate={{ strokeDashoffset: ring * (1 - score / 100) }}
                      transition={{ duration: 1.6, ease }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Counter to={score} className="text-4xl font-extrabold tracking-tight" />
                    <span className="text-xs font-semibold text-muted">/ 100</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="eyebrow">{copy.scoreLabel}</p>
                  <p className="mt-1.5 text-xl font-extrabold leading-tight tracking-tight">{copy.scoreVerdict}</p>
                  <p className="mt-1 truncate text-sm text-muted">{url}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-cream">{copy.redFlagsTitle}</p>
                <ul className="mt-3 space-y-2">
                  {copy.redFlags.map((flag, i) => (
                    <li key={flag} className="flex items-center gap-3 rounded-md border-2 border-line bg-bg px-3.5 py-2.5">
                      <Flag className="h-4 w-4 shrink-0 text-sage" strokeWidth={2.25} aria-hidden="true" />
                      <span className="text-sm font-bold">{flag}</span>
                      {/* Decorative blurred filler. Real findings come from the backend. */}
                      <span aria-hidden="true" className="ml-auto select-none text-sm text-muted blur-[6px]">
                        {["details in your report", "see the full report", "details in your report"][i % 3]}
                      </span>
                      <span className="sr-only">Details in your full report</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage("idle")}
              className="mt-6 inline-flex min-h-12 cursor-pointer items-center text-sm font-bold text-muted underline underline-offset-4 hover:text-cream"
            >
              {copy.startOver}
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
