import { CalendarCheck, CalendarDays, Inbox, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { BookingRowCompact } from "@/components/admin/booking-bits";
import { aed, fmtAgo } from "@/components/admin/format";
import { Card, Empty, PageHeader, SectionTitle, Skeleton, btnCls } from "@/components/admin/ui";
import { getDashboard } from "../_lib/data";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader eyebrow="Overview" title="Dashboard" description="Your events, requests and revenue at a glance." />
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </>
  );
}

function Stat({ icon, label, value, hint, href }: { icon: ReactNode; label: string; value: string; hint?: string; href: string }) {
  return (
    <Link href={href} className="glass group block rounded-2xl p-5 transition-colors hover:border-sand/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-cream/55">{label}</span>
        <span className="rounded-full bg-sand/10 p-2 text-sand">{icon}</span>
      </div>
      <p className="mt-4 font-display text-4xl text-cream">{value}</p>
      {hint && <p className="mt-1 text-xs text-cream/45">{hint}</p>}
    </Link>
  );
}

async function Dashboard() {
  const d = await getDashboard();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          href="/admin/bookings"
          icon={<CalendarDays className="h-4 w-4" />}
          label="Upcoming events"
          value={String(d.upcomingCount)}
          hint="Next 30 days"
        />
        <Stat
          href="/admin/requests"
          icon={<Inbox className="h-4 w-4" />}
          label="New requests"
          value={String(d.requestCount)}
          hint="Awaiting a quote"
        />
        <Stat
          href="/admin/bookings"
          icon={<CalendarCheck className="h-4 w-4" />}
          label="Confirmed"
          value={String(d.confirmedThisMonth)}
          hint={`Events in ${d.monthLabel}`}
        />
        <Stat
          href="/admin/bookings"
          icon={<Wallet className="h-4 w-4" />}
          label="Revenue"
          value={aed(d.revenueThisMonth)}
          hint={`Confirmed & completed, ${d.monthLabel}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <SectionTitle actions={<Link href="/admin/bookings" className={btnCls("ghost", "sm")}>All bookings</Link>}>
            Next events
          </SectionTitle>
          {d.nextEvents.length ? (
            <div className="-mx-2 divide-y divide-sand/[0.08]">
              {d.nextEvents.map((b) => (
                <BookingRowCompact key={b.id} b={b} />
              ))}
            </div>
          ) : (
            <Empty icon={<CalendarDays className="h-6 w-6" />} title="No upcoming events yet">
              New bookings from the website will appear here.
            </Empty>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle actions={<Link href="/admin/requests" className={btnCls("ghost", "sm")}>All requests</Link>}>
            Latest requests
          </SectionTitle>
          {d.latestRequests.length ? (
            <ul className="-mx-2 divide-y divide-sand/[0.08]">
              {d.latestRequests.map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings/${b.id}`} className="block rounded-xl px-2 py-3 hover:bg-sand/[0.06]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-medium text-cream">{b.customer_name}</span>
                      <span className="shrink-0 text-xs text-cream/45">{fmtAgo(b.created_at)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-cream/50">
                      {[b.ref, b.event_type, b.guests ? `${b.guests} guests` : null, b.region_name].filter(Boolean).join(" · ")}
                    </p>
                    {b.total > 0 && <p className="mt-1 text-xs text-sand/80">Estimate {aed(b.total)}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty icon={<Inbox className="h-6 w-6" />} title="No new requests">
              Custom requests waiting for a quote show up here.
            </Empty>
          )}
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Skeleton className="h-80 lg:col-span-3" />
        <Skeleton className="h-80 lg:col-span-2" />
      </div>
    </div>
  );
}
