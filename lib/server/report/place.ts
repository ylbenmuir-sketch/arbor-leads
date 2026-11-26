// Server-only. Towns, states and names: "spring hill tn" → "Spring Hill, TN", the town in a Google
// listing address, and which business name / city label the report shows.
import type { ReportData, ReportInput } from "./data";

const STATES: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA", colorado: "CO", connecticut: "CT",
  delaware: "DE", "district of columbia": "DC", florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID", illinois: "IL",
  indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS", missouri: "MO", montana: "MT",
  nebraska: "NE", nevada: "NV", "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA",
  "rhode island": "RI", "south carolina": "SC", "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT",
  vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI", wyoming: "WY",
};
const CODES = new Set(Object.values(STATES));
// Longest first, so "west virginia" wins over "virginia".
const NAMES = Object.keys(STATES).sort((a, b) => b.length - a.length);

export type City = { town: string; state: string | null; label: string };

/** Capitalize each word, unless they already typed mixed case ("McKinney" stays as is). */
function titleCase(s: string) {
  if (s !== s.toLowerCase() && s !== s.toUpperCase()) return s;
  return s.toLowerCase().replace(/(^|[\s\-'.])([a-z])/g, (_, sep, c) => sep + c.toUpperCase());
}

const label = (town: string, state: string | null) => (state ? `${town}, ${state}` : town);

/** "spring hill tn", "Spring Hill, Tennessee 37174", "SPRING HILL" → { town: "Spring Hill", state: "TN" | null }. */
export function formatCity(input: string): City {
  let s = input.trim().replace(/\s+/g, " ").replace(/[\s,.]+$/, "");
  s = s.replace(/[\s,]+(usa|us|united states)$/i, "").replace(/[\s,]+\d{5}(-\d{4})?$/, "");
  let state: string | null = null;

  const code = s.match(/^(.*?)(?:,\s*|\s+)([A-Za-z]{2})$/);
  if (code && CODES.has(code[2].toUpperCase())) {
    state = code[2].toUpperCase();
    s = code[1];
  } else {
    const lower = s.toLowerCase();
    const name = NAMES.find((n) => lower.endsWith(n) && /[\s,]/.test(lower.charAt(lower.length - n.length - 1)));
    if (name) {
      state = STATES[name];
      s = s.slice(0, s.length - name.length);
    }
  }
  const town = titleCase(s.replace(/[\s,]+$/, "").trim()) || titleCase(input.trim());
  return { town, state, label: label(town, state) };
}

/** Town and state from a Google listing address ("123 Main St, Spring Hill, TN 37174"). Null if it has no town. */
export function townOf(address: string | null | undefined): { town: string; state: string } | null {
  if (!address) return null;
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p && !/^(usa|us|united states)$/i.test(p));
  for (let i = parts.length - 1; i > 0; i--) {
    const m = parts[i].match(/^([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?)?$/);
    if (m && CODES.has(m[1])) return { town: parts[i - 1], state: m[1] };
  }
  return null;
}

const norm = (town: string) =>
  town
    .toLowerCase()
    .replace(/\bsaint\b/g, "st")
    .replace(/\bmount\b/g, "mt")
    .replace(/\bfort\b/g, "ft")
    .replace(/[^a-z0-9]/g, "");

/** Same town (and same state, when both are known)? */
export function sameTown(a: { town: string; state: string | null }, b: { town: string; state: string | null }) {
  return norm(a.town) === norm(b.town) && (!a.state || !b.state || a.state === b.state);
}

export const isTreeService = (category: string | null | undefined) => category?.trim().toLowerCase() === "tree service";

/** "Smith Tree Service - Tree Removal Spring Hill | 24/7" → "Smith Tree Service": the part before " - ", " | " or " + ". */
export function shortName(name: string) {
  return name.split(/\s+[-|+–—]\s+/)[0].trim() || name.trim();
}

/**
 * What the report calls the business and the city: the short form of the name on their Google listing
 * when we found it, and the city as "Spring Hill, TN". If they didn't type a state, borrow it from listings in that town.
 */
export function displayNames(lead: ReportInput, data: ReportData) {
  const city = formatCity(lead.city);
  if (!city.state) {
    const states = [data.profile, ...data.searches.flatMap((s) => s.listings)]
      .map((l) => townOf(l?.address))
      .filter((t): t is { town: string; state: string } => t != null && sameTown(t, city))
      .map((t) => t.state);
    const counts = new Map<string, number>();
    for (const st of states) counts.set(st, (counts.get(st) ?? 0) + 1);
    const top = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
    if (top) city.state = top;
    city.label = label(city.town, city.state);
  }
  return { businessName: shortName(data.profile?.name || lead.business_name), city };
}
