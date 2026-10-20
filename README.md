# Caprea

Catering booking website for Caprea, a specialty coffee and matcha café in Abu Dhabi. Customers pick a catering
package (or order by the cup, or send a custom request), customise drinks and extras, and book a date. The owner
manages bookings, packages, menu, pricing and terms in `/admin`.

Stack: Next.js 16 (App Router, Cache Components) on Vercel, Supabase (Postgres, Auth, Storage), Resend for email,
GSAP + Lenis for motion, Tailwind CSS v4.

See [docs/BRIEF.md](docs/BRIEF.md) for the client brief, brand and photo index.

## Run locally

```bash
cp .env.example .env.local   # fill in Supabase and Resend keys
npm install
npm run dev
```

## Database

Schema and row-level security live in `supabase/migrations/`, the starting catalogue in `supabase/seed.sql`.
Apply them with `psql` against the project's session pooler:

```bash
psql "host=aws-0-ap-south-1.pooler.supabase.com port=5432 user=postgres.<project-ref> dbname=postgres sslmode=require" \
  -f supabase/migrations/0001_init.sql -f supabase/seed.sql
```

`seed.sql` replaces the catalogue tables (menu, packages, regions, extras, cup tiers) but never touches bookings.

Admins are the emails in the `admins` table. They sign in at `/admin/login` with a Supabase Auth password.

## Where things are

| Path | What |
| --- | --- |
| `src/app/(site)` | Public pages: home, menu, packages, booking flow, booking confirmation |
| `src/app/admin` | Admin panel |
| `src/lib/pricing.ts` | Price calculation shared by the booking form and the server |
| `src/lib/catalog.ts` | Cached catalogue read; admin edits invalidate the `catalog` tag |
| `src/components/home` | Landing page sections and the scroll-driven frame sequences |
| `public/frames` | Photo bursts used for scroll animations (`matcha`, `strawberry`, `v60`) |
| `public/menu` | Drink and dessert illustrations from Caprea's menu |
