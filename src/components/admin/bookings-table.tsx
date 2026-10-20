"use client";

import clsx from "clsx";
import { ArrowDownUp, CalendarDays, List, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Booking, BookingKind, BookingStatus } from "@/lib/types";
import { BookingRowCompact, DateTile, guestsOrCups } from "./booking-bits";
import { aed, amountOf, digits, fmtDayLong, relDay } from "./format";
import { Empty, KIND_LABEL, KindBadge, PaymentBadge, STATUS_LABEL, Select, StatusBadge, inputCls } from "./ui";

type Range = "upcoming" | "past" | "all";

export function BookingsTable({ bookings, today }: { bookings: Booking[]; today: string }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all" | "active">("active");
  const [kind, setKind] = useState<BookingKind | "all">("all");
  const [range, setRange] = useState<Range>("upcoming");
  const [desc, setDesc] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const termDigits = digits(term);
    const out = bookings.filter((b) => {
      if (status === "active" ? b.status === "cancelled" : status !== "all" && b.status !== status) return false;
      if (kind !== "all" && b.kind !== kind) return false;
      if (range === "upcoming" && b.event_date < today) return false;
      if (range === "past" && b.event_date >= today) return false;
      if (!term) return true;
      return (
        b.ref.toLowerCase().includes(term) ||
        b.customer_name.toLowerCase().includes(term) ||
        b.customer_email.toLowerCase().includes(term) ||
        (termDigits.length >= 3 && digits(b.customer_phone).includes(termDigits))
      );
    });
    out.sort((a, b) => {
      const c = a.event_date.localeCompare(b.event_date) || a.start_time.localeCompare(b.start_time);
      return desc ? -c : c;
    });
    return out;
  }, [bookings, q, status, kind, range, desc, today]);

  const groups = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of rows) map.set(b.event_date, [...(map.get(b.event_date) ?? []), b]);
    return [...map.entries()];
  }, [rows]);

  const filtered = q || status !== "active" || kind !== "all" || range !== "upcoming";

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="glass rounded-2xl p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-sand/60" />
            <input
              type="search"
              placeholder="Search ref, name, phone or email"
              className={clsx(inputCls, "pl-10")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search bookings"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} aria-label="Status">
            <option value="active">All except cancelled</option>
            <option value="all">All statuses</option>
            {(Object.keys(STATUS_LABEL) as BookingStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
          <Select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} aria-label="Type">
            <option value="all">All types</option>
            {(Object.keys(KIND_LABEL) as BookingKind[]).map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </Select>
          <div className="flex rounded-full border border-sand/20 p-1" role="radiogroup" aria-label="Date range">
            {(["upcoming", "past", "all"] as Range[]).map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={range === r}
                onClick={() => {
                  setRange(r);
                  setDesc(r === "past");
                }}
                className={clsx(
                  "flex-1 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors",
                  range === r ? "bg-sand text-espresso" : "text-cream/65 hover:text-cream",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-cream/50">
          <span>
            {rows.length} {rows.length === 1 ? "booking" : "bookings"}
            {filtered && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setStatus("active");
                  setKind("all");
                  setRange("upcoming");
                  setDesc(false);
                }}
                className="ml-3 inline-flex items-center gap-1 text-sand hover:text-cream"
              >
                <X className="h-3 w-3" /> Reset filters
              </button>
            )}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDesc((d) => !d)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-sand/10 hover:text-cream"
            >
              <ArrowDownUp className="h-3.5 w-3.5" /> Event date {desc ? "newest first" : "soonest first"}
            </button>
            <button
              type="button"
              onClick={() => setView((v) => (v === "list" ? "calendar" : "list"))}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-sand/10 hover:text-cream"
            >
              {view === "list" ? <CalendarDays className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
              {view === "list" ? "Group by date" : "Table view"}
            </button>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <Empty icon={<CalendarDays className="h-6 w-6" />} title={bookings.length ? "No bookings match these filters" : "No bookings yet"}>
          {bookings.length ? "Try another search or date range." : "Bookings made on the website will appear here."}
        </Empty>
      ) : view === "calendar" ? (
        <div className="space-y-4">
          {groups.map(([date, list]) => (
            <section key={date} className="glass flex gap-4 rounded-2xl p-4 sm:gap-6 sm:p-5">
              <div className="flex flex-col items-center gap-2">
                <DateTile date={date} muted={date < today} />
                <span className="text-[0.65rem] uppercase tracking-[0.14em] text-cream/45">{relDay(date, today)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 font-sans text-sm tracking-normal text-cream/60">{fmtDayLong(date)}</h3>
                <div className="-mx-2 divide-y divide-sand/[0.08]">
                  {list.map((b) => (
                    <BookingRowCompact key={b.id} b={b} showDate={false} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="glass hidden overflow-hidden rounded-2xl md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-sand/10 text-[0.68rem] uppercase tracking-[0.16em] text-cream/45">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Event</th>
                  <th className="px-3 py-3.5 font-medium">Customer</th>
                  <th className="px-3 py-3.5 font-medium">Details</th>
                  <th className="px-3 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/[0.07]">
                {rows.map((b) => (
                  <tr key={b.id} className="group relative transition-colors hover:bg-sand/[0.05]">
                    <td className="px-5 py-3.5 align-top">
                      <Link href={`/admin/bookings/${b.id}`} className="after:absolute after:inset-0" aria-label={`Open ${b.ref}`}>
                        <span className="block text-cream">{fmtDayLong(b.event_date).replace(/ \d{4}$/, "")}</span>
                      </Link>
                      <span className="text-xs text-cream/45">
                        {b.start_time} · {relDay(b.event_date, today)}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      <span className="block text-cream">{b.customer_name}</span>
                      <span className="text-xs text-cream/45">{b.ref}</span>
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <KindBadge kind={b.kind} />
                        <span className="text-xs text-cream/60">
                          {[b.package_name, guestsOrCups(b), b.region_name].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 align-top">
                      <div className="flex flex-col items-start gap-1.5">
                        <StatusBadge status={b.status} />
                        <PaymentBadge status={b.payment_status} />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right align-top text-cream/85">
                      {amountOf(b) ? aed(amountOf(b)) : "—"}
                      {b.kind === "custom" && b.quote_amount == null && <span className="block text-xs text-cream/40">estimate</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {rows.map((b) => (
              <li key={b.id}>
                <Link href={`/admin/bookings/${b.id}`} className="glass flex gap-4 rounded-2xl p-4">
                  <DateTile date={b.event_date} muted={b.event_date < today} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="truncate font-medium text-cream">{b.customer_name}</span>
                      <span className="shrink-0 text-sm text-cream/85">{amountOf(b) ? aed(amountOf(b)) : "—"}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-cream/50">
                      {[b.ref, b.start_time, guestsOrCups(b), b.region_name].filter(Boolean).join(" · ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusBadge status={b.status} />
                      <PaymentBadge status={b.payment_status} />
                      <KindBadge kind={b.kind} />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
