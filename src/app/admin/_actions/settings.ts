"use server";

import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { CATALOG_TAG } from "@/lib/catalog";
import { dbError, runAction, type ActionResult } from "@/lib/admin";

const pricingModeSchema = z.enum(["packages", "per_cup", "both"]);

export async function setPricingMode(mode: z.input<typeof pricingModeSchema>): Promise<ActionResult> {
  return runAction(async ({ supabase }) => {
    const { error, count } = await supabase
      .from("settings")
      .update({ pricing_mode: pricingModeSchema.parse(mode) }, { count: "exact" })
      .eq("id", true);
    dbError(error);
    if (!count) throw new Error("Settings row not found.");
    updateTag(CATALOG_TAG);
    refresh();
  });
}

const int = (min: number, max: number) => z.number().int("Must be a whole number").min(min).max(max);

const settingsSchema = z.object({
  deposit_percent: int(0, 100),
  service_hours: int(1, 24),
  extra_hour_price: z.number().min(0).max(100_000),
  min_notice_days: int(0, 365),
  addon_min_qty: int(0, 1000),
  phone: z.string().trim().min(5, "Phone is required").max(40),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().min(8, "WhatsApp number needs country code and number").max(20)),
  email: z.email("Enter a valid contact email"),
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, ""))
    .pipe(z.string().min(1, "Instagram handle is required").max(60)),
  notify_email: z.email("Enter a valid notification email"),
  terms: z
    .array(z.object({ title: z.string().trim().min(1, "Each term needs a title").max(120), body: z.string().trim().min(1, "Each term needs text").max(2000) }))
    .max(40),
});

export type SettingsInput = z.input<typeof settingsSchema>;

export async function saveSettings(input: SettingsInput): Promise<ActionResult> {
  return runAction(async ({ supabase }) => {
    const data = settingsSchema.parse(input);
    const { error, count } = await supabase.from("settings").update(data, { count: "exact" }).eq("id", true);
    dbError(error);
    if (!count) throw new Error("Settings row not found.");
    updateTag(CATALOG_TAG);
    refresh();
  });
}
