"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { CtaButton } from "./ui";
import { announcement, pricing, site } from "@/content";

/** Desktop header phone number. Hidden when the variable isn't set. Inlined at build time. */
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "";
const telHref = `tel:${contactPhone.replace(/[^\d+]/g, "")}`;

/** Thin orange bar above the header. Hides itself once the pricing deadline passes. */
function AnnouncementBar({ hidden }: { hidden: boolean }) {
  const [days, setDays] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const ms = new Date(pricing.deadline).getTime() - Date.now();
    // Reads the clock after hydration on purpose, so server and browser HTML match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ms <= 0) setEnded(true);
    else setDays(Math.floor(ms / 86400000));
  }, []);

  if (ended) return null;
  const left =
    days === null ? "" : days === 0 ? announcement.lastDay : `${days} ${days === 1 ? announcement.dayLeft : announcement.daysLeft}`;

  return (
    <a
      href={announcement.href}
      tabIndex={hidden ? -1 : undefined}
      className="relative flex h-9 items-center justify-center gap-x-2 border-b border-line bg-deep px-3 text-[0.8125rem] font-semibold tracking-[0.01em] text-cream/70 after:absolute after:inset-x-0 after:-bottom-3 after:top-0 md:border-blaze md:font-extrabold md:text-blaze"
    >
      <span className="md:hidden">{announcement.textShort}</span>
      <span className="max-md:hidden">{announcement.text}</span>
      <span className="max-md:hidden" aria-hidden="true">·</span>
      <span className="max-md:hidden">{announcement.lock}</span>
      {left && (
        <>
          <span aria-hidden="true">·</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{left}</span>
        </>
      )}
      <span className="max-md:hidden" aria-hidden="true">→</span>
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  // Phones: the announcement bar slides away after 120px so it stops eating screen.
  const [tucked, setTucked] = useState(false);
  // Phones: the header button only shows between the hero button leaving the screen and the
  // sticky bottom bar arriving, so there is never more than one orange button in the chrome.
  const [pastCta, setPastCta] = useState(false);
  const [heroGone, setHeroGone] = useState(false);

  useEffect(() => {
    const cta = document.getElementById("hero-cta");
    const hero = document.getElementById("top");
    if (!cta || !hero) {
      // Pages without the hero (privacy, terms): always show the button. Needs the DOM, so it runs after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPastCta(true);
      return;
    }
    const a = new IntersectionObserver(([e]) => setPastCta(!e.isIntersecting && e.boundingClientRect.top < 0));
    const b = new IntersectionObserver(([e]) => setHeroGone(!e.isIntersecting));
    a.observe(cta);
    b.observe(hero);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);
  const showCta = pastCta && !heroGone;

  // Desktop: the header button steps aside whenever another orange button is on screen
  // (hero, case study, featured plan, audit form), so there's only ever one.
  const [otherOrange, setOtherOrange] = useState(false);
  useEffect(() => {
    // The audit form swaps its button in and out as it changes stage, so watch the form itself.
    const form = document.querySelector<HTMLElement>("main [data-audit-form]");
    const buttons = [...document.querySelectorAll<HTMLElement>("main .btn-blaze")].filter((b) => !b.closest("[data-audit-form]"));
    if (form) buttons.push(form);
    if (!buttons.length) return;
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      setOtherOrange(seen.size > 0);
    });
    buttons.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setTucked(window.scrollY > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${tucked ? "max-md:-translate-y-9" : ""}`}>
      <AnnouncementBar hidden={tucked} />
      <div
        className={`border-b-2 transition-[background-color,border-color] duration-300 ${
          scrolled ? "border-line bg-bg" : "border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 transition-[padding] duration-300 md:px-8 ${
            scrolled ? "py-2" : "py-4"
          }`}
        >
          <Link href="/" className="shrink-0 rounded-sm">
            <Logo className={`w-auto transition-[height] duration-300 ${scrolled ? "h-7" : "h-7 sm:h-8 md:h-9"}`} />
          </Link>
          <div className="flex items-center gap-5">
            {contactPhone && (
              <a href={telHref} className="text-base font-semibold text-muted underline-offset-4 hover:text-cream hover:underline max-md:hidden" style={{ fontVariantNumeric: "tabular-nums" }}>
                {contactPhone}
              </a>
            )}
            <CtaButton
              size="sm"
              className={`whitespace-nowrap transition-[opacity,visibility,background-color,border-color,transform] duration-300 max-sm:!px-2.5 max-sm:!text-xs ${
                showCta ? "" : "max-md:invisible max-md:opacity-0"
              } ${otherOrange ? "md:invisible md:opacity-0" : ""}`}
              label={
                <>
                  <span className="sm:hidden">{site.ctaShort}</span>
                  <span className="hidden sm:inline">{site.cta}</span>
                </>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
