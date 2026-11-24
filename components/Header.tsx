"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { CtaButton } from "./ui";
import { announcement, pricing, site } from "@/content";

/** Thin orange bar above the header. Hides itself once the pricing deadline passes. */
function AnnouncementBar({ hidden }: { hidden: boolean }) {
  const [days, setDays] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    const ms = new Date(pricing.deadline).getTime() - Date.now();
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
      className="relative flex h-9 items-center justify-center gap-x-2 border-b border-blaze bg-deep px-3 text-[0.8125rem] font-extrabold tracking-[0.01em] text-blaze after:absolute after:inset-x-0 after:-bottom-3 after:top-0"
    >
      <span>{announcement.text}</span>
      <span className="max-sm:hidden" aria-hidden="true">·</span>
      <span className="max-sm:hidden">{announcement.lock}</span>
      {left && (
        <>
          <span aria-hidden="true">·</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{left}</span>
        </>
      )}
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  // Phones: the announcement bar slides away after 120px so it stops eating screen.
  const [tucked, setTucked] = useState(false);

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
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-[padding] duration-300 md:px-8 ${
            scrolled ? "py-2" : "py-4"
          }`}
        >
          <Link href="/" className="shrink-0 rounded-sm">
            <Logo className={`w-auto transition-[height] duration-300 ${scrolled ? "h-7" : "h-8 md:h-9"}`} />
          </Link>
          <CtaButton
            size="sm"
            label={
              <>
                <span className="sm:hidden">{site.ctaShort}</span>
                <span className="hidden sm:inline">{site.cta}</span>
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}
