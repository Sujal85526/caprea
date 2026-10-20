"use server";

import { after } from "next/server";
import { z } from "zod";
import { getCatalog } from "@/lib/catalog";
import { sendBookingEmails, type EmailBooking } from "@/lib/email";
import { computeQuote } from "@/lib/pricing";
import { createServiceClient } from "@/lib/supabase/server";
import type { BookingDrink, BookingLine, BookingStatus, PaymentStatus } from "@/lib/types";
import { toQuoteInput, validateAll, type BookingForm, type FieldErrors } from "@/components/booking/model";

export type SubmitResult =
  | { ok: true; ref: string; email: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

const qtyMap = z.record(z.string().max(80), z.number().int().min(0).max(5000));
const text = (max: number) => z.string().max(max).transform((s) => s.trim());

const schema = z.object({
  kind: z.enum(["package", "per_cup", "custom"]),
  packageId: z.uuid().nullable(),
  cups: z.number().int().min(0).max(5000),
  drinks: qtyMap,
  addons: qtyMap,
  extras: qtyMap,
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  startTime: z.string().max(5),
  eventType: z.string().max(40),
  guests: z.string().max(6),
  regionId: z.string().max(40),
  address: text(500),
  notes: text(2000),
  name: text(120),
  phone: text(30),
  email: text(200).pipe(z.string().toLowerCase()),
  agree: z.boolean(),
  website: z.string().max(500),
});

export async function submitBooking(input: BookingForm): Promise<SubmitResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some details look incomplete. Please check the form and try again." };
  }
  const form: BookingForm = parsed.data;
  const kind = parsed.data.kind;

  // Honeypot: bots fill every field. Pretend it worked and store nothing.
  if (form.website) return { ok: true, ref: "CAP-0000", email: "" };

  const catalog = await getCatalog();
  const { settings, packages, regions, menu, extras: extrasCatalog } = catalog;

  if (form.kind === "per_cup" && settings.pricing_mode === "packages") {
    return { ok: false, error: "Ordering by the cup isn't available right now.", fieldErrors: { kind: "Not available." } };
  }

  // Same rules as the form: min notice days, add-on minimums, max signature drinks, etc.
  const fieldErrors = validateAll(form, catalog);
  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: Object.values(fieldErrors)[0] ?? "Please check the form.", fieldErrors };
  }

  // Authoritative price: never trust totals from the client.
  const quote = computeQuote(toQuoteInput(form), catalog);
  if (quote.errors.length) return { ok: false, error: quote.errors[0] };

  const bySlug = new Map(menu.map((m) => [m.slug, m]));
  const pkg = form.kind === "package" ? packages.find((p) => p.id === form.packageId) ?? null : null;
  const region = regions.find((r) => r.id === form.regionId)!;
  const pickedDrinks = Object.entries(form.drinks).filter(([, n]) => n > 0);

  const drinks: BookingDrink[] = pickedDrinks.map(([slug, cups]) => {
    const name = bySlug.get(slug)!.name;
    if (form.kind === "package") return { slug, name, cups: pkg!.cups_per_drink };
    if (form.kind === "custom") return { slug, name, cups };
    return { slug, name };
  });

  const addons: BookingLine[] = Object.entries(form.addons)
    .filter(([, qty]) => qty > 0)
    .map(([slug, qty]) => {
      const item = bySlug.get(slug)!;
      return { slug, name: item.name, qty, unit_price: item.addon_price ?? item.price ?? 0 };
    });

  const extras: BookingLine[] = Object.entries(form.extras)
    .filter(([, qty]) => qty > 0)
    .map(([slug, qty]) => {
      const x = extrasCatalog.find((e) => e.slug === slug)!;
      return { slug, name: x.name, qty, unit_price: x.price, unit: x.unit };
    });
  const extraHours = extras.filter((x) => x.unit === "per_hour").reduce((n, x) => n + x.qty, 0);

  const isRequest = form.kind === "custom";

  const status: BookingStatus = isRequest ? "request" : "confirmed";
  const paymentStatus: PaymentStatus = "unpaid";
  const row = {
    kind,
    status,
    payment_status: paymentStatus,
    customer_name: form.name,
    customer_phone: form.phone,
    customer_email: form.email,
    event_date: form.eventDate!,
    start_time: form.startTime,
    event_type: form.eventType,
    guests: pkg ? pkg.guests : form.kind === "custom" ? Number(form.guests) : null,
    region_id: region.id,
    region_name: region.name,
    address: form.address,
    package_id: pkg?.id ?? null,
    package_name: pkg ? `${pkg.name} · ${pkg.guests} guests` : null,
    cups:
      form.kind === "per_cup"
        ? form.cups
        : form.kind === "custom"
          ? pickedDrinks.reduce((n, [, c]) => n + c, 0)
          : null,
    drinks,
    addons,
    extras,
    extra_hours: extraHours,
    notes: form.notes || null,
    // subtotal = package / cups / drinks; extras_total = add-ons + extras; total = subtotal + extras_total + transport
    subtotal: quote.subtotal,
    transport_fee: quote.transportFee,
    extras_total: quote.addonsTotal + quote.extrasTotal,
    total: quote.total,
    deposit: quote.deposit,
  };

  const db = createServiceClient();
  const { data, error } = await db.from("bookings").insert(row).select("ref").single();
  if (error || !data) {
    console.error("[booking] insert failed:", error);
    return { ok: false, error: "We couldn't save your booking just now. Please try again or WhatsApp us." };
  }

  // TODO(payments): for package / per_cup bookings, start the deposit checkout here
  // (e.g. create a payment session for quote.deposit, store its id on the booking with
  // status "pending", and return its URL so the client redirects to checkout instead of
  // the confirmation page). Until then the team sends the deposit link manually.

  const emailBooking: EmailBooking = { ...row, ref: data.ref, has_on_request: quote.hasOnRequest };
  // Emails go out after the response so the customer isn't kept waiting; failures are logged only.
  after(() => sendBookingEmails(emailBooking, settings));

  return { ok: true, ref: data.ref, email: form.email };
}
