"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import type { MenuItem } from "@/lib/types";

// Soft tint per drink, sampled from the illustrations.
const tints: Record<string, string> = {
  "matcha-latte": "#e6ecd6",
  "velvet-sunset": "#f4dadf",
  "peach-iced-tea": "#f6e0cf",
  "cloud-nine": "#dbe5f1",
  "golden-hour": "#f8ecc8",
  "acai-smoothie": "#eadcea",
};

export function DrinksCarousel({ drinks }: { drinks: MenuItem[] }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          eyebrow="Signature drinks"
          title="The Oasis Edition"
          action={
            <Button asChild variant="outline">
              <Link href="/menu">
                Full menu <ArrowRight />
              </Link>
            </Button>
          }
        >
          Your guests choose from our signature drinks; the rest is poured from our coffee bar.
        </SectionHeading>

        <Reveal>
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {drinks.map((d) => (
                <CarouselItem key={d.id} className="basis-[62%] pl-4 sm:basis-1/3 lg:basis-1/4">
                  <article className="group rounded-3xl p-5 transition-transform duration-500 hover:-translate-y-1" style={{ background: tints[d.slug] ?? "#f1e8dd" }}>
                    <div className="relative aspect-square">
                      {d.image_url && (
                        <Image
                          src={d.image_url}
                          alt={d.name}
                          fill
                          sizes="(min-width: 1024px) 240px, 60vw"
                          className="object-contain drop-shadow-[0_18px_18px_rgba(54,31,24,.18)] transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-xl text-espresso uppercase">{d.name}</h3>
                        <p className="mt-1 text-sm text-espresso/60">{d.description}</p>
                      </div>
                    </div>
                    {d.best_seller && (
                      <Badge variant="secondary" className="mt-3 bg-white/70 text-espresso">
                        Best seller
                      </Badge>
                    )}
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious className="static size-11 translate-y-0" />
              <CarouselNext className="static size-11 translate-y-0" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}
