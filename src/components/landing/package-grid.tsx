import Link from "next/link";
import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { aed } from "@/lib/pricing";
import type { Package } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Package cards: a swipeable row on phones, a grid from tablet up. */
export function PackageGrid({ packages }: { packages: Package[] }) {
  return (
    <Reveal
      stagger
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pt-3 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-5"
    >
      {packages.map((p) => (
        <SpotlightCard
          key={p.id}
          className={cn(
            "relative flex w-[78vw] max-w-xs shrink-0 snap-start flex-col rounded-3xl border p-6 xl:p-5 transition-[box-shadow,translate] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-30px_rgba(54,31,24,.45)] sm:w-auto sm:max-w-none",
            p.featured ? "border-espresso bg-espresso text-cream" : "border-border bg-card text-espresso",
          )}
        >
          {p.featured && <Badge className="absolute -top-3 left-6 bg-sand text-espresso">Recommended</Badge>}
          <p className={cn("eyebrow", p.featured ? "text-sand" : "text-mocha")}>{p.name}</p>
          <p className="mt-5 font-display text-6xl leading-none">{p.guests}</p>
          <p className={cn("mt-1 text-sm", p.featured ? "text-cream/60" : "text-muted-foreground")}>guests</p>

          <ul className="mt-6 space-y-2.5 text-sm">
            {[`Up to ${p.max_signature_drinks} signature drinks`, `${p.cups_per_drink} cups each`, ...p.includes].map((x) => (
              <li key={x} className="flex items-start gap-2.5">
                <Check className={cn("mt-0.5 size-4 shrink-0", p.featured ? "text-sand" : "text-mocha")} weight="bold" /> {x}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            <p className="font-display text-2xl whitespace-nowrap xl:text-[1.6rem]">{aed(p.price)}</p>
            <Button asChild variant={p.featured ? "sand" : "default"} className="mt-4 w-full">
              <Link href={`/book?package=${p.id}`}>
                Book this package <ArrowUpRight weight="bold" />
              </Link>
            </Button>
          </div>
        </SpotlightCard>
      ))}
    </Reveal>
  );
}
