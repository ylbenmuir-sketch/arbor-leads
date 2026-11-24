"use client";

import { useEffect, useRef, useState } from "react";
import { animate, m, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { beforeAfter as copy, mock } from "@/content";
import { AfterSite, BeforeSite } from "./MockSites";
import { Item, Reveal, SectionHead } from "./ui";

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export default function BeforeAfter() {
  const frame = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(100); // divider position, % from the left (100 = all "before")
  const [value, setValue] = useState(100); // mirrored for aria-valuenow
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const reduce = useReducedMotion();
  const inView = useInView(frame, { once: true, amount: 0.4 });

  const clip = useMotionTemplate`inset(0 calc(100% - ${pos}%) 0 0)`;
  const left = useMotionTemplate`${pos}%`;

  useEffect(() => pos.on("change", (v) => setValue(Math.round(v))), [pos]);

  // First time it's seen: sweep once from all-before to almost all-after, so the reveal happens
  // without anyone having to find the handle. Reduced motion: just land on the end position.
  useEffect(() => {
    if (!inView || touched.current) return;
    if (reduce) {
      pos.set(8);
      return;
    }
    const controls = animate(pos, 8, { duration: 1.4, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] });
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
    <section className="relative overflow-x-clip py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead eyebrow={copy.eyebrow} title={copy.headline} sub={copy.sub} center />

        <Reveal className="mt-8 md:mt-14">
          <Item>
            <div className="relative mx-auto max-w-6xl">
              {/* browser chrome */}
              <div className="relative overflow-hidden rounded-lg border-2 border-line bg-raised shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-3 border-b-2 border-line px-3.5 py-2.5 md:px-5 md:py-3.5">
                  <div className="flex gap-1.5 md:gap-2" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-muted/40 md:h-3 md:w-3" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted/40 md:h-3 md:w-3" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted/40 md:h-3 md:w-3" />
                  </div>
                  <div className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-md bg-deep px-4 py-1.5 text-xs text-muted md:text-sm">
                    <svg viewBox="0 0 16 16" className="h-3 w-3 text-sage" fill="currentColor" aria-hidden="true">
                      <path d="M8 1a3.500 3.500 0 0 0-3.500 3.500V6H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.500A3.500 3.500 0 0 0 8 1zm2 5H6V4.500a2 2 0 1 1 4 0z" />
                    </svg>
                    <span className="truncate">ridgelinetree.com</span>
                  </div>
                  <div className="w-10 md:w-14" aria-hidden="true" />
                </div>

                {/* the stage */}
                <div
                  ref={frame}
                  className={`@container relative aspect-[10/16.5] w-full touch-pan-y select-none overflow-hidden sm:aspect-[16/10] ${
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
                    cluttered site with a dim photo and a wall of text. After: a modern redesign with the headline
                    &ldquo;{mock.after.headline.join(" ")}&rdquo;, a large call button, a Google review rating, a sample
                    customer review and four service cards.
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
                    <div className="absolute inset-y-0 -left-0.5 w-1 bg-cream" />
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
                      className={`absolute left-0 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border-[3px] border-bg bg-cream text-bg shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 focus-visible:outline-offset-4 md:h-16 md:w-16 ${
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
                <div className="grid grid-cols-2 gap-4 border-t-2 border-line px-3.5 py-2.5 text-xs leading-snug md:px-5 md:py-3 md:text-sm">
                  <span className="text-muted">
                    <span className="font-extrabold uppercase tracking-[0.14em]">{copy.before.tag}:</span> {copy.before.text}
                  </span>
                  <span className="text-right text-cream">
                    <span className="font-extrabold uppercase tracking-[0.14em]">{copy.after.tag}:</span> {copy.after.text}
                  </span>
                </div>
              </div>
            </div>
          </Item>
          <Item as="p" className="mt-5 text-center text-sm text-muted md:mt-8">
            {copy.caption}
          </Item>
        </Reveal>
      </div>
    </section>
  );
}
