-- Run this in Supabase → SQL Editor (once per project).
-- The API uses the service role key and bypasses RLS.

create extension if not exists "pgcrypto";

create table if not exists public.reservations (
  id uuid primary key,
  source text not null,
  status text not null,
  check_in date not null,
  check_out date not null,
  guest_name text not null,
  email text,
  phone text,
  adults int not null,
  children_count int not null default 0,
  suite_ids text[] not null default '{}',
  suite_names text[] not null default '{}',
  nights int not null,
  total_price numeric,
  nif text,
  notes text,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists reservations_check_in_idx on public.reservations (check_in);
create index if not exists reservations_source_idx on public.reservations (source);

alter table public.reservations enable row level security;
