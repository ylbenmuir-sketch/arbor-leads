import Image from "next/image";
import { ArrowRight, Axe, Check, CircleDot, CloudLightning, Phone, Scissors, Star } from "lucide-react";
import { mock } from "@/content";

/**
 * Two full mock websites for the before/after slider, built in HTML/CSS.
 * Both are for a made-up company and are not based on any real site.
 * Inside `.mock`, every Tailwind spacing and text size scales with the
 * browser frame (see globals.css), so use normal utilities — no px values.
 */

const b = mock.before;
const a = mock.after;

/* ───────────────────────── BEFORE ─────────────────────────
   A dated local site: clip art, cramped text, a tiny phone
   number, and no reviews anywhere. Its colors are deliberately
   NOT the Arbor Leads palette. */
export function BeforeSite() {
  return (
    <div
      className="mock mock-before absolute inset-0 overflow-hidden bg-[#e4e2dc] text-[#555]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* thin top bar — the phone number is buried here */}
      <div className="flex h-7 items-center gap-4 bg-black px-6 text-xs text-[#8f8f8f]">
        <span className="flex h-4 w-4 items-center justify-center bg-[#3b5998] text-[0.85em] font-bold text-white">
          f
        </span>
        <span className="truncate">{mock.address}</span>
        <span className="ml-auto truncate">{mock.gmail}</span>
        <span className="shrink-0 text-[0.85em]">Ph: {mock.phone}</span>
      </div>

      {/* dark header with clip art and a cluttered, wrapping menu */}
      <div className="flex items-center gap-5 bg-[#2a2a28] px-6 py-3">
        <div className="flex shrink-0 items-center gap-2">
          {/* clip-art tree */}
          <svg viewBox="0 0 44 48" className="h-12 w-11" aria-hidden="true">
            <rect x="19" y="30" width="6" height="16" fill="#7a5230" />
            <circle cx="22" cy="14" r="11" fill="#5d9a3a" />
            <circle cx="12" cy="22" r="9" fill="#4f8a30" />
            <circle cx="32" cy="22" r="9" fill="#6aa844" />
            <circle cx="22" cy="24" r="9" fill="#5d9a3a" />
          </svg>
          <div className="leading-none text-white" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <div className="text-xl font-bold italic">Ridgeline</div>
            <div className="mt-0.5 text-xs tracking-[0.2em] text-[#b9b9a8]">TREE SERVICE</div>
          </div>
        </div>
        <div className="flex w-150 flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs font-bold uppercase text-[#c9c9c0]">
          {b.menu.map((item, i) => (
            <span key={item} className={i === 0 ? "text-[#e8c62c] underline" : ""}>
              {item}
            </span>
          ))}
        </div>
        {/* clip-art "badge" */}
        <div className="ml-auto flex h-14 w-14 shrink-0 rotate-[-8deg] items-center justify-center rounded-full border-2 border-dashed border-[#e8c62c] text-center text-[0.55em] font-bold leading-tight text-[#e8c62c]">
          FREE
          <br />
          QUOTES!
        </div>
      </div>

      {/* dim, low-contrast hero */}
      <div className="relative h-56 overflow-hidden bg-[#3a3d3a]">
        <Image
          src="/images/before-hero.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 1150px"
          className="object-cover"
          style={{ filter: "grayscale(0.55) brightness(0.55) contrast(0.8)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
          <div
            className="text-5xl text-[#d8d8d0]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", textShadow: "0 0.05em 0.1em #000" }}
          >
            Tree Service {mock.town} {mock.state}
          </div>
        </div>
      </div>

      {/* cramped wall of text + plain yellow estimate box */}
      <div className="flex gap-8 bg-white px-10 py-6">
        <div className="flex-1">
          <div className="mb-2 text-2xl text-[#444]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {b.welcome}
          </div>
          {b.wall.map((p) => (
            <p key={p.slice(0, 24)} className="mb-2 text-justify text-xs leading-[1.4] text-[#8a8a8a]">
              {p}
            </p>
          ))}
          <p className="text-justify text-xs leading-[1.4] text-[#8a8a8a]">{b.wall[0]}</p>
        </div>
        <div className="w-64 shrink-0">
          <div className="border border-[#c9a800] bg-[#f2d024] px-4 py-5 text-center">
            <div className="text-sm font-bold text-[#222]">{b.estimate}</div>
            <div className="mt-3 space-y-2">
              {["Name", "Email", "Phone", "Message"].map((f) => (
                <div key={f} className="border border-[#bbb] bg-white px-2 py-1.5 text-left text-xs text-[#aaa]">
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-3 inline-block bg-[#333] px-5 py-1.5 text-xs font-bold text-white">SUBMIT</div>
          </div>
          <div className="mt-3 text-center text-xs text-[#999]">Serving {mock.town} and surrounding areas</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── AFTER ─────────────────────────
   The same company as a premium, modern tree service homepage.
   It has its OWN brand (charcoal, bone, hi-vis amber) on purpose:
   it should look like a real client site, not like Arbor Leads. */
const serviceIcons = [Axe, Scissors, CloudLightning, CircleDot];

/** Simple geometric tree mark for the made-up Ridgeline brand. */
function RidgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 36" className={className} aria-hidden="true">
      <path d="M16 1 26 14h-5l8 11H3l8-11H6z" fill="#F5A524" />
      <rect x="13.5" y="25" width="5" height="10" fill="#F3EFE6" />
    </svg>
  );
}

function Stars({ className }: { className: string }) {
  return (
    <span className="flex gap-0.5 text-[#F5B301]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} className={`fill-current ${className}`} strokeWidth={0} />
      ))}
    </span>
  );
}

export function AfterSite() {
  return (
    <div className="mock mock-after absolute inset-0 flex flex-col overflow-hidden bg-[#101211] text-[#F3EFE6]">
      {/* utility bar */}
      <div className="flex h-6 shrink-0 items-center justify-center gap-2.5 bg-[#0a0b0a] text-[calc(var(--spacing)*2.4)] font-bold uppercase tracking-[0.14em] text-[#F5A524] @2xl:h-7 @2xl:gap-3 @2xl:text-xs">
        {a.utility.map((u, i) => (
          <span key={u} className={`items-center gap-2.5 whitespace-nowrap @2xl:gap-3 ${i > 1 ? "hidden @2xl:flex" : "flex"}`}>
            {i > 0 && <span className="h-1 w-1 rounded-full bg-current opacity-60" />}
            {u}
          </span>
        ))}
      </div>

      {/* nav */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5 @2xl:px-10 @2xl:py-3.5">
        <div className="flex items-center gap-2 @2xl:gap-2.5">
          <RidgeMark className="h-8 w-7 @2xl:h-10 @2xl:w-9" />
          <div className="leading-none">
            <div className="text-lg font-extrabold uppercase leading-none tracking-[-0.01em] @2xl:text-2xl">{a.wordmark[0]}</div>
            <div className="mt-1 text-[calc(var(--spacing)*2.2)] font-bold uppercase leading-none tracking-[0.34em] text-[#F5A524] @2xl:text-xs">
              {a.wordmark[1]}
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-7 whitespace-nowrap text-sm font-semibold text-white/85 @2xl:flex">
          {a.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden text-right leading-none @2xl:block">
            <div className="text-[calc(var(--spacing)*2.5)] font-bold uppercase tracking-[0.18em] text-white/60">{a.phoneLabel}</div>
            <div className="mt-1 whitespace-nowrap text-xl font-extrabold leading-none tracking-[-0.01em]">{mock.phone}</div>
          </div>
          <div className="whitespace-nowrap rounded-md bg-[#F5A524] px-3.5 py-2 text-sm font-extrabold uppercase tracking-[0.04em] text-[#101211] @2xl:px-5 @2xl:py-3">
            {a.navQuote}
          </div>
        </div>
      </div>

      {/* hero: photo behind, dark from the left so the copy reads */}
      <div className="relative flex min-h-0 flex-1 flex-col justify-center px-4 @2xl:px-10">
        <div className="absolute inset-0 @2xl:left-[36%]">
          <Image
            src="/images/after-hero.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            className="object-cover object-[50%_55%] @2xl:object-[50%_62%]"
            style={{ filter: "saturate(0.82) contrast(1.12)" }}
          />
        </div>
        <div className="absolute inset-0 bg-[rgba(16,18,17,0.78)] @2xl:hidden" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#101211_0%,#101211_36%,rgba(16,18,17,0.92)_40%,rgba(16,18,17,0.55)_54%,rgba(16,18,17,0)_68%)] @2xl:block" />

        <div className="relative">
          {/* Google review badge */}
          <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-white px-2.5 py-1.5 text-[#101211]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#d9d9d9] text-xs font-extrabold leading-none text-[#3b6fd4]">G</span>
            <span className="text-sm font-extrabold leading-none">{a.rating}</span>
            <Stars className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold leading-none text-[#444]">{a.reviews}</span>
          </div>

          <div className="mt-3 text-5xl font-extrabold leading-[0.93] tracking-[-0.045em] @2xl:mt-5 @2xl:text-7xl">
            {a.headline.map((line, i) => (
              <div key={line} className={`whitespace-nowrap ${i === a.headline.length - 1 ? "text-[#F5A524]" : ""}`}>
                {line}
              </div>
            ))}
          </div>
          <div className="mt-2.5 text-sm leading-snug text-white/80 @2xl:mt-4 @2xl:w-[calc(var(--spacing)*118)] @2xl:text-lg">{a.sub}</div>

          <div className="mt-3.5 flex flex-col gap-2 @2xl:mt-6 @2xl:flex-row @2xl:items-stretch @2xl:gap-3">
            <div className="flex items-center justify-center gap-3 rounded-md bg-[#F5A524] px-6 py-2.5 text-[#101211]">
              <Phone className="h-6 w-6 shrink-0" strokeWidth={2.5} aria-hidden="true" />
              <div className="leading-none">
                <div className="text-xl font-extrabold uppercase leading-none tracking-[0.02em]">{a.call}</div>
                <div className="mt-1 whitespace-nowrap text-sm font-bold leading-none">{mock.phone}</div>
              </div>
            </div>
            <div className="flex items-center justify-center whitespace-nowrap rounded-md border-2 border-[#F3EFE6] px-6 py-2.5 text-base font-extrabold uppercase tracking-[0.04em]">
              {a.quote}
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-bold @2xl:mt-6 @2xl:flex @2xl:gap-5 @2xl:text-sm">
            {a.trust.map((t) => (
              <span key={t} className="flex items-center gap-1.5 whitespace-nowrap">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#F5A524]" strokeWidth={3.5} aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* floating sample review (desktop frame only) */}
        <div className="absolute bottom-5 right-10 hidden w-64 rounded-lg bg-[#F3EFE6] p-4 text-[#101211] shadow-[0_18px_40px_rgba(0,0,0,0.55)] @2xl:block">
          <Stars className="h-4 w-4" />
          <div className="mt-2 text-sm font-semibold leading-snug">&ldquo;{a.review.quote}&rdquo;</div>
          <div className="mt-2 text-xs font-bold text-[#5a5a55]">{a.review.name}</div>
        </div>
      </div>

      {/* services */}
      <div className="grid shrink-0 grid-cols-2 gap-2 bg-[#F3EFE6] px-4 py-3 @2xl:grid-cols-4 @2xl:gap-4 @2xl:px-10 @2xl:py-4">
        {a.services.map((s, i) => {
          const Icon = serviceIcons[i % serviceIcons.length];
          return (
            <div key={s.title} className="flex items-center gap-2.5 rounded-md bg-[#101211] p-3 text-[#F3EFE6] @2xl:block @2xl:rounded-lg @2xl:p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 shrink-0 text-[#F5A524] @2xl:h-7 @2xl:w-7" strokeWidth={1.9} aria-hidden="true" />
                <ArrowRight className="hidden h-4 w-4 text-[#F5A524] @2xl:block" strokeWidth={2.5} aria-hidden="true" />
              </div>
              <div className="min-w-0 @2xl:mt-2">
                <div className="whitespace-nowrap text-[calc(var(--spacing)*3.2)] font-extrabold leading-tight tracking-[-0.01em] @2xl:text-lg">{s.title}</div>
                <div className="mt-0.5 hidden whitespace-nowrap text-xs text-white/65 @2xl:block">{s.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* phone frame: call bar pinned to the bottom */}
      <div className="flex shrink-0 items-center justify-center gap-2.5 bg-[#F5A524] py-3 text-base font-extrabold uppercase leading-none tracking-[0.03em] text-[#101211] @2xl:hidden">
        <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        {a.stickyCall}
      </div>
    </div>
  );
}
