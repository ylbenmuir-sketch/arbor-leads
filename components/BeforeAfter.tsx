"use client";

import { useEffect, useRef, useState } from "react";
import { animate, m, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { beforeAfter as copy, mock } from "@/content";
import { AfterSite, BeforeSite } from "./MockSites";
import { Item, Reveal, SectionHead } from "./ui";

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export default function BeforeAfter() {
  const frame = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(50); // divider position, % from the left
  const [value, setValue] = useState(50); // mirrored for aria-valuenow
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const reduce = useReducedMotion();
  const inView = useInView(frame, { once: true, amount: 0.6 });

  const clip = useMotionTemplate`inset(0 calc(100% - ${pos}%) 0 0)`;
  const left = useMotionTemplate`${pos}%`;

  useEffect(() => pos.on("change", (v) => setValue(Math.round(v))), [pos]);

  // Subtle nudge the first time it's seen, so people know it drags.
  useEffect(() => {
    if (!inView || reduce || touched.current) return;
    const controls = animate(pos, [50, 62, 40, 50], {
      duration: 1.8,
      delay: 0.4,
      ease: "easeInOut",
      times: [0, 0.35, 0.75, 1],
    });
    const stop = () => controls.stop();
    const el = frame.current;
    el?.addEventListener("pointerdown", stop, { once: true });
    return () => {
      controls.stop();
      el?.removeEventListener("pointerdown", stop);
    };
  }, [inView, reduce, pos]);

  function moveTo(clientX: number) {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    pos.set(clamp(((clientX - r.left) / r.width) * 100));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const big = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = {
      ArrowLeft: pos.get() - big,
      ArrowDown: pos.get() - big,
      ArrowRight: pos.get() + big,
      ArrowUp: pos.get() + big,
      PageDown: pos.get() - 10,
      PageUp: pos.get() + 10,
      Home: 0,
      End: 100,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    touched.current = true;
    pos.set(clamp(map[e.key]));
  }

  return (
    <section className="relative overflow-x-clip py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead eyebrow={copy.eyebrow} title={copy.headline} sub={copy.sub} center />

        <Reveal className="mt-10 md:mt-16">
          <Item>
            {/* glow under the frame */}
            <div className="relative mx-auto max-w-6xl">
              <div
                className="pointer-events-none absolute -inset-x-6 -bottom-10 top-1/3 rounded-[4rem] opacity-25 blur-[90px]"
                style={{ background: "var(--accent)" }}
                aria-hidden="true"
              />

              {/* browser chrome */}
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#1b1b1b] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.9)] md:rounded-3xl">
                <div className="flex items-center gap-3 border-b border-white/10 px-3.5 py-2.5 md:px-5 md:py-3.5">
                  <div className="flex gap-1.5 md:gap-2" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] md:h-3 md:w-3" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] md:h-3 md:w-3" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] md:h-3 md:w-3" />
                  </div>
                  <div className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-black/40 px-4 py-1.5 text-xs text-white/60 md:text-sm">
                    <svg viewBox="0 0 16 16" className="h-3 w-3 text-accent" fill="currentColor" aria-hidden="true">
                      <path d="M8 1a3.500 3.500 0 0 0-3.500 3.500V6H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.500A3.500 3.500 0 0 0 8 1zm2 5H6V4.500a2 2 0 1 1 4 0z" />
                    </svg>
                    <span className="truncate">ridgelinetree.com</span>
                  </div>
                  <div className="w-10 md:w-14" aria-hidden="true" />
                </div>

                {/* the stage */}
                <div
                  ref={frame}
                  className={`@container relative aspect-[10/15.5] w-full touch-pan-y select-none overflow-hidden sm:aspect-[16/10] ${
                    dragging ? "cursor-grabbing" : "cursor-ew-resize"
                  }`}
                  onPointerDown={(e) => {
                    if (e.pointerType === "mouse" && e.button !== 0) return;
                    touched.current = true;
                    setDragging(true);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    moveTo(e.clientX);
                  }}
                  onPointerMove={(e) => dragging && moveTo(e.clientX)}
                  onPointerUp={() => setDragging(false)}
                  onPointerCancel={() => setDragging(false)}
                >
                  <p className="sr-only">
                    Comparison of two versions of the website for {mock.company}, a fictional company. Before: a dated,
                    cluttered site with a dim photo and a wall of text. After: a clean redesign with the headline
                    &ldquo;{mock.after.headline.join(" ")}&rdquo;, a tap-to-call button, a 60-second quote form, a star
                    rating and a licensed and insured badge.
                  </p>

                  {/* AFTER sits underneath, BEFORE is clipped on top */}
                  <div inert aria-hidden="true">
                    <AfterSite />
                  </div>
                  <m.div className="absolute inset-0" style={{ clipPath: clip }} inert aria-hidden="true">
                    <BeforeSite />
                  </m.div>

                  {/* divider + handle */}
                  <m.div className="absolute inset-y-0 z-10 w-0" style={{ left }}>
                    <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_18px_rgba(0,0,0,0.6)]" />
                    <div
                      role="slider"
                      tabIndex={0}
                      aria-label="Before and after comparison. Use the arrow keys to move the divider."
                      aria-orientation="horizontal"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={value}
                      aria-valuetext={`${value}% before, ${100 - value}% after`}
                      onKeyDown={onKeyDown}
                      className={`absolute left-0 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-accent text-black shadow-[0_8px_30px_rgba(0,0,0,0.55)] transition-transform duration-200 focus-visible:outline-offset-4 md:h-16 md:w-16 ${
                        dragging ? "scale-110" : "hover:scale-105"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                      </svg>
                    </div>
                  </m.div>
                </div>

                {/* labels */}
                <div className="flex items-center justify-between border-t border-white/10 px-3.5 py-2.5 md:px-5 md:py-3">
                  <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white/70 md:text-sm">
                    <span aria-hidden="true">←</span> {copy.before}
                  </span>
                  <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-accent md:text-sm">
                    {copy.after} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </div>
          </Item>
          <Item as="p" className="mt-8 text-center text-sm text-mute">
            {copy.caption}
          </Item>
        </Reveal>
      </div>
    </section>
  );
}
