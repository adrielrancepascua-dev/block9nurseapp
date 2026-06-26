-- NursePath pilot telemetry reset
-- Run once in Supabase → SQL Editor (postgres role) for a clean dashboard slate.
-- Optional: export a CSV backup from the dashboard Export page before running.

begin;

truncate table public.usage_events restart identity;
truncate table public.auth_email_log restart identity;

commit;

-- Verify
select 'usage_events' as table_name, count(*) as rows from public.usage_events
union all
select 'auth_email_log', count(*) from public.auth_email_log;
