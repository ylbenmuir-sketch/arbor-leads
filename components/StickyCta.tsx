"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { site } from "@/content";
import { CtaButton } from "./ui";

/**
 * Phone-only bar pinned to the bottom of the screen.
 * One full-width button. Shows after the hero scrolls away, and gets out of the way
 * over pricing and the free audit form, so two orange buttons are never stacked.
 */
export default function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);
  const [atPricing, setAtPricing] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("analyzer");
    if (!hero || !form) return;
    const a = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting));
    const b = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting || e.boundingClientRect.top < 0));
    const c = new IntersectionObserver(([e]) => setAtPricing(e.isIntersecting));
    a.observe(hero);
    b.observe(form);
    const pricing = document.getElementById("pricing");
    if (pricing) c.observe(pricing);
    return () => {
      a.disconnect();
      b.disconnect();
      c.disconnect();
    };
  }, []);

  // Hidden over pricing and the form: both have their own orange button.
  const show = pastHero && !atForm && !atPricing;

  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-deep px-2 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <CtaButton
        full
        className="btn-bar whitespace-nowrap"
        label={
          <>
            {site.ctaShort}
            <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          </>
        }
      />
    </div>
  );
}
