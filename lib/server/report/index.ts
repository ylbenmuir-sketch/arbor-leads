// Server-only. Builds and sends a "Who's Beating Me?" report. Runs in the background after an audit form lead.
// Never throws: any failure marks the report `failed` and emails the owner so the lead doesn't fall through.
import { leadRows, notifyOwner, ownerEmails, sendEmail, supabase } from "@/lib/server/leads";
import { pullReportData, type ReportData, type ReportInput } from "./data";
import { renderReportHtml, renderReportText } from "./html";
import { displayNames } from "./place";
import { presenceScore } from "./score";
import { buildFacts, MODEL, writeReport, type Facts, type Written } from "./write";

const message = (e: unknown) => (e instanceof Error ? e.message : String(e));

export async function buildAndSendReport(lead: ReportInput, leadId: string | null) {
  const raw: Record<string, unknown> = { input: lead, started_at: new Date().toISOString() };
  const db = supabase();

  // Saving the row is best effort: a database hiccup shouldn't stop the lead getting their report.
  let reportId: string | null = null;
  try {
    const { data, error } = await db.from("reports").insert({ lead_id: leadId, status: "building", raw_data: raw }).select("id").single();
    if (error) throw new Error(error.message);
    reportId = data.id;
  } catch (e) {
    console.error("[report] Couldn't create the reports row:", e);
  }

  type Fields = { status: string; raw_data: unknown; report_html?: string; score?: number; score_breakdown?: unknown };
  const write = async (fields: Fields) => {
    const { error } = reportId
      ? await db.from("reports").update(fields).eq("id", reportId)
      : await db.from("reports").insert({ lead_id: leadId, ...fields });
    if (error) throw new Error(error.message);
  };
  const save = async (fields: Fields) => {
    try {
      await write(fields);
    } catch (e) {
      // Most likely the score columns migration hasn't been run yet. Save the rest (the score is in raw_data too).
      if ("score" in fields) {
        console.error("[report] Saving with the score failed, retrying without it:", e);
        const { score: _s, score_breakdown: _b, ...rest } = fields;
        try {
          await write(rest);
          return;
        } catch (e2) {
          e = e2;
        }
      }
      console.error("[report] Couldn't save the report:", e);
    }
  };

  let step = "pulling Google Maps and PageSpeed data";
  try {
    const data: ReportData = await pullReportData(lead);
    raw.provider = data.provider;
    raw.searches = data.searches;
    raw.lead_profile = data.profile;
    raw.lookup = { keyword: data.lookupKeyword, rawItems: data.lookupRawItems };
    raw.pagespeed = data.speed;
    const score = presenceScore(lead, data);
    raw.score = score;

    step = "writing the report";
    const facts: Facts = buildFacts(lead, data);
    raw.facts = facts;
    const written: Written = await writeReport(facts);
    raw.ai = { model: MODEL, output: written };

    const html = renderReportHtml(lead, data, written, score);
    const text = renderReportText(lead, data, written, score);
    const subject = `Your Who's Beating Me report for ${displayNames(lead, data).businessName}`;

    step = "emailing the report to the lead";
    await sendEmail({ to: lead.email, subject, html, text, replyTo: ownerEmails() });
    raw.sent_at = new Date().toISOString();

    // The lead has it. A failed copy to the owner is logged, not a failed report.
    // No copy when the lead is the owner (testing with your own address): you already got it.
    const owners = ownerEmails();
    if (owners.some((o) => o.toLowerCase() === lead.email.toLowerCase())) {
      raw.owner_copy = "skipped: the lead's email is LEAD_NOTIFY_EMAIL";
    } else {
      try {
        await sendEmail({ to: owners, subject: `Copy: ${subject}`, html, text, replyTo: lead.email });
      } catch (e) {
        console.error("[report] Owner copy failed:", e);
        raw.owner_copy_error = message(e);
      }
    }

    await save({ status: "sent", raw_data: raw, report_html: html, score: score.total, score_breakdown: score.parts });
  } catch (e) {
    console.error(`[report] Failed while ${step}:`, e);
    raw.error = `Failed while ${step}: ${message(e)}`;
    raw.failed_at = new Date().toISOString();
    await save({ status: "failed", raw_data: raw });
    try {
      await notifyOwner(
        `Report FAILED: ${lead.business_name} (${lead.city})`,
        [
          ["What happened", `The Who's Beating Me report was not sent. It failed while ${step}.`],
          ["Error", message(e)],
          ["Next step", "Send them a report by hand, or fix the error and re-submit the form with their details."],
          ...leadRows({ ...lead, status: "new" }),
          ["Report ID", reportId],
        ],
        lead.email,
      );
    } catch (mailError) {
      console.error("[report] Failure notice email also failed:", mailError);
    }
  }
}
