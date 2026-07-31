-- ============================================================
-- BanglaYX CORE — Supabase schema
-- Run this in the Supabase SQL editor on a fresh project.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- admins  (linked 1:1 with a Supabase Auth user via auth.uid())
-- ------------------------------------------------------------
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- vote_links
-- ------------------------------------------------------------
create table if not exists public.vote_links (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  description text not null default '',
  vote_url text not null,
  reward_key_amount int not null default 1,
  reward_money_amount int not null default 200,
  display_order int not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ranks
-- ------------------------------------------------------------
create table if not exists public.ranks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric(10,2) not null default 0,
  currency text not null default 'BDT',
  features text[] not null default '{}',
  gradient_from text not null default '#55ff55',
  gradient_to text not null default '#e6b93c',
  badge_text text not null default '',
  image_url text,
  display_order int not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- staff
-- ------------------------------------------------------------
create table if not exists public.staff (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null, -- Owner | Admin | Moderator | Helper (free text, sorted by rank_weight)
  rank_weight int not null default 0, -- lower = higher in hierarchy (Owner=0)
  avatar_url text,
  discord_username text,
  display_order int not null default 0,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- settings  (single-row key/value store, seeded below)
-- ------------------------------------------------------------
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values
  ('server_name', '"BanglaYX CORE"'),
  ('java_ip', '"play.banglayxcore.fun"'),
  ('bedrock_ip', '"play.banglayxcore.fun"'),
  ('bedrock_port', '19193'),
  ('discord_invite', '"https://discord.gg/bWTWSUPK2y"'),
  ('discord_server_id', '""'),
  ('hero_background_url', '""'),
  ('website_logo_url', '""'),
  ('vote_reward_key', '1'),
  ('vote_reward_money', '200'),
  ('tagline', '"The Ultimate Bangladeshi Minecraft Survival Experience"')
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- website_visits  (append-only visit log for the analytics stat)
-- ------------------------------------------------------------
create table if not exists public.website_visits (
  id bigint generated always as identity primary key,
  path text not null,
  visited_at timestamptz not null default now()
);

create index if not exists website_visits_visited_at_idx on public.website_visits (visited_at);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.admins enable row level security;
alter table public.vote_links enable row level security;
alter table public.ranks enable row level security;
alter table public.staff enable row level security;
alter table public.settings enable row level security;
alter table public.website_visits enable row level security;

-- Helper: is the current auth.uid() a registered admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- admins: only admins can read the admin list; no public access
create policy "admins_select_self" on public.admins
  for select using (public.is_admin());

-- vote_links: public can read enabled rows; admins can read/write everything
create policy "vote_links_public_read" on public.vote_links
  for select using (enabled = true or public.is_admin());
create policy "vote_links_admin_write" on public.vote_links
  for all using (public.is_admin()) with check (public.is_admin());

-- ranks: same pattern
create policy "ranks_public_read" on public.ranks
  for select using (enabled = true or public.is_admin());
create policy "ranks_admin_write" on public.ranks
  for all using (public.is_admin()) with check (public.is_admin());

-- staff: same pattern
create policy "staff_public_read" on public.staff
  for select using (enabled = true or public.is_admin());
create policy "staff_admin_write" on public.staff
  for all using (public.is_admin()) with check (public.is_admin());

-- settings: public can read all keys (needed to render the site); only admins write
create policy "settings_public_read" on public.settings
  for select using (true);
create policy "settings_admin_write" on public.settings
  for update using (public.is_admin()) with check (public.is_admin());
create policy "settings_admin_insert" on public.settings
  for insert with check (public.is_admin());

-- website_visits: anyone (including anon via the API route) can insert; only admins can read/count
create policy "visits_public_insert" on public.website_visits
  for insert with check (true);
create policy "visits_admin_read" on public.website_visits
  for select using (public.is_admin());

-- ============================================================
-- After running this file:
-- 1. Create a user in Supabase Auth (Authentication > Users > Add user).
-- 2. Insert a row into public.admins with that user's id + a username:
--    insert into public.admins (id, username) values ('<auth-user-uuid>', 'owner');
-- 3. That account can now log in at /admin/login.
-- ============================================================
