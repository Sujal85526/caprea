import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow, type BookingStart } from "@/components/booking/booking-flow";
import { PageHero } from "@/components/site/page-hero";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Book your event",
  description:
    "Book Caprea's specialty coffee & matcha cart for your event. Choose a package, pick your signature drinks and confirm your date online.",
};

export default function BookPage({ searchParams }: PageProps<"/book">) {
  return (
    <>
      <PageHero compact eyebrow="Catering · Abu Dhabi &amp; across the UAE" title="Book your event">
        Specialty coffee, ceremonial matcha and our signature drinks, poured fresh by our baristas at your celebration.
        Build your menu below and see your price as you go.
      </PageHero>

      <div className="mx-auto max-w-[90rem] px-5 pb-36 sm:px-8 lg:px-12 lg:pb-28">
        <Suspense fallback={<FlowSkeleton />}>
          <BookingContent searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function BookingContent({ searchParams }: { searchParams: PageProps<"/book">["searchParams"] }) {
  const [params, catalog] = await Promise.all([searchParams, getCatalog()]);
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const packageId = one(params.package);
  const mode = one(params.mode);
  const perCupAllowed = catalog.settings.pricing_mode !== "packages";

  let start: BookingStart = { kind: null, packageId: null };
  if (packageId && catalog.packages.some((p) => p.id === packageId)) start = { kind: "package", packageId };
  else if (mode === "package" || mode === "packages") start = { kind: "package", packageId: null };
  else if (mode === "custom") start = { kind: "custom", packageId: null };
  else if (mode === "per_cup" && perCupAllowed) start = { kind: "per_cup", packageId: null };

  return <BookingFlow key={`${start.kind}-${start.packageId}`} catalog={catalog} start={start} />;
}

function FlowSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-14" aria-busy>
      <div>
        <div className="mb-12 hidden h-8 bg-cream md:block" />
        <div className="h-3 w-28 animate-pulse bg-cream" />
        <div className="mt-4 h-10 w-2/3 animate-pulse bg-cream" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[22rem] animate-pulse border bg-card" />
          ))}
        </div>
      </div>
      <div className="hidden h-[28rem] animate-pulse border bg-card lg:block" />
      <span className="sr-only">Loading booking form…</span>
    </div>
  );
}
