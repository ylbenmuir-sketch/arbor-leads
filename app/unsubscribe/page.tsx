import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: `Unsubscribe | ${site.name}`,
  robots: { index: false, follow: false },
};

/**
 * Where the unsubscribe link in follow-up emails lands. The button does the unsubscribing (POST /api/unsubscribe),
 * not the page load, because email scanners open links on their own.
 */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams;
  const one = (k: string) => (typeof q[k] === "string" ? (q[k] as string) : "");
  const token = one("t");
  const done = one("done") === "1";
  const failed = one("error") === "1";

  return (
    <main id="main" className="mx-auto min-h-screen max-w-prose px-5 py-10 md:py-14">
      <Link href="/" className="inline-block rounded-sm">
        <Logo className="h-8 w-auto" />
      </Link>
      <div className="pt-12 md:pt-16">
        {done ? (
          <>
            <h1 className="display-md">You&apos;re unsubscribed.</h1>
            <p className="mt-5 text-lg leading-relaxed text-cream">
              You won&apos;t get any more follow-up emails from us. If you ever want to talk, just reply to any email or write to{" "}
              <a href={`mailto:${site.email}`} className="font-bold underline underline-offset-2">
                {site.email}
              </a>
              .
            </p>
          </>
        ) : token ? (
          <>
            <h1 className="display-md">Stop follow-up emails?</h1>
            <p className="mt-5 text-lg leading-relaxed text-cream">We&apos;ll stop sending you follow-up emails about your Google report.</p>
            {failed && (
              <p role="alert" className="mt-5 rounded-md border-2 border-line bg-raised px-4 py-3 text-base font-semibold text-cream">
                That didn&apos;t go through. Please try again, or reply to any of our emails and we&apos;ll take you off the list.
              </p>
            )}
            <form method="post" action="/api/unsubscribe" className="mt-7">
              <input type="hidden" name="t" value={token} />
              <input type="hidden" name="from" value="page" />
              <button type="submit" className="btn btn-forest w-full sm:w-auto">
                Unsubscribe
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="display-md">This link isn&apos;t complete.</h1>
            <p className="mt-5 text-lg leading-relaxed text-cream">
              To stop our emails, reply to any of them and say so, or write to{" "}
              <a href={`mailto:${site.email}`} className="font-bold underline underline-offset-2">
                {site.email}
              </a>
              .
            </p>
          </>
        )}
      </div>
    </main>
  );
}
