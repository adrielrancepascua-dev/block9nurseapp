-- =============================================================================
-- NursePath: FULL pilot telemetry reset
-- Run in Supabase → SQL Editor (uses postgres role — required for TRUNCATE)
-- =============================================================================
-- Do this when the dashboard still shows old May/June sessions, inflated hours,
-- or legacy ghost rows from before the June 26, 2026 pilot-wave fixes.
--
-- Optional: Export a CSV backup from nursepath-dashboard → Export first.
-- After running: dashboard → Export → "Clear cache & reload"
-- =============================================================================

begin;

truncate table public.usage_events restart identity;
truncate table public.auth_email_log restart identity;

commit;

-- Should return 0 for both tables:
select 'usage_events' as table_name, count(*) as rows from public.usage_events
union all
select 'auth_email_log', count(*) from public.auth_email_log;
