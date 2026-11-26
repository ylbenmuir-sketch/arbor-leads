-- "Who's Beating Me?" reports, built in the background after each audit form lead.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Needs the leads table (20261126000000_create_leads.sql) first.

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  -- Nullable: if saving the lead failed, the report still gets built and sent.
  lead_id     uuid references public.leads (id) on delete cascade,
  -- Everything pulled (Google Maps results, PageSpeed, what the AI wrote, any error).
  raw_data    jsonb not null default '{}'::jsonb,
  -- The exact email that was sent to the lead.
  report_html text,
  -- building → sent, or failed (the error is in raw_data->>'error').
  status      text not null default 'building'
);

create index if not exists reports_lead_id_idx on public.reports (lead_id);
create index if not exists reports_created_at_idx on public.reports (created_at desc);

-- Same lockdown as leads: only the server (service role key) can read or write.
alter table public.reports enable row level security;
revoke all on table public.reports from anon, authenticated;
