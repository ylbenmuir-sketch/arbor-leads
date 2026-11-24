"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { site } from "@/content";
import { CtaButton } from "./ui";

/**
 * Phone-only bar pinned to the bottom of the screen.
 * Shows after the hero scrolls away, and gets out of the way once the
 * free audit form is on screen so it never covers the fields.
 */
export default function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const form = document.getElementById("analyzer");
    if (!hero || !form) return;
    const a = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting));
    const b = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting || e.boundingClientRect.top < 0));
    a.observe(hero);
    b.observe(form);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);

  const show = pastHero && !atForm;

  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-deep px-2 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex gap-2">
        <CtaButton
          className="btn-bar flex-[1.6]"
          label={
            <>
              {site.ctaShort}
              <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
            </>
          }
        />
        <a href="#pricing" className="btn btn-outline btn-bar flex-1">
          {site.pricingShort}
        </a>
      </div>
    </div>
  );
}
