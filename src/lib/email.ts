import "server-only";
import { Resend } from "resend";
import { aed } from "@/lib/pricing";
import type { Booking, Settings } from "@/lib/types";

// Transactional emails for bookings. Failures are logged and never thrown:
// a booking is saved even if Resend is down.

export type EmailBooking = Pick<
  Booking,
  | "ref"
  | "kind"
  | "status"
  | "customer_name"
  | "customer_phone"
  | "customer_email"
  | "event_date"
  | "start_time"
  | "event_type"
  | "guests"
  | "region_name"
  | "address"
  | "package_name"
  | "cups"
  | "drinks"
  | "addons"
  | "extras"
  | "extra_hours"
  | "notes"
  | "subtotal"
  | "transport_fee"
  | "extras_total"
  | "total"
  | "deposit"
> & { has_on_request?: boolean };

const C = {
  espresso: "#361F18",
  espresso900: "#24140F",
  mocha: "#6B4636",
  sand: "#D2B89E",
  sand600: "#B89A7C",
  cream: "#F6EFE6",
  cream200: "#ECE0D1",
};

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://capreacafe.com";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const dateLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T12:00:00Z`),
  );

function timeLabel(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h)) return hhmm;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const kindLabel = (k: Booking["kind"]) =>
  k === "package" ? "Package booking" : k === "per_cup" ? "Per-cup order" : "Custom request";

function row(label: string, value: string, opts: { strong?: boolean } = {}) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(210,184,158,0.18);color:${C.sand};font-size:13px;letter-spacing:0.04em;vertical-align:top;width:42%;">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid rgba(210,184,158,0.18);color:${C.cream};font-size:14px;text-align:right;vertical-align:top;${opts.strong ? "font-weight:600;font-size:16px;" : ""}">${value}</td>
  </tr>`;
}

function section(title: string, inner: string) {
  return `<tr><td style="padding:28px 36px 0 36px;">
    <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${C.sand600};margin:0 0 6px 0;">${esc(title)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${inner}</table>
  </td></tr>`;
}

function summaryHtml(b: EmailBooking) {
  const estimate = b.kind === "custom";
  const event = [
    row("Date", esc(dateLabel(b.event_date))),
    row("Start time", esc(timeLabel(b.start_time))),
    b.event_type ? row("Occasion", esc(b.event_type)) : "",
    b.guests ? row("Guests", esc(b.guests)) : "",
    row("Location", `${esc(b.region_name ?? "")}<br/><span style="color:${C.cream200};font-size:13px;">${esc(b.address)}</span>`),
  ].join("");

  const drinks = b.drinks
    .map((d) => row(d.name, d.cups ? `${esc(d.cups)} cups` : "&#10003;"))
    .join("");
  const addons = b.addons.map((a) => row(a.name, `${esc(a.qty)} pcs`)).join("");
  const extras = b.extras
    .map((x) =>
      row(
        x.name,
        x.unit === "on_request" ? "On request" : x.unit === "per_hour" ? `${esc(x.qty)} h` : "&#10003;",
      ),
    )
    .join("");

  const order = [
    b.package_name ? row("Package", esc(b.package_name)) : "",
    b.cups ? row("Cups", esc(b.cups)) : "",
    drinks,
    addons,
    extras,
  ].join("");

  const totals = [
    row(estimate ? "Drinks (estimate)" : "Package / cups", esc(aed(Number(b.subtotal)))),
    Number(b.extras_total) ? row("Add-ons & extras", esc(aed(Number(b.extras_total)))) : "",
    row("Transport", esc(aed(Number(b.transport_fee)))),
    row(estimate ? "Estimated total" : "Total", esc(aed(Number(b.total))), { strong: true }),
    estimate ? "" : row("50% deposit", esc(aed(Number(b.deposit)))),
  ].join("");

  return (
    section("Your event", event) +
    section(b.kind === "package" ? "Your menu" : "Your selection", order) +
    section(estimate ? "Estimate" : "Payment", totals) +
    (b.has_on_request
      ? `<tr><td style="padding:10px 36px 0 36px;color:${C.cream200};font-size:12px;">Items marked &ldquo;on request&rdquo; are priced separately with our team.</td></tr>`
      : "") +
    (b.notes ? section("Notes", `<tr><td style="padding:10px 0;color:${C.cream};font-size:14px;white-space:pre-line;">${esc(b.notes)}</td></tr>`) : "")
  );
}

function layout(opts: { preheader: string; eyebrow: string; title: string; intro: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="dark light"/><title>${esc(opts.title)}</title></head>
<body style="margin:0;padding:0;background:${C.espresso900};font-family:'Josefin Sans',Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.espresso900};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.espresso};border:1px solid rgba(210,184,158,0.22);border-radius:24px;overflow:hidden;">
      <tr><td align="center" style="padding:36px 36px 8px 36px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;letter-spacing:0.32em;color:${C.sand};text-transform:uppercase;">Caprea</div>
        <div style="font-size:10px;letter-spacing:0.4em;color:${C.sand600};text-transform:uppercase;margin-top:6px;">Coffee &amp; Matcha Catering</div>
      </td></tr>
      <tr><td style="padding:20px 36px 0 36px;"><div style="height:1px;background:rgba(210,184,158,0.25);"></div></td></tr>
      <tr><td align="center" style="padding:28px 36px 0 36px;">
        <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:${C.sand};">${esc(opts.eyebrow)}</div>
        <h1 style="margin:12px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;line-height:1.2;color:${C.cream};">${esc(opts.title)}</h1>
        <p style="margin:14px 0 0 0;font-size:15px;line-height:1.6;color:${C.cream200};">${opts.intro}</p>
      </td></tr>
      ${opts.body}
      <tr><td style="padding:32px 36px 36px 36px;">
        <div style="background:rgba(210,184,158,0.08);border:1px solid rgba(210,184,158,0.2);border-radius:16px;padding:18px 20px;color:${C.cream200};font-size:13px;line-height:1.6;">${opts.footer}</div>
      </td></tr>
    </table>
    <div style="max-width:600px;color:${C.sand600};font-size:11px;letter-spacing:0.08em;padding:18px 12px;">Caprea &middot; Abu Dhabi &middot; <a href="${SITE}" style="color:${C.sand};text-decoration:none;">capreacafe.com</a></div>
  </td></tr>
</table>
</body></html>`;
}

function contactLine(s: Settings) {
  return `Questions? WhatsApp us on <a href="https://wa.me/${esc(s.whatsapp)}" style="color:${C.sand};">${esc(s.phone)}</a> or reply to this email.`;
}

export function customerEmail(b: EmailBooking, s: Settings) {
  const first = esc(b.customer_name.split(" ")[0]);
  const link = `${SITE}/booking/${encodeURIComponent(b.ref)}?e=${encodeURIComponent(b.customer_email)}`;
  const button = `<tr><td align="center" style="padding:28px 36px 0 36px;"><a href="${link}" style="display:inline-block;background:${C.sand};color:${C.espresso};text-decoration:none;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;padding:14px 28px;border-radius:999px;">View your booking</a></td></tr>`;

  if (b.kind === "custom") {
    return {
      subject: `Request received – ${b.ref}`,
      html: layout({
        preheader: `We've received your custom request ${b.ref}. Our team will confirm your quote shortly.`,
        eyebrow: `Request ${b.ref}`,
        title: "Request received",
        intro: `Thank you, ${first}. We've received your custom request and our team will review it and send you a confirmed quote shortly. The total below is an <strong style="color:${C.cream};">estimate</strong>.`,
        body: summaryHtml(b) + button,
        footer: `Your date is not reserved until you approve the quote and pay the ${s.deposit_percent}% deposit. ${contactLine(s)}`,
      }),
    };
  }
  return {
    subject: `Booking confirmed – ${b.ref}`,
    html: layout({
      preheader: `Your Caprea booking ${b.ref} is confirmed. We'll send your ${s.deposit_percent}% deposit link shortly.`,
      eyebrow: `Booking ${b.ref}`,
      title: "Your booking is confirmed",
      intro: `Thank you, ${first}. We can't wait to serve your guests. We'll send your <strong style="color:${C.cream};">${s.deposit_percent}% deposit link (${esc(aed(Number(b.deposit)))})</strong> shortly to secure your date.`,
      body: summaryHtml(b) + button,
      footer: `The remaining balance is due before the event as per our booking terms. ${contactLine(s)}`,
    }),
  };
}

export function adminEmail(b: EmailBooking) {
  const contact = [
    row("Name", esc(b.customer_name)),
    row("Phone", `<a href="tel:${esc(b.customer_phone.replace(/\s/g, ""))}" style="color:${C.sand};">${esc(b.customer_phone)}</a>`),
    row("Email", `<a href="mailto:${esc(b.customer_email)}" style="color:${C.sand};">${esc(b.customer_email)}</a>`),
  ].join("");
  return {
    subject: `New ${b.kind === "custom" ? "request" : "booking"} ${b.ref} · ${dateLabel(b.event_date)} · ${aed(Number(b.total))}`,
    html: layout({
      preheader: `${kindLabel(b.kind)} from ${b.customer_name} for ${dateLabel(b.event_date)}.`,
      eyebrow: kindLabel(b.kind),
      title: `${b.ref} · ${b.customer_name}`,
      intro:
        b.kind === "custom"
          ? "A new custom request needs a quote. Review it in the admin panel."
          : "A new booking was confirmed online. Payment status: <strong>unpaid</strong>. Send the deposit link.",
      body: section("Customer", contact) + summaryHtml(b),
      footer: `Open the admin panel: <a href="${SITE}/admin" style="color:${C.sand};">${SITE}/admin</a>`,
    }),
  };
}

/** Sends the customer confirmation and the admin notification. Never throws. */
export async function sendBookingEmails(b: EmailBooking, settings: Settings) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) {
    console.warn("[email] RESEND_API_KEY / RESEND_FROM not set; skipping booking emails for", b.ref);
    return;
  }
  const resend = new Resend(key);
  // Test bookings (Resend's @resend.dev sink addresses) and BOOKING_NOTIFY_EMAIL keep
  // admin notifications out of the real inbox during development.
  const isTest = b.customer_email.endsWith("@resend.dev");
  const notifyTo = isTest ? "delivered@resend.dev" : process.env.BOOKING_NOTIFY_EMAIL || settings.notify_email;

  const jobs = [
    { to: b.customer_email, replyTo: settings.email, ...customerEmail(b, settings), label: "customer" },
    ...(notifyTo ? [{ to: notifyTo, replyTo: b.customer_email, ...adminEmail(b), label: "admin" }] : []),
  ];

  await Promise.all(
    jobs.map(async ({ label, ...msg }) => {
      try {
        const { error } = await resend.emails.send({ from, ...msg });
        if (error) console.error(`[email] ${label} email for ${b.ref} failed:`, error);
      } catch (err) {
        console.error(`[email] ${label} email for ${b.ref} threw:`, err);
      }
    }),
  );
}
