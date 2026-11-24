"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { faq } from "@/content";
import { Item, Reveal, SectionHead } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <section className="border-t border-line bg-[#0d0d0d]">
      <div className="mx-auto max-w-4xl px-5 py-24 md:px-8 md:py-36">
        <SectionHead title={faq.headline} />
        <Reveal className="mt-10 md:mt-14">
          {faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Item key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`${uid}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-xl font-extrabold tracking-tight transition-colors hover:text-accent md:py-7 md:text-2xl"
                  >
                    {f.q}
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
                        isOpen ? "rotate-45 border-accent bg-accent text-black" : "border-white/25 text-white"
                      }`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={`${uid}-a${i}`}
                      role="region"
                      aria-labelledby={`${uid}-q${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-lg leading-relaxed text-white/75 md:text-xl">{f.a}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </Item>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
