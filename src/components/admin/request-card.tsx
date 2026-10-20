"use client";

import { ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { updateBooking } from "@/app/admin/_actions/bookings";
import type { Booking } from "@/lib/types";
import { DateTile } from "./booking-bits";
import { aed, fmtAgo, relDay, telLink, waLink } from "./format";
import { NumberInput, PendingBtn, useAction } from "./client";
import { Btn, Field, StatusBadge, btnCls, inputCls } from "./ui";

export function RequestCard({
  booking: b,
  prices,
  today,
}: {
  booking: Booking;
  prices: Record<string, { name: string; price: number | null }>;
  today: string;
}) {
  const [quote, setQuote] = useState<number | null>(b.quote_amount);
  const [pending, run] = useAction();
  const [confirmPending, runConfirm] = useAction();
  const [declinePending, runDecline] = useAction();
  const totalCups = b.drinks.reduce((s, d) => s + (d.cups ?? 0), 0);

  return (
    <article className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex gap-4 md:w-64 md:shrink-0 md:flex-col">
          <DateTile date={b.event_date} />
          <div className="min-w-0 space-y-1">
            <p className="text-xs text-sand/80">
              {relDay(b.event_date, today)} · {b.start_time}
            </p>
            <h3 className="truncate font-sans text-lg font-medium tracking-normal text-cream">{b.customer_name}</h3>
            <p className="text-xs text-cream/45">
              {b.ref} · received {fmtAgo(b.created_at)}
            </p>
            <div className="pt-1">
              <StatusBadge status={b.status} />
            </div>
            <div className="flex gap-1 pt-2">
              <a href={telLink(b.customer_phone)} className={btnCls("ghost", "icon")} aria-label={`Call ${b.customer_name}`}>
                <Phone className="h-4 w-4" />
              </a>
              <a href={waLink(b.customer_phone)} target="_blank" rel="noreferrer" className={btnCls("ghost", "icon")} aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href={`mailto:${b.customer_email}`} className={btnCls("ghost", "icon")} aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
              <Link href={`/admin/bookings/${b.id}`} className={btnCls("ghost", "icon")} aria-label="Open booking">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-sm text-cream/65">
            {[b.event_type, b.guests ? `${b.guests} guests` : null, b.region_name, totalCups ? `${totalCups} cups` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {b.drinks.length > 0 && (
            <ul className="divide-y divide-sand/[0.07] rounded-xl border border-sand/10 text-sm">
              {b.drinks.map((d) => {
                const price = prices[d.slug]?.price;
                return (
                  <li key={d.slug} className="flex items-center justify-between gap-3 px-3.5 py-2">
                    <span className="text-cream/85">
                      {d.name}
                      {d.cups != null && <span className="text-cream/45"> × {d.cups}</span>}
                    </span>
                    <span className="text-xs tabular-nums text-cream/50">
                      {price != null && d.cups != null ? aed(price * d.cups) : ""}
                    </span>
                  </li>
                );
              })}
              {[...b.addons, ...b.extras].map((a) => (
                <li key={`x-${a.slug}`} className="flex items-center justify-between gap-3 px-3.5 py-2">
                  <span className="text-cream/70">
                    {a.name}
                    {a.qty > 1 && <span className="text-cream/45"> × {a.qty}</span>}
                  </span>
                  <span className="text-xs tabular-nums text-cream/50">
                    {a.unit_price != null ? aed(a.unit_price * (a.unit === "flat" ? 1 : a.qty)) : "on request"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {b.notes && <p className="whitespace-pre-line rounded-xl bg-sand/[0.05] px-3.5 py-2.5 text-sm text-cream/70">“{b.notes}”</p>}
          <p className="text-sm text-cream/60">
            Estimate incl. transport <span className="text-cream">{aed(b.total)}</span>
          </p>
        </div>

        <div className="space-y-3 md:w-56 md:shrink-0">
          <Field label="Quote (AED)">
            <NumberInput
              min={0}
              step="0.01"
              allowEmpty
              className={inputCls}
              value={quote}
              onChange={setQuote}
              placeholder={String(b.total || "")}
            />
          </Field>
          {b.status === "request" ? (
            <PendingBtn
              className="w-full"
              pending={pending}
              disabled={quote == null}
              onClick={() => run(() => updateBooking(b.id, { quote_amount: quote, status: "quoted" }), { success: `${b.ref} marked quoted` })}
            >
              Send quote
            </PendingBtn>
          ) : (
            <PendingBtn
              className="w-full"
              variant="outline"
              pending={pending}
              disabled={quote == null || quote === b.quote_amount}
              onClick={() => run(() => updateBooking(b.id, { quote_amount: quote }), { success: "Quote updated" })}
            >
              Update quote
            </PendingBtn>
          )}
          <PendingBtn
            className="w-full"
            variant={b.status === "quoted" ? "primary" : "outline"}
            pending={confirmPending}
            disabled={quote == null}
            onClick={() =>
              runConfirm(() => updateBooking(b.id, { quote_amount: quote, status: "confirmed" }), {
                success: `${b.ref} confirmed`,
              })
            }
          >
            Mark confirmed
          </PendingBtn>
          <Btn
            size="sm"
            variant="ghost"
            className="w-full"
            disabled={declinePending}
            onClick={() => runDecline(() => updateBooking(b.id, { status: "cancelled" }), { success: `${b.ref} declined` })}
          >
            Decline
          </Btn>
          <p className="text-[0.7rem] leading-relaxed text-cream/40">
            “Send quote” saves the price and marks the request quoted. Share it with the customer by WhatsApp or email.
          </p>
        </div>
      </div>
    </article>
  );
}
