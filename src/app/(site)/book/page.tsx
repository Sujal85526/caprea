import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { BookingFlow, type BookingStart } from "@/components/booking/booking-flow";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { getCatalog } from "@/lib/catalog";
import { aed, minCups } from "@/lib/pricing";
import type { Catalog } from "@/lib/types";

export const metadata: Metadata = {
  title: "Book your event",
  description:
    "Book Caprea's specialty coffee & matcha cart for your event. Choose a package, pick your signature drinks and confirm your date online.",
};

export default function BookPage({ searchParams }: PageProps<"/book">) {
  return (
    <>
      <PageHero eyebrow="Catering booking" title="Book Caprea for your event">
        Perfect for weddings, graduations and gatherings. Build your menu, pick your date and see your price as you go. Bookings
        confirm instantly.
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 pb-36 sm:px-8 lg:pb-28">
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

  return (
    <>
      <BookingInfo catalog={catalog} />
      <BookingFlow key={`${start.kind}-${start.packageId}`} catalog={catalog} start={start} />
    </>
  );
}

/** Two white price cards and an espresso "good to know" card above the form. */
function BookingInfo({ catalog }: { catalog: Catalog }) {
  const { packages, cupTiers, regions, settings } = catalog;
  const perCup = settings.pricing_mode !== "packages" && cupTiers.length > 0;
  const guests = packages.map((p) => p.guests);

  const rules = [
    `Book at least ${settings.min_notice_days} days before your event.`,
    `We serve for ${settings.service_hours} hours, setup to pack-down. Extra hours are ${aed(settings.extra_hour_price)} each.`,
    `A ${settings.deposit_percent}% deposit secures your date.`,
    "Every event includes our coffee cart and a dedicated barista.",
  ];

  return (
    <Reveal stagger className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <InfoCard
        src="/photos/matcha-cup.webp"
        title="Packages"
        rows={packages.map((p) => [`Up to ${p.guests} guests`, aed(p.price)])}
        foot={packages.length ? `${Math.min(...guests)} to ${Math.max(...guests)} guests · signature drinks included` : ""}
      />
      {perCup ? (
        <InfoCard
          src="/photos/iced-americano.webp"
          title="By the cup"
          rows={cupTiers.map((t) => [t.label, `${aed(t.price_per_cup)} / cup`])}
          foot={`Minimum order: ${minCups(cupTiers)} cups`}
        />
      ) : (
        <InfoCard
          src="/photos/iced-americano.webp"
          title="Custom request"
          rows={[["Your own menu", "Free quote"]]}
          foot="No commitment until you confirm"
        />
      )}

      <article className="rounded-[2rem] bg-espresso p-8 text-cream md:col-span-2 xl:col-span-1">
        <h2 className="display text-2xl">Good to know</h2>
        <ul className="mt-5 space-y-3 border-t border-cream/15 pt-5 text-sm leading-relaxed">
          {rules.map((r) => (
            <li key={r} className="flex gap-3">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sand" />
              <span className="text-cream/90">{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-cream/15 pt-5">
          <p className="display text-xs tracking-[0.12em] text-sand">Transport</p>
          <ul className="mt-3 space-y-1.5 text-sm font-bold">
            {regions.map((r) => (
              <li key={r.id} className="flex justify-between gap-4">
                <span>{r.name}</span>
                <span>{aed(r.fee)}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

function InfoCard({ src, title, rows, foot }: { src: string; title: string; rows: string[][]; foot: string }) {
  return (
    <article className="flex flex-col items-center rounded-[2rem] bg-card px-6 pt-8 pb-6 text-center text-espresso">
      <div className="relative isolate aspect-[4/5] w-36 overflow-hidden rounded-xl bg-cream-200">
        <Image src={src} alt="" fill sizes="144px" className="object-cover" />
      </div>
      <h2 className="display mt-6 text-2xl">{title}</h2>
      <ul className="mt-4 w-full max-w-[18rem] space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between gap-4 rounded-xl bg-cream px-4 py-2.5">
            <span className="font-bold">{k}</span>
            <span className="text-espresso/70">{v}</span>
          </li>
        ))}
      </ul>
      {foot && (
        <div className="mt-auto w-full pt-6">
          <p className="label-caps border-t border-espresso/10 pt-4 text-[0.62rem] leading-relaxed text-espresso/60">{foot}</p>
        </div>
      )}
    </article>
  );
}

function FlowSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-14" aria-busy>
      <div className="h-[34rem] animate-pulse rounded-[2rem] bg-card" />
      <div className="hidden h-[28rem] animate-pulse rounded-[2rem] bg-card lg:block" />
      <span className="sr-only">Loading booking form…</span>
    </div>
  );
}
