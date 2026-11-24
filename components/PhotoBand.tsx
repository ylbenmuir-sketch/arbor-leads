"use client";

import Image from "next/image";
import { m } from "framer-motion";
import { photoBand } from "@/content";
import { CtaButton, Item, Reveal, ease } from "./ui";

/* Full-bleed photo band: one huge line and the call to action. */
export default function PhotoBand() {
  // One sentence per line.
  const lines = photoBand.line.match(/[^.!?]+[.!?]+/g) ?? [photoBand.line];
  return (
    <section className="relative flex min-h-[50svh] items-center overflow-hidden md:min-h-[60vh]">
      {/* settles in slightly on enter; no scroll-linked movement */}
      <m.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.6, ease }}
        aria-hidden="true"
      >
        <Image src="/images/hero-forest.jpg" alt="" fill quality={55} sizes="100vw" className="object-cover" />
      </m.div>
      <div className="absolute inset-0 bg-[rgba(9,26,16,0.75)]" aria-hidden="true" />
      <Reveal className="relative mx-auto w-full max-w-6xl px-5 py-16 text-center md:px-8 md:py-24">
        <Item as="h2" className="display-xl">
          {lines.map((l) => (
            <span key={l} className="block">
              {l.trim()}
            </span>
          ))}
        </Item>
        <Item className="mt-8 md:mt-10">
          <CtaButton size="lg" arrow />
        </Item>
      </Reveal>
    </section>
  );
}
