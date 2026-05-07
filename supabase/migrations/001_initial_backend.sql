-- NeuroMath Quest optional cloud backend.
-- Run this in Supabase SQL Editor or with the Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'NeuroMath Explorer',
  role text not null default 'student' check (role in ('student', 'admin')),
  xp_total integer not null default 0,
  coins_total integer not null default 0,
  chests_opened integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  track_id text not null,
  attempts integer not null default 0,
  best_score real not null default 0,
  last_score real not null default 0,
  stars integer not null default 0,
  mastery text not null default 'not_started',
  last_attempt_at bigint,
  completed_at bigint,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_attempt_id text not null,
  lesson_id text not null,
  correct integer not null,
  total integer not null,
  score real not null,
  xp_awarded integer not null,
  coins_awarded integer not null,
  attempted_at bigint not null,
  created_at timestamptz not null default now(),
  unique (user_id, client_attempt_id)
);

create table if not exists public.streak_log (
  user_id uuid not null references auth.users(id) on delete cascade,
  day text not null,
  lessons_completed integer not null default 0,
  xp_earned integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table if not exists public.lesson_unlocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  cost_paid integer not null,
  unlocked_at bigint not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_claim_codes (
  id text primary key,
  code_hash text not null,
  salt text not null,
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.admin_claim_codes (id, code_hash, salt)
values (
  'primary',
  'ff01c0846f160e0360f98e9ddf43c6748a5b700dadb17bf45c36f6f1f3296d80',
  'neuromathquest-admin-v1'
)
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.claim_admin_with_code(claim_code text)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  code_row public.admin_claim_codes%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in first, then enter the superuser code.';
  end if;

  select *
  into code_row
  from public.admin_claim_codes
  where id = 'primary'
  for update;

  if not found then
    raise exception 'No superuser code is configured on this Supabase project.';
  end if;

  if code_row.used_at is not null and code_row.used_by is distinct from auth.uid() then
    raise exception 'This superuser code has already been used.';
  end if;

  if encode(digest(coalesce(trim(claim_code), '') || code_row.salt, 'sha256'), 'hex') <> code_row.code_hash then
    raise exception 'Superuser code not recognized.';
  end if;

  insert into public.profiles (user_id, display_name, role, updated_at)
  values (
    auth.uid(),
    coalesce(nullif(auth.jwt() -> 'user_metadata' ->> 'display_name', ''), 'NeuroMath Explorer'),
    'admin',
    now()
  )
  on conflict (user_id) do update
    set role = 'admin',
        updated_at = now();

  update public.admin_claim_codes
  set used_by = auth.uid(),
      used_at = coalesce(used_at, now())
  where id = 'primary';

  return 'Superuser role enabled for this cloud account.';
end;
$$;

grant execute on function public.claim_admin_with_code(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.streak_log enable row level security;
alter table public.lesson_unlocks enable row level security;
alter table public.usage_events enable row level security;
alter table public.admin_claim_codes enable row level security;

drop policy if exists "profiles own select or admin" on public.profiles;
create policy "profiles own select or admin"
on public.profiles for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "profiles own insert" on public.profiles;
create policy "profiles own insert"
on public.profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles own update or admin" on public.profiles;
create policy "profiles own update or admin"
on public.profiles for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "progress own select or admin" on public.lesson_progress;
create policy "progress own select or admin"
on public.lesson_progress for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "progress own insert" on public.lesson_progress;
create policy "progress own insert"
on public.lesson_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "progress own update" on public.lesson_progress;
create policy "progress own update"
on public.lesson_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "attempts own select or admin" on public.quiz_attempts;
create policy "attempts own select or admin"
on public.quiz_attempts for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "attempts own insert" on public.quiz_attempts;
create policy "attempts own insert"
on public.quiz_attempts for insert
with check (auth.uid() = user_id);

drop policy if exists "attempts own update" on public.quiz_attempts;
create policy "attempts own update"
on public.quiz_attempts for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "streak own select or admin" on public.streak_log;
create policy "streak own select or admin"
on public.streak_log for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "streak own insert" on public.streak_log;
create policy "streak own insert"
on public.streak_log for insert
with check (auth.uid() = user_id);

drop policy if exists "streak own update" on public.streak_log;
create policy "streak own update"
on public.streak_log for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "unlocks own select or admin" on public.lesson_unlocks;
create policy "unlocks own select or admin"
on public.lesson_unlocks for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "unlocks own insert" on public.lesson_unlocks;
create policy "unlocks own insert"
on public.lesson_unlocks for insert
with check (auth.uid() = user_id);

drop policy if exists "unlocks own update" on public.lesson_unlocks;
create policy "unlocks own update"
on public.lesson_unlocks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "usage own select or admin" on public.usage_events;
create policy "usage own select or admin"
on public.usage_events for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "usage own insert" on public.usage_events;
create policy "usage own insert"
on public.usage_events for insert
with check (auth.uid() = user_id);

create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id);
create index if not exists quiz_attempts_user_time_idx on public.quiz_attempts(user_id, attempted_at desc);
create index if not exists lesson_unlocks_user_idx on public.lesson_unlocks(user_id);
create index if not exists usage_events_user_time_idx on public.usage_events(user_id, created_at desc);

-- One-time superuser claim is handled by public.claim_admin_with_code().
-- Keep the plaintext owner code outside the public repository. To rotate it,
-- replace admin_claim_codes.code_hash with a SHA-256 hash of new_code || salt.
