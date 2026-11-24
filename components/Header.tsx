"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
      className={`fixed inset-x-0 top-0 z-50 border-b-2 transition-[background-color,border-color] duration-500 ${
        scrolled ? "border-line bg-bg" : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-[padding] duration-500 md:px-8 ${
          scrolled ? "py-2.5" : "py-5"
        }`}
      >
        <Link href="/" className="shrink-0 rounded-sm">
          <Logo className={`w-auto transition-[height] duration-500 ${scrolled ? "h-7" : "h-8 md:h-9"}`} />
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
    </header>
  );
}
