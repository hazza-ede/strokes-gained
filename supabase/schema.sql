-- Strokes Gained: database setup.
-- Paste this whole file into Supabase > SQL Editor > New query, then press Run.
-- Safe to run again: it only creates what is missing.

-- Each golfer's name, shown to mates.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

-- Saved rounds: private to their owner.
create table if not exists public.rounds (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists rounds_user_idx on public.rounds(user_id);

-- The round in progress, so it carries over between phone and computer.
create table if not exists public.drafts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Courses: pars and lengths entered once, shared by everyone.
create table if not exists public.courses (
  id text primary key,
  name text not null,
  holes jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- What each golfer chooses to share with the group (strokes gained per round, no hole detail).
create table if not exists public.players (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.rounds   enable row level security;
alter table public.drafts   enable row level security;
alter table public.courses  enable row level security;
alter table public.players  enable row level security;

-- profiles: everyone signed in can read names; you edit only your own.
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles own" on public.profiles;
create policy "profiles own" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- rounds and drafts: only you.
drop policy if exists "rounds own" on public.rounds;
create policy "rounds own" on public.rounds for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "drafts own" on public.drafts;
create policy "drafts own" on public.drafts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- courses: everyone signed in can read and add; editing is open to the group too (small trusted group for now).
drop policy if exists "courses read" on public.courses;
create policy "courses read" on public.courses for select to authenticated using (true);
drop policy if exists "courses add" on public.courses;
create policy "courses add" on public.courses for insert to authenticated with check (true);
drop policy if exists "courses edit" on public.courses;
create policy "courses edit" on public.courses for update to authenticated using (true) with check (true);

-- players: everyone signed in can see the leaderboard; you only write or remove your own row.
drop policy if exists "players read" on public.players;
create policy "players read" on public.players for select to authenticated using (true);
drop policy if exists "players own" on public.players;
create policy "players own" on public.players for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Create a profile automatically when someone signs up, using the name they gave.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
