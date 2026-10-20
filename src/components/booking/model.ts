// Booking form model shared by the client flow and the server action.
// Pure (no React, no server-only imports) so both sides run the same rules.

import { computeQuote, minCups, type QuoteInput } from "@/lib/pricing";
import type { BookingKind, Catalog, MenuCategory, MenuItem } from "@/lib/types";

export const DRINK_CATEGORIES: MenuCategory[] = ["signature", "matcha", "coffee", "smoothie", "refresher"];

export const EVENT_TYPES = ["Wedding", "Birthday", "Graduation", "Corporate", "Baby shower", "Other"] as const;

/** 08:00 – 23:30 in 30 minute steps */
export const START_TIMES = Array.from({ length: 32 }, (_, i) => {
  const mins = 8 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

export const MAX_EXTRA_HOURS = 6;

export type StepId = "mode" | "package" | "cups" | "drinks" | "extras" | "event" | "contact" | "review";

export const STEP_LABELS: Record<StepId, string> = {
  mode: "Start",
  package: "Package",
  cups: "Cups",
  drinks: "Drinks",
  extras: "Add-ons",
  event: "Event",
  contact: "Contact",
  review: "Review",
};

export const STEPS: Record<BookingKind, StepId[]> = {
  package: ["mode", "package", "drinks", "extras", "event", "contact", "review"],
  per_cup: ["mode", "cups", "extras", "event", "contact", "review"],
  custom: ["mode", "drinks", "extras", "event", "contact", "review"],
};

export type BookingForm = {
  kind: BookingKind | null;
  packageId: string | null;
  /** per_cup: total cups */
  cups: number;
  /** slug -> cups (package / per_cup: 1 = selected) */
  drinks: Record<string, number>;
  /** slug -> pieces */
  addons: Record<string, number>;
  /** extra slug -> qty (flat / on_request: 0|1, per_hour: hours) */
  extras: Record<string, number>;
  eventDate: string | null; // yyyy-MM-dd
  startTime: string;
  eventType: string;
  guests: string;
  regionId: string;
  address: string;
  notes: string;
  name: string;
  phone: string;
  email: string;
  agree: boolean;
  /** honeypot: real people never see or fill this */
  website: string;
};

export const emptyForm = (): BookingForm => ({
  kind: null,
  packageId: null,
  cups: 0,
  drinks: {},
  addons: {},
  extras: {},
  eventDate: null,
  startTime: "",
  eventType: "",
  guests: "",
  regionId: "",
  address: "",
  notes: "",
  name: "",
  phone: "",
  email: "",
  agree: false,
  website: "",
});

export const isDrink = (m: MenuItem) => DRINK_CATEGORIES.includes(m.category);

export function selectableDrinks(kind: BookingKind, catalog: Catalog) {
  return kind === "package" ? catalog.menu.filter((m) => m.catering_signature) : catalog.menu.filter(isDrink);
}

export function toQuoteInput(f: BookingForm): QuoteInput {
  const picked = Object.entries(f.drinks).filter(([, n]) => n > 0);
  return {
    kind: f.kind ?? "package",
    packageId: f.packageId,
    cups: f.kind === "per_cup" ? f.cups : null,
    drinks: picked.map(([slug, cups]) => (f.kind === "custom" ? { slug, cups } : { slug })),
    addons: Object.entries(f.addons)
      .filter(([, qty]) => qty > 0)
      .map(([slug, qty]) => ({ slug, qty })),
    extras: Object.entries(f.extras)
      .filter(([, qty]) => qty > 0)
      .map(([slug, qty]) => ({ slug, qty })),
    regionId: f.regionId || null,
  };
}

export const quoteFor = (f: BookingForm, catalog: Catalog) => computeQuote(toQuoteInput(f), catalog);

// Dates ----------------------------------------------------------------------------
// The business runs on UAE time, so "today" is today in Asia/Dubai on both sides.

export function todayInDubai(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDaysISO(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const earliestEventDate = (minNoticeDays: number, now = new Date()) =>
  addDaysISO(todayInDubai(now), minNoticeDays);

export const latestEventDate = (now = new Date()) => addDaysISO(todayInDubai(now), 540);

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function formatEventDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Validation -------------------------------------------------------------------------

export type FieldErrors = Partial<Record<string, string>>;

/** Which step owns each field, so a server error can send the customer back to it. */
export const FIELD_STEP: Record<string, StepId> = {
  kind: "mode",
  packageId: "package",
  cups: "cups",
  drinks: "drinks",
  addons: "extras",
  extras: "extras",
  eventDate: "event",
  startTime: "event",
  eventType: "event",
  guests: "event",
  regionId: "event",
  address: "event",
  notes: "event",
  name: "contact",
  phone: "contact",
  email: "contact",
  agree: "contact",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

export function validateStep(step: StepId, f: BookingForm, catalog: Catalog, now = new Date()): FieldErrors {
  const e: FieldErrors = {};
  const { settings, packages, cupTiers, menu, regions } = catalog;
  const bySlug = new Map(menu.map((m) => [m.slug, m]));
  const picked = Object.entries(f.drinks).filter(([, n]) => n > 0);

  switch (step) {
    case "mode":
      if (!f.kind) e.kind = "Choose how you'd like to book.";
      else if (f.kind === "per_cup" && settings.pricing_mode === "packages")
        e.kind = "Ordering by the cup isn't available right now.";
      break;

    case "package": {
      const pkg = packages.find((p) => p.id === f.packageId);
      if (!pkg) e.packageId = "Choose the package that fits your guest list.";
      break;
    }

    case "cups": {
      const min = minCups(cupTiers);
      if (!Number.isFinite(f.cups) || f.cups < min) e.cups = `The minimum order is ${min} cups.`;
      else if (f.cups > 5000) e.cups = "For more than 5,000 cups, send us a custom request.";
      if (picked.length === 0) e.drinks = "Pick at least one drink to serve.";
      else if (picked.some(([slug]) => !bySlug.get(slug) || !isDrink(bySlug.get(slug)!)))
        e.drinks = "One of the drinks is no longer available.";
      break;
    }

    case "drinks": {
      if (f.kind === "package") {
        const pkg = packages.find((p) => p.id === f.packageId);
        const max = pkg?.max_signature_drinks ?? 0;
        if (picked.length === 0) e.drinks = "Pick at least one signature drink.";
        else if (picked.length > max) e.drinks = `Your package includes up to ${max} signature drinks.`;
        else if (picked.some(([slug]) => !bySlug.get(slug)?.catering_signature))
          e.drinks = "One of the drinks is no longer available.";
      } else {
        if (picked.length === 0) e.drinks = "Add at least one drink with a number of cups.";
        else if (picked.some(([slug]) => !bySlug.get(slug) || !isDrink(bySlug.get(slug)!)))
          e.drinks = "One of the drinks is no longer available.";
        else if (picked.some(([, cups]) => cups > 2000)) e.drinks = "That's a lot of cups. Add a note and we'll help.";
      }
      break;
    }

    case "extras": {
      const bad = Object.entries(f.addons).find(([, qty]) => qty > 0 && qty < settings.addon_min_qty);
      if (bad) e.addons = `Add-ons start at ${settings.addon_min_qty} pieces each.`;
      if (Object.entries(f.addons).some(([slug, qty]) => qty > 0 && !bySlug.get(slug)?.catering_addon))
        e.addons = "One of the add-ons is no longer available.";
      if (Object.values(f.addons).some((qty) => qty > 2000)) e.addons = "For more than 2,000 pieces, add a note.";
      for (const [slug, qty] of Object.entries(f.extras)) {
        if (qty <= 0) continue;
        const extra = catalog.extras.find((x) => x.slug === slug);
        if (!extra) e.extras = "One of the extras is no longer available.";
        else if (extra.unit === "per_hour" && qty > MAX_EXTRA_HOURS)
          e.extras = `Up to ${MAX_EXTRA_HOURS} additional hours can be booked online.`;
        else if (extra.unit !== "per_hour" && qty !== 1) e.extras = "Invalid extra.";
      }
      break;
    }

    case "event": {
      const earliest = earliestEventDate(settings.min_notice_days, now);
      if (!f.eventDate || !ISO_DATE.test(f.eventDate)) e.eventDate = "Pick your event date.";
      else if (f.eventDate < earliest)
        e.eventDate = `We need at least ${settings.min_notice_days} days' notice. The earliest date is ${formatEventDate(earliest)}.`;
      else if (f.eventDate > latestEventDate(now)) e.eventDate = "We take bookings up to 18 months ahead.";
      if (!START_TIMES.includes(f.startTime)) e.startTime = "Choose a start time.";
      if (!EVENT_TYPES.includes(f.eventType as (typeof EVENT_TYPES)[number])) e.eventType = "What are we celebrating?";
      if (f.kind === "custom") {
        const g = Number(f.guests);
        if (!f.guests || !Number.isInteger(g) || g < 1) e.guests = "Roughly how many guests?";
        else if (g > 5000) e.guests = "For events above 5,000 guests, please contact us directly.";
      }
      if (!regions.some((r) => r.id === f.regionId)) e.regionId = "Choose the emirate.";
      if (f.address.trim().length < 6) e.address = "Add the venue or address so our team can find you.";
      else if (f.address.length > 500) e.address = "Please keep the address under 500 characters.";
      if (f.notes.length > 2000) e.notes = "Please keep notes under 2,000 characters.";
      break;
    }

    case "contact":
      if (f.name.trim().length < 2) e.name = "Tell us your name.";
      else if (f.name.length > 120) e.name = "That name is too long.";
      if (!PHONE.test(f.phone.trim()) || f.phone.replace(/\D/g, "").length < 7)
        e.phone = "Enter a phone number we can reach you on, e.g. +971 50 123 4567.";
      if (!EMAIL.test(f.email.trim()) || f.email.length > 200) e.email = "Enter a valid email address.";
      if (!f.agree) e.agree = "Please read and accept the booking terms.";
      break;

    case "review":
      break;
  }
  return e;
}

/** Validate every step of the chosen flow; used by the server and before submit. */
export function validateAll(f: BookingForm, catalog: Catalog, now = new Date()): FieldErrors {
  const steps = STEPS[f.kind ?? "package"];
  return Object.assign({}, ...steps.map((s) => validateStep(s, f, catalog, now)));
}
