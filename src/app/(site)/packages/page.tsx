import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkle, Truck } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <PageHero eyebrow="Catering packages" title="Crafted for gatherings">
        Every package includes Caprea&apos;s cart, one barista and one waiter, and {settings.service_hours} hours of service
        including setup and pack-down. Remaining servings are poured from our coffee selection.
      </PageHero>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10 sm:pb-28 xl:max-w-7xl">
        <PackageGrid packages={packages} />
      </section>

      <section className="bg-secondary/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <SectionHeading eyebrow="What guests choose from" title="Drinks in every package" />
          <div className="grid gap-4 md:grid-cols-2">
            <DrinkList title="Signature drinks" note="Choose up to your package's limit" items={menu.filter((m) => m.catering_signature)} />
            <DrinkList title="Coffee selection" note="Fills the remaining servings" items={menu.filter((m) => m.catering_coffee)} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-20 sm:px-10 sm:py-28 md:grid-cols-3">
        <Reveal>
          <Card className="h-full rounded-3xl">
            <CardHeader>
              <Truck className="size-7 text-mocha" weight="light" />
              <CardTitle className="mt-3 font-display text-2xl font-normal uppercase">Transport</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {regions.map((r) => (
                  <li key={r.id} className="flex justify-between py-3 text-sm">
                    <span>{r.name}</span>
                    <span className="font-medium">{aed(r.fee)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="h-full rounded-3xl">
            <CardHeader>
              <Sparkle className="size-7 text-mocha" weight="light" />
              <CardTitle className="mt-3 font-display text-2xl font-normal uppercase">Additional services</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {extras.map((e) => (
                  <li key={e.id} className="flex justify-between gap-4 py-3 text-sm">
                    <span>{e.name}</span>
                    <span className="text-right font-medium">
                      {e.price != null ? aed(e.price) : "On request"}
                      {e.unit === "per_hour" && <span className="font-normal text-muted-foreground"> / hr</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Reveal>
        <Reveal delay={0.16}>
          <Card className="h-full rounded-3xl border-espresso bg-espresso text-cream">
            <CardHeader>
              <CardTitle className="font-display text-2xl font-normal uppercase">{showPerCup ? "Order by the cup" : "Something different?"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              {showPerCup ? (
                <ul className="divide-y divide-cream/10">
                  {cupTiers.map((t) => (
                    <li key={t.id} className="flex justify-between py-3 text-sm">
                      <span>{t.label}</span>
                      <span className="font-medium">{aed(t.price_per_cup)} / cup</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed text-cream/70">
                  Tell us your guest count, drinks and setup. We&apos;ll design a custom menu and send you a quote.
                </p>
              )}
              <Button asChild variant="sand" className="mt-auto w-full">
                <Link href={showPerCup ? "/book?mode=per_cup" : "/book?mode=custom"}>
                  {showPerCup ? "Order by the cup" : "Request a quote"} <ArrowUpRight weight="bold" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      </section>

      <Faq id="terms" terms={settings.terms} />
      <CtaBand />
    </>
  );
}

function DrinkList({ title, note, items }: { title: string; note: string; items: MenuItem[] }) {
  return (
    <Reveal className="rounded-3xl bg-card p-6 sm:p-8">
      <p className="eyebrow text-mocha">{note}</p>
      <h3 className="mt-2 font-display text-3xl text-espresso uppercase">{title}</h3>
      <ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6">
        {items.map((it) => (
          <li key={it.id} className="text-center">
            <div className="relative mx-auto aspect-square w-full max-w-[96px]">
              {it.image_url && <Image src={it.image_url} alt={it.name} fill sizes="96px" className="object-contain" />}
            </div>
            <p className="mt-2 text-xs leading-tight text-espresso sm:text-sm">{it.name}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
