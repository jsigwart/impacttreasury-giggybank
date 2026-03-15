-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- Campaigns
-- Each row is one receipt / proof-of-impact event
-- ─────────────────────────────────────────
create table if not exists campaigns (
  id                uuid        primary key default gen_random_uuid(),
  slug              text        unique not null,
  title             text        not null,
  description       text,
  date              date        not null,
  category          text        not null check (category in ('food', 'transport', 'supplies', 'other')),
  platform          text,
  subtotal          numeric(10,2),
  tip               numeric(10,2),
  total             numeric(10,2) not null,
  treasury_tx       text,
  receipt_image_url text,
  social_post_url   text,
  notes             text,
  published         boolean     not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- Treasury snapshots
-- Manual point-in-time treasury balance records
-- ─────────────────────────────────────────
create table if not exists treasury_snapshots (
  id          uuid        primary key default gen_random_uuid(),
  balance_sol numeric(18,9) not null,
  balance_usd numeric(12,2) not null,
  sol_price   numeric(10,4),
  snapshot_at timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- Auto-update updated_at on campaigns
-- ─────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger campaigns_updated_at
  before update on campaigns
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────
alter table campaigns enable row level security;
alter table treasury_snapshots enable row level security;

-- Public: read published campaigns only
create policy "Public can read published campaigns"
  on campaigns for select
  using (published = true);

-- Admin: read all campaigns (includes unpublished)
create policy "Authenticated users can read all campaigns"
  on campaigns for select
  using (auth.role() = 'authenticated');

-- Admin: write access
create policy "Authenticated users can insert campaigns"
  on campaigns for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update campaigns"
  on campaigns for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete campaigns"
  on campaigns for delete
  using (auth.role() = 'authenticated');

-- Treasury snapshots: public read, admin write
create policy "Treasury snapshots are publicly readable"
  on treasury_snapshots for select
  using (true);

create policy "Authenticated users can insert treasury snapshots"
  on treasury_snapshots for insert
  with check (auth.role() = 'authenticated');
