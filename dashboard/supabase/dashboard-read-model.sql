-- Faculty dashboard aggregates.
-- The browser used to download every usage row and count it locally.
-- These functions return the same numbers in one small response.
-- Run in the Supabase SQL editor for this project (postgres role).

create index if not exists usage_events_timestamp_idx
  on public.usage_events (timestamp desc);

create index if not exists usage_events_event_id_timestamp_idx
  on public.usage_events (event_id, timestamp desc);

-- One row per event_id. The app sometimes inserts the same event twice.
create or replace view public.usage_events_deduped
with (security_invoker = true) as
select distinct on (event_id)
  id,
  event_id,
  user_email,
  session_id,
  feature,
  action,
  meta,
  timestamp,
  online,
  duration_ms
from public.usage_events
where event_id is not null
order by event_id, timestamp desc;

grant select on public.usage_events_deduped to anon, authenticated;

create or replace function public.dashboard_overview(
  since timestamptz,
  tz text default 'UTC'
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with pilot as (
    select *
    from public.usage_events_deduped
    where timestamp >= since
  ),
  session_ends as (
    select
      session_id,
      max(least(greatest(coalesce(duration_ms, 0), 0), 7200000)) as duration_ms
    from pilot
    where feature = 'session'
      and action = 'session_end'
      and session_id is not null
    group by session_id
  ),
  today as (
    select (timezone(tz, now()))::date as day
  ),
  days as (
    select generate_series(
      (select day from today) - 29,
      (select day from today),
      interval '1 day'
    )::date as day
  ),
  daily as (
    select (timezone(tz, timestamp))::date as day, count(*)::int as count
    from pilot
    group by 1
  ),
  features as (
    select feature, count(*)::int as value
    from pilot
    where feature is not null
      and feature not in ('session', 'auth', 'consent')
    group by feature
    order by count(*) desc
    limit 8
  )
  select jsonb_build_object(
    'unique_users', (
      select count(distinct lower(btrim(user_email)))::int
      from pilot
      where nullif(btrim(user_email), '') is not null
    ),
    'total_sessions', (
      select count(distinct session_id)::int
      from pilot
      where session_id is not null
    ),
    'feature_uses', (
      select count(*)::int
      from pilot
      where feature is not null
        and feature not in ('session', 'auth', 'consent')
    ),
    'avg_session_ms', coalesce((select avg(duration_ms) from session_ends), 0),
    'daily', (
      select coalesce(jsonb_agg(
        jsonb_build_object(
          'date', to_char(days.day, 'YYYY-MM-DD'),
          'count', coalesce(daily.count, 0)
        )
        order by days.day
      ), '[]'::jsonb)
      from days
      left join daily on daily.day = days.day
    ),
    'top_features', (
      select coalesce(jsonb_agg(
        jsonb_build_object('feature', feature, 'value', value)
        order by value desc
      ), '[]'::jsonb)
      from features
    )
  );
$$;

create or replace function public.dashboard_users(since timestamptz)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  with pilot as (
    select *
    from public.usage_events_deduped
    where timestamp >= since
  ),
  people as (
    select lower(btrim(user_email)) as email
    from pilot
    where nullif(btrim(user_email), '') is not null
    group by 1
  ),
  ends as (
    select
      lower(btrim(user_email)) as email,
      session_id,
      max(least(greatest(coalesce(duration_ms, 0), 0), 7200000)) as duration_ms
    from pilot
    where feature = 'session'
      and action = 'session_end'
      and session_id is not null
      and nullif(btrim(user_email), '') is not null
    group by 1, 2
  ),
  rows as (
    select
      people.email,
      (
        select count(distinct pilot.session_id)::int
        from pilot
        where lower(btrim(pilot.user_email)) = people.email
          and pilot.session_id is not null
      ) as sessions,
      coalesce((
        select sum(ends.duration_ms)::bigint
        from ends
        where ends.email = people.email
      ), 0) as total_duration,
      (
        select max(pilot.timestamp)
        from pilot
        where lower(btrim(pilot.user_email)) = people.email
      ) as last_active,
      (
        select count(distinct pilot.feature)::int
        from pilot
        where lower(btrim(pilot.user_email)) = people.email
          and pilot.feature is not null
          and pilot.feature not in ('session', 'auth')
      ) as feature_count
    from people
  )
  select jsonb_build_object(
    'legacy_events', (
      select count(*)::int
      from pilot
      where nullif(btrim(user_email), '') is null
    ),
    'users', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'email', email,
          'sessions', sessions,
          'total_duration', total_duration,
          'last_active', last_active,
          'feature_count', feature_count
        )
        order by last_active desc
      )
      from rows
    ), '[]'::jsonb)
  );
$$;

create or replace function public.dashboard_feature_counts(
  since timestamptz,
  until_ts timestamptz
)
returns table(feature text, uses integer)
language sql
stable
security invoker
set search_path = public
as $$
  select usage_events_deduped.feature, count(*)::int as uses
  from public.usage_events_deduped
  where usage_events_deduped.timestamp >= since
    and usage_events_deduped.timestamp <= until_ts
    and usage_events_deduped.feature is not null
    and usage_events_deduped.feature not in ('session', 'auth', 'consent')
  group by usage_events_deduped.feature
  order by count(*) desc;
$$;

grant execute on function public.dashboard_overview(timestamptz, text) to anon, authenticated;
grant execute on function public.dashboard_users(timestamptz) to anon, authenticated;
grant execute on function public.dashboard_feature_counts(timestamptz, timestamptz) to anon, authenticated;
