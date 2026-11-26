// Server-only. Turns the pulled data into plain facts, then has Claude Haiku write the words.
// Every number the email shows in a table comes from `facts`, not from the model.
import { generateText, Output } from "ai";
import { z } from "zod";
import { DEPTH, type Listing, type ReportData, type ReportInput } from "./data";
import { displayNames, isTreeService, sameTown, townOf } from "./place";

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

/** Mobile speed under this is a problem; at or above it, the email just says it's fine. */
export const SLOW_SPEED = 70;

const where = (address: string | null | undefined) => {
  const t = townOf(address);
  return t ? `${t.town}, ${t.state}` : "not shown on the listing";
};

/** The only facts the model is allowed to use. Comparisons and likely reasons are worked out here so it never guesses. */
export function buildFacts(lead: ReportInput, data: ReportData) {
  const top = topCompetitors(data);
  const p = data.profile;
  const { businessName, city } = displayNames(lead, data);
  const reviews = top.map((c) => c.reviews ?? 0);
  const ratings = top.map((c) => c.rating).filter((r): r is number => r != null);
  const most = [...top].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))[0];
  const ranks = data.searches.map((s) => s.leadRank).filter((r): r is number => r != null);
  const outsideTop3 = data.searches.some((s) => s.leadRank == null || s.leadRank > 3);

  const yourTown = townOf(p?.address);
  const inTown = (address: string | null) => {
    const t = townOf(address);
    return t ? sameTown(t, city) : null;
  };
  const topInTown = top.filter((c) => inTown(c.address) === true).length;
  const topTreeService = top.filter((c) => isTreeService(c.category)).length;

  // Concrete, checkable reasons. Only when they're actually behind (outside the top 3 somewhere).
  const likelyReasons: string[] = [];
  if (p && outsideTop3 && yourTown && !sameTown(yourTown, city)) {
    likelyReasons.push(
      `Your Google listing's address is in ${yourTown.town}, ${yourTown.state}, not ${city.label}. Google mostly shows businesses located in the town being searched${
        top.length ? ` (${topInTown} of the top ${top.length} are located in ${city.town})` : ""
      }, so this is likely the main reason you're lower for ${city.town} searches.`,
    );
  }
  if (p && outsideTop3 && !isTreeService(p.category)) {
    likelyReasons.push(
      `Your listing's primary category on Google is ${p.category ? `"${p.category}"` : "not shown"}, not "Tree service"${
        top.length ? `, while ${topTreeService} of the top ${top.length} use "Tree service"` : ""
      }. Google leans on the primary category to decide who shows up for tree searches, so this is likely holding you back.`,
    );
  }

  const speed = data.speed;
  return {
    business_name: businessName,
    city: city.label,
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
          address: p.address ?? "not shown (may be a service-area listing)",
          town: where(p.address),
          in_the_searched_city: yourTown ? sameTown(yourTown, city) : "unknown (no address shown)",
          primary_category: p.category ?? "not shown",
          primary_category_is_tree_service: isTreeService(p.category),
          rating: p.rating ?? "no rating shown",
          review_count: p.reviews ?? 0,
          website_on_listing: p.website ?? "none listed",
        }
      : "We could not find a Google Maps listing that matches this business name in this city.",
    your_website: lead.website ?? "No website given on the form.",
    your_website_mobile_speed: !speed
      ? "Not checked: no website given. Don't mention speed."
      : speed.ok
        ? speed.score < SLOW_SPEED
          ? {
              google_mobile_performance_score_out_of_100: speed.score,
              verdict: `Slow (under ${SLOW_SPEED}). Can be one of the 3 problems.`,
              largest_contentful_paint: speed.lcp,
            }
          : {
              google_mobile_performance_score_out_of_100: speed.score,
              verdict: `Fine (${SLOW_SPEED} or above). NOT a problem. Don't mention speed anywhere: the email already shows one line saying it's fine.`,
            }
        : "The speed check didn't finish. Don't mention speed.",
    top_3_competitors: top.map((c) => ({
      name: c.name,
      map_positions: data.searches.map((s, i) => ({ search: s.keyword, position: c.ranks[i] ?? "not in the top 20" })),
      town: where(c.address),
      located_in_the_searched_city: inTown(c.address) ?? "unknown",
      primary_category: c.category ?? "not shown",
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
      top_3_located_in_the_searched_city: `${topInTown} of ${top.length}`,
      top_3_with_primary_category_tree_service: `${topTreeService} of ${top.length}`,
      your_best_position: ranks.length ? Math.min(...ranks) : "not in the top 20",
    },
    // Left out entirely when empty, so the model has nothing to say "no reasons were found" about.
    ...(likelyReasons.length ? { likely_reasons: likelyReasons } : {}),
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
  whos_beating_you: z
    .string()
    .describe("3 to 5 sentences. If FACTS has likely_reasons, start with those, said plainly. Then compare the top 3 to them using concrete facts: reviews, rating, website, town, category."),
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
- Call the business by business_name and the city by city, exactly as written in FACTS.
- You're writing to the owner, not about your inputs. Never mention FACTS, "the data", field names, or what was or wasn't found or provided. Never write lines like "No likely reasons were found", "here's what the numbers show" or "based on the data provided". Just say the finding.

Explaining why (the "whos_beating_you" section):
- If FACTS has likely_reasons, say each one plainly as the likely reason, before anything else. Keep the town names and category names exactly as written. These usually belong in the 3 problems too.
- Every reason must point to a specific fact: their town vs. the searched city, their primary category, review counts, rating, website. Never write vague lines like "the gap is in how Google ranks your listing", "Google's algorithm", "ranking factors" or "visibility signals".
- If you can't point to a specific fact, compare what the facts show and stop. Don't fill the gap with a vague explanation.

What not to flag:
- Mobile speed: only a problem when its verdict says slow. If the verdict says fine, don't mention speed anywhere.
- Never call a listing name with keywords in it (like "Smith Tree Service & Tree Removal Spring Hill") a problem, theirs or a competitor's, and never suggest renaming the listing.

If found_a_google_listing_at_all is false: lead with that, plainly. When a homeowner in their city searches these terms, their business doesn't show up, and we couldn't find a Google listing under that name at all. That is the biggest finding. Say that if they do have a listing under a different name, they can reply and we'll re-run it. The first problem and fix should be about getting a Google Business Profile set up and verified.

If they have a listing but aren't in the top 20: say they exist on Google but homeowners scrolling the map won't reach them.

Pick the 3 problems from the gaps the facts actually show (for example: listing address in a different town, primary category that isn't "Tree service", far fewer reviews than the competitors, lower rating, no website or no website on the listing, a mobile speed verdict of slow). Most important first; likely_reasons usually come first. The fixes describe what the work looks like in practice, concretely and honestly.`;

// Sentences that talk about the model's inputs or wave at "the algorithm" instead of saying something.
// A safety net under the instructions: any sentence matching one of these never reaches a customer.
const INTERNAL = [
  /likely[_ ]reasons?/i,
  /\bno (specific |clear |obvious |single |other )?(likely )?reasons? (were|was|could be|are|is) (found|identified|given|listed)/i,
  /here'?s what the (numbers|data|facts) (show|say)/i,
  /\b(based on|according to|going by|from) the (facts|data|information|numbers)( (provided|given|above|we have|available))?\b/i,
  /\bthe (facts|data) (provided|given)\b/i,
  /\b(provided|given) (facts|data)\b/i,
  /\bFACTS\b/,
  /\bthe gap is in how google/i,
  /how google ranks your (listing|business)/i,
  /google'?s algorithm/i,
  /\branking (factors|signals)\b/i,
  /\bvisibility signals?\b/i,
];

/** Drop sentences that leak internal phrasing. Splits on sentence ends, not decimals ("4.8 stars"). */
export function scrub(text: string) {
  return text
    .split(/(?<=[.!?]["”')]?)\s+(?=["“(]?[A-Z0-9])/)
    .filter((sentence) => !INTERNAL.some((re) => re.test(sentence)))
    .join(" ")
    .trim();
}

/** Have the model write the report text, then scrub it. Throws if the call fails or the output doesn't match. */
export async function writeReport(facts: Facts): Promise<Written> {
  const { output } = await generateText({
    model: MODEL,
    instructions: INSTRUCTIONS,
    prompt: `FACTS:\n${JSON.stringify(facts, null, 2)}\n\nWrite the report.`,
    output: Output.object({ schema }),
    abortSignal: AbortSignal.timeout(120_000),
  });
  const points = (items: { title: string; detail: string }[]) =>
    items
      .slice(0, 3)
      .map((it) => ({ title: scrub(it.title), detail: scrub(it.detail) }))
      .filter((it) => it.title || it.detail);
  return {
    opening: scrub(output.opening),
    where_you_show_up: scrub(output.where_you_show_up),
    whos_beating_you: scrub(output.whos_beating_you),
    holding_back: points(output.holding_back),
    fixes: points(output.fixes),
  };
}
