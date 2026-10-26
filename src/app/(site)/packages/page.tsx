import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/landing/cta-band";
import { Faq } from "@/components/landing/faq";
import { PackageGrid } from "@/components/landing/package-grid";
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
      <PageHero label="Packages" strong="Catering" light="packages">
        Cart, barista, waiter and {settings.service_hours} hours of service, setup to pack-down.
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20">
        <PackageGrid packages={packages} />
      </section>

      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <SectionHeading label="Drinks" strong="What" light="your guests choose from" />
          <div className="grid gap-4 md:grid-cols-2">
            <DrinkList title="Signature drinks" note="Up to your package's limit" items={menu.filter((m) => m.catering_signature)} />
            <DrinkList title="Coffee selection" note="Pours the remaining servings" items={menu.filter((m) => m.catering_coffee)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-20 sm:px-10 sm:pt-24">
        <SectionHeading label="Extras" strong="Good" light="to know" />
        <div className="grid gap-4 md:grid-cols-3">
          <PriceList title="Transport" rows={regions.map((r) => [r.name, aed(r.fee)])} />
          <PriceList
            title="Additional services"
            rows={extras.map((e) => [e.name, e.price != null ? `${aed(e.price)}${e.unit === "per_hour" ? " / hr" : ""}` : "On request"])}
          />
          <Reveal className="flex flex-col rounded-3xl bg-espresso p-6 text-cream sm:p-7">
            <h3 className="font-sans text-lg font-semibold tracking-normal">{showPerCup ? "Order by the cup" : "Something different?"}</h3>
            {showPerCup ? (
              <ul className="mt-4 divide-y divide-cream/10 text-sm">
                {cupTiers.map((t) => (
                  <li key={t.id} className="flex justify-between gap-4 py-2.5">
                    <span className="text-cream/75">{t.label}</span>
                    <span>{aed(t.price_per_cup)} / cup</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-cream/65">Tell us your guest count and drinks. We&apos;ll send you a quote.</p>
            )}
            <div className="mt-auto pt-6">
              <Button asChild variant="sand" className="w-full">
                <Link href={showPerCup ? "/book?mode=per_cup" : "/book?mode=custom"}>
                  {showPerCup ? "Order by the cup" : "Request a quote"} <ArrowUpRight weight="bold" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Faq id="terms" terms={settings.terms} />
      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}

function PriceList({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <Reveal className="rounded-3xl border border-espresso/10 bg-card p-6 sm:p-7">
      <h3 className="font-sans text-lg font-semibold tracking-normal text-espresso">{title}</h3>
      <ul className="mt-4 divide-y divide-espresso/10 text-sm">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between gap-4 py-2.5">
            <span className="text-espresso/70">{k}</span>
            <span className="text-right text-espresso">{v}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function DrinkList({ title, note, items }: { title: string; note: string; items: MenuItem[] }) {
  return (
    <Reveal className="rounded-3xl bg-linen p-6 sm:p-7">
      <h3 className="font-sans text-lg font-semibold tracking-normal text-espresso">{title}</h3>
      <p className="mt-1 text-sm text-espresso/55">{note}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.id} className="rounded-full border border-espresso/10 bg-card px-3.5 py-1.5 text-sm text-espresso">
            {it.name}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
