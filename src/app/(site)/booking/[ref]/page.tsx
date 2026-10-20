import type { Metadata } from "next";
import { Check, Clock, MessageCircle } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { formatEventDate, formatTime } from "@/components/booking/model";
import { ButtonLink } from "@/components/ui/button";
import { getCatalog } from "@/lib/catalog";
import { aed } from "@/lib/pricing";
import { createServiceClient } from "@/lib/supabase/server";
import type { Booking, Settings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Your booking",
  robots: { index: false, follow: false },
};

// Only fields that are safe to show back to the customer who made the booking.
const PUBLIC_COLUMNS =
  "ref, kind, status, payment_status, customer_name, customer_email, event_date, start_time, event_type, guests, region_name, address, package_name, cups, drinks, addons, extras, extra_hours, notes, subtotal, transport_fee, extras_total, total, deposit, quote_amount";

type PublicBooking = Pick<
  Booking,
  | "ref"
  | "kind"
  | "status"
  | "payment_status"
  | "customer_name"
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
  | "quote_amount"
>;

export default function BookingPage({ params, searchParams }: PageProps<"/booking/[ref]">) {
  return (
    <div className="grain relative isolate overflow-clip">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-[34rem] w-[56rem] -translate-x-1/2 rounded-full bg-sand/[0.09] blur-[120px]" />
      </div>
      <div className="mx-auto max-w-5xl px-5 pt-32 pb-28 sm:px-8 md:pt-40">
        <Suspense fallback={<Skeleton />}>
          <Confirmation params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function Confirmation({
  params,
  searchParams,
}: {
  params: PageProps<"/booking/[ref]">["params"];
  searchParams: PageProps<"/booking/[ref]">["searchParams"];
}) {
  const [{ ref }, sp, catalog] = await Promise.all([params, searchParams, getCatalog()]);
  const email = one(sp.e)?.trim().toLowerCase();
  const cleanRef = decodeURIComponent(ref).toUpperCase();

  if (!email || !/^CAP-\d{1,10}$/.test(cleanRef)) return <Generic settings={catalog.settings} />;

  const { data, error } = await createServiceClient()
    .from("bookings")
    .select(PUBLIC_COLUMNS)
    .eq("ref", cleanRef)
    .maybeSingle<PublicBooking>();
  if (error) console.error("[booking page] lookup failed:", error);
  if (!data || data.customer_email.toLowerCase() !== email) return <Generic settings={catalog.settings} bookingRef={cleanRef} />;

  return <Details b={data} settings={catalog.settings} />;
}

function whatsappHref(settings: Settings, text: string) {
  return `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

function SuccessMark() {
  return (
    <span className="relative mx-auto grid size-20 place-items-center">
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-sand/20 [animation-duration:2.4s] [animation-iteration-count:2]" />
      <span className="relative grid size-20 place-items-center rounded-full border border-sand/50 bg-sand/10">
        <span className="grid size-12 place-items-center rounded-full bg-sand text-espresso">
          <Check className="size-6" strokeWidth={2.5} />
        </span>
      </span>
    </span>
  );
}

function Generic({ settings, bookingRef }: { settings: Settings; bookingRef?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <SuccessMark />
      <p className="eyebrow mt-8 text-sand">Thank you</p>
      <h1 className="mt-4 font-display text-5xl uppercase text-cream md:text-6xl">Booking received</h1>
      <p className="mx-auto mt-6 max-w-lg leading-relaxed text-cream/70">
        If you&apos;ve just booked with us, your confirmation is on its way to your inbox with every detail of your event.
        Can&apos;t find it? Message us and we&apos;ll help right away.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href={whatsappHref(settings, bookingRef ? `Hi Caprea, about my booking ${bookingRef}` : "Hi Caprea, about my booking")} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" /> WhatsApp us
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}

function Card({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`glass rounded-3xl p-6 sm:p-7 ${className ?? ""}`}>
      <h2 className="eyebrow text-sand">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Row({ k, v, strong }: { k: ReactNode; v: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-sand/10 py-3 text-sm last:border-0">
      <dt className="text-cream/55">{k}</dt>
      <dd className={strong ? "text-right font-display text-2xl text-cream" : "text-right text-cream"}>{v}</dd>
    </div>
  );
}

function Details({ b, settings }: { b: PublicBooking; settings: Settings }) {
  const isRequest = b.kind === "custom";
  const first = b.customer_name.split(" ")[0];
  const steps = isRequest
    ? [
        { t: "Request received", d: "A copy of your request has been sent to your email." },
        { t: "We prepare your quote", d: "Our team reviews your menu and confirms availability for your date." },
        { t: "Approve & pay deposit", d: `Secure your date with a ${settings.deposit_percent}% deposit once you're happy with the quote.` },
        { t: "Event day", d: "We arrive early to set up the cart and start pouring on time." },
      ]
    : [
        { t: "Booking confirmed", d: "Your confirmation has been sent to your email." },
        { t: `${settings.deposit_percent}% deposit link`, d: `We'll send your secure payment link for ${aed(Number(b.deposit))} shortly.` },
        { t: "Final balance", d: "The remaining balance is due before your event, as per our booking terms." },
        { t: "Event day", d: "We arrive early to set up the cart and start pouring on time." },
      ];

  return (
    <div>
      <header className="mx-auto max-w-2xl text-center">
        <SuccessMark />
        <p className="eyebrow mt-8 text-sand">
          {isRequest ? "Request" : "Booking"} {b.ref}
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase text-cream md:text-7xl">
          {isRequest ? "Request received" : "Booking confirmed"}
        </h1>
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-cream/70">
          {isRequest
            ? `Thank you, ${first}. Our team will review your selection and send your confirmed quote to ${b.customer_email}.`
            : `Thank you, ${first}. We can't wait to serve your guests. We'll send your ${settings.deposit_percent}% deposit link to ${b.customer_email} shortly.`}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-sand/40 bg-sand/10 px-4 py-2 text-[0.62rem] text-cream">
            <span className="size-1.5 rounded-full bg-matcha" />
            {b.status === "request" ? "Awaiting quote" : b.status === "confirmed" ? "Confirmed" : b.status}
          </span>
          {!isRequest && (
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-sand/25 px-4 py-2 text-[0.62rem] text-cream/75">
              <Clock className="size-3" />
              {b.payment_status === "unpaid" ? "Deposit pending" : b.payment_status.replace("_", " ")}
            </span>
          )}
        </div>
      </header>

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        <Card title="Your event">
          <dl>
            <Row k="Date" v={formatEventDate(b.event_date)} />
            <Row k="Start time" v={formatTime(b.start_time)} />
            {b.event_type && <Row k="Occasion" v={b.event_type} />}
            {b.guests && <Row k="Guests" v={b.guests} />}
            <Row k="Location" v={<>{b.region_name}<span className="block text-xs whitespace-pre-line text-cream/55">{b.address}</span></>} />
          </dl>
        </Card>

        <Card title={isRequest ? "Your selection" : "Your menu"}>
          <dl>
            {b.package_name && <Row k="Package" v={b.package_name} />}
            {b.kind === "per_cup" && b.cups && <Row k="Cups" v={b.cups} />}
            {b.drinks.map((d) => (
              <Row key={d.slug} k={d.name} v={d.cups ? `${d.cups} cups` : <Check className="ml-auto size-4 text-sand" />} />
            ))}
            {b.addons.map((a) => (
              <Row key={a.slug} k={a.name} v={`${a.qty} pcs`} />
            ))}
            {b.extras.map((x) => (
              <Row
                key={x.slug}
                k={x.name}
                v={x.unit === "on_request" ? "On request" : x.unit === "per_hour" ? `${x.qty} h` : <Check className="ml-auto size-4 text-sand" />}
              />
            ))}
          </dl>
        </Card>

        <Card title={isRequest ? "Estimate" : "Payment"}>
          <dl>
            <Row k={isRequest ? "Drinks (estimate)" : b.kind === "package" ? "Package" : "Cups"} v={aed(Number(b.subtotal))} />
            {Number(b.extras_total) > 0 && <Row k="Add-ons & extras" v={aed(Number(b.extras_total))} />}
            <Row k={`Transport · ${b.region_name}`} v={aed(Number(b.transport_fee))} />
            <Row k={isRequest ? "Estimated total" : "Total"} v={aed(Number(b.quote_amount ?? b.total))} strong />
            {!isRequest && <Row k={`${settings.deposit_percent}% deposit`} v={<span className="text-sand">{aed(Number(b.deposit))}</span>} />}
          </dl>
          {isRequest && (
            <p className="mt-3 text-xs leading-relaxed text-cream/50">This is an estimate. Our team will confirm your final quote.</p>
          )}
        </Card>

        <Card title="What happens next">
          <ol className="relative space-y-6 pl-10">
            <span aria-hidden className="absolute top-2 bottom-2 left-[0.9rem] w-px bg-sand/20" />
            {steps.map((s, i) => (
              <li key={s.t} className="relative">
                <span
                  className={`absolute top-0 -left-10 grid size-7 place-items-center rounded-full text-xs tabular-nums ${
                    i === 0 ? "bg-sand text-espresso" : "border border-sand/30 bg-espresso text-sand"
                  }`}
                >
                  {i === 0 ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <p className="text-cream">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-cream/55">{s.d}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {b.notes && (
        <Card title="Your notes" className="mt-5">
          <p className="text-sm leading-relaxed whitespace-pre-line text-cream/75">{b.notes}</p>
        </Card>
      )}

      <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href={whatsappHref(settings, `Hi Caprea, about my ${isRequest ? "request" : "booking"} ${b.ref}`)} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-4" /> WhatsApp us
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
      <p className="mt-6 text-center text-xs text-cream/45">
        Keep your reference <span className="text-sand">{b.ref}</span> handy · {settings.phone} · {settings.email}
      </p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-2xl text-center" aria-busy>
      <div className="mx-auto size-20 animate-pulse rounded-full bg-sand/10" />
      <div className="mx-auto mt-8 h-3 w-32 animate-pulse rounded-full bg-sand/15" />
      <div className="mx-auto mt-5 h-14 w-3/4 animate-pulse rounded-2xl bg-sand/10" />
      <div className="mx-auto mt-6 h-4 w-2/3 animate-pulse rounded-full bg-sand/10" />
      <span className="sr-only">Loading your booking…</span>
    </div>
  );
}
