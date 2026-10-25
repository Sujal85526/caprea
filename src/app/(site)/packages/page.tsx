import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/landing/cta-band";
import { Faq } from "@/components/landing/faq";
import { ImageBand } from "@/components/landing/image-band";
import { PackageList } from "@/components/landing/package-list";
import { SectionHeading } from "@/components/landing/section-heading";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { getCatalog } from "@/lib/catalog";
import { aed } from "@/lib/pricing";
import type { MenuItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catering packages",
  description: "Caprea catering packages for 30 to 300 guests: signature drinks, coffee bar, barista, waiter and four hours of service.",
};

export default async function PackagesPage() {
  const { packages, menu, regions, extras, cupTiers, settings } = await getCatalog();
  const showPerCup = settings.pricing_mode !== "packages" && cupTiers.length > 0;

  return (
    <>
      <PageHero eyebrow="Catering packages" title="Crafted for gatherings">
        Every package includes Caprea&apos;s cart, one barista and one waiter, and {settings.service_hours} hours of service
        including setup and pack-down. Remaining servings are poured from our coffee selection.
      </PageHero>

      <section className="mx-auto max-w-[90rem] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
        <PackageList packages={packages} />
      </section>

      <ImageBand src="/photos/trio-overhead.webp" alt="Three Caprea smoothies seen from above" />

      <section className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <SectionHeading eyebrow="What guests choose from" title="Drinks in every package" />
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <DrinkList title="Signature drinks" note="Choose up to your package's limit" items={menu.filter((m) => m.catering_signature)} />
          <DrinkList title="Coffee selection" note="Fills the remaining servings" items={menu.filter((m) => m.catering_coffee)} />
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-[90rem] gap-16 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-3 lg:gap-12 lg:px-12">
          <PriceList title="Transport" note="Fee by emirate" rows={regions.map((r) => ({ key: r.id, label: r.name, value: aed(r.fee) }))} />
          <PriceList
            title="Additional services"
            note="Add them while you book"
            rows={extras.map((e) => ({
              key: e.id,
              label: e.name,
              value: e.price != null ? `${aed(e.price)}${e.unit === "per_hour" ? " / hr" : ""}` : "On request",
            }))}
          />
          <Reveal className="flex flex-col bg-espresso p-7 text-cream sm:p-9">
            <p className="label text-sand">{showPerCup ? "Flexible" : "Bespoke"}</p>
            <h3 className="mt-4 font-display text-3xl uppercase sm:text-4xl">{showPerCup ? "Order by the cup" : "Something different?"}</h3>
            {showPerCup ? (
              <ul className="mt-6 divide-y divide-cream/15 border-y border-cream/15">
                {cupTiers.map((t) => (
                  <li key={t.id} className="flex justify-between gap-4 py-3 text-sm">
                    <span>{t.label}</span>
                    <span>{aed(t.price_per_cup)} / cup</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 leading-relaxed text-cream/70">
                Tell us your guest count, drinks and setup. We&apos;ll design a custom menu and send you a quote.
              </p>
            )}
            <div className="mt-auto pt-10">
              <Button asChild variant="sand" size="lg" className="w-full">
                <Link href={showPerCup ? "/book?mode=per_cup" : "/book?mode=custom"}>
                  {showPerCup ? "Order by the cup" : "Request a quote"} <ArrowUpRight weight="bold" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Faq id="terms" terms={settings.terms} />
      <CtaBand />
    </>
  );
}

function PriceList({ title, note, rows }: { title: string; note: string; rows: { key: string; label: string; value: string }[] }) {
  return (
    <Reveal>
      <p className="label text-espresso/60">{note}</p>
      <h3 className="mt-4 font-display text-3xl text-espresso uppercase sm:text-4xl">{title}</h3>
      <ul className="mt-6 border-t border-espresso/15">
        {rows.map((r) => (
          <li key={r.key} className="flex items-baseline gap-3 border-b border-espresso/15 py-3.5 text-sm text-espresso">
            <span>{r.label}</span>
            <span aria-hidden className="h-px min-w-4 flex-1 border-b border-dotted border-espresso/25" />
            <span className="whitespace-nowrap tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function DrinkList({ title, note, items }: { title: string; note: string; items: MenuItem[] }) {
  return (
    <div>
      <Reveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-espresso/15 pb-4">
        <h3 className="font-display text-3xl text-espresso uppercase">{title}</h3>
        <p className="label text-espresso/60">{note}</p>
      </Reveal>
      <Reveal stagger as="ul" className="mt-8 grid grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5">
        {items.map((it) => (
          <li key={it.id}>
            <div className="relative aspect-square bg-cream">
              {it.image_url && (
                <Image
                  src={it.image_url}
                  alt={it.name}
                  fill
                  unoptimized={it.image_url.startsWith("http")}
                  sizes="(min-width: 1024px) 14vw, 30vw"
                  className="object-contain p-[14%]"
                />
              )}
            </div>
            <p className="mt-3 text-xs leading-snug tracking-[0.12em] text-espresso uppercase sm:text-[0.8rem]">{it.name}</p>
          </li>
        ))}
      </Reveal>
    </div>
  );
}
