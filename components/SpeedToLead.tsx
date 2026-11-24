"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import { mock, speedToLead as copy } from "@/content";
import { Item, Reveal } from "./ui";

/**
 * Timeline (ms from start). Each entry reveals the next thing on screen.
 * 0: missed call · 1: auto-text · 2: customer typing · 3: customer reply
 * 4: auto-reply with link · 5: booked confirmation
 */
const TIMELINE = [500, 1900, 3600, 5000, 6700, 8700];
const LAST = TIMELINE.length;

const pop = {
  initial: { opacity: 0, y: 14, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 380, damping: 28 },
};

function Bubble({ from, children, tag }: { from: "business" | "customer"; children: React.ReactNode; tag?: string }) {
  const mine = from === "business";
  return (
    <m.div {...pop} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[84%] rounded-[1.25rem] px-3.5 py-2.5 text-[0.9rem] leading-snug ${
          mine ? "rounded-br-md bg-accent font-medium text-black" : "rounded-bl-md bg-[#26262a] text-white"
        }`}
      >
        {children}
      </div>
      {tag && <span className="mt-1 px-1 text-[0.65rem] font-semibold text-white/45">{tag}</span>}
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
    <section className="relative overflow-hidden border-y border-line bg-[#0d0d0d] py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <Reveal>
          <Item as="p" className="eyebrow mb-5">
            {copy.eyebrow}
          </Item>
          <Item as="h2" className="display text-[clamp(2.25rem,5.4vw,4.25rem)]">
            {copy.headline}
          </Item>
          <Item as="p" className="mt-8 max-w-xl border-l-2 border-accent pl-5 text-xl font-semibold leading-snug text-white/90 md:text-2xl">
            {copy.caption}
          </Item>
        </Reveal>

        {/* phone */}
        <div ref={ref} className="relative mx-auto w-full max-w-[21rem]">
          <div
            className="pointer-events-none absolute inset-6 rounded-full opacity-25 blur-[80px]"
            style={{ background: "var(--accent)" }}
            aria-hidden="true"
          />
          <div className="relative rounded-[3rem] border border-white/15 bg-[#161618] p-2.5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
            <div
              className="relative flex h-[37rem] flex-col overflow-hidden rounded-[2.4rem] bg-black"
              role="img"
              aria-label={`Text conversation demo. A call to ${mock.company} is missed. An automatic text goes out: "${first.text}" The homeowner replies: "${reply.text}" An automatic reply sends a booking link. Result: ${copy.booked}.`}
            >
              <div className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#161618]" />

              {/* thread header */}
              <div className="flex flex-col items-center border-b border-white/10 bg-[#101012] pb-2.5 pt-11">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold">H</span>
                <span className="mt-1 text-[0.7rem] font-semibold text-white/70">{copy.contactName}</span>
              </div>

              {/* missed-call notification */}
              <AnimatePresence>
                {shown >= 1 && (
                  <m.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-[#ff5a4d]/30 bg-[#2a1614] px-3.5 py-2.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff5a4d]">
                      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 3l5 5m0-5l-5 5M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                      </svg>
                    </span>
                    <span className="leading-tight">
                      <span className="block text-sm font-bold text-white">{copy.missedCall.title}</span>
                      <span className="block text-xs text-white/60">{copy.missedCall.detail}</span>
                    </span>
                  </m.div>
                )}
              </AnimatePresence>

              {/* messages */}
              <div className="flex flex-1 flex-col gap-2.5 px-3 pt-4" aria-hidden="true">
                {shown >= 2 && (
                  <Bubble from="business" tag={first.tag}>
                    {first.text}
                  </Bubble>
                )}
                {shown === 3 && (
                  <m.div {...pop} className="flex w-fit gap-1 rounded-[1.25rem] rounded-bl-md bg-[#26262a] px-4 py-3.5">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-white"
                        style={{ animation: `typing 1s ${d * 0.15}s infinite` }}
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
                    {...pop}
                    className="mt-1 flex items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-3 py-3 text-sm font-extrabold text-accent"
                  >
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10.500l4 4 8-9" />
                    </svg>
                    {copy.booked}
                  </m.div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex h-8 justify-center">
            {shown >= LAST && !reduce && (
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="cursor-pointer rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/80 transition-colors hover:border-accent hover:text-accent"
              >
                ↻ {copy.replay}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
