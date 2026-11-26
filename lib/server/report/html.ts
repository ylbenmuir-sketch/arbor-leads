// Server-only. The report email. Table layout + inline styles so it holds up in Gmail, Outlook and Apple Mail.
import { escape as esc } from "@/lib/server/leads";
import type { ReportData, ReportInput } from "./data";
import type { Written } from "./write";
import { topCompetitors } from "./write";

const C = {
  page: "#f6f4ee",
  card: "#ffffff",
  ink: "#0e2418",
  body: "#33463a",
  muted: "#6b7a70",
  line: "#e2ddcf",
  sage: "#8db89a",
  soft: "#eef4ef",
  blaze: "#e07a2e",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const rankText = (r: number | null) => (r == null ? "Not in top 20" : `#${r}`);
const num = (n: number | null | undefined) => (n == null ? "–" : n.toLocaleString("en-US"));
const stars = (r: number | null | undefined) => (r == null ? "–" : `${r.toFixed(1)} ★`);

/** Booking URL with Cal.com's name/email pre-fill, like the site's buttons. */
export function bookingLink(lead: ReportInput) {
  const base = process.env.NEXT_PUBLIC_BOOKING_URL;
  if (!base) return null;
  try {
    const url = new URL(base);
    url.searchParams.set("name", lead.name);
    url.searchParams.set("email", lead.email);
    return url.toString();
  } catch {
    return base;
  }
}

function heading(n: number, text: string) {
  return `<tr><td style="padding:28px 0 10px"><p style="margin:0;font:700 12px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${C.muted}">${n} of 4</p><h2 style="margin:4px 0 0;font:800 21px/1.3 ${FONT};color:${C.ink}">${esc(text)}</h2></td></tr>`;
}
const para = (text: string) => `<tr><td style="padding:8px 0 0;font:400 16px/1.6 ${FONT};color:${C.body}">${esc(text)}</td></tr>`;

function list(items: { title: string; detail: string }[]) {
  return items
    .map(
      (it, i) => `<tr><td style="padding:12px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="34" valign="top" style="padding-top:1px"><div style="width:26px;height:26px;border-radius:13px;background:${C.ink};color:#fff;font:800 14px/26px ${FONT};text-align:center">${i + 1}</div></td>
<td valign="top" style="font:400 16px/1.55 ${FONT};color:${C.body}"><strong style="color:${C.ink}">${esc(it.title)}</strong><br>${esc(it.detail)}</td>
</tr></table></td></tr>`,
    )
    .join("");
}

const th = (t: string, align = "left") =>
  `<th class="c" align="${align}" style="padding:8px 5px;font:700 11px/1.3 ${FONT};color:${C.muted};border-bottom:2px solid ${C.line};text-transform:uppercase;letter-spacing:.04em">${t}</th>`;
const td = (t: string, align = "left", strong = false) =>
  `<td class="c" align="${align}" style="padding:10px 5px;font:${strong ? 700 : 400} 15px/1.35 ${FONT};color:${C.ink};border-bottom:1px solid ${C.line}${align === "left" ? "" : ";white-space:nowrap"}">${t}</td>`;

function rankTable(data: ReportData) {
  const rows = data.searches
    .map((s) => `<tr>${td(`“${esc(s.keyword)}”`)}${td(rankText(s.leadRank), "right", true)}</tr>`)
    .join("");
  return `<tr><td style="padding:12px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>${th("Google Maps search")}${th("Your spot", "right")}</tr>${rows}</table></td></tr>`;
}

/** "tree service Austin" → "tree service": the search without the city, for column headers. */
const shortSearch = (keyword: string, city: string) => keyword.replace(city, "").trim();
const spot = (r: number | null) => (r == null ? `<span style="color:${C.muted}">–</span>` : `#${r}`);

function competitorTable(lead: ReportInput, data: ReportData) {
  const top = topCompetitors(data);
  const p = data.profile;
  const you = `<tr style="background:${C.soft}">${td(`<strong>You</strong><br><span style="color:${C.muted};font-size:13px">${esc(lead.business_name)}</span>`)}${data.searches
    .map((s) => td(spot(s.leadRank), "center", true))
    .join("")}${td(p ? stars(p.rating) : "–", "center")}${td(p ? num(p.reviews ?? 0) : "–", "center")}${td(lead.website || p?.website ? "Yes" : "No", "center")}</tr>`;
  const rows = top
    .map(
      (c) =>
        `<tr>${td(esc(c.name))}${c.ranks.map((r) => td(spot(r), "center", true)).join("")}${td(stars(c.rating), "center")}${td(num(c.reviews ?? 0), "center")}${td(c.website ? "Yes" : "No", "center")}</tr>`,
    )
    .join("");
  const searchHeads = data.searches.map((s) => th(esc(shortSearch(s.keyword, lead.city)), "center")).join("");
  return `<tr><td style="padding:12px 0 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>${th("Business")}${searchHeads}${th("Rating", "center")}${th("Reviews", "center")}${th("Site", "center")}</tr>${you}${rows}</table><p style="margin:8px 0 0;font:400 13px/1.4 ${FONT};color:${C.muted}">Map spot in each search. – means not in the top 20.</p></td></tr>`;
}

function speedLine(data: ReportData) {
  const s = data.speed;
  if (!s) return "";
  const text = s.ok
    ? `Your website's mobile speed score from Google: <strong style="color:${C.ink}">${s.score} / 100</strong>${s.lcp ? ` (main content shows up in ${esc(s.lcp)})` : ""}.`
    : `We tried to test your website's mobile speed, but Google's tester couldn't finish it.`;
  return `<tr><td style="padding:12px 0 0;font:400 15px/1.55 ${FONT};color:${C.body}">${text}</td></tr>`;
}

export function renderReportHtml(lead: ReportInput, data: ReportData, w: Written, sentAt = new Date()) {
  const book = bookingLink(lead);
  const date = sentAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const cta = book
    ? `<tr><td align="center" style="padding:32px 0 6px"><a href="${esc(book)}" style="display:inline-block;background:${C.blaze};color:${C.ink};font:800 17px/1 ${FONT};text-decoration:none;padding:18px 28px;border-radius:8px">Book a 15-min call to walk through it.</a></td></tr>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light">
<style>@media (max-width:480px){.pad{padding-left:16px!important;padding-right:16px!important}.c{padding-left:3px!important;padding-right:3px!important;font-size:13px!important}th.c{font-size:10px!important}}</style><title>Who's Beating Me? ${esc(lead.business_name)}</title></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden">${esc(w.opening)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:24px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border-radius:12px;border:1px solid ${C.line}">
<tr><td class="pad" style="background:${C.ink};border-radius:12px 12px 0 0;padding:26px 28px">
<p style="margin:0;font:700 12px/1.4 ${FONT};letter-spacing:.16em;text-transform:uppercase;color:${C.sage}">Who's Beating Me? Report</p>
<h1 style="margin:6px 0 0;font:800 26px/1.25 ${FONT};color:#f6f4ee">${esc(lead.business_name)}</h1>
<p style="margin:4px 0 0;font:400 15px/1.4 ${FONT};color:#b7c3b8">${esc(lead.city)} · ${date}</p>
</td></tr>
<tr><td class="pad" style="padding:8px 28px 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:22px 0 0;font:600 18px/1.5 ${FONT};color:${C.ink}">${esc(w.opening)}</td></tr>
${heading(1, "Where you show up right now")}
${rankTable(data)}
${para(w.where_you_show_up)}
${heading(2, "Who's beating you, and why")}
${competitorTable(lead, data)}
${para(w.whos_beating_you)}
${speedLine(data)}
${heading(3, "3 biggest things holding you back")}
${list(w.holding_back)}
${heading(4, "What fixing them would look like")}
${list(w.fixes)}
${cta}
<tr><td style="padding:22px 0 0;font:400 15px/1.55 ${FONT};color:${C.body}">Questions? Just reply to this email.</td></tr>
</table></td></tr>
</table>
<p style="max-width:600px;margin:16px auto 0;font:400 12px/1.5 ${FONT};color:${C.muted}">How we got this: on ${date} we searched Google Maps for ${data.searches
    .map((s) => `“${esc(s.keyword)}”`)
    .join(" and ")} (top 20 results, searched from the United States) and ran your site through Google PageSpeed Insights on mobile. Map spots shift day to day and depend on where someone searches from, so treat these as a snapshot.<br><br>Arbor Leads · arborleads.co</p>
</td></tr></table>
</body></html>`;
}

/** Plain-text version for email clients that don't show HTML. */
export function renderReportText(lead: ReportInput, data: ReportData, w: Written) {
  const top = topCompetitors(data);
  const book = bookingLink(lead);
  return [
    `Who's Beating Me? Report: ${lead.business_name} (${lead.city})`,
    "",
    w.opening,
    "",
    "1. WHERE YOU SHOW UP RIGHT NOW",
    ...data.searches.map((s) => `- "${s.keyword}": ${rankText(s.leadRank)}`),
    w.where_you_show_up,
    "",
    "2. WHO'S BEATING YOU, AND WHY",
    ...top.map(
      (c) =>
        `- ${c.name}: ${data.searches.map((s, i) => `"${s.keyword}" ${rankText(c.ranks[i])}`).join(", ")}; ${stars(c.rating)}, ${num(c.reviews ?? 0)} reviews, website: ${c.website ? "yes" : "no"}`,
    ),
    w.whos_beating_you,
    "",
    "3. 3 BIGGEST THINGS HOLDING YOU BACK",
    ...w.holding_back.map((p, i) => `${i + 1}. ${p.title}: ${p.detail}`),
    "",
    "4. WHAT FIXING THEM WOULD LOOK LIKE",
    ...w.fixes.map((p, i) => `${i + 1}. ${p.title}: ${p.detail}`),
    "",
    ...(book ? [`Book a 15-min call to walk through it: ${book}`, ""] : []),
    "Questions? Just reply to this email.",
    "",
    "Arbor Leads · arborleads.co",
  ].join("\n");
}
