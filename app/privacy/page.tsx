import type { Metadata } from "next";
import Link from "next/link";
import { footer, legal, site } from "@/content";
import Logo from "@/components/Logo";

const page = legal.privacy;

export const metadata: Metadata = {
  title: `${page.title} | ${site.name}`,
  robots: { index: false },
};

export default function Page() {
  return (
    <main id="main" className="mx-auto min-h-screen max-w-prose px-5 py-10 md:py-14">
      <Link href="/" className="inline-block rounded-sm">
        <Logo className="h-8 w-auto" />
      </Link>
      <article className="pt-12 md:pt-16">
        <h1 className="display-lg">{page.title}</h1>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted">
          {legal.effectiveLabel} {page.effective}
        </p>
        <p className="mt-6 text-lg leading-relaxed text-cream">{page.intro}</p>
        {page.sections.map((s) => (
          <section key={s.h} className="mt-9 border-t-2 border-line pt-6">
            <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.02em]">{s.h}</h2>
            {s.p.map((t) => (
              <p key={t} className="mt-3 text-base leading-relaxed text-cream md:text-lg">
                {t}
              </p>
            ))}
          </section>
        ))}
      </article>
      <nav aria-label="Legal" className="mt-12 flex flex-wrap gap-x-6 border-t-2 border-line pt-4 text-base font-bold">
        <Link href="/" className="inline-flex min-h-12 items-center text-cream underline underline-offset-4">
          {legal.back}
        </Link>
        {footer.legalLinks.map((l) => (
          <Link key={l.href} href={l.href} className="inline-flex min-h-12 items-center text-cream underline underline-offset-4">
            {l.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
