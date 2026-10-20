import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow, type BookingStart } from "@/components/booking/booking-flow";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Book your event",
  description:
    "Book Caprea's specialty coffee & matcha cart for your event. Choose a package, pick your signature drinks and confirm your date online.",
};

export default function BookPage({ searchParams }: PageProps<"/book">) {
  return (
    <div className="grain relative isolate overflow-clip">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-sand/[0.07] blur-[120px]" />
        <div className="absolute top-[40rem] -left-40 size-[28rem] rounded-full bg-mocha/30 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-32 pb-36 sm:px-8 md:pt-40 lg:pb-28">
        <header className="mb-14 max-w-3xl md:mb-20">
          <p className="eyebrow text-sand">Catering · Abu Dhabi &amp; across the UAE</p>
          <h1 className="mt-5 font-display text-5xl uppercase text-cream sm:text-6xl md:text-7xl lg:text-8xl">
            Book your <span className="text-sand">Caprea</span> cart
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/70 md:text-lg">
            Specialty coffee, ceremonial matcha and our signature drinks, poured fresh by our baristas at your
            celebration. Build your menu below and see your price as you go.
          </p>
        </header>

        <Suspense fallback={<FlowSkeleton />}>
          <BookingContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-16" aria-busy>
      <div>
        <div className="mb-14 hidden h-10 rounded-full bg-sand/[0.06] md:block" />
        <div className="h-4 w-28 animate-pulse rounded-full bg-sand/15" />
        <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-sand/10" />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[22rem] animate-pulse rounded-3xl border border-sand/10 bg-sand/[0.05]" />
          ))}
        </div>
      </div>
      <div className="hidden h-[28rem] animate-pulse rounded-3xl border border-sand/10 bg-sand/[0.05] lg:block" />
      <span className="sr-only">Loading booking form…</span>
    </div>
  );
}
