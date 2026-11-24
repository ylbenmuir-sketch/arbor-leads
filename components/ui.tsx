"use client";

import { useEffect, useRef } from "react";
import { m, animate, useInView, useMotionValue, useReducedMotion, useSpring, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { site } from "@/content";
import { goToAnalyzer } from "./Providers";

/** Calm, heavy ease. No springs, no bounce. */
export const ease = [0.22, 0.61, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/** Fades and rises its <Item> children, staggered, the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  as = "div",
  role,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section";
  role?: string;
}) {
  const Tag = m[as] as typeof m.div;
  return (
    <Tag
      role={role}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      {children}
    </Tag>
  );
}

export function Item({
  children,
  className,
  as = "div",
  role,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "h2" | "p";
  role?: string;
}) {
  const Tag = m[as] as typeof m.div;
  return (
    <Tag role={role} className={className} variants={item}>
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
  size = "lg",
}: {
  eyebrow?: string;
  title: string;
  sub?: React.ReactNode;
  center?: boolean;
  /** xl = statement, lg = normal section, md = utility section. */
  size?: "xl" | "lg" | "md";
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      {eyebrow && (
        <Item as="p" className="eyebrow mb-4 md:mb-5">
          {eyebrow}
        </Item>
      )}
      <Item as="h2" className={`display-${size}`}>
        {title}
      </Item>
      {sub && (
        <Item as="p" className="mt-4 text-lg leading-snug opacity-80 md:mt-5 md:text-xl">
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
  decimals = 0,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const show = (v: number) =>
    prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease,
      onUpdate: (v) => (el.textContent = show(v)),
      onComplete: () => (el.textContent = show(to)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, prefix, suffix, decimals, reduce]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {show(to)}
    </span>
  );
}

/** A number that eases to its new value whenever it changes (ROI calculator). */
export function SpringNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  // Over-damped on purpose: settles without any bounce.
  const spring = useSpring(mv, { stiffness: 120, damping: 34 });

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

/**
 * The call to action. Scrolls to the free audit form.
 * Pass `plan` to pre-select a pricing plan in the form.
 * `blaze` (orange) is the main CTA; `forest` is the quieter version for repeated spots.
 */
export function CtaButton({
  size = "md",
  full = false,
  variant = "blaze",
  label = site.cta,
  arrow = false,
  plan,
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  full?: boolean;
  variant?: "blaze" | "forest";
  label?: React.ReactNode;
  arrow?: boolean;
  plan?: string;
  className?: string;
}) {
  const sizes = { sm: "btn-sm", md: "", lg: "btn-lg" };
  return (
    <a
      href="/#analyzer"
      onClick={(e) => {
        if (!document.getElementById("analyzer")) return;
        e.preventDefault();
        goToAnalyzer(plan);
      }}
      className={`btn btn-${variant} ${sizes[size]} ${full ? "w-full" : ""} ${className}`}
    >
      {label}
      {arrow && <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />}
    </a>
  );
}
