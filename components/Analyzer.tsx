"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { analyzer as copy } from "@/content";
import { Check, Counter } from "./ui";

type Stage = "idle" | "scanning" | "result" | "done";

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
  transition: { duration: 0.3 },
};

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-base text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

export default function Analyzer({ id }: { id?: string }) {
  const uid = useId();
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("idle");
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const liveRef = useRef<HTMLDivElement>(null);

  // Scanning sequence: tick through the steps, then show the score.
  useEffect(() => {
    if (stage !== "scanning") return;
    const per = reduce ? 250 : 750;
    if (step >= copy.scanSteps.length) {
      const t = setTimeout(() => setStage("result"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), per);
    return () => clearTimeout(t);
  }, [stage, step, reduce]);

  function startScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setScore(mockScore(url));
    setStep(0);
    setStage("scanning");
  }

  function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lead = {
      website: url.trim(),
      mockScore: score,
      businessName: String(data.get("business") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      submittedAt: new Date().toISOString(),
    };
    // ────────────────────────────────────────────────────────────────
    // TODO(backend): REPLACE THIS WITH THE REAL BACKEND.
    //   1. POST `lead` to your API route / CRM / email tool.
    //   2. Run the real website analysis and email the report.
    //   3. The score shown above is a MOCK generated from the URL —
    //      swap `mockScore()` for the real result before launch.
    // ────────────────────────────────────────────────────────────────
    console.log("[Arbor Leads] New analysis request (not sent anywhere yet):", lead);
    setStage("done");
  }

  const ring = 2 * Math.PI * 52;

  return (
    <div
      id={id}
      className="relative overflow-hidden rounded-3xl border border-line bg-panel/80 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur sm:p-5"
    >
      <div ref={liveRef} aria-live="polite" className="min-h-[7.5rem] sm:min-h-[4.25rem]">
        <AnimatePresence mode="wait" initial={false}>
          {stage === "idle" && (
            <m.form key="idle" {...swap} onSubmit={startScan} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor={`${uid}-url`} className="sr-only">
                {copy.inputLabel}
              </label>
              <input
                id={`${uid}-url`}
                type="text"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={copy.inputLabel}
                className={`${inputClass} sm:flex-1 sm:py-4 sm:text-lg`}
              />
              <button type="submit" className="btn-primary cursor-pointer rounded-xl px-6 py-4 text-base sm:text-lg">
                {copy.button}
              </button>
            </m.form>
          )}

          {stage === "scanning" && (
            <m.div key="scan" {...swap} className="p-2">
              <p className="truncate text-sm text-mute">
                Scanning <span className="font-semibold text-white">{url.trim()}</span>
              </p>
              <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 w-1/3 rounded-full bg-accent"
                  style={{ animation: reduce ? undefined : "scan 1.1s ease-in-out infinite" }}
                />
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {copy.scanSteps.map((label, i) => {
                  const done = i < step;
                  const active = i === step;
                  return (
                    <li
                      key={label}
                      className={`flex items-center gap-3 text-base font-semibold transition-opacity duration-300 ${
                        done || active ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      {done ? (
                        <Check className="text-accent" />
                      ) : (
                        <span
                          className={`h-5 w-5 shrink-0 rounded-full border-2 border-white/25 ${
                            active ? "animate-spin border-t-accent" : ""
                          }`}
                        />
                      )}
                      {label}
                    </li>
                  );
                })}
              </ul>
            </m.div>
          )}

          {stage === "result" && (
            <m.div key="result" {...swap} className="p-1 sm:p-2">
              <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
                <div className="flex items-center gap-5">
                  <div className="relative h-32 w-32 shrink-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="9" />
                      <m.circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#ff5a4d"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={ring}
                        initial={{ strokeDashoffset: ring }}
                        animate={{ strokeDashoffset: ring * (1 - score / 100) }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Counter to={score} className="text-4xl font-extrabold tracking-tight" />
                      <span className="text-xs font-semibold text-mute">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow !text-[#ff7a70]">{copy.scoreLabel}</p>
                    <p className="mt-1 text-xl font-extrabold leading-tight tracking-tight">{copy.scoreVerdict}</p>
                    <p className="mt-1 truncate text-sm text-mute">{url.trim()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-white">{copy.redFlagsTitle}</p>
                  <ul className="mt-2 space-y-2">
                    {copy.redFlags.map((flag, i) => (
                      <li key={flag} className="flex items-center gap-3 rounded-lg border border-[#ff5a4d]/25 bg-[#ff5a4d]/[0.07] px-3 py-2">
                        <span aria-hidden="true" className="text-[#ff5a4d]">⚑</span>
                        <span className="text-sm font-bold">{flag}</span>
                        {/* Decorative blurred filler. Real findings come from the backend. */}
                        <span aria-hidden="true" className="ml-auto select-none text-sm text-white/80 blur-[6px]">
                          {["costing you calls daily", "hurting your ranking", "turning buyers away"][i % 3]}
                        </span>
                        <span className="sr-only">Details in your full report</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <form onSubmit={submitLead} className="mt-6 border-t border-line pt-5">
                <p className="text-lg font-extrabold tracking-tight sm:text-xl">{copy.leadPrompt}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label htmlFor={`${uid}-biz`} className="sr-only">{copy.fields.business}</label>
                    <input id={`${uid}-biz`} name="business" required autoComplete="organization" placeholder={copy.fields.business} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor={`${uid}-email`} className="sr-only">{copy.fields.email}</label>
                    <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" placeholder={copy.fields.email} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor={`${uid}-phone`} className="sr-only">{copy.fields.phone}</label>
                    <input id={`${uid}-phone`} name="phone" type="tel" required autoComplete="tel" placeholder={copy.fields.phone} className={inputClass} />
                  </div>
                </div>
                <button type="submit" className="btn-primary mt-3 w-full cursor-pointer rounded-xl px-6 py-4 text-lg">
                  {copy.leadButton}
                </button>
              </form>
            </m.div>
          )}

          {stage === "done" && (
            <m.div key="done" {...swap} className="flex flex-col items-center gap-4 px-2 py-6 text-center">
              <Check className="!h-12 !w-12 text-accent" />
              <p className="max-w-md text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">{copy.success}</p>
              <button
                type="button"
                onClick={() => {
                  setUrl("");
                  setStage("idle");
                }}
                className="cursor-pointer text-sm font-semibold text-mute underline underline-offset-4 hover:text-white"
              >
                {copy.startOver}
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
