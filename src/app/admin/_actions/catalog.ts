"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { CATALOG_TAG } from "@/lib/catalog";
import { dbError, runAction, type ActionResult } from "@/lib/admin";

const CATALOG_TABLES = ["packages", "menu_items", "cup_tiers", "regions", "extras"] as const;
type CatalogTable = (typeof CATALOG_TABLES)[number];

const id = z.uuid();
const money = z.number().min(0, "Must be 0 or more").max(1_000_000);
const optionalMoney = money.nullable();
const int = (min = 0) => z.number().int("Must be a whole number").min(min);
const text = (label: string, max = 200) => z.string().trim().min(1, `${label} is required`).max(max);
const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((v) => (v ? v : null));
const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers and dashes");

function done() {
  updateTag(CATALOG_TAG);
  refresh();
}

// Packages -------------------------------------------------------------------------

const packageSchema = z.object({
  id: id.optional(),
  name: text("Name", 80),
  guests: int(1),
  max_signature_drinks: int(0),
  cups_per_drink: int(0),
  price: money,
  includes: z.array(z.string().trim().min(1).max(200)).max(20),
  featured: z.boolean(),
  active: z.boolean(),
});

export async function savePackage(input: z.input<typeof packageSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async ({ supabase }) => {
    const { id: rowId, ...data } = packageSchema.parse(input);
    return upsert(supabase, "packages", rowId, data);
  });
}

// Menu items -----------------------------------------------------------------------

const menuSchema = z.object({
  id: id.optional(),
  slug,
  name: text("Name", 80),
  description: optionalText(600),
  category: z.enum(["signature", "matcha", "coffee", "smoothie", "refresher", "dessert", "box"]),
  price: optionalMoney,
  image_url: optionalText(1000),
  best_seller: z.boolean(),
  catering_signature: z.boolean(),
  catering_coffee: z.boolean(),
  catering_addon: z.boolean(),
  addon_price: optionalMoney,
  active: z.boolean(),
});

export async function saveMenuItem(input: z.input<typeof menuSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async ({ supabase }) => {
    const { id: rowId, ...data } = menuSchema.parse(input);
    return upsert(supabase, "menu_items", rowId, data, { column: "category", value: data.category });
  });
}

// Cup tiers, regions, extras ------------------------------------------------------

const cupTierSchema = z
  .object({
    id: id.optional(),
    label: text("Label", 80),
    min_cups: int(1),
    max_cups: int(1).nullable(),
    price_per_cup: money,
    active: z.boolean(),
  })
  .refine((t) => t.max_cups == null || t.max_cups >= t.min_cups, {
    message: "Max cups must be at least the minimum",
    path: ["max_cups"],
  });

export async function saveCupTier(input: z.input<typeof cupTierSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async ({ supabase }) => {
    const { id: rowId, ...data } = cupTierSchema.parse(input);
    return upsert(supabase, "cup_tiers", rowId, data);
  });
}

const regionSchema = z.object({
  id: id.optional(),
  name: text("Name", 80),
  fee: money,
  active: z.boolean(),
});

export async function saveRegion(input: z.input<typeof regionSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async ({ supabase }) => {
    const { id: rowId, ...data } = regionSchema.parse(input);
    return upsert(supabase, "regions", rowId, data);
  });
}

const extraSchema = z.object({
  id: id.optional(),
  slug,
  name: text("Name", 80),
  description: optionalText(600),
  price: optionalMoney,
  unit: z.enum(["flat", "per_hour", "on_request"]),
  active: z.boolean(),
});

export async function saveExtra(input: z.input<typeof extraSchema>): Promise<ActionResult<{ id: string }>> {
  return runAction(async ({ supabase }) => {
    const { id: rowId, ...data } = extraSchema.parse(input);
    if (data.unit === "on_request") data.price = null;
    else if (data.price == null) throw new Error("Set a price, or choose 'on request'.");
    return upsert(supabase, "extras", rowId, data);
  });
}

// Shared row operations -----------------------------------------------------------

const tableSchema = z.enum(CATALOG_TABLES);

export async function setActive(table: CatalogTable, rowId: string, active: boolean): Promise<ActionResult> {
  return runAction(async ({ supabase }) => {
    const t = tableSchema.parse(table);
    const { error } = await supabase.from(t).update({ active: z.boolean().parse(active) }).eq("id", id.parse(rowId));
    dbError(error);
    done();
  });
}

export async function deleteRow(table: CatalogTable, rowId: string): Promise<ActionResult> {
  return runAction(async ({ supabase }) => {
    const t = tableSchema.parse(table);
    const { error, count } = await supabase.from(t).delete({ count: "exact" }).eq("id", id.parse(rowId));
    dbError(error, "delete this");
    if (!count) throw new Error("Nothing was deleted.");
    done();
  });
}

/**
 * Saves a new order for the given rows. The rows keep the same set of sort values they already
 * had (so a reorder inside one menu category doesn't move it relative to other categories).
 */
export async function reorderRows(table: CatalogTable, ids: string[]): Promise<ActionResult> {
  return runAction(async ({ supabase }) => {
    const t = tableSchema.parse(table);
    const list = z.array(id).min(1).max(500).parse(ids);
    const { data: rows, error: readError } = await supabase.from(t).select("id, sort").in("id", list);
    dbError(readError);
    let slots = (rows ?? []).map((r) => r.sort as number).sort((a, b) => a - b);
    if (slots.length !== list.length || new Set(slots).size !== slots.length) {
      const start = slots[0] ?? 1;
      slots = list.map((_, i) => start + i);
    }
    const results = await Promise.all(
      list.map((rowId, i) => supabase.from(t).update({ sort: slots[i] }).eq("id", rowId)),
    );
    dbError(results.find((r) => r.error)?.error ?? null);
    done();
  });
}

type Session = Awaited<ReturnType<typeof import("@/lib/supabase/server").createSessionClient>>;

async function upsert(
  supabase: Session,
  table: CatalogTable,
  rowId: string | undefined,
  data: Record<string, unknown>,
  scope?: { column: string; value: string },
) {
  if (rowId) {
    const { error, count } = await supabase.from(table).update(data, { count: "exact" }).eq("id", rowId);
    dbError(error);
    if (!count) throw new Error("This row no longer exists. Refresh the page.");
    done();
    return { id: rowId };
  }
  // New rows go to the end of the list.
  let lastQuery = supabase.from(table).select("sort");
  if (scope) lastQuery = lastQuery.eq(scope.column, scope.value);
  let { data: last } = await lastQuery.order("sort", { ascending: false }).limit(1);
  if (scope && !last?.length) {
    ({ data: last } = await supabase.from(table).select("sort").order("sort", { ascending: false }).limit(1));
  }
  const sort = (last?.[0]?.sort ?? 0) + 1;
  const { data: created, error } = await supabase.from(table).insert({ ...data, sort }).select("id").single();
  dbError(error);
  done();
  return { id: created!.id as string };
}
