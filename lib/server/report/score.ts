// Server-only. The Google Presence Score (0–100), worked out in code from the pulled data. The AI never touches it.
import type { ReportData, ReportInput } from "./data";
import { displayNames, formatCity, isTreeService, sameTown, townOf } from "./place";
import { topCompetitors } from "./write";

export type ScorePart = { key: "rank" | "reviews" | "rating" | "website" | "profile"; label: string; points: number; max: number; detail: string };
export type PresenceScore = { total: number; color: "red" | "orange" | "green"; parts: ScorePart[] };

export function presenceScore(lead: ReportInput, data: ReportData): PresenceScore {
  const p = data.profile;
  const { city } = displayNames(lead, data);

  // Map rank (50): points for each search, averaged. #1–3 = 50, #4–10 = 30, #11–20 = 12, not in the top 20 = 0.
  const perSearch = (r: number | null) => (r == null ? 0 : r <= 3 ? 50 : r <= 10 ? 30 : 12);
  const searched = formatCity(lead.city).label;
  const rank: ScorePart = {
    key: "rank",
    label: "Map rank",
    max: 50,
    points: data.searches.length ? Math.round(data.searches.reduce((sum, s) => sum + perSearch(s.leadRank), 0) / data.searches.length) : 0,
    detail: data.searches.every((s) => s.leadRank == null)
      ? "Not in the top 20 for either search"
      : data.searches.map((s) => `“${s.keyword.replace(searched, "").trim()}” ${s.leadRank == null ? "not in top 20" : `#${s.leadRank}`}`).join(" · "),
  };

  // Reviews (15): theirs vs the top 3 competitors' average, scaled. Equal or more = 15.
  const top = topCompetitors(data);
  const avg = top.length ? top.reduce((sum, c) => sum + (c.reviews ?? 0), 0) / top.length : 0;
  const mine = p?.reviews ?? 0;
  const reviews: ScorePart = {
    key: "reviews",
    label: "Reviews",
    max: 15,
    points: !p ? 0 : avg <= 0 || mine >= avg ? 15 : Math.round((15 * mine) / avg),
    detail: !p ? "No Google listing found" : top.length ? `${mine.toLocaleString("en-US")} vs ${Math.round(avg).toLocaleString("en-US")} avg for the top 3` : `${mine.toLocaleString("en-US")} reviews`,
  };

  // Rating (10).
  const r = p?.rating ?? null;
  const rating: ScorePart = {
    key: "rating",
    label: "Rating",
    max: 10,
    points: r == null ? 0 : r >= 4.8 ? 10 : r >= 4.5 ? 7 : r >= 4.0 ? 4 : 0,
    detail: !p ? "No Google listing found" : r == null ? "No rating yet" : `${r.toFixed(1)} stars`,
  };

  // Website (10): 5 for having one, plus mobile speed score / 20 (up to 5). A speed check that didn't finish counts as 3 of 5.
  const hasSite = Boolean(lead.website || p?.website);
  const s = data.speed;
  const speedPoints = !hasSite ? 0 : s?.ok ? Math.max(0, Math.min(5, Math.round(s.score / 20))) : 3;
  const website: ScorePart = {
    key: "website",
    label: "Website",
    max: 10,
    points: hasSite ? 5 + speedPoints : 0,
    detail: !hasSite ? "No website" : s?.ok ? `Mobile speed ${s.score}/100` : "Speed check didn't finish",
  };

  // Profile (15): category, location, hours + photos. No town on the listing scores 0 for location (shown as ✗).
  // Hours/photos the provider doesn't report at all get the benefit of the doubt.
  const town = townOf(p?.address);
  const catOk = isTreeService(p?.category);
  const townOk = town != null && sameTown(town, city);
  const extrasOk = p ? p.hasHours !== false && p.hasPhotos !== false : false;
  const tick = (ok: boolean) => (ok ? "✓" : "✗");
  const profile: ScorePart = {
    key: "profile",
    label: "Google profile",
    max: 15,
    points: p ? (catOk ? 5 : 0) + (townOk ? 5 : 0) + (extrasOk ? 5 : 0) : 0,
    detail: !p
      ? "No Google listing found"
      : `${tick(catOk)} Tree service category · ${town ? `${tick(townOk)} In ${city.town}` : "✗ No town shown on listing"} · ${tick(extrasOk)} Hours & photos`,
  };

  const parts = [rank, reviews, rating, website, profile];
  const total = parts.reduce((sum, x) => sum + x.points, 0);
  return { total, color: total < 50 ? "red" : total < 75 ? "orange" : "green", parts };
}
