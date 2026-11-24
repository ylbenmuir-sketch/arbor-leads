"use client";

import { useEffect } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Smooth-scroll to the free analyzer and put the cursor in the first field. */
export function goToAnalyzer() {
  const target = document.getElementById("analyzer");
  if (!target) return;
  const input = target.querySelector<HTMLInputElement>("input");
  // Only auto-focus with a mouse/keyboard: on phones it would pop the keyboard over the form.
  const focus = () => {
    if (window.matchMedia("(hover: hover)").matches) input?.focus({ preventScroll: true });
  };
  if (lenis) {
    lenis.scrollTo(target, {
      offset: -40,
      duration: 1.3,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      lock: true,
      onComplete: focus,
    });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(focus, reduce ? 0 : 700);
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ anchors: { offset: -20 }, lerp: 0.1 });
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
