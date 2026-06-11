-- ============================================================
-- Aperolek 2026 - schemat bazy (Supabase / Postgres)
-- Wklej całość w Supabase: Dashboard -> SQL Editor -> New query -> Run
-- ============================================================

-- Listy z odhaczaniem: pakowanie (per osoba) + zakupy (wspólne)
create table if not exists public.checks (
  scope text not null,                 -- 'packing' | 'shopping'
  person text not null,                -- imię (pakowanie) lub 'shared' (zakupy)
  item text not null,                  -- treść pozycji (klucz)
  checked boolean not null default false,
  checked_by text,                     -- kto ostatnio zmienił
  updated_at timestamptz not null default now(),
  primary key (scope, person, item)
);

-- Budżet: wydatki
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  category text not null,              -- nocleg|transport|atrakcje|jedzenie|inne
  amount numeric(10,2) not null,
  paid_by text not null,               -- id osoby (dawid|karolina|wiktoria|banan)
  shared_by text[],                    -- null/[] = cała ekipa
  created_at timestamptz not null default now()
);

-- Budżet: zwroty (kto komu oddał)
create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  from_person text not null,
  to_person text not null,
  amount numeric(10,2) not null,
  note text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- RLS: odczyt dla wszystkich (anon), zapis tylko przez Server Actions
-- (service role omija RLS, więc nie dajemy policy na insert/update/delete)
-- ------------------------------------------------------------
alter table public.checks enable row level security;
alter table public.expenses enable row level security;
alter table public.settlements enable row level security;

drop policy if exists "read checks" on public.checks;
drop policy if exists "read expenses" on public.expenses;
drop policy if exists "read settlements" on public.settlements;

create policy "read checks" on public.checks for select using (true);
create policy "read expenses" on public.expenses for select using (true);
create policy "read settlements" on public.settlements for select using (true);

-- Generyczne wpisy treści (CMS): listy z dodaj/edytuj/usuń.
-- data (jsonb) trzyma pola danej sekcji (np. title, body, emoji, url...).
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  sort double precision not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists entries_scope_idx on public.entries (scope, sort, created_at);

alter table public.entries enable row level security;
drop policy if exists "read entries" on public.entries;
create policy "read entries" on public.entries for select using (true);

-- ------------------------------------------------------------
-- Realtime: żywa synchronizacja między urządzeniami
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.checks;
alter publication supabase_realtime add table public.entries;
