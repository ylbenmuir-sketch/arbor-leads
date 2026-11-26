// Server-only: uses the Supabase service role key and the Resend key.
// Never import this from a "use client" file.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  website: string | null;
  status: string;
  booked_at: string | null;
  booking_id: string | null;
};

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

let db: SupabaseClient | null = null;

/** Supabase client with the service role key. Bypasses row level security. */
export function supabase() {
  db ??= createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return db;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Email the site owner (LEAD_NOTIFY_EMAIL). `rows` are label/value pairs; empty values are skipped.
 * Sends from LEAD_FROM_EMAIL, or Resend's test sender, which only delivers to your own Resend account email.
 */
export async function notifyOwner(subject: string, rows: [string, string | null | undefined][], replyTo?: string) {
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]));
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:15px;border-collapse:collapse">${filled
    .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${escape(k)}</td><td><strong>${escape(v)}</strong></td></tr>`)
    .join("")}</table>`;

  const { error } = await new Resend(env("RESEND_API_KEY")).emails.send({
    from: process.env.LEAD_FROM_EMAIL || "Arbor Leads <onboarding@resend.dev>",
    to: env("LEAD_NOTIFY_EMAIL").split(",").map((e) => e.trim()),
    subject,
    text,
    html,
    replyTo,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

/** Rows for the notification email, in a fixed order. */
export function leadRows(lead: Partial<Lead>): [string, string | null | undefined][] {
  return [
    ["Name", lead.name],
    ["Business", lead.business_name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["City", lead.city],
    ["Website", lead.website],
    ["Status", lead.status],
  ];
}
