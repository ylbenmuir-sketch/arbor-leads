// Server-only. Pulls the facts for a "Who's Beating Me?" report:
// Google Maps rankings from Serper.dev or DataForSEO (DATA_PROVIDER) and mobile speed from Google PageSpeed Insights.
import { env } from "@/lib/server/leads";
import { formatCity, sameTown, townOf, type City } from "./place";

export type ReportInput = {
  name: string;
  business_name: string;
  email: string;
  city: string;
  website: string | null;
  /** Google place ID of the listing they picked on the form. When set, their listing is matched by it instead of by name. */
  place_id?: string | null;
};

/** One Google Maps listing, trimmed to what the report uses. */
export type Listing = {
  name: string;
  /** Google place ID ("ChIJ…"), when the provider returns one. */
  placeId: string | null;
  rank: number;
  rating: number | null;
  reviews: number | null;
  website: string | null;
  category: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  /** Opening hours / photos on the listing. Null when the provider doesn't report it (scored as present). */
  hasHours: boolean | null;
  hasPhotos: boolean | null;
};

export type Dropped = { name: string; town: string | null; miles: number | null };

export type SearchResult = {
  keyword: string;
  /** The lead's position in the map results, or null for "not in top 20". */
  leadRank: number | null;
  /** Top 5 businesses that aren't the lead, in or within NEARBY_MILES of the searched city. */
  competitors: Listing[];
  /** Businesses skipped as competitors because they're too far from the searched city. */
  droppedFar: Dropped[];
  /** Every organic map result (up to 20), parsed. */
  listings: Listing[];
  /** The provider's raw result items, unmodified, for raw_data. */
  rawItems: unknown[];
};

export type Speed =
  | { ok: true; url: string; score: number; lcp: string | null; fcp: string | null; tbt: string | null; cls: string | null; speedIndex: string | null }
  | { ok: false; url: string; error: string };

export type ReportData = {
  /** Which Google Maps data source was used ("serper" or "dataforseo"). */
  provider: Provider;
  searches: SearchResult[];
  /** The lead's own Google listing, from the rank searches or a direct name search. Null if we couldn't find one. */
  profile: (Listing & { foundIn: string }) | null;
  /** Mobile speed of the form's website, or the listing's website if they gave none. Null when neither exists. */
  speed: Speed | null;
  /** The "{business} {city}" lookup search and its raw items, for raw_data. */
  lookupKeyword: string;
  lookupRawItems: unknown[];
};

export const DEPTH = 20;

// ── Google Maps providers ──
// Each one returns organic map results as Listings (rank = 1-based position) plus its raw response items.

export type Provider = "serper" | "dataforseo";
type MapsResult = { listings: Listing[]; raw: unknown[] };

/** DATA_PROVIDER wins; otherwise Serper when SERPER_API_KEY is set, else DataForSEO. */
export function chooseProvider(): Provider {
  const set = process.env.DATA_PROVIDER?.trim().toLowerCase();
  if (set === "serper" || set === "dataforseo") return set;
  if (set) throw new Error(`DATA_PROVIDER must be "serper" or "dataforseo", not "${set}"`);
  return process.env.SERPER_API_KEY ? "serper" : "dataforseo";
}

const cleanName = (s: unknown) => (typeof s === "string" && s.trim() ? s.trim() : "Unnamed business");
const numOrNull = (n: unknown) => (typeof n === "number" && Number.isFinite(n) ? n : null);
const strOrNull = (s: unknown) => (typeof s === "string" && s.trim() ? s.trim() : null);

type DataForSeoItem = {
  type?: string;
  place_id?: string | null;
  rank_group?: number;
  rank_absolute?: number;
  title?: string;
  domain?: string | null;
  url?: string | null;
  category?: string | null;
  address?: string | null;
  rating?: { value?: number | null; votes_count?: number | null } | null;
  latitude?: number | null;
  longitude?: number | null;
  work_hours?: { timetable?: unknown } | null;
  main_image?: string | null;
  total_photos?: number | null;
};

/**
 * Hours/photos: a provider that reports them for some listings in a search reports them for all,
 * so a missing value there means "none". If no listing has it, the provider doesn't report it: leave null.
 */
function settleUnknowns(listings: Listing[]) {
  const hours = listings.some((l) => l.hasHours === true);
  const photos = listings.some((l) => l.hasPhotos === true);
  return listings.map((l) => ({ ...l, hasHours: l.hasHours ?? (hours ? false : null), hasPhotos: l.hasPhotos ?? (photos ? false : null) }));
}

/** DataForSEO live Google Maps search (basic auth). Throws on any API error. */
async function dataForSeoSearch(keyword: string, depth: number): Promise<MapsResult> {
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
  const raw = (task.result?.[0]?.items ?? []) as DataForSeoItem[];
  const listings = raw
    .filter((it) => it.type === "maps_search" && it.title)
    .slice(0, depth)
    .map(
      (it, i): Listing => ({
        name: cleanName(it.title),
        placeId: strOrNull(it.place_id),
        rank: it.rank_group ?? i + 1,
        rating: numOrNull(it.rating?.value),
        reviews: numOrNull(it.rating?.votes_count),
        website: strOrNull(it.url) ?? (it.domain ? `https://${it.domain}` : null),
        category: strOrNull(it.category),
        address: strOrNull(it.address),
        lat: numOrNull(it.latitude),
        lng: numOrNull(it.longitude),
        hasHours: it.work_hours?.timetable ? true : null,
        hasPhotos: it.main_image || (it.total_photos ?? 0) > 0 ? true : null,
      }),
    );
  return { listings: settleUnknowns(listings), raw };
}

type SerperPlace = {
  position?: number;
  title?: string;
  address?: string;
  rating?: number;
  ratingCount?: number;
  type?: string;
  types?: string[];
  category?: string;
  website?: string;
  cid?: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: Record<string, string>;
  thumbnailUrl?: string;
};

async function serperPage(keyword: string, page: number): Promise<SerperPlace[]> {
  const res = await fetch("https://google.serper.dev/maps", {
    method: "POST",
    headers: { "X-API-KEY": env("SERPER_API_KEY"), "Content-Type": "application/json" },
    body: JSON.stringify({ q: keyword, gl: "us", hl: "en", page }),
    signal: AbortSignal.timeout(30_000),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`Serper HTTP ${res.status} for "${keyword}": ${json?.message ?? "no details"}`);
  if (!json || !Array.isArray(json.places)) throw new Error(`Serper returned no places list for "${keyword}"`);
  return json.places as SerperPlace[];
}

/**
 * Serper.dev Google Maps search. A page can hold fewer than `depth` places, so a full page 1
 * (10+ places, short of `depth`) means there's more: fetch page 2. A short page 1 is everything
 * there is, so don't spend a credit on page 2. Rank is the order across pages, since Serper
 * may restart `position` on page 2.
 */
async function serperSearch(keyword: string, depth: number): Promise<MapsResult> {
  const raw = await serperPage(keyword, 1);
  if (raw.length >= 10 && raw.length < depth) raw.push(...(await serperPage(keyword, 2)));

  const seen = new Set<string>();
  const unique = raw.filter((p) => {
    if (!p.title) return false;
    const id = p.cid || p.placeId || `${p.title}|${p.address ?? ""}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  const listings = unique.slice(0, depth).map(
    (p, i): Listing => ({
      name: cleanName(p.title),
      placeId: strOrNull(p.placeId),
      rank: i + 1,
      rating: numOrNull(p.rating),
      reviews: numOrNull(p.ratingCount),
      website: strOrNull(p.website),
      category: strOrNull(p.type) ?? strOrNull(p.category) ?? strOrNull(p.types?.[0]),
      address: strOrNull(p.address),
      lat: numOrNull(p.latitude),
      lng: numOrNull(p.longitude),
      hasHours: p.openingHours && Object.keys(p.openingHours).length ? true : null,
      hasPhotos: p.thumbnailUrl ? true : null,
    }),
  );
  return { listings: settleUnknowns(listings), raw };
}

function mapsSearch(provider: Provider, keyword: string, depth = DEPTH) {
  return provider === "serper" ? serperSearch(keyword, depth) : dataForSeoSearch(keyword, depth);
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

export function isSameBusiness(lead: { business_name: string; website: string | null }, item: { name: string; website: string | null }) {
  const leadHost = hostOf(lead.website);
  const itemHost = hostOf(item.website);
  if (leadHost && itemHost && leadHost === itemHost && !SHARED_HOSTS.test(`${leadHost}.`)) return true;

  const a = tokens(lead.business_name);
  const b = tokens(item.name);
  if (!a.length || !b.length) return false;
  if (a.join("") === b.join("")) return true;
  // Every distinctive word in their name shows up in the listing ("Smith Tree" ↔ "Smith Tree Service LLC").
  const distinctive = a.filter((t) => !GENERIC.has(t));
  const listing = new Set(b);
  return distinctive.length > 0 && distinctive.every((t) => listing.has(t));
}

/**
 * Is this listing the lead's business? When we have their Google place ID and the listing has one too,
 * that decides it. Otherwise (typed in by hand, or the provider gave no ID) fall back to name/website matching.
 */
export function isLeadListing(lead: ReportInput, item: Listing) {
  if (lead.place_id && item.placeId) return lead.place_id === item.placeId;
  return isSameBusiness(lead, item);
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

// ── Distance from the searched city ──

/** Competitors further than this from the searched city aren't shown. */
export const NEARBY_MILES = 30;

function miles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

/** Center of the searched city: the median spot of listings whose address is in that town. Null if none are. */
export function cityCenter(listings: Listing[], city: City) {
  const inTown = listings.filter((l) => l.lat != null && l.lng != null && townOf(l.address) && sameTown(townOf(l.address)!, city));
  if (!inTown.length) return null;
  return { lat: median(inTown.map((l) => l.lat!)), lng: median(inTown.map((l) => l.lng!)) };
}

/**
 * Is this listing a real local competitor? Yes if its address is in the searched city or within NEARBY_MILES.
 * When we can't tell (no center or no coordinates) keep it, rather than guess.
 */
function nearby(l: Listing, city: City, center: { lat: number; lng: number } | null): { keep: boolean; miles: number | null } {
  const t = townOf(l.address);
  if (t && sameTown(t, city)) return { keep: true, miles: null };
  if (!center || l.lat == null || l.lng == null) return { keep: true, miles: null };
  const d = Math.round(miles(center, { lat: l.lat, lng: l.lng }));
  return { keep: d <= NEARBY_MILES, miles: d };
}

// ── Everything together ──

export const keywordsFor = (city: string) => [`tree service ${city}`, `tree removal ${city}`];

/**
 * Pull all the data. Maps provider failures throw (no report without rankings).
 * PageSpeed failures don't: they're recorded on `speed` and the report says the check didn't finish.
 */
export async function pullReportData(lead: ReportInput): Promise<ReportData> {
  const provider = chooseProvider();
  // "spring hill tn" → "Spring Hill, TN", so searches and the email read cleanly.
  const cityParts = formatCity(lead.city);
  const city = cityParts.label;
  const keywords = keywordsFor(city);
  const lookupKeyword = `${lead.business_name} ${city}`;
  const [rankResults, lookup, speed] = await Promise.all([
    Promise.all(keywords.map((k) => mapsSearch(provider, k))),
    // Their own listing, even if it isn't in the top 20 for the money searches.
    mapsSearch(provider, lookupKeyword, 10),
    lead.website ? pageSpeed(lead.website) : Promise.resolve(null),
  ]);

  const center = cityCenter(
    rankResults.flatMap((r) => r.listings),
    cityParts,
  );

  let profile: ReportData["profile"] = null;
  const searches = keywords.map((keyword, i): SearchResult => {
    const { listings, raw } = rankResults[i];
    const mine = listings.find((l) => isLeadListing(lead, l));
    if (mine && !profile) profile = { ...mine, foundIn: keyword };
    const competitors: Listing[] = [];
    const droppedFar: Dropped[] = [];
    for (const l of listings) {
      if (l === mine) continue;
      const near = nearby(l, cityParts, center);
      if (near.keep) competitors.push(l);
      else droppedFar.push({ name: l.name, town: townOf(l.address)?.town ?? null, miles: near.miles });
    }
    return { keyword, leadRank: mine?.rank ?? null, competitors: competitors.slice(0, 5), droppedFar, listings, rawItems: raw };
  });

  if (!profile) {
    const mine = lookup.listings.find((l) => isLeadListing(lead, l));
    if (mine) profile = { ...mine, foundIn: lookupKeyword };
  }

  // No website on the form, but one on their Google listing: test that one instead.
  let finalSpeed = speed;
  const listed = (profile as ReportData["profile"])?.website;
  if (!finalSpeed && listed && !SHARED_HOSTS.test(`${hostOf(listed)}.`)) finalSpeed = await pageSpeed(listed);

  return { provider, searches, profile, speed: finalSpeed, lookupKeyword, lookupRawItems: lookup.raw };
}
