/** Tree-ring mark. Also used for the favicon (app/icon.svg) and the OG image. */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14" stroke="var(--accent)" strokeWidth="2.6" />
      <circle cx="16" cy="16" r="8.6" stroke="var(--accent)" strokeWidth="2.6" strokeDasharray="42 12" transform="rotate(-50 16 16)" />
      <circle cx="16" cy="16" r="3.2" fill="var(--accent)" />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={compact ? "h-6 w-6" : "h-7 w-7"} />
      <span className={`font-extrabold tracking-[-0.03em] leading-none ${compact ? "text-lg" : "text-xl"}`}>
        ARBOR LEADS
      </span>
    </span>
  );
}
