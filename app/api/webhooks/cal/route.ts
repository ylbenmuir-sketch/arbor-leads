import { createHmac, timingSafeEqual } from "node:crypto";
import { type Lead, leadRows, notifyOwner, supabase } from "@/lib/server/leads";

/**
 * Cal.com webhook. On BOOKING_CREATED: mark the lead (matched by email) as booked,
 * or create one if they never filled in the audit form, then email the owner.
 * Cal.com signs the raw body with HMAC-SHA256 (hex) in the X-Cal-Signature-256 header.
 */

type Attendee = { name?: string; email?: string; phoneNumber?: string; timeZone?: string };
type CalEvent = {
  triggerEvent?: string;
  createdAt?: string;
  payload?: {
    uid?: string;
    bookingId?: number;
    title?: string;
    startTime?: string;
    attendees?: Attendee[];
    organizer?: { timeZone?: string };
    responses?: Record<string, { value?: unknown } | undefined>;
  };
};

function validSignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(body).digest("hex"));
  const given = Buffer.from(signature.trim());
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Booking form answers can be a string or, for a split name field, { firstName, lastName }. */
function answer(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    return Object.values(value)
      .filter((v) => typeof v === "string")
      .join(" ")
      .trim();
  }
  return "";
}

export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[cal] CAL_WEBHOOK_SECRET is not set");
    return Response.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-cal-signature-256"), secret)) {
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: CalEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Acknowledge pings and other events so Cal.com doesn't retry them.
  if (event.triggerEvent !== "BOOKING_CREATED") return Response.json({ ok: true, ignored: event.triggerEvent ?? null });

  const p = event.payload ?? {};
  const attendee = p.attendees?.[0] ?? {};
  const email = (attendee.email || answer(p.responses?.email?.value)).toLowerCase();
  if (!email) return Response.json({ error: "Booking has no attendee email." }, { status: 400 });

  const name = attendee.name || answer(p.responses?.name?.value) || email;
  const phone = attendee.phoneNumber || answer(p.responses?.attendeePhoneNumber?.value) || null;
  const booking = {
    status: "booked",
    booked_at: event.createdAt ?? new Date().toISOString(),
    booking_id: p.uid ?? (p.bookingId != null ? String(p.bookingId) : null),
  };

  const db = supabase();
  const { data: found, error: findError } = await db
    .from("leads")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Lead>();
  if (findError) {
    console.error("[cal] Lead lookup failed:", findError);
    return Response.json({ error: "Database error." }, { status: 500 }); // Cal.com retries
  }

  const { data: lead, error: saveError } = found
    ? await db.from("leads").update(booking).eq("id", found.id).select().single<Lead>()
    : await db.from("leads").insert({ name, email, phone, ...booking }).select().single<Lead>();
  if (saveError || !lead) {
    console.error("[cal] Lead save failed:", saveError);
    return Response.json({ error: "Database error." }, { status: 500 });
  }

  const timeZone = p.organizer?.timeZone || attendee.timeZone || "UTC";
  let callTime: string | undefined;
  if (p.startTime) {
    try {
      callTime = new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short", timeZone, timeZoneName: "short" }).format(
        new Date(p.startTime),
      );
    } catch {
      callTime = p.startTime;
    }
  }

  try {
    await notifyOwner(
      "New call booked",
      [
        ["Call time", callTime],
        ["Event", p.title],
        ...leadRows(lead),
        ["Phone (from booking)", lead.phone ? null : phone],
        ["Booking ID", lead.booking_id],
        ["Lead source", found ? "Audit form, then booked" : "Booked directly (no audit form)"],
      ],
      lead.email,
    );
  } catch (e) {
    // The lead is saved; don't make Cal.com retry (and double-process) over an email failure.
    console.error("[cal] Notification email failed:", e);
  }

  return Response.json({ ok: true });
}
