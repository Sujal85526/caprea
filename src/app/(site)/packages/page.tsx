import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CtaBand } from "@/components/landing/cta-band";
import { PackageGrid } from "@/components/landing/package-grid";
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
      <PageHero eyebrow="Coffee & matcha catering" title="Catering packages">
        Cart, barista, waiter and {settings.service_hours} hours of service, setup to pack-down. Choose your package, pick your
        drinks and we&apos;ll take care of the rest.
      </PageHero>

      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-8">
        <PackageGrid packages={packages} />
      </section>

      <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 pb-16 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Terms and transport on espresso, like an event-rules card */}
        <Reveal as="article" className="scroll-mt-28 rounded-[2rem] bg-espresso p-8 text-cream sm:p-10">
          <div id="terms" className="scroll-mt-28">
            <h2 className="display text-2xl sm:text-3xl">Booking terms</h2>
            <ul className="mt-6 space-y-4 border-t border-cream/15 pt-6 text-sm leading-relaxed">
              {settings.terms.map((t) => (
                <li key={t.title} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sand" />
                  <span>
                    <span className="font-bold text-sand">{t.title}.</span> <span className="text-cream/85">{t.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 border-t border-cream/15 pt-6">
            <p className="display text-xs tracking-[0.12em] text-sand">Transport</p>
            <ul className="mt-4 space-y-2 text-sm">
              {regions.map((r) => (
                <li key={r.id} className="flex justify-between gap-4 font-bold">
                  <span>{r.name}</span>
                  <span>{aed(r.fee)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="grid content-start gap-6">
          <PriceCard
            title="Additional services"
            rows={extras.map((e) => [e.name, e.price != null ? `${aed(e.price)}${e.unit === "per_hour" ? " / hr" : ""}` : "On request"])}
          />
          <Reveal as="article" className="flex flex-col rounded-[2rem] bg-card p-8 text-espresso sm:p-10">
            <h2 className="display text-2xl">{showPerCup ? "Order by the cup" : "Something different?"}</h2>
            {showPerCup ? (
              <ul className="mt-5 space-y-2 text-sm">
                {cupTiers.map((t) => (
                  <li key={t.id} className="flex justify-between gap-4 rounded-xl bg-cream px-4 py-2.5">
                    <span className="font-bold">{t.label}</span>
                    <span className="text-espresso/70">{aed(t.price_per_cup)} / cup</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-espresso/65">Tell us your guest count and drinks. We&apos;ll send you a quote.</p>
            )}
            <Link
              href={showPerCup ? "/book?mode=per_cup" : "/book?mode=custom"}
              className="label-caps group mt-6 inline-flex h-11 items-center gap-2 self-start rounded-full bg-espresso px-6 text-[0.7rem] text-cream transition-colors hover:bg-espresso-700"
            >
              {showPerCup ? "Order by the cup" : "Request a quote"}
              <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-8 sm:pb-28">
        <Reveal>
          <h2 className="display border-b border-espresso/10 pb-4 text-[clamp(2.25rem,6vw,4rem)] text-espresso">What guests choose from</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <DrinkList title="Signature drinks" note="Up to your package's limit" items={menu.filter((m) => m.catering_signature)} />
          <DrinkList title="Coffee selection" note="Pours the remaining servings" items={menu.filter((m) => m.catering_coffee)} />
        </div>
      </section>

      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}

function PriceCard({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <Reveal as="article" className="rounded-[2rem] bg-card p-8 text-espresso sm:p-10">
      <h2 className="display text-2xl">{title}</h2>
      <ul className="mt-5 divide-y divide-espresso/10 border-t border-espresso/10 text-sm">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between gap-4 py-3">
            <span className="font-bold">{k}</span>
            <span className="text-right text-espresso/70">{v}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

function DrinkList({ title, note, items }: { title: string; note: string; items: MenuItem[] }) {
  return (
    <Reveal as="article" className="rounded-[2rem] bg-card p-8 sm:p-10">
      <h3 className="display text-2xl text-espresso">{title}</h3>
      <p className="mt-2 text-sm text-espresso/60 italic">{note}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.id} className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-espresso">
            {it.name}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
