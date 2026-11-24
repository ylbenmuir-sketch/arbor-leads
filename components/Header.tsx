"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { CtaButton } from "./ui";
import { site } from "@/content";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-line bg-ink/70 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[padding] duration-300 md:px-8 ${
          scrolled ? "py-2.5" : "py-5"
        }`}
      >
        <a href="#top" aria-label={`${site.name} — home`} className="rounded-sm">
          <Logo compact={scrolled} />
        </a>
        <CtaButton size="sm" />
      </div>
    </header>
  );
}
