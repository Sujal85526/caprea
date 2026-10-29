"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { Reveal } from "@/components/site/reveal";
import { aed } from "@/lib/pricing";
import { photoFor } from "@/lib/photos";
import type { MenuCategory, MenuItem } from "@/lib/types";

const sections: { key: MenuCategory; title: string }[] = [
  { key: "matcha", title: "Matcha" },
  { key: "coffee", title: "Coffee" },
  { key: "smoothie", title: "Smoothies" },
  { key: "refresher", title: "Refreshers" },
  { key: "dessert", title: "Desserts" },
  { key: "box", title: "Gathering boxes" },
];

/** Catalogue bar (label + category select), then white product cards in a grid. */
export function MenuBoard({ items }: { items: MenuItem[] }) {
  const groups = useMemo(
    () => sections.map((s) => ({ ...s, items: items.filter((i) => i.category === s.key) })).filter((g) => g.items.length),
    [items],
  );
  const [filter, setFilter] = useState<MenuCategory | "all">("all");
  const shown = filter === "all" ? groups : groups.filter((g) => g.key === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-espresso/10 pt-6">
        <p className="label-caps text-sm text-espresso">Catalogue</p>
        <label className="flex items-center gap-3">
          <span className="label-caps text-xs text-espresso">Show</span>
          <span className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as MenuCategory | "all")}
              className="h-11 w-48 appearance-none rounded-full border border-espresso/15 bg-linen pr-10 pl-4 text-sm text-espresso outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
            >
              <option value="all">Everything</option>
              {groups.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.title}
                </option>
              ))}
            </select>
            <CaretDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-espresso" />
          </span>
        </label>
      </div>

      <div className="mt-8 space-y-16">
        {shown.map((g) => (
          <section key={g.key} aria-labelledby={`menu-${g.key}`}>
            {filter === "all" && (
              <h2 id={`menu-${g.key}`} className="display mb-6 text-3xl text-espresso sm:text-4xl">
                {g.title}
              </h2>
            )}
            <Reveal stagger className="grid grid-cols-1 gap-6 min-[460px]:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => (
                <ProductCard key={it.id} item={it} />
              ))}
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ item }: { item: MenuItem }) {
  const photo = photoFor(item.slug);
  const src = photo ?? item.image_url;
  return (
    <article className="group flex flex-col rounded-[2rem] bg-linen p-2 shadow-[0_18px_40px_-30px_rgba(54,31,24,.35)]">
      <div className="relative isolate aspect-square overflow-hidden rounded-[1.6rem] bg-cream">
        {src && (
          <Image
            src={src}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 460px) 45vw, 90vw"
            className={
              photo
                ? "object-cover transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-105"
                : "object-contain p-10 transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-105"
            }
          />
        )}
        {item.best_seller && (
          <span className="label-caps absolute top-4 left-4 rounded-full bg-espresso px-3 py-1.5 text-[0.58rem] text-cream">Best seller</span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <h3 className="display text-xl text-espresso [overflow-wrap:anywhere]">{item.name}</h3>
        {item.description && <p className="mt-2 text-xs leading-relaxed text-espresso/60 uppercase italic">{item.description}</p>}
        <div className="mt-auto pt-4">
          <div className="border-t border-espresso/10 px-3 pt-4">
            <p className="label-caps text-[0.6rem] text-espresso/70">Price</p>
            <p className="mt-1 font-bold text-espresso">{item.price != null ? aed(item.price) : "On request"}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
