"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
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

export function MenuBoard({ items }: { items: MenuItem[] }) {
  const groups = useMemo(
    () => sections.map((s) => ({ ...s, items: items.filter((i) => i.category === s.key) })).filter((g) => g.items.length),
    [items],
  );

  return (
    <Tabs defaultValue="all" className="gap-8">
      <div className="sticky top-20 z-30 -mx-6 bg-background/85 px-6 py-3 backdrop-blur-md sm:top-24 sm:mx-0 sm:px-0">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-full bg-secondary p-1 [scrollbar-width:none] sm:w-auto">
          <TabsTrigger value="all" className="rounded-full px-4 py-2 data-[state=active]:bg-espresso data-[state=active]:text-cream">
            All
          </TabsTrigger>
          {groups.map((g) => (
            <TabsTrigger key={g.key} value={g.key} className="rounded-full px-4 py-2 data-[state=active]:bg-espresso data-[state=active]:text-cream">
              {g.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="all" className="space-y-16">
        {groups.map((g) => (
          <section key={g.key}>
            <h2 className="mb-6 font-display text-3xl text-espresso uppercase sm:text-4xl">{g.title}</h2>
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((it) => (
        <article key={it.id} className="group flex flex-col rounded-3xl border bg-card p-3 transition-shadow duration-500 hover:shadow-[0_20px_50px_-30px_rgba(54,31,24,.45)] sm:p-4">
          <div className={cn("relative aspect-square overflow-hidden rounded-2xl", photo ? "bg-cream-200" : "bg-secondary/70")}>
            {it.image_url && (
              <Image
                src={it.image_url}
                alt={it.name}
                fill
                sizes="(min-width: 1024px) 260px, 45vw"
                className={cn(
                  "transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-105",
                  photo ? "object-cover" : "object-contain p-3 drop-shadow-[0_14px_14px_rgba(54,31,24,.18)]",
                )}
              />
            )}
            {it.best_seller && <Badge className="absolute top-2.5 left-2.5 bg-espresso text-cream">Best seller</Badge>}
          </div>
          <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
            <h3 className="font-display text-lg leading-tight text-espresso uppercase [overflow-wrap:anywhere] sm:text-xl">{it.name}</h3>
            {it.description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{it.description}</p>}
            {it.price != null && <p className="mt-auto pt-3 text-sm font-medium text-espresso">{aed(it.price)}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
