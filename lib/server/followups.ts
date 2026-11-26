// Server-only. Follow-up emails for leads who got their report but haven't booked a call:
// day 2, day 5 and day 10 after the report. Run once a day by the Vercel Cron job (app/api/cron/followups).
// OFF by default: emails only go out when FOLLOWUP_ENABLED=true AND LEAD_FROM_EMAIL is set. Otherwise it only logs.
import { escape, ownerEmails, sendEmail, siteUrl, supabase } from "@/lib/server/leads";
import { bookingLink } from "@/lib/server/report/html";

const DAY = 24 * 60 * 60 * 1000;

/** Which email goes out on which day after the report. */
export const STEPS = [
  { step: 1, day: 2 },
  { step: 2, day: 5 },
  { step: 3, day: 10 },
] as const;

/** Only look at reports this recent. A couple of days past the last step, in case a daily run was missed. */
const WINDOW_DAYS = 12;
/** Most emails one run sends, so a run always finishes inside the function's time limit. */
const MAX_PER_RUN = 60;

export const stepLabel = (step: number) => `Day ${STEPS.find((s) => s.step === step)?.day ?? "?"}`;

/** Is sending switched on? Both settings are needed, so nothing goes out by accident. */
export function followupsEnabled() {
  const reasons: string[] = [];
  if (process.env.FOLLOWUP_ENABLED !== "true") reasons.push("FOLLOWUP_ENABLED is not \"true\"");
  if (!process.env.LEAD_FROM_EMAIL) reasons.push("LEAD_FROM_EMAIL is not set");
  if (!process.env.NEXT_PUBLIC_BOOKING_URL) reasons.push("NEXT_PUBLIC_BOOKING_URL is not set");
  return { on: reasons.length === 0, reasons };
}

/** The biggest issue in their report, and (when the report had one) what fixing it looks like. */
type Issue = { title: string; detail: string; fix?: string };

export type FollowupInput = {
  name: string;
  email: string;
  businessName: string;
  score: number | null;
  issue: Issue | null;
  unsubscribeToken: string;
};

/** Calendar days (UTC) between two dates: a report on Monday afternoon is "2 days" old on Wednesday morning. */
const calendarDays = (from: Date, to: Date) => Math.round((Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()) - Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())) / DAY);

const sentence = (s: string) => {
  const t = s.trim();
  return t && !/[.!?]$/.test(t) ? `${t}.` : t;
};

/** The three emails. Plain, short, from Ben. Every number comes from their report. */
export function composeFollowup(step: number, lead: FollowupInput) {
  const first = lead.name.trim().split(/\s+/)[0] || "there";
  const business = lead.businessName;
  const book = bookingLink({ name: lead.name, email: lead.email, business_name: business, city: "", website: null }) ?? "";
  const score = lead.score != null ? `${lead.score} out of 100` : null;
  const issueTitle = lead.issue ? sentence(lead.issue.title) : null;
  const issueDetail = lead.issue ? lead.issue.detail.trim() : "";

  let subject: string;
  let paragraphs: string[];

  if (step === 1) {
    subject = score ? `Your Google score: ${lead.score}/100` : `Your Google report for ${business}`;
    paragraphs = [
      `Hi ${first},`,
      `It's Ben from Arbor Leads. A couple of days ago I sent you the Who's Beating Me report for ${business}.`,
      [score && `You scored ${score}.`, issueTitle && `The biggest thing holding you back right now: ${issueTitle}`].filter(Boolean).join(" "),
      issueDetail,
      `If you'd like to go through it together, you can grab 15 minutes on my calendar here:\n${book}`,
      `Or just reply to this email with any questions.`,
    ];
  } else if (step === 2) {
    subject = `The first thing I'd fix for ${business}`;
    paragraphs = [
      `Hi ${first},`,
      issueTitle
        ? `Following up on your Google report. Out of everything in it, this is what I'd work on first: ${issueTitle}`
        : `Following up on your Google report${score ? `, where ${business} scored ${score}` : ""}.`,
      lead.issue?.fix ? `What fixing it looks like: ${lead.issue.fix.trim()}` : issueDetail,
      `Some of this you can do on your own. If you'd like a second set of eyes on it, here's my calendar:\n${book}`,
    ];
  } else {
    subject = `Last note about your Google report`;
    paragraphs = [
      `Hi ${first},`,
      `This is my last email about your Who's Beating Me report.${score ? ` ${business} scored ${score}${issueTitle ? `, and the biggest gap was this: ${issueTitle}` : "."}` : ""}`,
      `I ran a tree company for years, so I know how little time there is for this stuff. If you ever want to go over it, my calendar is here:\n${book}`,
      `Or reply any time and I'll get back to you.`,
    ];
  }

  paragraphs = paragraphs.filter((p) => p.trim());
  const unsubscribe = `${siteUrl()}/unsubscribe?t=${encodeURIComponent(lead.unsubscribeToken)}`;
  const signature = ["Ben Muir", "Arbor Leads"];
  const footer = `You're getting this because you asked for a free Google report at arborleads.co. Don't want these emails? Unsubscribe: ${unsubscribe}`;

  const text = [...paragraphs, signature.join("\n"), `--\n${footer}`].join("\n\n");

  // Plain HTML: no images, no buttons, just like a normal email. Links are written out so they're easy to see.
  const linkify = (s: string) => escape(s).replace(/(https?:\/\/[^\s<]+)/g, (url) => `<a href="${url}" style="color:#1F4D35">${url}</a>`);
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#1d1d1d;max-width:560px">${[
    ...paragraphs,
    signature.join("\n"),
  ]
    .map((p) => `<p style="margin:0 0 16px">${linkify(p).replace(/\n/g, "<br>")}</p>`)
    .join("")}<p style="margin:28px 0 0;font-size:13px;color:#777">You're getting this because you asked for a free Google report at arborleads.co. Don't want these emails? <a href="${escape(unsubscribe)}" style="color:#777">Unsubscribe</a>.</p></div>`;

  const oneClick = `${siteUrl()}/api/unsubscribe?t=${encodeURIComponent(lead.unsubscribeToken)}`;
  return {
    subject,
    text,
    html,
    // Lets Gmail/Apple Mail show their own "Unsubscribe" button (one click, RFC 8058).
    headers: { "List-Unsubscribe": `<${oneClick}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}

type ReportRow = {
  id: string;
  lead_id: string;
  created_at: string;
  score: number | null;
  holding_back: { title?: string; detail?: string }[] | null;
  fixes: { title?: string; detail?: string }[] | null;
  parts: { label: string; points: number; max: number; detail: string }[] | null;
};

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  business_name: string | null;
  status: string;
  booked_at: string | null;
  unsubscribed_at: string | null;
  unsubscribe_token: string;
};

export type FollowupResult = {
  mode: "send" | "dry-run";
  notSendingBecause: string[];
  checked: number;
  sent: { email: string; step: number; subject: string }[];
  wouldSend: { email: string; step: number; subject: string }[];
  skipped: { email: string; reason: string }[];
  errors: { email: string; error: string }[];
};

/** The biggest issue from their report: what the report itself put first, or else the score part they lost most points on. */
function biggestIssue(r: ReportRow): Issue | null {
  const i = Array.isArray(r.holding_back) ? r.holding_back.findIndex((h) => h?.title) : -1;
  if (i >= 0) {
    const fix = Array.isArray(r.fixes) ? r.fixes[i]?.detail : undefined;
    return { title: r.holding_back![i].title!, detail: r.holding_back![i].detail ?? "", fix };
  }
  const worst = (r.parts ?? []).filter((p) => p.max - p.points > 0).sort((a, b) => b.max - b.points - (a.max - a.points))[0];
  return worst ? { title: `${worst.label}: ${worst.detail}`, detail: "" } : null;
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** One daily run: works out who's due which email, and sends it (or, when switched off, logs it). */
export async function runFollowups(now = new Date()): Promise<FollowupResult> {
  const { on, reasons } = followupsEnabled();
  const result: FollowupResult = { mode: on ? "send" : "dry-run", notSendingBecause: reasons, checked: 0, sent: [], wouldSend: [], skipped: [], errors: [] };
  const db = supabase();
  const since = new Date(now.getTime() - (WINDOW_DAYS + 1) * DAY).toISOString();

  // Reports that were actually emailed, newest first. Score and issues come from raw_data, which every sent report has.
  const { data: reports, error: reportError } = await db
    .from("reports")
    .select("id, lead_id, created_at, score:raw_data->score->total, parts:raw_data->score->parts, holding_back:raw_data->ai->output->holding_back, fixes:raw_data->ai->output->fixes")
    .eq("status", "sent")
    .not("lead_id", "is", null)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .overrideTypes<ReportRow[], { merge: false }>();
  if (reportError) throw new Error(`Loading reports: ${reportError.message}`);
  if (!reports?.length) return result;

  const leadCols = "id, name, email, business_name, status, booked_at, unsubscribed_at, unsubscribe_token";
  const { data: reportLeads, error: leadError } = await db
    .from("leads")
    .select(leadCols)
    .in("id", [...new Set(reports.map((r) => r.lead_id))])
    .overrideTypes<LeadRow[], { merge: false }>();
  if (leadError) throw new Error(`Loading leads (has supabase/migrations/20261126040000_followups.sql been run?): ${leadError.message}`);
  const leadById = new Map((reportLeads ?? []).map((l) => [l.id, l]));
  const emails = [...new Set((reportLeads ?? []).map((l) => l.email?.toLowerCase()).filter((e): e is string => Boolean(e)))];
  if (!emails.length) return result;

  // Booked or unsubscribed under ANY lead with the same email counts (people sometimes fill in the form twice).
  const [{ data: sameEmail, error: sameError }, { data: done, error: doneError }] = await Promise.all([
    db.from("leads").select("email, status, booked_at, unsubscribed_at").in("email", emails),
    db.from("lead_followups").select("email, step").in("email", emails).gte("created_at", since),
  ]);
  if (sameError) throw new Error(`Loading leads by email: ${sameError.message}`);
  if (doneError) throw new Error(`Loading sent follow-ups (has supabase/migrations/20261126040000_followups.sql been run?): ${doneError.message}`);

  const stopped = new Map<string, string>();
  for (const l of sameEmail ?? []) {
    const e = (l.email as string).toLowerCase();
    if (l.status === "booked" || l.booked_at) stopped.set(e, "booked a call");
    else if (l.unsubscribed_at && !stopped.has(e)) stopped.set(e, "unsubscribed");
  }
  const highestSent = new Map<string, number>();
  for (const f of done ?? []) {
    const e = (f.email as string).toLowerCase();
    highestSent.set(e, Math.max(highestSent.get(e) ?? 0, f.step as number));
  }

  // One sequence per email address, anchored on their newest report.
  const seen = new Set<string>();
  let sentThisRun = 0;
  for (const report of reports) {
    const lead = leadById.get(report.lead_id);
    const email = lead?.email?.toLowerCase();
    if (!lead || !email || seen.has(email)) continue;
    seen.add(email);
    result.checked++;

    const why = stopped.get(email);
    if (why) {
      result.skipped.push({ email, reason: why });
      continue;
    }
    const age = calendarDays(new Date(report.created_at), now);
    // The latest step whose day has come. If a run was missed, the skipped step is dropped rather than sending two at once.
    const due = [...STEPS].reverse().find((s) => age >= s.day);
    if (!due) continue;
    if ((highestSent.get(email) ?? 0) >= due.step) continue;
    if (sentThisRun >= MAX_PER_RUN) {
      result.skipped.push({ email, reason: "run limit reached, will go tomorrow" });
      continue;
    }

    const message = composeFollowup(due.step, {
      name: lead.name ?? "",
      email,
      businessName: lead.business_name ?? "your business",
      score: typeof report.score === "number" ? report.score : null,
      issue: biggestIssue(report),
      unsubscribeToken: lead.unsubscribe_token,
    });
    const entry = { email, step: due.step, subject: message.subject };

    if (!on) {
      console.log(`[followups] DRY RUN (${reasons.join("; ")}). Would send ${stepLabel(due.step)} email to ${email}: "${message.subject}"\n${message.text}`);
      result.wouldSend.push(entry);
      continue;
    }

    // Claim the step first: the unique (lead_id, step) means two overlapping runs can't both send it.
    const { data: claim, error: claimError } = await db
      .from("lead_followups")
      .insert({ lead_id: lead.id, report_id: report.id, email, step: due.step, status: "sending", subject: message.subject })
      .select("id")
      .single();
    if (claimError || !claim) {
      result.skipped.push({ email, reason: `already claimed (${claimError?.message ?? "no row"})` });
      continue;
    }
    try {
      await sendEmail({ to: email, subject: message.subject, html: message.html, text: message.text, replyTo: ownerEmails(), headers: message.headers });
      await db.from("lead_followups").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", claim.id);
      result.sent.push(entry);
      sentThisRun++;
      console.log(`[followups] Sent ${stepLabel(due.step)} email to ${email}`);
    } catch (e) {
      // Free the step so tomorrow's run can try again.
      await db.from("lead_followups").delete().eq("id", claim.id);
      const error = e instanceof Error ? e.message : String(e);
      console.error(`[followups] Sending to ${email} failed:`, error);
      result.errors.push({ email, error });
    }
    await pause(600); // stay under Resend's rate limit
  }

  return result;
}
