import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestCard } from "@/components/admin/request-card";
import { Empty, PageHeader, PageSkeleton, SectionTitle } from "@/components/admin/ui";
import { getMenuPrices, getRequests, todayUAE } from "../../_lib/data";

export const metadata: Metadata = { title: "Requests" };

export default function RequestsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Custom requests"
        title="Requests"
        description="Custom requests from the website. Review the drinks, set a price, then mark it quoted and confirmed."
      />
      <Suspense fallback={<PageSkeleton rows={3} />}>
        <Requests />
      </Suspense>
    </>
  );
}

async function Requests() {
  const [requests, prices] = await Promise.all([getRequests(), getMenuPrices()]);
  const today = await todayUAE();
  const fresh = requests.filter((r) => r.status === "request");
  const quoted = requests.filter((r) => r.status === "quoted");

  if (!requests.length)
    return (
      <Empty icon={<Inbox className="h-6 w-6" />} title="No open requests">
        New custom requests appear here until they are confirmed or declined.
      </Empty>
    );

  return (
    <div className="space-y-10">
      <section>
        <SectionTitle hint="Waiting for a price from you.">Awaiting quote · {fresh.length}</SectionTitle>
        {fresh.length ? (
          <div className="space-y-4">
            {fresh.map((b) => (
              <RequestCard key={b.id} booking={b} prices={prices} today={today} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-cream/50">All caught up.</p>
        )}
      </section>
      <section>
        <SectionTitle hint="Quote sent; waiting for the customer to confirm.">Quoted · {quoted.length}</SectionTitle>
        {quoted.length ? (
          <div className="space-y-4">
            {quoted.map((b) => (
              <RequestCard key={b.id} booking={b} prices={prices} today={today} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-cream/50">No quotes waiting on customers.</p>
        )}
      </section>
    </div>
  );
}
