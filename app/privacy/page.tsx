import type { Metadata } from "next";
import Link from "next/link";
import { legal, site } from "@/content";
import Logo from "@/components/Logo";

const page = legal.privacy;

export const metadata: Metadata = {
  title: `${page.title} | ${site.name}`,
  robots: { index: false },
};

export default function Page() {
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10 md:px-8">
      <Link href="/" aria-label={`${site.name} — home`}>
        <Logo />
      </Link>
      <div className="my-auto py-20">
        <h1 className="display text-5xl md:text-7xl">{page.title}</h1>
        <p className="mt-6 text-xl text-mute">{page.body}</p>
        <Link href="/" className="mt-10 inline-block font-bold text-accent underline-offset-4 hover:underline">
          {legal.back}
        </Link>
      </div>
    </main>
  );
}
