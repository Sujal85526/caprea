import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingsTable } from "@/components/admin/bookings-table";
import { PageHeader, PageSkeleton } from "@/components/admin/ui";
import { getBookings, todayUAE } from "../../_lib/data";

export const metadata: Metadata = { title: "Bookings" };

export default function BookingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Bookings"
        description="Every package, per-cup and custom booking. Open one to update its status, payment or notes."
      />
      <Suspense fallback={<PageSkeleton rows={5} />}>
        <Bookings />
      </Suspense>
    </>
  );
}

async function Bookings() {
  const bookings = await getBookings();
  return <BookingsTable bookings={bookings} today={await todayUAE()} />;
}
