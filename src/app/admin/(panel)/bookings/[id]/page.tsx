import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { BookingManage } from "@/components/admin/booking-manage";
import { aed, drinkEstimate, fmtDayLong, fmtStamp, relDay, telLink, waLink } from "@/components/admin/format";
import { Card, KindBadge, PaymentBadge, SectionTitle, Skeleton, StatusBadge, btnCls } from "@/components/admin/ui";
import { unitLabel } from "@/lib/pricing";
import type { Booking } from "@/lib/types";
import { getBooking, getMenuPrices, todayUAE } from "../../../_lib/data";

export const metadata: Metadata = { title: "Booking" };

export default function BookingPage({ params }: PageProps<"/admin/bookings/[id]">) {
  return (
    <>
      <Link href="/admin/bookings" className="mb-6 inline-flex items-center gap-1.5 text-sm text-sand/80 hover:text-cream">
        <ArrowLeft className="h-4 w-4" /> All bookings
      </Link>
      <Suspense fallback={<DetailSkeleton />}>
        {params.then(({ id }) => (
          <BookingDetail id={id} />
        ))}
      </Suspense>
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
      <dt className="w-36 shrink-0 text-xs uppercase tracking-[0.14em] text-cream/45 sm:pt-0.5">{label}</dt>
      <dd className="text-sm text-cream/90">{children}</dd>
    </div>
  );
}

function Line({ label, detail, amount, strong }: { label: ReactNode; detail?: ReactNode; amount: ReactNode; strong?: boolean }) {
  return (
    <div className={"flex items-baseline justify-between gap-4 py-2 " + (strong ? "text-cream" : "text-cream/80")}>
      <div className="min-w-0">
        <span className={strong ? "font-semibold" : ""}>{label}</span>
        {detail && <span className="ml-2 text-xs text-cream/45">{detail}</span>}
      </div>
      <span className={"shrink-0 tabular-nums " + (strong ? "font-semibold" : "")}>{amount}</span>
    </div>
  );
}

async function BookingDetail({ id }: { id: string }) {
  const [b, prices] = await Promise.all([getBooking(id), getMenuPrices()]);
  const today = await todayUAE();
  const estimate = b.kind === "custom" ? drinkEstimate(b, prices) : 0;
  const totalCups = b.drinks.reduce((s, d) => s + (d.cups ?? 0), 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2 text-sand/70">
            {b.ref} · booked {fmtStamp(b.created_at)}
          </p>
          <h1 className="text-4xl text-cream sm:text-5xl">{b.customer_name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={b.status} />
            <PaymentBadge status={b.payment_status} />
            <KindBadge kind={b.kind} />
          </div>
        </div>
        <QuickLinks b={b} />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <SectionTitle>Event</SectionTitle>
            <dl className="divide-y divide-sand/[0.07]">
              <Row label="Date">
                {fmtDayLong(b.event_date)} <span className="ml-2 text-xs text-sand/80">{relDay(b.event_date, today)}</span>
              </Row>
              <Row label="Start time">{b.start_time}</Row>
              {b.event_type && <Row label="Occasion">{b.event_type}</Row>}
              {b.guests != null && <Row label="Guests">{b.guests}</Row>}
              <Row label="Emirate">{b.region_name ?? "—"}</Row>
              <Row label="Address">
                <span className="whitespace-pre-line">{b.address}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.address}, ${b.region_name ?? ""} UAE`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-xs text-sand underline-offset-4 hover:underline"
                >
                  Map
                </a>
              </Row>
              {b.extra_hours > 0 && <Row label="Extra hours">{b.extra_hours}</Row>}
            </dl>
          </Card>

          <Card>
            <SectionTitle>Order</SectionTitle>
            <dl className="divide-y divide-sand/[0.07]">
              {b.kind === "package" && <Row label="Package">{b.package_name ?? "—"}</Row>}
              {b.kind === "per_cup" && <Row label="Cups">{b.cups ?? "—"}</Row>}
              <Row label={b.kind === "package" ? "Signature drinks" : "Drinks"}>
                {b.drinks.length ? (
                  <ul className="space-y-1">
                    {b.drinks.map((d) => (
                      <li key={d.slug}>
                        {d.name}
                        {d.cups != null && <span className="text-cream/50"> · {d.cups} cups</span>}
                        {b.kind === "custom" && prices[d.slug]?.price != null && d.cups != null && (
                          <span className="text-cream/40"> · {aed(d.cups * (prices[d.slug].price ?? 0))}</span>
                        )}
                      </li>
                    ))}
                    {totalCups > 0 && b.kind !== "package" && <li className="text-xs text-cream/45">{totalCups} cups in total</li>}
                  </ul>
                ) : (
                  "—"
                )}
              </Row>
              {b.addons.length > 0 && (
                <Row label="Add-ons">
                  <ul className="space-y-1">
                    {b.addons.map((a) => (
                      <li key={a.slug}>
                        {a.name} <span className="text-cream/50">× {a.qty}</span>
                      </li>
                    ))}
                  </ul>
                </Row>
              )}
              {b.extras.length > 0 && (
                <Row label="Extras">
                  <ul className="space-y-1">
                    {b.extras.map((e) => (
                      <li key={e.slug}>
                        {e.name}
                        {e.unit === "per_hour" && <span className="text-cream/50"> × {e.qty} h</span>}
                        {(e.unit === "on_request" || e.unit_price == null) && <span className="text-gold/80"> · price on request</span>}
                      </li>
                    ))}
                  </ul>
                </Row>
              )}
              {b.notes && (
                <Row label="Customer notes">
                  <span className="whitespace-pre-line">{b.notes}</span>
                </Row>
              )}
            </dl>
          </Card>

          <Card>
            <SectionTitle hint={b.kind === "custom" ? "Totals on a custom request are an estimate until you set a quote." : undefined}>
              Totals
            </SectionTitle>
            <div className="divide-y divide-sand/[0.07] text-sm">
              <Line
                label={b.kind === "package" ? "Package" : b.kind === "per_cup" ? "Cups" : "Drinks"}
                detail={b.kind === "custom" && estimate !== b.subtotal ? `menu prices ${aed(estimate)}` : undefined}
                amount={aed(b.subtotal)}
              />
              {b.addons.map((a) => (
                <Line key={a.slug} label={a.name} detail={`${a.qty} × ${aed(a.unit_price ?? 0)}`} amount={aed((a.unit_price ?? 0) * a.qty)} />
              ))}
              {b.extras.map((e) => (
                <Line
                  key={e.slug}
                  label={e.name}
                  detail={e.unit_price == null ? "on request" : e.unit ? unitLabel(e.unit) : undefined}
                  amount={e.unit_price == null ? "—" : aed(e.unit_price * (e.unit === "per_hour" ? e.qty : 1))}
                />
              ))}
              <Line label="Transport" detail={b.region_name ?? undefined} amount={aed(b.transport_fee)} />
              <Line label={b.kind === "custom" ? "Estimated total" : "Total"} amount={aed(b.total)} strong />
              {b.quote_amount != null && <Line label="Quoted price" amount={aed(b.quote_amount)} strong />}
              <Line label="Deposit due" amount={aed(b.deposit)} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <SectionTitle>Customer</SectionTitle>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-cream/45">Name</dt>
                <dd className="text-cream/90">{b.customer_name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-cream/45">Phone</dt>
                <dd>
                  <a href={telLink(b.customer_phone)} className="text-cream/90 hover:text-sand">
                    {b.customer_phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-cream/45">Email</dt>
                <dd className="break-all">
                  <a href={`mailto:${b.customer_email}`} className="text-cream/90 hover:text-sand">
                    {b.customer_email}
                  </a>
                </dd>
              </div>
            </dl>
          </Card>
          <BookingManage booking={b} />
          <p className="px-1 text-xs text-cream/35">Last updated {fmtStamp(b.updated_at)}</p>
        </div>
      </div>
    </div>
  );
}

function QuickLinks({ b }: { b: Booking }) {
  const subject = encodeURIComponent(`Your Caprea booking ${b.ref}`);
  return (
    <div className="flex flex-wrap gap-2">
      <a href={telLink(b.customer_phone)} className={btnCls("outline", "md")}>
        <Phone className="h-4 w-4" /> Call
      </a>
      <a href={waLink(b.customer_phone)} target="_blank" rel="noreferrer" className={btnCls("outline", "md")}>
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
      <a href={`mailto:${b.customer_email}?subject=${subject}`} className={btnCls("outline", "md")}>
        <Mail className="h-4 w-4" /> Email
      </a>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-24 max-w-md" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-56" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
