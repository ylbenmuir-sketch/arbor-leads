import Image from "next/image";
import { Axe, CloudLightning, Phone, Scissors, ShieldCheck, Star, TreePine } from "lucide-react";
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
   The same company in the Arbor Leads look: forest, cream,
   sage, and one orange tap-to-call button. */
const serviceIcons = [Axe, Scissors, CloudLightning];

export function AfterSite() {
  return (
    <div className="mock mock-after absolute inset-0 flex flex-col overflow-hidden bg-bg text-cream">
      {/* header */}
      <div className="flex shrink-0 items-center justify-between border-b-2 border-line bg-deep px-5 py-3 @2xl:px-10 @2xl:py-4">
        <div className="flex items-center gap-2.5">
          <TreePine className="h-8 w-8 text-sage" strokeWidth={2} aria-hidden="true" />
          <span className="text-lg uppercase leading-none tracking-[0.04em] @2xl:text-xl">
            <span className="font-extrabold">Ridgeline</span> <span className="font-light">Tree Service</span>
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.1em] text-muted @2xl:flex">
          {a.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-md border-2 border-cream px-3 py-1.5 text-sm font-extrabold @2xl:px-4 @2xl:py-2">
          <Phone className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
          <span className="hidden @2xl:inline">{mock.phone}</span>
          <span className="@2xl:hidden">Call</span>
        </div>
      </div>

      {/* hero */}
      <div className="relative flex flex-col @2xl:min-h-0 @2xl:flex-1 @2xl:flex-row">
        {/* crisp photo */}
        <div className="relative h-32 shrink-0 @2xl:order-2 @2xl:h-auto @2xl:w-[46%]">
          <Image
            src="/images/after-hero.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover object-[50%_45%] @2xl:object-[50%_100%]"
            style={{ filter: "saturate(1.05) contrast(1.05)" }}
          />
          {/* quote form (desktop: sits over the photo) */}
          <div className="absolute inset-x-12 bottom-6 hidden rounded-lg border-2 border-bg bg-cream p-5 text-bg @2xl:block">
            <div className="text-xl font-extrabold tracking-tight">{a.formTitle}</div>
            <div className="mt-3 space-y-2">
              {a.formFields.map((f) => (
                <div key={f} className="rounded-md border-2 border-[#cfcdbf] bg-white px-3 py-2 text-sm text-[#5d6a60]">
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-md bg-forest py-3 text-center text-base font-extrabold uppercase tracking-[0.05em] text-cream">
              {a.formButton}
            </div>
          </div>
        </div>

        {/* copy */}
        <div className="flex flex-col justify-center px-5 py-4 @2xl:order-1 @2xl:flex-1 @2xl:px-10 @2xl:py-0">
          <div className="flex items-center gap-1.5 whitespace-nowrap text-[calc(var(--spacing)*2.6)] font-bold @2xl:gap-3 @2xl:text-sm">
            <span className="flex items-center gap-1.5 rounded-md border-2 border-line bg-raised px-2.5 py-1.5 @2xl:px-3">
              <span className="flex gap-0.5 text-sage" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-3 w-3 fill-current @2xl:h-3.5 @2xl:w-3.5" strokeWidth={0} />
                ))}
              </span>
              {a.rating} · {a.reviews}
            </span>
            <span className="flex items-center gap-1.5 rounded-md border-2 border-line bg-raised px-2.5 py-1.5 @2xl:px-3">
              <ShieldCheck className="h-3.5 w-3.5 text-sage" strokeWidth={2.25} aria-hidden="true" /> {a.badge}
            </span>
          </div>
          <div className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-[-0.045em] @2xl:mt-5 @2xl:text-7xl">
            {a.headline.map((line, i) => (
              <div key={line} className={i === a.headline.length - 1 ? "text-sage" : ""}>
                {line}
              </div>
            ))}
          </div>
          <div className="mt-3 hidden text-base text-muted @2xl:mt-4 @2xl:block @2xl:text-lg">{a.sub}</div>
          <div className="mt-4 flex flex-col gap-2.5 @2xl:mt-6 @2xl:flex-row @2xl:items-center">
            <div className="flex items-center justify-center gap-3 rounded-md bg-blaze px-6 py-4 text-xl font-extrabold uppercase tracking-[0.03em] text-bg @2xl:px-7">
              <Phone className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              {a.call} {mock.phone}
            </div>
            {/* mobile: quote button instead of the form */}
            <div className="rounded-md border-2 border-cream py-3.5 text-center text-lg font-extrabold uppercase tracking-[0.03em] @2xl:hidden">
              {a.formTitle}
            </div>
          </div>
        </div>
      </div>

      {/* service cards */}
      <div className="grid shrink-0 grid-cols-3 gap-2.5 border-t-2 border-line bg-deep px-5 py-4 @2xl:gap-5 @2xl:px-10 @2xl:py-6">
        {a.services.map((s, i) => {
          const Icon = serviceIcons[i % serviceIcons.length];
          return (
            <div key={s.title} className="rounded-md border-2 border-line bg-raised p-3 @2xl:flex @2xl:items-center @2xl:gap-4 @2xl:rounded-lg @2xl:p-5">
              <Icon className="h-6 w-6 shrink-0 text-sage @2xl:h-8 @2xl:w-8" strokeWidth={1.75} aria-hidden="true" />
              <div className="mt-2 @2xl:mt-0">
                <div className="text-sm font-extrabold leading-tight tracking-tight @2xl:text-lg">{s.title}</div>
                <div className="mt-0.5 hidden text-sm text-muted @2xl:block">{s.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
