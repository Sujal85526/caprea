"use client";

import { useMemo, useRef, useState } from "react";
import { ProductTile } from "@/components/menu/product-tile";
import { Flip, gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const sections: { key: MenuCategory; title: string }[] = [
  { key: "signature", title: "Signature" },
  { key: "matcha", title: "Matcha" },
  { key: "coffee", title: "Coffee" },
  { key: "smoothie", title: "Smoothies" },
  { key: "refresher", title: "Refreshers" },
  { key: "dessert", title: "Desserts" },
  { key: "box", title: "Gathering boxes" },
];

type Filter = MenuCategory | "all";

/** Whole menu in one grid; the category filter rearranges the tiles with a short Flip animation. */
export function MenuBoard({ items }: { items: MenuItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const firstReveal = useRef<ScrollTrigger[]>([]);

  const groups = useMemo(() => sections.filter((s) => items.some((i) => i.category === s.key)), [items]);
  // Group the "all" view by category so related drinks sit together.
  const ordered = useMemo(() => {
    const rank = new Map(sections.map((s, i) => [s.key, i]));
    return [...items].sort((a, b) => (rank.get(a.category) ?? 99) - (rank.get(b.category) ?? 99));
  }, [items]);
  const count = filter === "all" ? items.length : items.filter((i) => i.category === filter).length;

  const choose = (f: Filter) => {
    if (f === filter || !grid.current) return;
    const tiles = grid.current.querySelectorAll(".menu-tile");
    // Tiles below the fold may still be waiting for their first reveal; show them before rearranging.
    firstReveal.current.forEach((t) => t.kill());
    firstReveal.current = [];
    gsap.killTweensOf(tiles);
    gsap.set(tiles, { clearProps: "transform,opacity" });
    if (!prefersReducedMotion()) flipState.current = Flip.getState(tiles);
    setFilter(f);
  };

  // First view: tiles rise in, row by row, as they scroll into view.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tiles = gsap.utils.toArray<HTMLElement>(".menu-tile");
      gsap.set(tiles, { opacity: 0, y: 28 });
      firstReveal.current = ScrollTrigger.batch(tiles, {
        start: "top 94%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out", clearProps: "transform,opacity" }),
      });
    },
    { scope: grid },
  );

  // After React shows/hides tiles, animate from the recorded layout.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state || !grid.current) return;
      flipState.current = null;
      Flip.from(state, {
        targets: grid.current.querySelectorAll(".menu-tile"),
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        nested: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.25 }),
      });
    },
    { dependencies: [filter], scope: grid },
  );

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-5 mb-10 border-b border-espresso/10 bg-linen/95 px-5 backdrop-blur-md sm:top-20 sm:-mx-8 sm:mb-14 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex items-center justify-between gap-6">
          <div role="tablist" aria-label="Filter the menu" className="-mx-2 flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] sm:gap-3">
            {[{ key: "all" as const, title: "All" }, ...groups].map((g) => {
              const on = filter === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => choose(g.key)}
                  className={cn(
                    "label relative h-12 shrink-0 px-2 whitespace-nowrap transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    on ? "text-espresso" : "text-espresso/50 hover:text-espresso",
                  )}
                >
                  {g.title}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-2 bottom-0 h-px origin-left bg-espresso transition-transform duration-500 ease-(--ease-luxe)",
                      on ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
          <p className="label hidden shrink-0 text-espresso/50 tabular-nums sm:block" aria-live="polite">
            {count} items
          </p>
        </div>
      </div>

      <div ref={grid} className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
        {ordered.map((it) => (
          <ProductTile key={it.id} item={it} className={cn("menu-tile", filter !== "all" && filter !== it.category && "hidden")} />
        ))}
      </div>
    </div>
  );
}
