import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Booking } from "@/lib/types";
import { aed, amountOf, parseDay } from "./format";
import { KindBadge, StatusBadge } from "./ui";

/** Small calendar tile: weekday, day number, month. */
export function DateTile({ date, muted }: { date: string; muted?: boolean }) {
  const d = parseDay(date);
  return (
    <div
      className={
        "flex h-fit w-14 shrink-0 flex-col items-center self-start rounded-xl border py-1.5 text-center " +
        (muted ? "border-cream/10 text-cream/45" : "border-sand/25 bg-sand/[0.06] text-cream")
      }
    >
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-sand/80">{format(d, "EEE")}</span>
      <span className="font-display text-2xl leading-none">{format(d, "d")}</span>
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-cream/50">{format(d, "MMM")}</span>
    </div>
  );
}

export function guestsOrCups(b: Booking) {
  if (b.kind === "per_cup" && b.cups) return `${b.cups} cups`;
  if (b.guests) return `${b.guests} guests`;
  const cups = b.drinks.reduce((s, d) => s + (d.cups ?? 0), 0);
  return cups ? `${cups} cups` : "";
}

/** Compact clickable row for lists on the dashboard. */
export function BookingRowCompact({ b, showDate = true }: { b: Booking; showDate?: boolean }) {
  return (
    <Link
      href={`/admin/bookings/${b.id}`}
      className="group flex items-center gap-4 rounded-xl px-2 py-2.5 transition-colors hover:bg-sand/[0.06]"
    >
      {showDate && <DateTile date={b.event_date} />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium text-cream">{b.customer_name}</span>
          <StatusBadge status={b.status} />
        </div>
        <p className="mt-1 truncate text-xs text-cream/50">
          {[b.ref, b.package_name ?? (b.kind === "custom" ? "Custom request" : null), guestsOrCups(b), b.region_name, b.start_time]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-sm text-cream/85">{amountOf(b) ? aed(amountOf(b)) : "—"}</p>
        <div className="mt-1">
          <KindBadge kind={b.kind} />
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-sand/40 transition-transform group-hover:translate-x-0.5 group-hover:text-sand" />
    </Link>
  );
}
