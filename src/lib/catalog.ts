import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import type { Catalog } from "@/lib/types";

export const CATALOG_TAG = "catalog";

const num = (v: unknown) => (v == null ? null : Number(v));

/** Active menu, packages, pricing and settings. Cached; admin edits call updateTag(CATALOG_TAG). */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);

  const db = createPublicClient();
  const [settings, menu, packages, cupTiers, regions, extras] = await Promise.all([
    db.from("settings").select("*").single(),
    db.from("menu_items").select("*").eq("active", true).order("sort"),
    db.from("packages").select("*").eq("active", true).order("sort"),
    db.from("cup_tiers").select("*").eq("active", true).order("sort"),
    db.from("regions").select("*").eq("active", true).order("sort"),
    db.from("extras").select("*").eq("active", true).order("sort"),
  ]);

  const failed = [settings, menu, packages, cupTiers, regions, extras].find((r) => r.error);
  if (failed?.error) throw new Error(`Catalogue query failed: ${failed.error.message}`);

  // Postgres numerics arrive as strings; normalise to numbers once here.
  return {
    settings: {
      ...settings.data,
      extra_hour_price: Number(settings.data.extra_hour_price),
    },
    menu: menu.data!.map((m) => ({ ...m, price: num(m.price), addon_price: num(m.addon_price) })),
    packages: packages.data!.map((p) => ({ ...p, price: Number(p.price) })),
    cupTiers: cupTiers.data!.map((t) => ({ ...t, price_per_cup: Number(t.price_per_cup) })),
    regions: regions.data!.map((r) => ({ ...r, fee: Number(r.fee) })),
    extras: extras.data!.map((e) => ({ ...e, price: num(e.price) })),
  };
}
