-- NursePath Supabase hardening script
-- Project ref: oobrhmnvbxiqdbpjnnbn
-- Run in Supabase SQL Editor as project owner.
-- Safe to run multiple times.

-- ============================================================
-- 1) Domain helper function for policy checks
-- ============================================================
create or replace function public.is_cdd_user()
returns boolean
language sql
stable
as $$
  select coalesce(lower(split_part(auth.jwt() ->> 'email', '@', 2)) = 'cdd.edu.ph', false);
$$;

grant execute on function public.is_cdd_user() to anon, authenticated;

-- ============================================================
-- 2) Enable RLS on all public tables
-- ============================================================
do $$
declare r record;
begin
  for r in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename not in ('schema_migrations')
  loop
    execute format('alter table public.%I enable row level security;', r.tablename);
  end loop;
end $$;

-- Optional strict mode (uncomment if you want to force RLS always)
-- do $$
-- declare r record;
-- begin
--   for r in
--     select tablename
--     from pg_tables
--     where schemaname = 'public'
--       and tablename not in ('schema_migrations')
--   loop
--     execute format('alter table public.%I force row level security;', r.tablename);
--   end loop;
-- end $$;

-- ============================================================
-- 3) Auto-create owner+domain policies for user-owned tables
--    Supported owner columns (priority order):
--    user_id, owner_id, profile_id, created_by
-- ============================================================
do $$
declare
  r record;
  p_sel text;
  p_ins text;
  p_upd text;
  p_del text;
begin
  for r in
    with owner_cols as (
      select
        c.table_name,
        coalesce(
          max(case when c.column_name = 'user_id' then c.column_name end),
          max(case when c.column_name = 'owner_id' then c.column_name end),
          max(case when c.column_name = 'profile_id' then c.column_name end),
          max(case when c.column_name = 'created_by' then c.column_name end)
        ) as owner_column
      from information_schema.columns c
      where c.table_schema = 'public'
      group by c.table_name
    )
    select table_name, owner_column
    from owner_cols
    where owner_column is not null
  loop
    p_sel := format('p_sel_%s', substr(md5(r.table_name || '_sel_own_domain'), 1, 12));
    p_ins := format('p_ins_%s', substr(md5(r.table_name || '_ins_own_domain'), 1, 12));
    p_upd := format('p_upd_%s', substr(md5(r.table_name || '_upd_own_domain'), 1, 12));
    p_del := format('p_del_%s', substr(md5(r.table_name || '_del_own_domain'), 1, 12));

    execute format('drop policy if exists %I on public.%I;', p_sel, r.table_name);
    execute format('drop policy if exists %I on public.%I;', p_ins, r.table_name);
    execute format('drop policy if exists %I on public.%I;', p_upd, r.table_name);
    execute format('drop policy if exists %I on public.%I;', p_del, r.table_name);

    execute format(
      'create policy %I on public.%I for select to authenticated using (public.is_cdd_user() and %I::text = auth.uid()::text);',
      p_sel,
      r.table_name,
      r.owner_column
    );

    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.is_cdd_user() and %I::text = auth.uid()::text);',
      p_ins,
      r.table_name,
      r.owner_column
    );

    execute format(
      'create policy %I on public.%I for update to authenticated using (public.is_cdd_user() and %I::text = auth.uid()::text) with check (public.is_cdd_user() and %I::text = auth.uid()::text);',
      p_upd,
      r.table_name,
      r.owner_column,
      r.owner_column
    );

    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.is_cdd_user() and %I::text = auth.uid()::text);',
      p_del,
      r.table_name,
      r.owner_column
    );
  end loop;
end $$;

-- ============================================================
-- 4) Storage policies for PRIVATE buckets only
--    Rule: authenticated cdd users can access files only in
--    folder path auth.uid()/...
-- ============================================================
do $$
declare
  b record;
  p_sel text;
  p_ins text;
  p_upd text;
  p_del text;
begin
  if exists (select 1 from pg_namespace where nspname = 'storage') then
    for b in
      select id, public
      from storage.buckets
    loop
      if b.public is false then
        p_sel := format('obj_sel_%s', substr(md5(b.id || '_sel'), 1, 10));
        p_ins := format('obj_ins_%s', substr(md5(b.id || '_ins'), 1, 10));
        p_upd := format('obj_upd_%s', substr(md5(b.id || '_upd'), 1, 10));
        p_del := format('obj_del_%s', substr(md5(b.id || '_del'), 1, 10));

        execute format('drop policy if exists %I on storage.objects;', p_sel);
        execute format('drop policy if exists %I on storage.objects;', p_ins);
        execute format('drop policy if exists %I on storage.objects;', p_upd);
        execute format('drop policy if exists %I on storage.objects;', p_del);

        execute format(
          'create policy %I on storage.objects for select to authenticated using (bucket_id = %L and public.is_cdd_user() and coalesce((storage.foldername(name))[1], '''') = auth.uid()::text);',
          p_sel,
          b.id
        );

        execute format(
          'create policy %I on storage.objects for insert to authenticated with check (bucket_id = %L and public.is_cdd_user() and coalesce((storage.foldername(name))[1], '''') = auth.uid()::text);',
          p_ins,
          b.id
        );

        execute format(
          'create policy %I on storage.objects for update to authenticated using (bucket_id = %L and public.is_cdd_user() and coalesce((storage.foldername(name))[1], '''') = auth.uid()::text) with check (bucket_id = %L and public.is_cdd_user() and coalesce((storage.foldername(name))[1], '''') = auth.uid()::text);',
          p_upd,
          b.id,
          b.id
        );

        execute format(
          'create policy %I on storage.objects for delete to authenticated using (bucket_id = %L and public.is_cdd_user() and coalesce((storage.foldername(name))[1], '''') = auth.uid()::text);',
          p_del,
          b.id
        );
      end if;
    end loop;
  end if;
end $$;

-- ============================================================
-- 5) Audits (run after hardening)
-- ============================================================

-- 5a) Any public table still missing RLS?
select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relrowsecurity = false
order by c.relname;

-- 5b) Review all policies
select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;

-- 5c) Find existing users outside allowed domain (review only)
select
  id,
  email,
  created_at
from auth.users
where email is not null
  and lower(split_part(email, '@', 2)) <> 'cdd.edu.ph'
order by created_at desc;
