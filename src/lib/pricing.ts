// Booking price calculation. Pure, so the booking form shows the same numbers the server stores.

import type { BookingKind, Catalog, CupTier, ExtraUnit } from "@/lib/types";

export type QuoteInput = {
  kind: BookingKind;
  packageId?: string | null;
  /** per_cup bookings: total cups ordered */
  cups?: number | null;
  /** package: signature slugs; per_cup and custom: slug with cups */
  drinks: { slug: string; cups?: number }[];
  addons: { slug: string; qty: number }[];
  extras: { slug: string; qty: number }[];
  regionId?: string | null;
};

export type QuoteLine = { label: string; detail?: string; amount: number | null };

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  addonsTotal: number;
  extrasTotal: number;
  transportFee: number;
  total: number;
  deposit: number;
  /** extras priced "on request" are excluded from the total */
  hasOnRequest: boolean;
  errors: string[];
};

export const aed = (n: number) =>
  `AED ${n.toLocaleString("en-AE", { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 })}`;

export function cupTierFor(cups: number, tiers: CupTier[]) {
  return [...tiers]
    .sort((a, b) => b.min_cups - a.min_cups)
    .find((t) => cups >= t.min_cups && (t.max_cups == null || cups <= t.max_cups));
}

export function minCups(tiers: CupTier[]) {
  return tiers.length ? Math.min(...tiers.map((t) => t.min_cups)) : 0;
}

export function computeQuote(input: QuoteInput, catalog: Catalog): Quote {
  const { settings, menu, packages, cupTiers, regions, extras } = catalog;
  const bySlug = new Map(menu.map((m) => [m.slug, m]));
  const lines: QuoteLine[] = [];
  const errors: string[] = [];
  let subtotal = 0;

  if (input.kind === "package") {
    const pkg = packages.find((p) => p.id === input.packageId);
    if (!pkg) {
      errors.push("Choose a package.");
    } else {
      subtotal = pkg.price;
      lines.push({ label: `${pkg.guests} guests package`, detail: `${pkg.max_signature_drinks} signature drinks`, amount: pkg.price });
      const chosen = input.drinks.filter((d) => bySlug.get(d.slug)?.catering_signature);
      if (chosen.length === 0) errors.push("Pick at least one signature drink.");
      if (chosen.length > pkg.max_signature_drinks)
        errors.push(`This package includes up to ${pkg.max_signature_drinks} signature drinks.`);
    }
  } else if (input.kind === "per_cup") {
    const cups = Math.max(0, Math.floor(input.cups ?? 0));
    const tier = cupTierFor(cups, cupTiers);
    if (!tier) {
      errors.push(`Minimum order is ${minCups(cupTiers)} cups.`);
    } else {
      subtotal = cups * tier.price_per_cup;
      lines.push({ label: `${cups} cups`, detail: `${aed(tier.price_per_cup)} per cup`, amount: subtotal });
    }
    if (input.drinks.length === 0) errors.push("Pick the drinks you'd like served.");
  } else {
    // custom request: an estimate from menu prices; the team confirms the final quote
    for (const d of input.drinks) {
      const item = bySlug.get(d.slug);
      const cups = Math.max(0, Math.floor(d.cups ?? 0));
      if (!item || cups === 0) continue;
      const amount = cups * (item.price ?? 0);
      subtotal += amount;
      lines.push({ label: item.name, detail: `${cups} cups × ${aed(item.price ?? 0)}`, amount });
    }
    if (subtotal === 0) errors.push("Add at least one drink with a number of cups.");
  }

  let addonsTotal = 0;
  for (const a of input.addons) {
    const item = bySlug.get(a.slug);
    if (!item?.catering_addon || a.qty <= 0) continue;
    if (a.qty < settings.addon_min_qty) errors.push(`${item.name}: minimum ${settings.addon_min_qty} pieces.`);
    const unit = item.addon_price ?? item.price ?? 0;
    addonsTotal += unit * a.qty;
    lines.push({ label: item.name, detail: `${a.qty} × ${aed(unit)}`, amount: unit * a.qty });
  }

  let extrasTotal = 0;
  let hasOnRequest = false;
  for (const e of input.extras) {
    const extra = extras.find((x) => x.slug === e.slug);
    if (!extra || e.qty <= 0) continue;
    if (extra.unit === "on_request" || extra.price == null) {
      hasOnRequest = true;
      lines.push({ label: extra.name, detail: "Priced on request", amount: null });
      continue;
    }
    const qty = extra.unit === "per_hour" ? e.qty : 1;
    extrasTotal += extra.price * qty;
    lines.push({
      label: extra.name,
      detail: extra.unit === "per_hour" ? `${qty} h × ${aed(extra.price)}` : undefined,
      amount: extra.price * qty,
    });
  }

  const region = regions.find((r) => r.id === input.regionId);
  const transportFee = region?.fee ?? 0;
  if (!region) errors.push("Choose the event emirate.");
  else lines.push({ label: "Transport", detail: region.name, amount: transportFee });

  const total = subtotal + addonsTotal + extrasTotal + transportFee;
  const deposit = Math.round((total * settings.deposit_percent) / 100);

  return { lines, subtotal, addonsTotal, extrasTotal, transportFee, total, deposit, hasOnRequest, errors };
}

export const unitLabel = (unit: ExtraUnit) =>
  unit === "per_hour" ? "per hour" : unit === "on_request" ? "on request" : "";
