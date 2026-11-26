-- Google Presence Score on each report (0–100, worked out in code) and its 5-part breakdown.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

alter table public.reports add column if not exists score integer;
alter table public.reports add column if not exists score_breakdown jsonb;
