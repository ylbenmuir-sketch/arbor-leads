import { supabase } from "@/lib/server/leads";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Unsubscribe from follow-up emails. Two ways in, both POST:
 *  - the button on /unsubscribe (redirects back there with ?done=1)
 *  - the one-click "Unsubscribe" button Gmail/Apple Mail show (RFC 8058; just needs a 200)
 * Stops follow-ups to that email address for every lead that has it.
 * No GET on purpose: email scanners open links, and that mustn't unsubscribe anyone.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  let form: FormData | null = null;
  try {
    form = await request.formData();
  } catch {
    // One-click senders always send a form body, but don't fail if one doesn't.
  }
  const token = url.searchParams.get("t") ?? String(form?.get("t") ?? "");
  const fromPage = form?.get("from") === "page";
  const back = (query: string) => Response.redirect(new URL(`/unsubscribe?${query}`, url), 303);

  if (!UUID.test(token)) return fromPage ? back("error=1") : Response.json({ error: "Invalid link." }, { status: 400 });

  try {
    const db = supabase();
    const { data: lead, error } = await db.from("leads").select("id, email").eq("unsubscribe_token", token).maybeSingle();
    if (error) throw new Error(error.message);
    if (lead) {
      const now = new Date().toISOString();
      const { error: updateError } = lead.email
        ? await db.from("leads").update({ unsubscribed_at: now }).eq("email", lead.email).is("unsubscribed_at", null)
        : await db.from("leads").update({ unsubscribed_at: now }).eq("id", lead.id);
      if (updateError) throw new Error(updateError.message);
      console.log(`[unsubscribe] ${lead.email ?? lead.id} unsubscribed`);
    }
  } catch (e) {
    console.error("[unsubscribe] Failed:", e);
    return fromPage ? back(`t=${encodeURIComponent(token)}&error=1`) : Response.json({ error: "Something went wrong." }, { status: 500 });
  }

  // Unknown tokens get the same answer, so the link can't be used to probe who's on the list.
  return fromPage ? back("done=1") : Response.json({ ok: true });
}
