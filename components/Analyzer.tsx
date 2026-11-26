"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, CircleCheck, MapPin, X } from "lucide-react";
import { analyzer as copy, pricing, site } from "@/content";
import PlaceSearch from "./PlaceSearch";
import { businessDetails, cityParts, PLACES_FAILED, placesEnabled, type PickedBusiness, type Suggestion } from "./places";
import { bookingUrl, ease, rememberContact, useBookingHref } from "./ui";

/** business = step 1 (find your business), contact = step 2 (where to send the report), done = success screen. */
type Stage = "business" | "contact" | "done";

const swap = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.45, ease },
};

const inputClass =
  "w-full min-h-14 rounded-md border-2 border-sage/50 bg-bg px-4 py-3.5 text-base text-cream placeholder:text-muted/60 focus:border-sage focus:outline-none";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-cream";
const linkClass = "inline-flex min-h-12 cursor-pointer items-center text-sm font-semibold text-muted underline underline-offset-4 hover:text-cream";

/** Hidden from people, filled in by bots. The API drops anything that has it. */
function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Optional() {
  return <span className="ml-1.5 font-semibold normal-case tracking-normal text-muted">{copy.optional}</span>;
}

export default function Analyzer() {
  const uid = useId();
  const [stage, setStage] = useState<Stage>("business");
  // Set when a "Start with <plan>" pricing button sends someone here.
  const [plan, setPlan] = useState("");
  // "zero-down" or "495-setup", set by the "Two ways to start" buttons.
  const [setup, setSetup] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const bookHref = useBookingHref();

  // Step 1. Google search mode, or typed by hand (no key, Google failed, or "Not on Google?").
  const [manual, setManual] = useState(!placesEnabled);
  const [googleDown, setGoogleDown] = useState(!placesEnabled);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<PickedBusiness | null>(null);
  const [looking, setLooking] = useState(false);
  // Null until they edit it: until then it shows whatever they typed in the Google search box.
  const [businessNameEdit, setBusinessName] = useState<string | null>(null);
  const businessName = businessNameEdit ?? query;
  const [city, setCity] = useState("");
  const [cityState, setCityState] = useState(""); // "TN" when they picked a city from the list
  const [website, setWebsite] = useState("");
  const [stepError, setStepError] = useState("");
  // The partial lead saved after step 1, filled in by step 2.
  const [leadId, setLeadId] = useState<string | null>(null);

  // Step 2.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const cityInput = useRef<HTMLDivElement>(null);
  const stepTwo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPlan = (e: Event) => {
      setPlan((e as CustomEvent<string>).detail ?? "");
      setStage((s) => (s === "done" ? "business" : s));
    };
    const onSetup = (e: Event) => {
      setSetup((e as CustomEvent<string>).detail ?? "");
      setStage((s) => (s === "done" ? "business" : s));
    };
    // Google rejected the key: same as failGoogle() below.
    const onPlacesFailed = () => {
      setGoogleDown(true);
      setManual(true);
      setPicked(null);
    };
    window.addEventListener("arbor:plan", onPlan);
    window.addEventListener("arbor:setup", onSetup);
    window.addEventListener(PLACES_FAILED, onPlacesFailed);
    return () => {
      window.removeEventListener("arbor:plan", onPlan);
      window.removeEventListener("arbor:setup", onSetup);
      window.removeEventListener(PLACES_FAILED, onPlacesFailed);
    };
  }, []);

  /** Google can't be used: carry on with typed fields (what they typed in the search box becomes the business name). */
  function failGoogle() {
    setGoogleDown(true);
    setManual(true);
    setPicked(null);
  }

  function goManual() {
    setManual(true);
    setPicked(null);
    setStepError("");
  }

  async function pickBusiness(s: Suggestion) {
    setQuery(s.main);
    setStepError("");
    setLooking(true);
    try {
      setPicked(await businessDetails(s));
    } catch (e) {
      console.warn("[places] Details lookup failed:", e);
      // Still usable: keep the name and let them type the city.
      setPicked({ placeId: s.id, name: s.main, address: s.secondary, city: "", state: "", category: "", website: "" });
    }
    setLooking(false);
  }

  function pickCity(s: Suggestion) {
    const parts = cityParts(s);
    setCity(parts.state ? `${parts.city}, ${parts.state}` : parts.city);
    setCityState(parts.state);
  }

  const focusFirst = (el: HTMLElement | null) => {
    // Only with a mouse/keyboard: on phones it would pop the keyboard up over the form.
    if (window.matchMedia("(hover: hover)").matches) el?.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus();
  };

  /** The business fields both steps send. */
  function business() {
    if (picked) {
      return {
        placeId: picked.placeId,
        businessName: picked.name,
        city: picked.city || city.replace(/,\s*[A-Z]{2}$/, ""),
        state: picked.state || cityState,
        address: picked.address,
        category: picked.category,
        website: picked.website,
      };
    }
    // A city picked from the list reads "Spring Hill, TN": send the town and state separately.
    const town = cityState ? city.replace(new RegExp(`,\\s*${cityState}$`), "") : city;
    return { businessName: businessName.trim(), city: town.trim(), state: cityState, website: website.trim() };
  }

  async function next(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || looking) return;
    const honeypot = String(new FormData(e.currentTarget).get("company") ?? "");

    if (!manual && !picked) {
      if (query.trim()) {
        // Typed a name but didn't pick from the list: switch to the typed fields with that name filled in.
        goManual();
        window.setTimeout(() => focusFirst(cityInput.current), 50);
      } else {
        setStepError(copy.find.pickError);
      }
      return;
    }
    if (picked && !picked.city && !city.trim()) {
      setStepError(copy.find.cityMissing);
      return;
    }

    setStepError("");
    setSending(true);
    try {
      // Saves a partial lead so we know who started (app/api/leads/route.ts). Never blocks step 2.
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "business", leadId, ...business(), company: honeypot }),
        signal: AbortSignal.timeout(8000),
      });
      const json = await res.json().catch(() => null);
      if (json?.leadId) setLeadId(json.leadId);
    } catch {
      // Step 2 sends everything again, so the lead is still saved then.
    }
    setSending(false);
    setStage("contact");
    window.setTimeout(() => focusFirst(stepTwo.current), 500);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const honeypot = String(new FormData(e.currentTarget).get("company") ?? "");
    const contact = { name: name.trim(), email: email.trim(), phone: phone.trim() };

    setSending(true);
    setError(false);
    try {
      // Fills in the partial lead, emails the owner, and starts the report in the background (app/api/leads/route.ts).
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "contact", leadId, ...business(), ...contact, plan, setup, company: honeypot }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setError(true);
      setSending(false);
      return;
    }
    setSending(false);
    rememberContact({ name: contact.name, email: contact.email });
    setStage("done");
  }

  function startOver() {
    setStage("business");
    setManual(googleDown);
    setQuery("");
    setPicked(null);
    setBusinessName(null);
    setCity("");
    setCityState("");
    setWebsite("");
    setLeadId(null);
    setStepError("");
    setError(false);
  }

  const setupOption = pricing.setup.options.find((o) => o.id === setup);
  const picks = [
    ...(plan ? [{ label: copy.planLabel, value: plan, clear: () => setPlan("") }] : []),
    ...(setupOption ? [{ label: copy.setupLabel, value: `${setupOption.price} ${setupOption.detail}`, clear: () => setSetup("") }] : []),
  ];

  const errorBox = (text: React.ReactNode) => (
    <p role="alert" className="mt-5 rounded-md border-2 border-blaze bg-bg px-4 py-3 text-base font-semibold text-cream">
      {text}
    </p>
  );

  const stepLabel = (text: string) => <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-sage">{text}</p>;

  // City field for typed-in businesses, with Google city suggestions when Google is available.
  const cityField = (labelText: string) => (
    <div ref={cityInput}>
      <label htmlFor={`${uid}-city`} className={labelClass}>
        {labelText}
      </label>
      {googleDown ? (
        <input
          id={`${uid}-city`}
          type="text"
          autoComplete="address-level2"
          autoCapitalize="words"
          spellCheck={false}
          required
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setCityState("");
          }}
          className={inputClass}
        />
      ) : (
        <PlaceSearch
          id={`${uid}-city`}
          kind="city"
          value={city}
          onChange={(t) => {
            setCity(t);
            setCityState("");
          }}
          onPick={pickCity}
          onFail={failGoogle}
          required
          placeholder={copy.find.cityPlaceholder}
          className={inputClass}
        />
      )}
    </div>
  );

  return (
    <div data-audit-form className="rounded-lg border-2 border-line bg-raised p-5 text-left sm:p-8" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "business" && (
          <m.form key="business" {...swap} onSubmit={next} noValidate={!manual}>
            {picks.map((c) => (
              <p key={c.label} className="mb-3 flex items-center justify-between gap-3 rounded-md border-2 border-line bg-bg py-1 pl-4 pr-1 text-base text-muted">
                <span>
                  {c.label} <span className="font-extrabold text-cream">{c.value}</span>
                </span>
                <button
                  type="button"
                  onClick={c.clear}
                  aria-label={`${copy.planClear} ${c.value}`}
                  className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted hover:text-cream"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </p>
            ))}
            {stepLabel(copy.steps.business)}

            {!manual ? (
              <div>
                <label htmlFor={`${uid}-find`} className={labelClass}>
                  {copy.find.label}
                </label>
                {picked ? (
                  <div className="flex items-start gap-3 rounded-md border-2 border-sage bg-bg py-3 pl-4 pr-2">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sage" strokeWidth={2.5} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-base font-extrabold leading-snug text-cream">{picked.name}</p>
                      {picked.address && <p className="mt-0.5 break-words text-sm leading-snug text-muted">{picked.address}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPicked(null);
                        setCity("");
                        setCityState("");
                      }}
                      className="inline-flex min-h-12 shrink-0 cursor-pointer items-center px-2 text-sm font-bold text-muted underline underline-offset-4 hover:text-cream"
                    >
                      {copy.find.change}
                    </button>
                  </div>
                ) : (
                  <PlaceSearch
                    id={`${uid}-find`}
                    kind="business"
                    value={query}
                    onChange={(t) => {
                      setQuery(t);
                      setStepError("");
                    }}
                    onPick={pickBusiness}
                    onFail={failGoogle}
                    placeholder={copy.find.placeholder}
                    autoComplete="organization"
                    describedBy={`${uid}-find-hint`}
                    className={inputClass}
                  />
                )}
                {looking ? (
                  <p className="mt-2 text-sm text-muted">{copy.find.loading}</p>
                ) : (
                  !picked && (
                    <p id={`${uid}-find-hint`} className="mt-2 text-sm text-muted">
                      {copy.find.hint}
                    </p>
                  )
                )}
                {picked && !picked.city && !looking && <div className="mt-4">{cityField(copy.find.cityMissing)}</div>}
                <button type="button" onClick={goManual} className={`${linkClass} mt-1`}>
                  {copy.find.manualLink}
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-business`} className={labelClass}>
                    {copy.fields.business}
                  </label>
                  <input
                    id={`${uid}-business`}
                    type="text"
                    autoComplete="organization"
                    autoCapitalize="words"
                    spellCheck={false}
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                {cityField(copy.fields.city)}
                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-website`} className={labelClass}>
                    {copy.fields.website}
                    <Optional />
                  </label>
                  <input
                    id={`${uid}-website`}
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={copy.websitePlaceholder}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={inputClass}
                  />
                </div>
                {!googleDown && (
                  <button
                    type="button"
                    onClick={() => {
                      setManual(false);
                      setStepError("");
                    }}
                    className={`${linkClass} -mt-2 sm:col-span-2`}
                  >
                    {copy.find.searchLink}
                  </button>
                )}
              </div>
            )}

            <Honeypot />
            {stepError && errorBox(stepError)}
            <button
              type="submit"
              disabled={sending || looking}
              aria-busy={sending}
              className="btn btn-blaze btn-lg mt-5 w-full disabled:cursor-wait disabled:opacity-70"
            >
              {sending ? copy.sending : copy.next}
            </button>
          </m.form>
        )}

        {stage === "contact" && (
          <m.form key="contact" {...swap} onSubmit={submit}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage">{copy.steps.contact}</p>
              <button
                type="button"
                onClick={() => setStage("business")}
                className="-my-3 inline-flex min-h-12 cursor-pointer items-center gap-1.5 text-sm font-bold text-muted underline underline-offset-4 hover:text-cream"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                {copy.back}
              </button>
            </div>
            <h3 className="text-2xl font-extrabold leading-tight tracking-[-0.02em] sm:text-3xl">{copy.contactHeading}</h3>
            <p className="mt-1.5 break-words text-base text-muted">{business().businessName}</p>

            <div ref={stepTwo} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-name`} className={labelClass}>
                  {copy.fields.name}
                </label>
                <input
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  spellCheck={false}
                  enterKeyHint="next"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className={labelClass}>
                  {copy.fields.email}
                </label>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="next"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className={labelClass}>
                  {copy.fields.phone}
                  <Optional />
                </label>
                <input
                  id={`${uid}-phone`}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="send"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <Honeypot />
            {error &&
              errorBox(
                <>
                  {copy.error}{" "}
                  <a href={`mailto:${site.email}`} className="underline underline-offset-2">
                    {site.email}
                  </a>
                  .
                </>,
              )}
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending}
              className="btn btn-blaze btn-lg mt-5 w-full disabled:cursor-wait disabled:opacity-70 max-[400px]:!px-3 max-[400px]:!text-[0.875rem]"
            >
              {sending ? copy.sending : copy.button}
            </button>
            {/* Second path for ready buyers. Hidden until a booking link is set: without one it would only point back at this form. */}
            {bookingUrl && (
              <p className="mt-3 text-center text-sm text-muted">
                <a
                  href={bookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center font-semibold underline underline-offset-4 hover:text-cream"
                >
                  {site.ratherTalk} {site.bookCall}
                </a>
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {copy.consent.text}{" "}
              <Link href="/privacy" className="font-bold text-cream underline underline-offset-2">
                {copy.consent.link}
              </Link>
              .
            </p>
          </m.form>
        )}

        {stage === "done" && (
          <m.div key="done" {...swap}>
            <div className="flex items-start gap-4">
              <CircleCheck className="mt-0.5 h-8 w-8 shrink-0 text-sage" strokeWidth={2} aria-hidden="true" />
              <div className="min-w-0">
                <p className="break-words text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
                  {copy.success.replace("{email}", email.trim())}
                </p>
                <p className="mt-2 text-base text-muted">{copy.successSub}</p>
              </div>
            </div>

            {bookingUrl && (
              <div className="mt-7 flex flex-col gap-3 border-t-2 border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-lg font-extrabold tracking-tight">{copy.bookAfter}</p>
                <a href={bookHref} target="_blank" rel="noopener noreferrer" className="btn btn-blaze shrink-0">
                  {site.bookCall}
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={startOver}
              className="mt-6 inline-flex min-h-12 cursor-pointer items-center text-sm font-bold text-muted underline underline-offset-4 hover:text-cream"
            >
              {copy.startOver}
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
