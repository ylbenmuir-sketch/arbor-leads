"use client";

import { useEffect, useRef } from "react";
import {
  m,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import { site } from "@/content";
import { goToAnalyzer } from "./Providers";

const ease = [0.2, 0.8, 0.2, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/** Fades/slides its <Item> children up, staggered, the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const Tag = m[as] as typeof m.div;
  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </Tag>
  );
}

export function Item({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "h2" | "p";
}) {
  const Tag = m[as] as typeof m.div;
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}

/** Standard section heading: eyebrow + big headline, revealed on scroll. */
export function SectionHead({
  eyebrow,
  title,
  sub,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      {eyebrow && (
        <Item as="p" className="eyebrow mb-5">
          {eyebrow}
        </Item>
      )}
      <Item as="h2" className="display text-[clamp(2.25rem,6vw,4.5rem)]">
        {title}
      </Item>
      {sub && (
        <Item as="p" className="mt-5 text-lg text-mute md:text-xl">
          {sub}
        </Item>
      )}
    </Reveal>
  );
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Counts up from 0 the first time it's visible. */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = prefix + fmt(v) + suffix),
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, reduce]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix + fmt(to) + suffix}
    </span>
  );
}

/** A number that springs to its new value whenever it changes (ROI calculator). */
export function SpringNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 140, damping: 22 });

  useEffect(() => {
    if (reduce) {
      if (ref.current) ref.current.textContent = prefix + fmt(value);
      return;
    }
    mv.set(value);
  }, [value, mv, reduce, prefix]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) ref.current.textContent = prefix + fmt(v);
      }),
    [spring, prefix],
  );

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix + fmt(value)}
    </span>
  );
}

/** Wraps a button so it leans toward the cursor. Mouse only. */
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const reduce = useReducedMotion();

  return (
    <m.span
      className={`inline-block ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.span>
  );
}

/** The one call to action. Scrolls to the hero analyzer. */
export function CtaButton({
  size = "md",
  full = false,
  variant = "primary",
}: {
  size?: "sm" | "md" | "lg";
  full?: boolean;
  variant?: "primary" | "outline";
}) {
  const sizes = {
    sm: "px-4 py-2.5 text-sm",
    md: "px-6 py-3.5 text-base",
    lg: "px-8 py-4 text-lg",
  };
  return (
    <Magnetic className={full ? "w-full" : ""}>
      <a
        href="#analyzer"
        onClick={(e) => {
          e.preventDefault();
          goToAnalyzer();
        }}
        className={`inline-flex items-center justify-center rounded-full whitespace-nowrap ${sizes[size]} ${
          full ? "w-full" : ""
        } ${
          variant === "primary"
            ? "btn-primary"
            : "border border-white/25 font-bold text-white transition-colors hover:border-accent hover:text-accent"
        }`}
      >
        {site.cta}
      </a>
    </Magnetic>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`h-5 w-5 shrink-0 ${className}`} aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path d="M5.5 10.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlaceholderTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded border border-dashed border-amber-300/60 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-amber-300">
      {children}
    </span>
  );
}
