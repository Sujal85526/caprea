import Link from "next/link";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { aed } from "@/lib/pricing";
import type { Package } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Package cards: a swipeable row on phones, a grid from tablet up. */
export function PackageGrid({ packages }: { packages: Package[] }) {
  return (
    <Reveal
      stagger
      className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pt-1 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-5"
    >
      {packages.map((p) => {
        const dark = p.featured;
        const inclusions = [`${p.max_signature_drinks} signature drinks`, `${p.cups_per_drink} cups each`, ...p.includes].slice(0, 4);
        return (
          <article
            key={p.id}
            className={cn(
              "flex w-[76vw] max-w-[18rem] shrink-0 snap-start flex-col rounded-3xl p-6 sm:w-auto sm:max-w-none xl:p-5",
              dark ? "bg-espresso text-cream" : "border border-espresso/10 bg-card text-espresso",
            )}
          >
            <div className="flex min-h-6 items-center justify-between gap-2">
              <h3 className="font-sans text-base font-semibold tracking-normal">{p.name}</h3>
              {dark && <span className="eyebrow rounded-full bg-sand px-2.5 py-1 text-[0.55rem] font-semibold text-espresso">Popular</span>}
            </div>
            <p className={cn("mt-1 text-sm", dark ? "text-cream/60" : "text-espresso/55")}>Up to {p.guests} guests</p>
            <p className="mt-5 font-sans text-2xl leading-none font-semibold whitespace-nowrap">{aed(p.price)}</p>

            <ul className={cn("mt-6 space-y-2 text-sm", dark ? "text-cream/80" : "text-espresso/75")}>
              {inclusions.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check className={cn("mt-0.5 size-3.5 shrink-0", dark ? "text-sand" : "text-espresso/50")} weight="bold" /> {x}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-7">
              <Button asChild variant={dark ? "sand" : "outline"} className={cn("w-full", !dark && "border-espresso/20 bg-transparent")}>
                <Link href={`/book?package=${p.id}`} aria-label={`Book the ${p.name} package`}>
                  Book
                </Link>
              </Button>
            </div>
          </article>
        );
      })}
    </Reveal>
  );
}
