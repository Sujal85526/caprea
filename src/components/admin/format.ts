import { differenceInCalendarDays, format, formatDistanceToNowStrict, parseISO } from "date-fns";
import type { Booking } from "@/lib/types";

export { aed } from "@/lib/pricing";

/** event_date is a plain yyyy-mm-dd date: parse it as a local calendar date, never as UTC. */
export const parseDay = (d: string) => parseISO(d.slice(0, 10));

export const fmtDay = (d: string) => format(parseDay(d), "EEE d MMM yyyy");
export const fmtDayShort = (d: string) => format(parseDay(d), "d MMM");
export const fmtDayLong = (d: string) => format(parseDay(d), "EEEE d MMMM yyyy");
export const fmtStamp = (ts: string) => format(new Date(ts), "d MMM yyyy, HH:mm");
export const fmtAgo = (ts: string) => `${formatDistanceToNowStrict(new Date(ts))} ago`;

/** "Today", "Tomorrow", "In 5 days", "3 days ago" relative to the given yyyy-mm-dd. */
export function relDay(d: string, today: string) {
  const diff = differenceInCalendarDays(parseDay(d), parseDay(today));
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return diff > 0 ? `In ${diff} days` : `${-diff} days ago`;
}

export const digits = (s: string) => s.replace(/\D/g, "");

/** wa.me link; local UAE numbers (05x…) get the 971 country code. */
export function waLink(phone: string) {
  let n = digits(phone);
  if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("0")) n = `971${n.slice(1)}`;
  return `https://wa.me/${n}`;
}

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const amountOf = (b: Pick<Booking, "quote_amount" | "total">) => (b.quote_amount != null ? b.quote_amount : b.total);

export function todayLocal() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(new Date());
}

/** Rough per-drink estimate for custom requests: cups × menu price. */
export function drinkEstimate(b: Booking, prices: Record<string, { name: string; price: number | null }>) {
  return b.drinks.reduce((sum, d) => sum + (d.cups ?? 0) * (prices[d.slug]?.price ?? 0), 0);
}
