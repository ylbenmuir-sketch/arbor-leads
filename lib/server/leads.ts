// Server-only: uses the Supabase service role key and the Resend key.
// Never import this from a "use client" file.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export type Lead = {
  id: string;
  created_at: string;
  /** Null only on a partial lead (step 1 of the form done, step 2 not yet). */
  name: string | null;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  website: string | null;
  /** partial → new → booked */
  status: string;
  booked_at: string | null;
  booking_id: string | null;
  // From the Google listing picked on step 1 (migration 20261126030000). Null when typed in by hand.
  place_id?: string | null;
  state?: string | null;
  address?: string | null;
  category?: string | null;
  updated_at?: string | null;
  // Follow-up emails (migration 20261126040000).
  unsubscribed_at?: string | null;
  unsubscribe_token?: string | null;
};

export function env(name: string) {
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

export const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** LEAD_NOTIFY_EMAIL as a list (it can be comma-separated). */
export const ownerEmails = () =>
  env("LEAD_NOTIFY_EMAIL")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

/**
 * Send one email through Resend. Sends from LEAD_FROM_EMAIL, or Resend's test sender,
 * which only delivers to your own Resend account email.
 */
export async function sendEmail(message: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string | string[];
  headers?: Record<string, string>;
}) {
  const { error } = await new Resend(env("RESEND_API_KEY")).emails.send({
    from: process.env.LEAD_FROM_EMAIL || "Arbor Leads <onboarding@resend.dev>",
    ...message,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

/** Email the site owner (LEAD_NOTIFY_EMAIL). `rows` are label/value pairs; empty values are skipped. */
export async function notifyOwner(subject: string, rows: [string, string | null | undefined][], replyTo?: string | null) {
  const filled = rows.filter((r): r is [string, string] => Boolean(r[1]));
  const text = filled.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:15px;border-collapse:collapse">${filled
    .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${escape(k)}</td><td><strong>${escape(v)}</strong></td></tr>`)
    .join("")}</table>`;

  await sendEmail({ to: ownerEmails(), subject, text, html, replyTo: replyTo || undefined });
}

/** Rows for the notification email, in a fixed order. */
export function leadRows(lead: Partial<Lead>): [string, string | null | undefined][] {
  return [
    ["Name", lead.name],
    ["Business", lead.business_name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["City", lead.state && lead.city ? `${lead.city}, ${lead.state}` : lead.city],
    ["Address", lead.address],
    ["Google category", lead.category],
    ["Website", lead.website],
    ["Google place ID", lead.place_id],
    ["Status", lead.status],
  ];
}

/**
 * The live site's address, for links in emails (unsubscribe). Vercel sets VERCEL_PROJECT_PRODUCTION_URL
 * to the production domain on every deployment; locally it falls back to arborleads.co.
 */
export function siteUrl() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return host ? `https://${host}` : "https://arborleads.co";
}
