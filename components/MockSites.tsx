import Image from "next/image";
import { mock } from "@/content";

/**
 * Two full mock websites for the before/after slider, built in HTML/CSS.
 * Inside `.mock`, every Tailwind spacing and text size scales with the
 * browser frame (see globals.css), so use normal utilities — no px values.
 */

const b = mock.before;
const a = mock.after;

/* ───────────────────────── BEFORE ───────────────────────── */
export function BeforeSite() {
  return (
    <div
      className="mock mock-before absolute inset-0 overflow-hidden bg-[#e9e7e1] text-[#555]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* thin top bar */}
      <div className="flex h-7 items-center gap-4 bg-black px-6 text-xs text-[#9a9a9a]">
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#3b5998] text-[0.85em] font-bold text-white">
          f
        </span>
        <span className="truncate">{mock.address}</span>
        <span className="ml-auto truncate">{mock.gmail}</span>
      </div>

      {/* dark header with a cluttered, wrapping menu */}
      <div className="flex items-center gap-5 bg-[#22231f] px-6 py-3">
        <div className="flex shrink-0 items-center gap-2">
          <svg viewBox="0 0 40 44" className="h-11 w-10" aria-hidden="true">
            <path d="M20 2 6 20h7L4 32h12v10h8V32h12l-9-12h7z" fill="#4c7a34" />
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
        <div className="ml-auto shrink-0 text-right leading-tight">
          <div className="text-xs text-[#b9b9a8]">Call Us Today!</div>
          <div className="text-xl font-bold text-[#f2d024]">{mock.phone}</div>
        </div>
      </div>

      {/* dim, low-contrast hero */}
      <div className="relative h-60 overflow-hidden bg-[#3a3d3a]">
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

      {/* wall of text + plain yellow estimate box */}
      <div className="flex gap-8 bg-white px-10 py-7">
        <div className="flex-1">
          <div className="mb-3 text-2xl text-[#444]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {b.welcome}
          </div>
          {b.wall.map((p) => (
            <p key={p.slice(0, 24)} className="mb-3 text-justify text-xs leading-[1.65] text-[#8a8a8a]">
              {p}
            </p>
          ))}
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

/* ───────────────────────── AFTER ───────────────────────── */
function Stars() {
  return (
    <span className="tracking-tight text-[#f5a524]" aria-hidden="true">
      ★★★★★
    </span>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </svg>
  );
}

const serviceIcons = [
  "M12 3 5 13h4l-3 5h5v3h2v-3h5l-3-5h4z",
  "M4 20 14 10m0 0 2-6 4 4-6 2zM6 14l4 4",
  "M13 2 4 14h7l-1 8 9-12h-7z",
];

export function AfterSite() {
  return (
    <div className="mock mock-after absolute inset-0 flex flex-col overflow-hidden bg-[#f6f7f4] text-[#0f1f14]">
      {/* header */}
      <div className="flex shrink-0 items-center justify-between bg-white px-5 py-3 @2xl:px-10 @2xl:py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15803d]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#fff" aria-hidden="true">
              <path d="M12 3 5 13h4l-3 5h5v3h2v-3h5l-3-5h4z" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight @2xl:text-xl">
            Ridgeline <span className="font-semibold text-[#15803d]">Tree Service</span>
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#3c4a40] @2xl:flex">
          {a.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[#0f1f14] px-3.5 py-2 text-sm font-bold text-white @2xl:px-5 @2xl:py-2.5">
          <PhoneIcon className="h-3.5 w-3.5" />
          <span className="hidden @2xl:inline">{mock.phone}</span>
          <span className="@2xl:hidden">Call</span>
        </div>
      </div>

      {/* hero */}
      <div className="relative flex flex-col @2xl:min-h-0 @2xl:flex-1 @2xl:flex-row">
        {/* bright photo */}
        <div className="relative h-32 shrink-0 @2xl:order-2 @2xl:h-auto @2xl:w-[46%]">
          <Image
            src="/images/after-hero.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover object-[50%_45%] @2xl:object-[50%_100%]"
            style={{ filter: "saturate(1.15) contrast(1.05)" }}
          />
          {/* quote form (desktop: floats over the photo) */}
          <div className="absolute inset-x-12 bottom-6 hidden rounded-2xl bg-white p-5 shadow-[0_1.5em_3em_-1em_rgba(0,0,0,0.45)] @2xl:block">
            <div className="text-xl font-extrabold tracking-tight">{a.formTitle}</div>
            <div className="mt-3 space-y-2">
              {a.formFields.map((f) => (
                <div key={f} className="rounded-lg border border-[#d6dbd4] bg-[#f6f7f4] px-3 py-2.5 text-sm text-[#7b877e]">
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-[#15803d] py-3 text-center text-base font-extrabold text-white">
              {a.formButton} →
            </div>
          </div>
        </div>

        {/* copy */}
        <div className="flex flex-col justify-center px-5 py-4 @2xl:order-1 @2xl:flex-1 @2xl:px-10 @2xl:py-0">
          <div className="flex items-center gap-1.5 whitespace-nowrap text-[calc(var(--spacing)*2.6)] font-bold @2xl:gap-3 @2xl:text-sm">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 shadow-sm @2xl:px-3">
              <Stars /> {a.rating} · {a.reviews}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-2.5 py-1.5 text-[#166534] @2xl:px-3">
              <ShieldIcon className="h-3.5 w-3.5" /> {a.badge}
            </span>
          </div>
          <div className="mt-4 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] @2xl:mt-5 @2xl:text-7xl">
            {a.headline.map((line, i) => (
              <div key={line} className={i === a.headline.length - 1 ? "text-[#15803d]" : ""}>
                {line}
              </div>
            ))}
          </div>
          <div className="mt-3 hidden text-base text-[#4b5a50] @2xl:mt-4 @2xl:block @2xl:text-lg">{a.sub}</div>
          <div className="mt-4 flex flex-col gap-2.5 @2xl:mt-6 @2xl:flex-row @2xl:items-center">
            <div className="flex items-center justify-center gap-3 rounded-xl bg-[#f97316] px-6 py-4 text-xl font-extrabold text-white shadow-[0_0.6em_1.4em_-0.5em_#f97316] @2xl:rounded-2xl @2xl:px-7">
              <PhoneIcon className="h-6 w-6" />
              {a.call} {mock.phone}
            </div>
            {/* mobile: quote button instead of the floating form */}
            <div className="rounded-xl border-2 border-[#15803d] bg-white py-3.5 text-center text-lg font-extrabold text-[#15803d] @2xl:hidden">
              {a.formTitle} →
            </div>
          </div>
        </div>
      </div>

      {/* service cards */}
      <div className="grid shrink-0 grid-cols-3 gap-2.5 px-5 pb-5 @2xl:gap-5 @2xl:px-10 @2xl:py-7">
        {a.services.map((s, i) => (
          <div key={s.title} className="rounded-xl bg-white p-3 shadow-sm @2xl:flex @2xl:items-center @2xl:gap-4 @2xl:rounded-2xl @2xl:p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#dcfce7] @2xl:h-12 @2xl:w-12 @2xl:rounded-xl">
              <svg viewBox="0 0 24 24" className="h-5 w-5 @2xl:h-6 @2xl:w-6" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={serviceIcons[i % serviceIcons.length]} />
              </svg>
            </span>
            <div className="mt-2 @2xl:mt-0">
              <div className="text-sm font-extrabold leading-tight tracking-tight @2xl:text-lg">{s.title}</div>
              <div className="mt-0.5 hidden text-sm text-[#5b6a60] @2xl:block">{s.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
