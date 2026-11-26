import { createHash, timingSafeEqual } from "node:crypto";
import { runFollowups } from "@/lib/server/followups";

// Sends up to a few dozen emails with a short pause between each.
export const maxDuration = 300;

const hash = (s: string) => createHash("sha256").update(s).digest();

/**
 * Daily follow-up emails (schedule in vercel.json). Vercel Cron calls this with
 * "Authorization: Bearer <CRON_SECRET>". Anyone else gets a 401.
 * Only sends when FOLLOWUP_ENABLED=true and LEAD_FROM_EMAIL is set; otherwise it logs what it would send.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[followups] CRON_SECRET is not set");
    return Response.json({ error: "Cron not configured." }, { status: 500 });
  }
  const given = request.headers.get("authorization") ?? "";
  if (!timingSafeEqual(hash(given), hash(`Bearer ${secret}`))) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await runFollowups();
    console.log(
      `[followups] ${result.mode}: checked ${result.checked}, sent ${result.sent.length}, would send ${result.wouldSend.length}, errors ${result.errors.length}`,
    );
    return Response.json(result);
  } catch (e) {
    console.error("[followups] Run failed:", e);
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
