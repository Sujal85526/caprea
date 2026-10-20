import "server-only";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { normaliseBooking, requireAdmin } from "@/lib/admin";
import type { Booking, CupTier, Extra, MenuItem, Package, Region, Settings } from "@/lib/types";

// Admin reads go through the signed-in session client so RLS (is_admin()) applies.

const num = (v: unknown) => (v == null ? null : Number(v));

/** Today's date in the UAE (yyyy-mm-dd), so "upcoming" matches the business's calendar. */
export async function todayUAE(offsetDays = 0) {
  await connection(); // request-time value, never prerendered
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(d);
}

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export async function getBookings(): Promise<Booking[]> {
  const { supabase } = await requireAdmin();
  const rows = check(await supabase.from("bookings").select("*").order("event_date").order("start_time").limit(2000));
  return (rows ?? []).map(normaliseBooking);
}

export async function getBooking(id: string): Promise<Booking> {
  const { supabase } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const row = check(await supabase.from("bookings").select("*").eq("id", id).maybeSingle());
  if (!row) notFound();
  return normaliseBooking(row);
}

export async function getRequests(): Promise<Booking[]> {
  const { supabase } = await requireAdmin();
  const rows = check(
    await supabase
      .from("bookings")
      .select("*")
      .eq("kind", "custom")
      .in("status", ["request", "quoted"])
      .order("created_at", { ascending: false }),
  );
  return (rows ?? []).map(normaliseBooking);
}

export async function getDashboard() {
  const { supabase } = await requireAdmin();
  const today = await todayUAE();
  const in30 = await todayUAE(30);
  const monthStart = `${today.slice(0, 7)}-01`;
  const [y, m] = today.split("-").map(Number);
  const nextMonth = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;

  const [upcoming, requests, thisMonth, nextEvents] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("status", ["confirmed", "pending"])
      .gte("event_date", today)
      .lte("event_date", in30),
    supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .eq("kind", "custom")
      .eq("status", "request")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("bookings")
      .select("total, quote_amount")
      .in("status", ["confirmed", "completed"])
      .gte("event_date", monthStart)
      .lt("event_date", nextMonth),
    supabase
      .from("bookings")
      .select("*")
      .in("status", ["confirmed", "pending", "quoted"])
      .gte("event_date", today)
      .order("event_date")
      .order("start_time")
      .limit(5),
  ]);
  for (const r of [upcoming, requests, thisMonth, nextEvents]) if (r.error) throw new Error(r.error.message);

  const monthRows = thisMonth.data ?? [];
  return {
    upcomingCount: upcoming.count ?? 0,
    requestCount: requests.count ?? 0,
    confirmedThisMonth: monthRows.length,
    revenueThisMonth: monthRows.reduce((s, r) => s + Number(r.quote_amount ?? r.total ?? 0), 0),
    latestRequests: (requests.data ?? []).map(normaliseBooking),
    nextEvents: (nextEvents.data ?? []).map(normaliseBooking),
    monthLabel: new Intl.DateTimeFormat("en-GB", { month: "long", timeZone: "UTC" }).format(new Date(`${monthStart}T00:00:00Z`)),
  };
}

export async function getPackages(): Promise<Package[]> {
  const { supabase } = await requireAdmin();
  const rows = check(await supabase.from("packages").select("*").order("sort").order("guests"));
  return (rows ?? []).map((p) => ({ ...p, price: Number(p.price), includes: p.includes ?? [] }));
}

export async function getMenu(): Promise<MenuItem[]> {
  const { supabase } = await requireAdmin();
  const rows = check(await supabase.from("menu_items").select("*").order("sort").order("name"));
  return (rows ?? []).map((m) => ({ ...m, price: num(m.price), addon_price: num(m.addon_price) }));
}

export async function getPricing(): Promise<{
  mode: Settings["pricing_mode"];
  cupTiers: CupTier[];
  regions: Region[];
  extras: Extra[];
}> {
  const { supabase } = await requireAdmin();
  const [settings, tiers, regions, extras] = await Promise.all([
    supabase.from("settings").select("pricing_mode").single(),
    supabase.from("cup_tiers").select("*").order("sort"),
    supabase.from("regions").select("*").order("sort"),
    supabase.from("extras").select("*").order("sort"),
  ]);
  return {
    mode: check(settings).pricing_mode,
    cupTiers: (check(tiers) ?? []).map((t) => ({ ...t, price_per_cup: Number(t.price_per_cup) })),
    regions: (check(regions) ?? []).map((r) => ({ ...r, fee: Number(r.fee) })),
    extras: (check(extras) ?? []).map((e) => ({ ...e, price: num(e.price) })),
  };
}

export async function getSettings(): Promise<Settings> {
  const { supabase } = await requireAdmin();
  const s = check(await supabase.from("settings").select("*").single()) as Settings & { extra_hour_price: string | number };
  return {
    ...s,
    extra_hour_price: Number(s.extra_hour_price),
    terms: Array.isArray(s.terms) ? s.terms : [],
  };
}

/** Menu lookup for showing drink names/prices on custom requests. */
export async function getMenuPrices(): Promise<Record<string, { name: string; price: number | null }>> {
  const { supabase } = await requireAdmin();
  const rows = check(await supabase.from("menu_items").select("slug, name, price"));
  return Object.fromEntries((rows ?? []).map((m) => [m.slug, { name: m.name, price: num(m.price) }]));
}
