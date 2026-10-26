"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aed } from "@/lib/pricing";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const sections: { key: MenuCategory; title: string }[] = [
  { key: "matcha", title: "Matcha" },
  { key: "coffee", title: "Coffee" },
  { key: "smoothie", title: "Smoothies" },
  { key: "refresher", title: "Refreshers" },
  { key: "dessert", title: "Desserts" },
  { key: "box", title: "Gathering boxes" },
];

const tab =
  "h-11 flex-none rounded-full border border-espresso/10 px-4 text-espresso/70 shadow-none data-[state=active]:border-espresso data-[state=active]:bg-espresso data-[state=active]:text-cream data-[state=active]:shadow-none";

export function MenuBoard({ items }: { items: MenuItem[] }) {
  const groups = useMemo(
    () => sections.map((s) => ({ ...s, items: items.filter((i) => i.category === s.key) })).filter((g) => g.items.length),
    [items],
  );

  return (
    <Tabs defaultValue="all" className="gap-8">
      <div className="sticky top-16 z-30 -mx-6 bg-background/90 px-6 py-3 backdrop-blur-md sm:top-[4.5rem] sm:mx-0 sm:px-0">
        <TabsList className="h-auto w-full justify-start gap-1.5 overflow-x-auto rounded-none bg-transparent p-px [scrollbar-width:none] group-data-horizontal/tabs:h-auto sm:w-auto">
          <TabsTrigger value="all" className={tab}>
            All
          </TabsTrigger>
          {groups.map((g) => (
            <TabsTrigger key={g.key} value={g.key} className={tab}>
              {g.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="all" className="space-y-14">
        {groups.map((g) => (
          <section key={g.key}>
            <h2 className="mb-5 font-sans text-2xl font-semibold tracking-normal text-espresso">{g.title}</h2>
            <Grid items={g.items} photo={g.key === "box"} />
          </section>
        ))}
      </TabsContent>
      {groups.map((g) => (
        <TabsContent key={g.key} value={g.key}>
          <Grid items={g.items} photo={g.key === "box"} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function Grid({ items, photo }: { items: MenuItem[]; photo: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {items.map((it) => (
        <article key={it.id} className="flex flex-col rounded-3xl bg-cream p-2.5 sm:p-3">
          <div className={cn("relative aspect-square overflow-hidden rounded-2xl", photo ? "bg-cream-200" : "bg-linen/70")}>
            {it.image_url && (
              <Image
                src={it.image_url}
                alt={it.name}
                fill
                sizes="(min-width: 1024px) 260px, 45vw"
                className={photo ? "object-cover" : "object-contain p-4"}
              />
            )}
            {it.best_seller && (
              <span className="eyebrow absolute top-2 left-2 rounded-full bg-espresso px-2 py-1 text-[0.5rem] font-semibold text-cream">Best seller</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1 px-1.5 pt-3 pb-1.5">
            <h3 className="font-sans text-[0.95rem] leading-snug font-semibold tracking-normal text-espresso [overflow-wrap:anywhere]">{it.name}</h3>
            {it.price != null && <p className="mt-auto text-sm text-espresso/60">{aed(it.price)}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
