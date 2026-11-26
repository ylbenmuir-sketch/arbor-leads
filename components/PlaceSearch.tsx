"use client";

import { useEffect, useRef, useState } from "react";
import { loadPlaces, newSessionToken, suggest, type Kind, type Suggestion } from "./places";

/**
 * A text input with Google Places suggestions under it (an accessible combobox).
 * Calls `onFail` if Google can't be reached or refuses the key, so the form can fall back to plain fields.
 */
export default function PlaceSearch({
  id,
  kind,
  value,
  onChange,
  onPick,
  onFail,
  className,
  placeholder,
  required,
  autoComplete = "off",
  describedBy,
}: {
  id: string;
  kind: Kind;
  value: string;
  onChange: (text: string) => void;
  onPick: (s: Suggestion) => void;
  onFail: () => void;
  className: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  describedBy?: string;
}) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const token = useRef<object | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(0);
  const listId = `${id}-list`;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function search(text: string) {
    const n = ++latest.current;
    if (text.trim().length < 2) {
      setItems([]);
      setOpen(false);
      return;
    }
    try {
      token.current ??= await newSessionToken();
      const found = await suggest(kind, text, token.current);
      if (n !== latest.current) return; // a newer keystroke already went out
      setItems(found);
      setOpen(found.length > 0);
      setActive(-1);
    } catch (e) {
      console.warn("[places] Suggestions failed, switching to typed fields:", e);
      onFail();
    }
  }

  function type(text: string) {
    onChange(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => search(text), 200);
  }

  function pick(s: Suggestion) {
    window.clearTimeout(timer.current);
    latest.current++;
    setOpen(false);
    setItems([]);
    token.current = null; // the next search is a new session
    onPick(s);
  }

  function focus() {
    // Start loading Google's script the moment they tap in, so suggestions are ready by the second letter.
    loadPlaces().catch((e) => {
      console.warn("[places] Couldn't load Google Maps, switching to typed fields:", e);
      onFail();
    });
    // Phones: lift the field toward the top so the suggestions aren't hidden behind the keyboard.
    if (window.matchMedia("(max-width: 767.98px)").matches) {
      window.setTimeout(() => {
        const el = input.current;
        if (!el || document.activeElement !== el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 88;
        if (Math.abs(el.getBoundingClientRect().top - 88) > 40) window.scrollTo({ top, behavior: "smooth" });
      }, 300);
    }
  }

  function key(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault(); // pick the suggestion, don't submit the form
      pick(items[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        ref={input}
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-describedby={describedBy}
        autoComplete={autoComplete}
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint={kind === "business" ? "search" : "next"}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => type(e.target.value)}
        onFocus={focus}
        onKeyDown={key}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        className={className}
      />
      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-1.5 overflow-hidden rounded-md border-2 border-sage/50 bg-raised shadow-2xl shadow-black/40">
          <ul id={listId} role="listbox" aria-label={kind === "business" ? "Businesses on Google" : "Cities"}>
            {items.map((s, i) => (
              <li
                key={s.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // mousedown, not click: fires before the input's blur closes the list
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(s);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex min-h-14 cursor-pointer flex-col justify-center border-b-2 border-line px-4 py-2.5 text-left last:border-b-0 ${
                  i === active ? "bg-forest" : ""
                }`}
              >
                <span className="text-base font-bold leading-snug text-cream">{s.main}</span>
                {s.secondary && <span className="text-sm leading-snug text-muted">{s.secondary}</span>}
              </li>
            ))}
          </ul>
          <p className="border-t-2 border-line px-4 py-1.5 text-right text-[0.6875rem] font-semibold text-muted">Powered by Google</p>
        </div>
      )}
    </div>
  );
}
