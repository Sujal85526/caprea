import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Tag } from "@/components/menu/product-tile";
import { Reveal } from "@/components/site/reveal";
import { aed } from "@/lib/pricing";
import type { Package } from "@/lib/types";
import { cn } from "@/lib/utils";

/** What every package includes, so rows only list what differs. */
export function commonIncludes(packages: Package[]) {
  if (!packages.length) return [];
  return packages[0].includes.filter((x) => packages.every((p) => p.includes.includes(x)));
}

/** Packages as a calm comparison list: one row per package, the whole row books it. */
export function PackageList({ packages }: { packages: Package[] }) {
  const common = commonIncludes(packages);

  return (
    <div>
      {common.length > 0 && (
        <Reveal className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="label mr-1 text-espresso/60">Every package includes</span>
          {common.map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </Reveal>
      )}

      <Reveal stagger as="ul" className="border-t border-espresso/15">
        {packages.map((p) => {
          const extra = p.includes.filter((x) => !common.includes(x));
          return (
            <li key={p.id} className="border-b border-espresso/15">
              <Link
                href={`/book?package=${p.id}`}
                className={cn(
                  "group relative grid grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-x-3 py-6 transition-colors duration-500 sm:grid-cols-[7rem_minmax(0,1fr)_auto_auto] sm:gap-x-6 lg:grid-cols-[10rem_minmax(0,1.1fr)_minmax(0,1fr)_auto_auto] lg:py-8",
                  p.featured ? "bg-cream" : "hover:bg-cream/70",
                )}
              >
                <span className="row-span-2 pl-3 font-display text-[2.3rem] leading-none text-espresso tabular-nums sm:row-span-1 sm:pl-5 sm:text-6xl lg:text-7xl">{p.guests}</span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg tracking-[0.04em] text-espresso uppercase sm:text-2xl">{p.name}</span>
                    {p.featured && <Tag dark>Most booked</Tag>}
                  </span>
                  <span className="mt-1 block text-sm text-espresso/60">{p.guests} guests</span>
                  <span className="mt-1 block text-sm text-espresso/60 lg:hidden">
                    {p.max_signature_drinks} signature drinks · {p.cups_per_drink} cups each
                  </span>
                </span>

                <span className="hidden text-sm leading-relaxed text-espresso/75 lg:block">
                  Up to {p.max_signature_drinks} signature drinks, {p.cups_per_drink} cups each
                  {extra.length > 0 && <span className="block text-espresso/60">{extra.join(" · ")}</span>}
                </span>

                <span className="col-start-2 mt-2 pr-3 font-display text-xl whitespace-nowrap text-espresso sm:col-start-auto sm:mt-0 sm:pr-0 sm:text-right sm:text-3xl">{aed(p.price)}</span>

                <span
                  aria-hidden
                  className="mr-5 hidden size-11 place-items-center border border-espresso/25 text-espresso transition-colors duration-500 group-hover:border-espresso group-hover:bg-espresso group-hover:text-linen sm:grid"
                >
                  <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" weight="bold" />
                </span>
                <span className="sr-only">Book the {p.name} package</span>
              </Link>
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}
