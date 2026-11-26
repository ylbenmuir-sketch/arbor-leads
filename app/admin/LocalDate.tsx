"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** A date in the viewer's own time zone. The server doesn't know it, so it shows the plain date until the page loads. */
export default function LocalDate({ iso }: { iso: string }) {
  const inBrowser = useSyncExternalStore(noop, () => true, () => false);
  const d = new Date(iso);
  const text = inBrowser
    ? d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return (
    <time dateTime={iso} className="whitespace-nowrap">
      {text}
    </time>
  );
}
