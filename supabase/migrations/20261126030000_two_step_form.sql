-- Two-step audit form.
-- Step 1 ("Find your business") saves a partial lead (status 'partial') with the Google listing they picked.
-- Step 2 (name, email, phone) fills in that same row and sets status 'new'.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Needs the leads table (20261126000000_create_leads.sql) first.

-- A partial lead has no name or email yet.
alter table public.leads alter column name drop not null;
alter table public.leads alter column email drop not null;

-- From the Google listing they picked (Places Autocomplete). Empty when they typed it in by hand.
alter table public.leads add column if not exists place_id   text;
alter table public.leads add column if not exists state      text;
alter table public.leads add column if not exists address    text;
alter table public.leads add column if not exists category   text; -- primary category on Google, e.g. "Tree service"
alter table public.leads add column if not exists updated_at timestamptz;

-- status is now: partial → new → booked.
