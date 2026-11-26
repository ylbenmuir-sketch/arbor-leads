-- Follow-up emails (day 2, 5 and 10 after the report) for leads who haven't booked, plus unsubscribes.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Needs the leads and reports tables first (20261126000000_create_leads.sql, 20261126010000_create_reports.sql).

-- Set when they click the unsubscribe link. No more follow-ups to that email address after this.
alter table public.leads add column if not exists unsubscribed_at timestamptz;
-- The secret part of each lead's unsubscribe link. Existing rows get one too.
alter table public.leads add column if not exists unsubscribe_token uuid not null default gen_random_uuid();
create unique index if not exists leads_unsubscribe_token_idx on public.leads (unsubscribe_token);

-- One row per follow-up email. The unique (lead_id, step) stops the same email going out twice.
create table if not exists public.lead_followups (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id    uuid not null references public.leads (id) on delete cascade,
  report_id  uuid references public.reports (id) on delete set null,
  email      text not null,
  -- 1 = day 2, 2 = day 5, 3 = day 10.
  step       smallint not null check (step between 1 and 3),
  -- sending → sent. (A failed send deletes its row so the next day's run can try again.)
  status     text not null default 'sending',
  subject    text,
  sent_at    timestamptz,
  unique (lead_id, step)
);

create index if not exists lead_followups_email_idx on public.lead_followups (email);

-- Same lockdown as leads and reports: only the server (service role key) can read or write.
alter table public.lead_followups enable row level security;
revoke all on table public.lead_followups from anon, authenticated;
