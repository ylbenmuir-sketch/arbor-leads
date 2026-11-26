import { after } from "next/server";
import { leadRows, notifyOwner, supabase } from "@/lib/server/leads";
import { buildAndSendReport } from "@/lib/server/report";
import { formatCity } from "@/lib/server/report/place";

// The report builds after the response is sent, inside this function's time limit.
// 300s is the most Vercel's Hobby plan allows; a report usually takes under 2 minutes.
export const maxDuration = 300;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Columns added by supabase/migrations/20261126030000_two_step_form.sql. If that hasn't been run yet,
// saves are retried without them so no lead is lost.
const NEW_COLUMNS = ["place_id", "state", "address", "category", "updated_at"] as const;
const withoutNewColumns = (row: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(row).filter(([k]) => !(NEW_COLUMNS as readonly string[]).includes(k)));

async function insertLead(row: Record<string, unknown>) {
  const db = supabase();
  let { data, error } = await db.from("leads").insert(row).select("id").single();
  if (error) {
    console.error("[leads] Insert failed, retrying without the new columns:", error.message);
    ({ data, error } = await db.from("leads").insert(withoutNewColumns(row)).select("id").single());
  }
  if (error || !data) throw new Error(error?.message ?? "No row returned");
  return data.id as string;
}

/** Updates the row only while it's still partial, so an old link can never overwrite a finished or booked lead. Null if nothing matched. */
async function updatePartial(id: string, row: Record<string, unknown>) {
  const db = supabase();
  let { data, error } = await db.from("leads").update(row).eq("id", id).eq("status", "partial").select("id").maybeSingle();
  if (error) {
    console.error("[leads] Update failed, retrying without the new columns:", error.message);
    ({ data, error } = await db.from("leads").update(withoutNewColumns(row)).eq("id", id).eq("status", "partial").select("id").maybeSingle());
  }
  if (error) throw new Error(error.message);
  return (data?.id as string | undefined) ?? null;
}

/**
 * Free audit form. Two steps:
 *  - step "business": saves a partial lead (status 'partial') and returns its id.
 *  - step "contact": fills in that same row (status 'new'), emails the owner, then builds their report in the background.
 * A request with no step is treated like "contact" (the old one-step form).
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const field = (key: string, max = 200) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "");

  // Hidden field real people never fill in. Bots do: pretend it worked and drop it.
  if (field("company")) return Response.json({ ok: true, leadId: null });

  const step = field("step") === "business" ? "business" : "contact";
  const leadId = UUID.test(field("leadId")) ? field("leadId") : null;

  // "spring hill tn" / "Spring Hill" + "TN" → town "Spring Hill", state "TN".
  const cityInput = [field("city"), field("state", 40)].filter(Boolean).join(", ");
  const city = cityInput ? formatCity(cityInput) : null;
  const business = {
    business_name: field("businessName"),
    city: city?.town ?? "",
    state: city?.state ?? null,
    website: field("website", 500) || null,
    place_id: field("placeId", 300) || null,
    address: field("address", 300) || null,
    category: field("category", 100) || null,
  };

  if (!business.business_name || !business.city) {
    return Response.json({ error: "Please add your business name and city." }, { status: 400 });
  }

  // ── Step 1: save what we have. Never block the visitor: if this fails, step 2 saves the whole lead. ──
  if (step === "business") {
    const row = { ...business, status: "partial", updated_at: new Date().toISOString() };
    try {
      // Went back and changed the business? Update the same partial row instead of making another.
      const id = (leadId && (await updatePartial(leadId, row))) || (await insertLead(row));
      return Response.json({ ok: true, leadId: id });
    } catch (e) {
      console.error("[leads] Partial lead save failed:", e);
      return Response.json({ ok: true, leadId: null });
    }
  }

  // ── Step 2: the full lead. ──
  const lead = {
    ...business,
    name: field("name"),
    email: field("email", 254).toLowerCase(),
    phone: field("phone", 40) || null,
    status: "new",
    updated_at: new Date().toISOString(),
  };
  const plan = field("plan");
  const setup = field("setup");

  if (!lead.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return Response.json({ error: "Please add your name and a valid email." }, { status: 400 });
  }

  // Save and email independently: if one fails, the other still captures the lead.
  let saved = false;
  let savedId: string | null = null;
  try {
    savedId = (leadId && (await updatePartial(leadId, lead))) || (await insertLead(lead));
    saved = true;
  } catch (e) {
    console.error("[leads] Supabase save failed:", e);
  }

  let emailed = false;
  try {
    await notifyOwner(
      `New audit request: ${lead.business_name} (${city?.label ?? lead.city})`,
      [
        ...leadRows(lead),
        ["Plan picked", plan],
        ["Setup picked", setup],
        ["Saved to Supabase", saved ? "Yes" : "NO, save failed. Add this lead by hand."],
      ],
      lead.email,
    );
    emailed = true;
  } catch (e) {
    console.error("[leads] Notification email failed:", e);
  }

  if (!saved && !emailed) {
    return Response.json({ error: "Something went wrong on our end. Please try again, or email us." }, { status: 500 });
  }

  // The visitor gets their answer now; the report is built and emailed after the response.
  const reportInput = {
    name: lead.name,
    business_name: lead.business_name,
    email: lead.email,
    city: city?.label ?? lead.city,
    website: lead.website,
    place_id: lead.place_id,
  };
  after(() => buildAndSendReport(reportInput, savedId));
  return Response.json({ ok: true });
}
