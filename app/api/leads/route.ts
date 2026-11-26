import { leadRows, notifyOwner, supabase } from "@/lib/server/leads";

/** Free audit form submissions. Saves the lead, then emails the owner. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const field = (key: string, max = 200) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "");

  // Hidden field real people never fill in. Bots do: pretend it worked and drop it.
  if (field("company")) return Response.json({ ok: true });

  const lead = {
    name: field("name"),
    business_name: field("businessName"),
    email: field("email", 254).toLowerCase(),
    phone: field("phone", 40),
    city: field("city"),
    website: field("website", 500) || null,
  };
  const plan = field("plan");
  const setup = field("setup");

  if (!lead.name || !lead.business_name || !lead.phone || !lead.city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return Response.json({ error: "Please fill in every field with a valid email." }, { status: 400 });
  }

  // Save and email independently: if one fails, the other still captures the lead.
  let saved = false;
  try {
    const { error } = await supabase().from("leads").insert(lead);
    if (error) throw new Error(error.message);
    saved = true;
  } catch (e) {
    console.error("[leads] Supabase insert failed:", e);
  }

  let emailed = false;
  try {
    await notifyOwner(
      `New audit request: ${lead.business_name} (${lead.city})`,
      [
        ...leadRows({ ...lead, status: "new" }),
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
  return Response.json({ ok: true });
}
