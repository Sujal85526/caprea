"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import type { MenuCategory, MenuItem } from "@/lib/types";

const CATEGORY: Partial<Record<MenuCategory, string>> = {
  matcha: "Matcha",
  coffee: "Coffee",
  smoothie: "Smoothie",
  refresher: "Refresher",
  signature: "Signature",
};

export function DrinksCarousel({ drinks }: { drinks: MenuItem[] }) {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Carousel opts={{ align: "start" }} className="w-full">
          <SectionHeading
            label="Signature drinks"
            strong="Favourites"
            light="your guests will love"
            action={
              <div className="flex items-center gap-2">
                <CarouselPrevious className="static size-11 translate-y-0 border-espresso/15 bg-transparent text-espresso hover:bg-espresso/5" />
                <CarouselNext className="static size-11 translate-y-0 border-espresso/15 bg-transparent text-espresso hover:bg-espresso/5" />
                <Button asChild variant="outline" className="ml-1 border-espresso/15 bg-transparent">
                  <Link href="/menu">Full menu</Link>
                </Button>
              </div>
            }
          />

          <Reveal>
            <CarouselContent className="-ml-3 sm:-ml-4">
              {drinks.map((d) => {
                const tags = [d.best_seller && "Best seller", CATEGORY[d.category]].filter(Boolean) as string[];
                return (
                  <CarouselItem key={d.id} className="basis-[64%] pl-3 min-[480px]:basis-[45%] sm:basis-1/3 sm:pl-4 lg:basis-1/4">
                    <article className="rounded-3xl bg-linen p-3">
                      <div className="relative aspect-square rounded-2xl bg-cream/70">
                        {d.image_url && (
                          <Image src={d.image_url} alt={d.name} fill sizes="(min-width: 1024px) 240px, 60vw" className="object-contain p-5" />
                        )}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                          {tags.map((t, i) => (
                            <span
                              key={t}
                              className={
                                i === 0 && d.best_seller
                                  ? "eyebrow rounded-full bg-espresso px-2 py-1 text-[0.52rem] font-semibold text-cream"
                                  : "eyebrow rounded-full bg-linen px-2 py-1 text-[0.52rem] font-semibold text-espresso"
                              }
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="px-1 pt-4 pb-2 font-sans text-base font-semibold tracking-normal text-espresso">{d.name}</h3>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Reveal>
        </Carousel>
      </div>
    </section>
  );
}
