"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { CalendarCheck, PhoneMissed, RotateCcw, Timer } from "lucide-react";
import { mock, speedToLead as copy } from "@/content";
import { Item, Reveal, ease } from "./ui";

/**
 * Timeline (ms from start). Each entry reveals the next thing on screen.
 * 0: missed call · 1: auto-text · 2: customer typing · 3: customer reply
 * 4: auto-reply with link · 5: booked confirmation
 */
const TIMELINE = [600, 2200, 4000, 5600, 7400, 9400];
const LAST = TIMELINE.length;

const rise = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease },
};

function Bubble({ from, children, tag }: { from: "business" | "customer"; children: React.ReactNode; tag?: string }) {
  const mine = from === "business";
  return (
    <m.div {...rise} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[84%] rounded-xl px-3.5 py-2.5 text-[0.9rem] leading-snug ${
          mine ? "rounded-br-sm bg-sage font-medium text-bg" : "rounded-bl-sm bg-raised text-cream"
        }`}
      >
        {children}
      </div>
      {tag && <span className="mt-1 px-1 text-[0.65rem] font-semibold text-muted">{tag}</span>}
    </m.div>
  );
}

export default function SpeedToLead() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(LAST);
      return;
    }
    setShown(0);
    const timers = TIMELINE.map((t, i) => setTimeout(() => setShown(i + 1), t));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, run]);

  const [first, reply, link] = copy.messages;

  return (
    <section className="relative overflow-hidden py-16 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-7 px-5 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <Reveal>
          <Item as="p" className="eyebrow mb-4 md:mb-5">
            {copy.eyebrow}
          </Item>
          <Item as="h2" className="display-lg">
            {copy.headline}
          </Item>
          <Item as="p" className="mt-5 max-w-xl text-lg font-semibold leading-snug text-muted md:mt-8 md:text-2xl">
            {copy.caption}
          </Item>
          {/* the big label beside the phone */}
          <Item className="mt-6 flex items-center gap-4 border-y-2 border-cream py-4 md:mt-10 md:gap-6 md:py-6">
            <Timer className="h-11 w-11 shrink-0 text-sage md:h-20 md:w-20" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-[1.75rem] font-extrabold leading-[0.98] tracking-[-0.04em] md:text-6xl">
              {copy.bigLabel.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </p>
          </Item>
        </Reveal>

        {/* phone */}
        <div ref={ref} className="relative mx-auto w-full max-w-[21rem]">
          <div className="relative rounded-[2.75rem] border-2 border-line bg-deep p-2.5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)]">
            <div
              className="relative flex h-[33rem] flex-col md:h-[37rem] overflow-hidden rounded-[2.2rem] border-2 border-line bg-bg"
              role="img"
              aria-label={`Text conversation demo. A call to ${mock.company} is missed. An automatic text goes out: "${first.text}" The homeowner replies: "${reply.text}" An automatic reply sends a booking link. Result: ${copy.booked}.`}
            >
              <div className="absolute left-1/2 top-2.5 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-deep" />

              {/* thread header */}
              <div className="flex flex-col items-center border-b-2 border-line bg-deep pb-2.5 pt-10">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-line text-sm font-bold text-cream">H</span>
                <span className="mt-1 text-[0.7rem] font-semibold text-muted">{copy.contactName}</span>
              </div>

              {/* missed-call notification */}
              {shown >= 1 && (
                <m.div
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="mx-3 mt-3 flex items-center gap-3 rounded-lg border-2 border-cream bg-raised px-3.5 py-2.5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cream text-bg">
                    <PhoneMissed className="h-4.5 w-4.5" strokeWidth={2.5} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-bold text-cream">{copy.missedCall.title}</span>
                    <span className="block text-xs text-muted">{copy.missedCall.detail}</span>
                  </span>
                </m.div>
              )}

              {/* messages */}
              <div className="flex flex-1 flex-col gap-2.5 px-3 pt-4" aria-hidden="true">
                {shown >= 2 && (
                  <Bubble from="business" tag={first.tag}>
                    {first.text}
                  </Bubble>
                )}
                {shown === 3 && (
                  <m.div {...rise} className="flex w-fit gap-1 rounded-xl rounded-bl-sm bg-raised px-4 py-3.5">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-cream"
                        style={{ animation: `typing 1.2s ${d * 0.18}s infinite` }}
                      />
                    ))}
                  </m.div>
                )}
                {shown >= 4 && <Bubble from="customer">{reply.text}</Bubble>}
                {shown >= 5 && (
                  <Bubble from="business" tag={link.tag}>
                    {link.text} <span className="font-bold underline">{link.link}</span>
                  </Bubble>
                )}
                {shown >= 6 && (
                  <m.div
                    {...rise}
                    className="mt-1 flex items-center justify-center gap-2 rounded-lg border-2 border-sage px-3 py-3 text-sm font-extrabold text-cream"
                  >
                    <CalendarCheck className="h-5 w-5 text-sage" strokeWidth={2.25} />
                    {copy.booked}
                  </m.div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex h-12 justify-center">
            {shown >= LAST && !reduce && (
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-md border-2 border-line px-4 text-sm font-bold uppercase tracking-[0.1em] text-muted transition-colors duration-300 hover:border-sage hover:text-cream"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                {copy.replay}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
