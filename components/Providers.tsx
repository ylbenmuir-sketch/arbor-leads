"use client";

import { useEffect } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Smooth-scroll to the free audit form and put the cursor in the first field. */
export function goToAnalyzer(plan?: string, setup?: string) {
  // Tell the analyzer form which plan button was clicked (see Analyzer.tsx).
  if (plan) window.dispatchEvent(new CustomEvent("arbor:plan", { detail: plan }));
  // Same for the "Two ways to start" buttons ("zero-down" or "495-setup").
  if (setup) window.dispatchEvent(new CustomEvent("arbor:setup", { detail: setup }));
  const section = document.getElementById("analyzer");
  if (!section) return;
  // Land on the form itself (with the last line of the pitch above it), not the big headline.
  const target = section.querySelector<HTMLElement>("[data-audit-form]") ?? section;
  const input = target.querySelector<HTMLInputElement>("input:not([type=hidden])");
  // Only auto-focus with a mouse/keyboard: on phones it would pop the keyboard over the form.
  const focus = () => {
    if (window.matchMedia("(hover: hover)").matches) input?.focus({ preventScroll: true });
  };
  if (lenis) {
    lenis.scrollTo(target, {
      offset: -190,
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      lock: true,
      onComplete: focus,
    });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY - 190;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(focus, reduce ? 0 : 700);
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones and tablets keep native scrolling: smoothing a touch scroll is what feels "drifty".
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // If it still feels floaty on a trackpad, set smoothWheel: false.
    const instance = new Lenis({ anchors: { offset: -20 }, lerp: 0.2, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    lenis = instance;
    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
