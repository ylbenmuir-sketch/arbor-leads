// Server-only. Pulls the facts for a "Who's Beating Me?" report:
// Google Maps rankings from DataForSEO and mobile speed from Google PageSpeed Insights.
import { env } from "@/lib/server/leads";

export type ReportInput = {
  name: string;
  business_name: string;
  email: string;
  city: string;
  website: string | null;
};

/** One Google Maps listing, trimmed to what the report uses. */
export type Listing = {
  name: string;
  rank: number;
  rating: number | null;
  reviews: number | null;
  website: string | null;
  category: string | null;
  address: string | null;
};

export type SearchResult = {
  keyword: string;
  /** The lead's position in the map results, or null for "not in top 20". */
  leadRank: number | null;
  /** Top 5 businesses that aren't the lead. */
  competitors: Listing[];
  /** Every organic map result (up to 20), parsed. */
  listings: Listing[];
  /** DataForSEO's items, unmodified, for raw_data. */
  rawItems: unknown[];
};

export type Speed =
  | { ok: true; url: string; score: number; lcp: string | null; fcp: string | null; tbt: string | null; cls: string | null; speedIndex: string | null }
  | { ok: false; url: string; error: string };

export type ReportData = {
  searches: SearchResult[];
  /** The lead's own Google listing, from the rank searches or a direct name search. Null if we couldn't find one. */
  profile: (Listing & { foundIn: string }) | null;
  /** Null when they didn't give a website. */
  speed: Speed | null;
  /** Raw items from the "{business} {city}" lookup, for raw_data. */
  lookupRawItems: unknown[];
};

export const DEPTH = 20;

type MapsItem = {
  type?: string;
  rank_group?: number;
  rank_absolute?: number;
  title?: string;
  domain?: string | null;
  url?: string | null;
  category?: string | null;
  address?: string | null;
  rating?: { value?: number | null; votes_count?: number | null } | null;
};

/** One live Google Maps search through DataForSEO. Throws on any API error. */
async function mapsSearch(keyword: string, depth = DEPTH): Promise<MapsItem[]> {
  const auth = Buffer.from(`${env("DATAFORSEO_LOGIN")}:${env("DATAFORSEO_PASSWORD")}`).toString("base64");
  const res = await fetch("https://api.dataforseo.com/v3/serp/google/maps/live/advanced", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify([{ keyword, location_name: "United States", language_code: "en", depth }]),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`DataForSEO HTTP ${res.status} for "${keyword}"`);
  const json = await res.json();
  if (json.status_code !== 20000) throw new Error(`DataForSEO ${json.status_code}: ${json.status_message}`);
  const task = json.tasks?.[0];
  if (task?.status_code !== 20000) throw new Error(`DataForSEO task ${task?.status_code}: ${task?.status_message} ("${keyword}")`);
  return (task.result?.[0]?.items ?? []) as MapsItem[];
}

// ── Matching the lead to a listing ──

const STOP = new Set(["llc", "inc", "co", "corp", "ltd", "the", "and", "of", "pllc", "company"]);
// Words half the listings share. A name made only of these ("Tree Service") is too vague to match on its own.
const GENERIC = new Set([
  "tree", "trees", "service", "services", "removal", "care", "expert", "experts", "arborist", "arborists", "arbor",
  "pro", "pros", "professional", "professionals", "landscaping", "landscape", "stump", "stumps", "grinding",
  "trimming", "trim", "lawn", "yard", "solutions", "specialists", "llc",
]);

const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !STOP.has(t));

/** Big shared hosts where matching on domain would match strangers (everyone's Facebook page is facebook.com). */
const SHARED_HOSTS = /(^|\.)(facebook|fb|instagram|google|business\.site|sites\.google|yelp|nextdoor|angi|homeadvisor|thumbtack|linktr|wix|wixsite|square|godaddysites|weebly)\./;

export function hostOf(url: string | null | undefined) {
  if (!url) return null;
  try {
    const host = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.toLowerCase().replace(/^www\./, "");
    return host.includes(".") ? host : null;
  } catch {
    return null;
  }
}

export function isSameBusiness(lead: { business_name: string; website: string | null }, item: { title?: string; domain?: string | null; url?: string | null }) {
  const leadHost = hostOf(lead.website);
  const itemHost = hostOf(item.domain) ?? hostOf(item.url);
  if (leadHost && itemHost && leadHost === itemHost && !SHARED_HOSTS.test(`${leadHost}.`)) return true;

  const a = tokens(lead.business_name);
  const b = tokens(item.title ?? "");
  if (!a.length || !b.length) return false;
  if (a.join("") === b.join("")) return true;
  // Every distinctive word in their name shows up in the listing ("Smith Tree" ↔ "Smith Tree Service LLC").
  const distinctive = a.filter((t) => !GENERIC.has(t));
  const listing = new Set(b);
  return distinctive.length > 0 && distinctive.every((t) => listing.has(t));
}

function toListing(item: MapsItem): Listing {
  return {
    name: item.title?.trim() || "Unnamed business",
    rank: item.rank_group ?? item.rank_absolute ?? 0,
    rating: item.rating?.value ?? null,
    reviews: item.rating?.votes_count ?? null,
    website: item.url || (item.domain ? `https://${item.domain}` : null),
    category: item.category ?? null,
    address: item.address ?? null,
  };
}

// ── PageSpeed ──

export function normalizeUrl(website: string) {
  const url = /^https?:\/\//i.test(website) ? website : `https://${website}`;
  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
}

async function pageSpeed(website: string): Promise<Speed> {
  const url = normalizeUrl(website);
  if (!url) return { ok: false, url: website, error: "That website address isn't a valid URL." };
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("category", "performance");
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(90_000) });
    const json = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, url, error: json?.error?.message ?? `PageSpeed HTTP ${res.status}` };
    const lh = json?.lighthouseResult;
    const score = lh?.categories?.performance?.score;
    if (typeof score !== "number") return { ok: false, url, error: "PageSpeed returned no performance score." };
    const audit = (id: string) => (lh.audits?.[id]?.displayValue as string | undefined)?.replace(/ /g, " ") ?? null;
    return {
      ok: true,
      url,
      score: Math.round(score * 100),
      lcp: audit("largest-contentful-paint"),
      fcp: audit("first-contentful-paint"),
      tbt: audit("total-blocking-time"),
      cls: audit("cumulative-layout-shift"),
      speedIndex: audit("speed-index"),
    };
  } catch (e) {
    return { ok: false, url, error: e instanceof Error ? e.message : String(e) };
  }
}

// ── Everything together ──

export const keywordsFor = (city: string) => [`tree service ${city}`, `tree removal ${city}`];

/**
 * Pull all the data. DataForSEO failures throw (no report without rankings).
 * PageSpeed failures don't: they're recorded on `speed` and the report says the check didn't finish.
 */
export async function pullReportData(lead: ReportInput): Promise<ReportData> {
  const keywords = keywordsFor(lead.city);
  const [rankItems, lookupItems, speed] = await Promise.all([
    Promise.all(keywords.map((k) => mapsSearch(k))),
    // Their own listing, even if it isn't in the top 20 for the money searches.
    mapsSearch(`${lead.business_name} ${lead.city}`, 10),
    lead.website ? pageSpeed(lead.website) : Promise.resolve(null),
  ]);

  let profile: ReportData["profile"] = null;
  const searches = keywords.map((keyword, i): SearchResult => {
    const items = rankItems[i].filter((it) => it.type === "maps_search" && it.title);
    const mine = items.find((it) => isSameBusiness(lead, it));
    if (mine && !profile) profile = { ...toListing(mine), foundIn: keyword };
    return {
      keyword,
      leadRank: mine ? toListing(mine).rank : null,
      competitors: items
        .filter((it) => it !== mine)
        .slice(0, 5)
        .map(toListing),
      listings: items.map(toListing),
      rawItems: rankItems[i],
    };
  });

  if (!profile) {
    const mine = lookupItems.find((it) => it.type === "maps_search" && it.title && isSameBusiness(lead, it));
    if (mine) profile = { ...toListing(mine), foundIn: `${lead.business_name} ${lead.city}` };
  }

  return { searches, profile, speed, lookupRawItems: lookupItems };
}
