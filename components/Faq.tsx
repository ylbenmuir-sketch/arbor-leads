"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import { faq } from "@/content";
import { Item, Reveal, SectionHead, ease } from "./ui";

/* Light section: cream background, dark text, forest accents. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  return (
    <section id="faq" className="on-cream bg-cream text-bg">
      <div className="mx-auto max-w-4xl px-5 py-20 md:px-8 md:py-28">
        <SectionHead title={faq.headline} size="md" />
        <Reveal className="mt-7 border-t-2 border-bg md:mt-12">
          {faq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <Item key={f.q} className="border-b-2 border-bg">
                <h3>
                  <button
                    type="button"
                    id={`${uid}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full cursor-pointer items-center justify-between gap-5 py-4 text-left text-lg font-extrabold leading-tight tracking-[-0.03em] md:py-6 md:text-2xl"
                  >
                    {f.q}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-bg transition-[transform,background-color,color] duration-500 ${
                        isOpen ? "rotate-45 bg-forest text-cream" : "text-bg"
                      }`}
                      aria-hidden="true"
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.75} />
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
                      transition={{ duration: 0.45, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-base leading-relaxed text-bg/85 md:text-xl">{f.a}</p>
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
