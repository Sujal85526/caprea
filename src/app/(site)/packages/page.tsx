import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Truck } from "lucide-react";
import { PackageCards } from "@/components/home/package-cards";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { getCatalog } from "@/lib/catalog";
import { aed, unitLabel } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Catering packages",
  description: "Caprea catering packages for 30 to 300 guests: signature drinks, coffee bar, barista, waiter and four hours of service.",
};

export default async function PackagesPage() {
  const { packages, menu, regions, extras, cupTiers, settings } = await getCatalog();
  const signature = menu.filter((m) => m.catering_signature);
  const coffee = menu.filter((m) => m.catering_coffee);
  const showPerCup = settings.pricing_mode !== "packages" && cupTiers.length > 0;

  return (
    <div className="bg-espresso">
      <PageHero eyebrow="Catering packages" title={<>Crafted for <span className="text-sand">gatherings</span></>}>
        Celebrations, graduations and special occasions. Every package includes Caprea&apos;s cart, one barista and one
        waiter, and {settings.service_hours} hours of service including setup and pack-down.
      </PageHero>

      <section className="mx-auto max-w-[96rem] px-6 pb-28 sm:px-10">
        <PackageCards packages={packages} />
        <p className="mt-8 text-center text-sm text-cream/50">Remaining servings are poured from our coffee selection.</p>
      </section>

      {/* What guests choose from */}
      <section className="bg-cream py-28 text-espresso">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 sm:px-10 lg:grid-cols-2">
          {[
            { title: "Signature drinks", note: "Choose up to your package's limit", items: signature },
            { title: "Coffee selection", note: "Fills the remaining servings", items: coffee },
          ].map((block) => (
            <div key={block.title}>
              <p className="eyebrow mb-3 text-mocha">{block.note}</p>
              <h2 className="mb-10 font-display text-5xl uppercase">{block.title}</h2>
              <div className="grid grid-cols-3 gap-x-4 gap-y-8">
                {block.items.map((it) => (
                  <div key={it.id} className="text-center">
                    <div className="relative mx-auto aspect-square w-full max-w-[120px]">
                      {it.image_url && <Image src={it.image_url} alt={it.name} fill sizes="120px" className="object-contain drop-shadow-[0_18px_18px_rgba(54,31,24,.25)]" />}
                    </div>
                    <p className="mt-3 font-display text-lg uppercase">{it.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-28 sm:px-10 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-sand/15 bg-espresso-800 p-8">
          <Truck className="size-6 text-sand" />
          <h3 className="mt-6 font-display text-3xl text-cream uppercase">Transport</h3>
          <ul className="mt-6 divide-y divide-sand/10">
            {regions.map((r) => (
              <li key={r.id} className="flex justify-between py-3 text-cream/80">
                <span>{r.name}</span>
                <span className="text-sand">{aed(r.fee)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-sand/15 bg-espresso-800 p-8">
          <Sparkles className="size-6 text-sand" />
          <h3 className="mt-6 font-display text-3xl text-cream uppercase">Additional services</h3>
          <ul className="mt-6 divide-y divide-sand/10">
            {extras.map((e) => (
              <li key={e.id} className="flex justify-between gap-4 py-3 text-cream/80">
                <span>{e.name}</span>
                <span className="text-right text-sand">
                  {e.price != null ? aed(e.price) : "Upon request"} {e.unit === "per_hour" && <span className="text-cream/50">/ hour</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] bg-sand p-8 text-espresso">
          <h3 className="font-display text-3xl uppercase">{showPerCup ? "Order by the cup" : "Something different?"}</h3>
          {showPerCup ? (
            <ul className="mt-6 divide-y divide-espresso/10">
              {cupTiers.map((t) => (
                <li key={t.id} className="flex justify-between py-3">
                  <span>{t.label}</span>
                  <span>{aed(t.price_per_cup)} / cup</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 leading-relaxed text-espresso/75">
              Tell us your guest count, drinks and setup. We&apos;ll design a custom menu and send you a quote.
            </p>
          )}
          <ButtonLink href={showPerCup ? "/book?mode=per_cup" : "/book?mode=custom"} variant="espresso" className="mt-8 w-full">
            {showPerCup ? "Order by the cup" : "Request a custom quote"} <ArrowUpRight className="size-4" />
          </ButtonLink>
        </div>
      </section>

      <section id="terms" className="scroll-mt-28 border-t border-sand/10 bg-espresso-900 py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <p className="eyebrow mb-4 text-sand">Before you book</p>
          <h2 className="mb-14 font-display text-5xl text-cream uppercase sm:text-6xl">Booking terms</h2>
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {settings.terms.map((t, i) => (
              <div key={t.title} className="border-t border-sand/15 pt-6">
                <p className="font-display text-2xl text-sand">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl text-cream uppercase">{t.title}</h3>
                <p className="mt-3 leading-relaxed text-cream/65">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-14 text-sm text-cream/40">Extra cups and services marked {unitLabel("on_request")} are confirmed by our team.</p>
        </div>
      </section>
    </div>
  );
}
