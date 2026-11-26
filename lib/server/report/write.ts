// Server-only. Turns the pulled data into plain facts, then has Claude Haiku write the words.
// Every number the email shows in a table comes from `facts`, not from the model.
import { generateText, Output } from "ai";
import { z } from "zod";
import { DEPTH, type Listing, type ReportData, type ReportInput } from "./data";

export const MODEL = "anthropic/claude-haiku-5.5";

/** A competitor with its spot in each search (same order as data.searches; null = not in top 20). */
export type Competitor = Listing & { bestRank: number; ranks: (number | null)[] };

const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Top 3 competitors across both searches, by best map position, then reviews. */
export function topCompetitors(data: ReportData, count = 3): Competitor[] {
  const byName = new Map<string, Listing>();
  for (const s of data.searches) for (const c of s.competitors) if (!byName.has(key(c.name))) byName.set(key(c.name), c);
  return [...byName.values()]
    .map((c) => {
      const ranks = data.searches.map((s) => s.listings.find((l) => key(l.name) === key(c.name))?.rank ?? null);
      return { ...c, ranks, bestRank: Math.min(...ranks.map((r) => r ?? Infinity)) };
    })
    .sort((a, b) => a.bestRank - b.bestRank || (b.reviews ?? 0) - (a.reviews ?? 0))
    .slice(0, count);
}

const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);

/** The only facts the model is allowed to use. Comparisons are worked out here so it never does math. */
export function buildFacts(lead: ReportInput, data: ReportData) {
  const top = topCompetitors(data);
  const p = data.profile;
  const reviews = top.map((c) => c.reviews ?? 0);
  const ratings = top.map((c) => c.rating).filter((r): r is number => r != null);
  const most = [...top].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))[0];
  const ranks = data.searches.map((s) => s.leadRank).filter((r): r is number => r != null);

  return {
    business_name: lead.business_name,
    city: lead.city,
    searches_checked: data.searches.map((s) => s.keyword),
    how_we_searched: `Google Maps, top ${DEPTH} results, searched from the United States in English`,
    found_in_top_20_for_any_search: ranks.length > 0,
    found_a_google_listing_at_all: p != null,
    your_map_positions: data.searches.map((s) => ({
      search: s.keyword,
      your_position: s.leadRank ?? "not in the top 20",
    })),
    your_google_listing: p
      ? {
          name_on_google: p.name,
          rating: p.rating ?? "no rating shown",
          review_count: p.reviews ?? 0,
          category: p.category ?? "not shown",
          website_on_listing: p.website ?? "none listed",
        }
      : "We could not find a Google Maps listing that matches this business name in this city.",
    your_website: lead.website ?? "No website given on the form.",
    your_website_mobile_speed: !data.speed
      ? "Not checked: no website given."
      : data.speed.ok
        ? {
            google_mobile_performance_score_out_of_100: data.speed.score,
            largest_contentful_paint: data.speed.lcp,
            first_contentful_paint: data.speed.fcp,
            total_blocking_time: data.speed.tbt,
          }
        : `The speed check didn't finish (Google's tester said: ${data.speed.error}). Don't guess at the speed.`,
    top_3_competitors: top.map((c) => ({
      name: c.name,
      map_positions: data.searches.map((s, i) => ({ search: s.keyword, position: c.ranks[i] ?? "not in the top 20" })),
      rating: c.rating ?? "no rating shown",
      review_count: c.reviews ?? 0,
      has_website_on_listing: Boolean(c.website),
    })),
    comparisons: {
      your_review_count: p ? (p.reviews ?? 0) : "unknown (no listing found)",
      top_3_average_review_count: avg(reviews),
      top_3_average_rating: avg(ratings),
      competitor_with_most_reviews: most ? { name: most.name, review_count: most.reviews ?? 0 } : null,
      reviews_behind_that_competitor: p && most ? Math.max(0, (most.reviews ?? 0) - (p.reviews ?? 0)) : null,
      top_3_with_a_website: `${top.filter((c) => c.website).length} of ${top.length}`,
      your_best_position: ranks.length ? Math.min(...ranks) : "not in the top 20",
    },
  };
}

export type Facts = ReturnType<typeof buildFacts>;

const point = z.object({
  title: z.string().describe("Short plain heading, under 10 words."),
  detail: z.string().describe("1 to 3 short sentences."),
});

const schema = z.object({
  opening: z.string().describe("1 to 2 sentences: the single most important finding, said plainly."),
  where_you_show_up: z.string().describe("2 to 4 sentences on their map position in each search."),
  whos_beating_you: z.string().describe("3 to 5 sentences comparing the top 3 competitors to them: reviews, rating, website."),
  holding_back: z.array(point).describe("Exactly 3 items: the biggest things holding them back, most important first."),
  fixes: z.array(point).describe("Exactly 3 items, one per problem above, in the same order: what fixing it would look like."),
});

export type Written = z.infer<typeof schema>;

const INSTRUCTIONS = `You write short "Who's Beating Me?" reports for owners of tree service companies. The reader runs crews, not computers. Write like a straight-talking friend who knows Google Maps.

Rules:
- Use ONLY the facts in the FACTS block. Every number you write must appear in FACTS exactly. Never estimate, round differently, or invent numbers, percentages, search volumes, call counts, revenue or timelines.
- No hype. No guarantees or promises about rankings, calls or jobs. Say "would help", "usually", "is likely to", not "will".
- Plain words, short sentences, about an 8th-grade reading level. No jargon. If you must name something technical, say what it means in a few words (for example "how fast the main part of the page shows up").
- Speak to the owner as "you". Name competitors by their actual names.
- Don't sell. Don't mention Arbor Leads, pricing or a call. The email adds its own closing.
- If a fact says something wasn't checked or didn't finish, don't guess at it, and don't make it one of the 3 problems.
- Position 1 is the top of the map. Most people call one of the first 3.

If found_a_google_listing_at_all is false: lead with that, plainly. When a homeowner in their city searches these terms, their business doesn't show up, and we couldn't find a Google listing under that name at all. That is the biggest finding. Say that if they do have a listing under a different name, they can reply and we'll re-run it. The first problem and fix should be about getting a Google Business Profile set up and verified.

If they have a listing but aren't in the top 20: say they exist on Google but homeowners scrolling the map won't reach them.

Pick the 3 problems from the gaps the facts actually show (for example: not in the top 3, far fewer reviews than the competitors, lower rating, no website or no website on the listing, a slow mobile site, a vague category). The fixes describe what the work looks like in practice, concretely and honestly.`;

/** Have the model write the report text. Throws if the call fails or the output doesn't match. */
export async function writeReport(facts: Facts): Promise<Written> {
  const { output } = await generateText({
    model: MODEL,
    instructions: INSTRUCTIONS,
    prompt: `FACTS:\n${JSON.stringify(facts, null, 2)}\n\nWrite the report.`,
    output: Output.object({ schema }),
    abortSignal: AbortSignal.timeout(120_000),
  });
  return { ...output, holding_back: output.holding_back.slice(0, 3), fixes: output.fixes.slice(0, 3) };
}
