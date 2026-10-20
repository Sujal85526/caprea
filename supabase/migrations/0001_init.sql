-- Caprea catering: catalogue, pricing and bookings.
-- Public visitors read the active catalogue; bookings are written only by the server (service role).
-- Admins are users listed in public.admins and can read and write everything.

create extension if not exists pgcrypto;

-- Admins ---------------------------------------------------------------------
create table public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Settings (single row) --------------------------------------------------------
create table public.settings (
  id boolean primary key default true check (id),
  pricing_mode text not null default 'packages' check (pricing_mode in ('packages', 'per_cup', 'both')),
  deposit_percent int not null default 50 check (deposit_percent between 0 and 100),
  service_hours int not null default 4,
  extra_hour_price numeric(10, 2) not null default 150,
  min_notice_days int not null default 3,
  addon_min_qty int not null default 10,
  phone text not null default '+971 52 225 0022',
  whatsapp text not null default '971522250022',
  email text not null default 'info@capreacafe.com',
  instagram text not null default 'caprea.ae',
  notify_email text not null default 'capreawebsite@gmail.com',
  terms jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Catalogue ----------------------------------------------------------------------
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null check (category in ('signature', 'matcha', 'coffee', 'smoothie', 'refresher', 'dessert', 'box')),
  price numeric(10, 2),
  image_url text,
  best_seller boolean not null default false,
  -- catering roles
  catering_signature boolean not null default false,
  catering_coffee boolean not null default false,
  catering_addon boolean not null default false,
  addon_price numeric(10, 2),
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  guests int not null,
  max_signature_drinks int not null,
  cups_per_drink int not null,
  price numeric(10, 2) not null,
  includes text[] not null default array['Caprea''s cart', '1 barista & 1 waiter', '4 hours of service'],
  featured boolean not null default false,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Per-cup pricing, used when settings.pricing_mode is 'per_cup' or 'both'
create table public.cup_tiers (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  min_cups int not null,
  max_cups int,
  price_per_cup numeric(10, 2) not null,
  active boolean not null default true,
  sort int not null default 0
);

create table public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fee numeric(10, 2) not null,
  active boolean not null default true,
  sort int not null default 0
);

create table public.extras (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price numeric(10, 2),
  unit text not null default 'flat' check (unit in ('flat', 'per_hour', 'on_request')),
  active boolean not null default true,
  sort int not null default 0
);

-- Bookings -----------------------------------------------------------------------
create sequence public.booking_ref_seq start 1001;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique default ('CAP-' || nextval('public.booking_ref_seq')),
  kind text not null check (kind in ('package', 'per_cup', 'custom')),
  status text not null default 'pending' check (status in ('pending', 'request', 'quoted', 'confirmed', 'completed', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'deposit_paid', 'paid', 'refunded')),

  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,

  event_date date not null,
  start_time text not null,
  event_type text,
  guests int,
  region_id uuid references public.regions (id),
  region_name text,
  address text not null,

  package_id uuid references public.packages (id),
  package_name text,
  cups int,
  -- [{slug, name, cups}] signature drinks; coffee fills the rest
  drinks jsonb not null default '[]'::jsonb,
  -- [{slug, name, qty, unit_price}]
  addons jsonb not null default '[]'::jsonb,
  -- [{slug, name, qty, unit_price, unit}]
  extras jsonb not null default '[]'::jsonb,
  extra_hours int not null default 0,
  notes text,

  subtotal numeric(10, 2) not null default 0,
  transport_fee numeric(10, 2) not null default 0,
  extras_total numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  deposit numeric(10, 2) not null default 0,
  quote_amount numeric(10, 2),
  admin_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_event_date_idx on public.bookings (event_date);
create index bookings_status_idx on public.bookings (status);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_touch before update on public.bookings
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- Row level security ---------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.menu_items enable row level security;
alter table public.packages enable row level security;
alter table public.cup_tiers enable row level security;
alter table public.regions enable row level security;
alter table public.extras enable row level security;
alter table public.bookings enable row level security;

create policy "admins read admins" on public.admins for select using (public.is_admin());

create policy "public read settings" on public.settings for select using (true);
create policy "admin write settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['menu_items', 'packages', 'cup_tiers', 'regions', 'extras'] loop
    execute format('create policy "public read active %1$s" on public.%1$I for select using (active or public.is_admin())', t);
    execute format('create policy "admin write %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

create policy "admin read bookings" on public.bookings for select using (public.is_admin());
create policy "admin update bookings" on public.bookings for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete bookings" on public.bookings for delete using (public.is_admin());

-- Storage bucket for menu images uploaded from the admin panel
insert into storage.buckets (id, name, public) values ('menu', 'menu', true) on conflict (id) do nothing;
create policy "public read menu images" on storage.objects for select using (bucket_id = 'menu');
create policy "admin upload menu images" on storage.objects for insert with check (bucket_id = 'menu' and public.is_admin());
create policy "admin update menu images" on storage.objects for update using (bucket_id = 'menu' and public.is_admin());
create policy "admin delete menu images" on storage.objects for delete using (bucket_id = 'menu' and public.is_admin());
