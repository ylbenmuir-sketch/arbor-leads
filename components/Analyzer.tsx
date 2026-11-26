"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Check, CircleCheck, Flag, X } from "lucide-react";
import { analyzer as copy, pricing, site } from "@/content";
import { Counter, bookingUrl, ease, rememberContact, useBookingHref } from "./ui";

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
  // "zero-down" or "495-setup", set by the "Two ways to start" buttons.
  const [setup, setSetup] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const bookHref = useBookingHref();

  useEffect(() => {
    const onPlan = (e: Event) => {
      setPlan((e as CustomEvent<string>).detail ?? "");
      setStage((s) => (s === "done" ? "idle" : s));
    };
    const onSetup = (e: Event) => {
      setSetup((e as CustomEvent<string>).detail ?? "");
      setStage((s) => (s === "done" ? "idle" : s));
    };
    window.addEventListener("arbor:plan", onPlan);
    window.addEventListener("arbor:setup", onSetup);
    return () => {
      window.removeEventListener("arbor:plan", onPlan);
      window.removeEventListener("arbor:setup", onSetup);
    };
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

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const business = get("business");
    const city = get("city");
    const website = get("website");
    // No website: score and show the business name instead.
    const checking = website || business;
    // TODO: the score is still a MOCK generated from the URL. Swap in a real analysis before relying on it.
    const mock = mockScore(website || `${business} ${city}`);
    const lead = {
      name: get("name"),
      businessName: business,
      city,
      website,
      email: get("email"),
      phone: get("phone"),
      plan: get("plan"),
      setup: get("setup"),
      company: get("company"), // honeypot
    };

    setSending(true);
    setError(false);
    try {
      // Saves to Supabase and emails the owner (app/api/leads/route.ts).
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setError(true);
      setSending(false);
      return;
    }
    setSending(false);
    rememberContact({ name: lead.name, email: lead.email });
    setEmail(lead.email);
    setUrl(checking);
    setScore(mock);
    setStep(0);
    setStage("scanning");
  }

  const setupOption = pricing.setup.options.find((o) => o.id === setup);
  const picks = [
    ...(plan ? [{ label: copy.planLabel, value: plan, clear: () => setPlan("") }] : []),
    ...(setupOption ? [{ label: copy.setupLabel, value: `${setupOption.price} ${setupOption.detail}`, clear: () => setSetup("") }] : []),
  ];
  const ring = 2 * Math.PI * 52;
  // Website is optional and spans the full row, so business/city and email/phone pair up.
  const fields = [
    { name: "name", label: copy.fields.name, type: "text", auto: "name", mode: "text" as const, wide: true },
    { name: "business", label: copy.fields.business, type: "text", auto: "organization", mode: "text" as const },
    { name: "city", label: copy.fields.city, type: "text", auto: "address-level2", mode: "text" as const },
    { name: "website", label: copy.fields.website, type: "text", auto: "url", mode: "url" as const, optional: true, wide: true, placeholder: copy.websitePlaceholder },
    { name: "email", label: copy.fields.email, type: "email", auto: "email", mode: "email" as const },
    { name: "phone", label: copy.fields.phone, type: "tel", auto: "tel", mode: "tel" as const },
  ];

  return (
    <div data-audit-form className="rounded-lg border-2 border-line bg-raised p-5 text-left sm:p-8" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "idle" && (
          <m.form key="idle" {...swap} onSubmit={submit}>
            <input type="hidden" name="plan" value={plan} />
            <input type="hidden" name="setup" value={setup} />
            {picks.map((c) => (
              <p key={c.label} className="mb-3 flex items-center justify-between gap-3 rounded-md border-2 border-line bg-bg py-1 pl-4 pr-1 text-base text-muted">
                <span>
                  {c.label} <span className="font-extrabold text-cream">{c.value}</span>
                </span>
                <button
                  type="button"
                  onClick={c.clear}
                  aria-label={`${copy.planClear} ${c.value}`}
                  className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted hover:text-cream"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </p>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.wide ? "sm:col-span-2" : undefined}>
                  <label htmlFor={`${uid}-${f.name}`} className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-cream">
                    {f.label}
                    {f.optional && <span className="ml-1.5 font-semibold normal-case tracking-normal text-muted">{copy.optional}</span>}
                  </label>
                  <input
                    id={`${uid}-${f.name}`}
                    name={f.name}
                    type={f.type}
                    inputMode={f.mode}
                    autoComplete={f.auto}
                    autoCapitalize={f.name === "name" || f.name === "business" || f.name === "city" ? "words" : "none"}
                    spellCheck={false}
                    required={!f.optional}
                    placeholder={f.placeholder}
                    className={`${inputClass} placeholder:text-muted/60`}
                  />
                </div>
              ))}
            </div>
            {/* Honeypot: hidden from people, filled in by bots. The API drops anything that has it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            {error && (
              <p role="alert" className="mt-5 rounded-md border-2 border-blaze bg-bg px-4 py-3 text-base font-semibold text-cream">
                {copy.error}{" "}
                <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                  {site.email}
                </a>
                .
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className="btn btn-blaze btn-lg mt-5 w-full disabled:cursor-wait disabled:opacity-70 max-[400px]:!px-3 max-[400px]:!text-[0.875rem]"
            >
              {sending ? copy.sending : copy.button}
            </button>
            {/* Second path for ready buyers. Hidden until a booking link is set: without one it would only point back at this form. */}
            {bookingUrl && (
              <p className="mt-3 text-center text-sm text-muted">
                <a
                  href={bookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4 hover:text-cream"
                >
                  {site.ratherTalk} {site.bookCall}
                </a>
              </p>
            )}
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
              <p className="min-w-0 break-words text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
                {copy.success.replace("{email}", email)}
              </p>
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

            {bookingUrl && (
              <div className="mt-7 flex flex-col gap-3 border-t-2 border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-lg font-extrabold tracking-tight">{copy.bookAfter}</p>
                <a href={bookHref} target="_blank" rel="noopener noreferrer" className="btn btn-blaze shrink-0">
                  {site.bookCall}
                </a>
              </div>
            )}

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
