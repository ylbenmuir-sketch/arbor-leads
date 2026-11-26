-- Leads from the free audit form and from Cal.com bookings.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null,
  -- Nullable because a lead created by a Cal.com booking (no audit form) won't have these.
  business_name text,
  email         text not null,
  phone         text,
  city          text,
  website       text,
  status        text not null default 'new',
  booked_at     timestamptz,
  booking_id    text
);

-- Emails are stored lowercased; the Cal.com webhook looks leads up by email.
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Row level security on, with no policies: the public (anon) and signed-in keys
-- can't read or write anything. Only the server, using the service role key
-- (which bypasses RLS), can.
alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;
