// Server-only. The Google Presence Score (0–100), worked out in code from the pulled data. The AI never touches it.
import type { ReportData, ReportInput } from "./data";
import { displayNames, isTreeService, sameTown, townOf } from "./place";
import { topCompetitors } from "./write";

export type ScorePart = { key: "rank" | "reviews" | "rating" | "website" | "profile"; label: string; points: number; max: number; detail: string };
export type PresenceScore = { total: number; color: "red" | "orange" | "green"; parts: ScorePart[] };

export function presenceScore(lead: ReportInput, data: ReportData): PresenceScore {
  const p = data.profile;
  const { city } = displayNames(lead, data);

  // Map rank (40): best spot across both searches.
  const ranks = data.searches.map((s) => s.leadRank).filter((r): r is number => r != null);
  const best = ranks.length ? Math.min(...ranks) : null;
  const rank: ScorePart = {
    key: "rank",
    label: "Map rank",
    max: 40,
    points: best == null ? 0 : best <= 3 ? 40 : best <= 10 ? 25 : 10,
    detail: best == null ? "Not in the top 20" : `Best spot: #${best}`,
  };

  // Reviews (20): theirs vs the top 3 competitors' average, scaled. Equal or more = 20.
  const top = topCompetitors(data);
  const avg = top.length ? top.reduce((sum, c) => sum + (c.reviews ?? 0), 0) / top.length : 0;
  const mine = p?.reviews ?? 0;
  const reviews: ScorePart = {
    key: "reviews",
    label: "Reviews",
    max: 20,
    points: !p ? 0 : avg <= 0 || mine >= avg ? 20 : Math.round((20 * mine) / avg),
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

  // Website (15): 5 for having one, plus mobile speed score / 10. A speed check that didn't finish counts as 5 of 10.
  const hasSite = Boolean(lead.website || p?.website);
  const s = data.speed;
  const speedPoints = !hasSite ? 0 : s?.ok ? Math.max(0, Math.min(10, Math.round(s.score / 10))) : 5;
  const website: ScorePart = {
    key: "website",
    label: "Website",
    max: 15,
    points: hasSite ? 5 + speedPoints : 0,
    detail: !hasSite ? "No website" : s?.ok ? `Mobile speed ${s.score}/100` : "Speed check didn't finish",
  };

  // Profile (15): category, location, hours + photos. Anything the data doesn't show is given the benefit of the doubt.
  const town = townOf(p?.address);
  const catOk = isTreeService(p?.category);
  const townOk = !town || sameTown(town, city);
  const extrasOk = p ? p.hasHours !== false && p.hasPhotos !== false : false;
  const tick = (ok: boolean) => (ok ? "✓" : "✗");
  const profile: ScorePart = {
    key: "profile",
    label: "Google profile",
    max: 15,
    points: p ? (catOk ? 5 : 0) + (townOk ? 5 : 0) + (extrasOk ? 5 : 0) : 0,
    detail: !p
      ? "No Google listing found"
      : `${tick(catOk)} Tree service category · ${tick(townOk)} In ${city.town} · ${tick(extrasOk)} Hours & photos`,
  };

  const parts = [rank, reviews, rating, website, profile];
  const total = parts.reduce((sum, x) => sum + x.points, 0);
  return { total, color: total < 50 ? "red" : total < 75 ? "orange" : "green", parts };
}
