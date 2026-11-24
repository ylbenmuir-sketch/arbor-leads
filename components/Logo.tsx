/**
 * Logo files live in /public/logo:
 *   logo-dark.svg  — cream wordmark + sage tree, for dark backgrounds
 *   logo-light.svg — dark wordmark + forest tree, for cream backgrounds
 *   icon.svg       — app icon (also copied to app/icon.svg for the favicon)
 * Replace those files to change the logo everywhere.
 */
export default function Logo({
  variant = "dark",
  className = "h-8 w-auto",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/logo/logo-${variant}.svg`} alt="Arbor Leads" width={331} height={54} className={className} />
  );
}
