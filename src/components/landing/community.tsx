"use client";

import Image from "next/image";
import { GuestsHero } from "@/components/landing/guests-hero";
import Link from "next/link";
import { useRef } from "react";
import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { aed } from "@/lib/pricing";
import { photoFor } from "@/lib/photos";
import type { MenuItem } from "@/lib/types";

/**
 * Espresso section revealed by a circle that grows to fill the screen as you scroll, with the animated cup
 * scene under the headline and a row of signature-drink cards you can slide through.
 */
export function Community({ drinks }: { drinks: MenuItem[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".cm-circle",
        { clipPath: "circle(22% at 50% 30%)" },
        {
          clipPath: "circle(150% at 50% 30%)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 5%", scrub: 0.6 },
        },
      );
      gsap.from(".cm-card", {
        y: 50,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.07,
        scrollTrigger: { trigger: track.current, start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.clientWidth + 18), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section ref={root} className="relative z-20 w-full bg-espresso-900">
      <div className="cm-circle relative overflow-hidden bg-espresso px-4 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <GuestsHero />

        <div className="mx-auto mt-6 max-w-[1400px] sm:mt-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <h3 className="display text-[clamp(1.75rem,4vw,2.5rem)] text-cream">
              Our signature
              <br />
              drinks
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => slide(-1)}
                aria-label="Previous drinks"
                className="grid size-11 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur transition-colors hover:bg-cream hover:text-espresso"
              >
                <CaretLeft weight="bold" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => slide(1)}
                aria-label="Next drinks"
                className="grid size-11 place-items-center rounded-full bg-cream/15 text-cream backdrop-blur transition-colors hover:bg-cream hover:text-espresso"
              >
                <CaretRight weight="bold" className="size-4" />
              </button>
            </div>
          </div>

          <ul
            ref={track}
            className="-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-[18px] overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {drinks.map((d) => (
              <li key={d.id} className="cm-card w-[78vw] max-w-[20rem] shrink-0 snap-start">
                <DrinkCard drink={d} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DrinkCard({ drink }: { drink: MenuItem }) {
  const photo = photoFor(drink.slug);
  return (
    <article className="group relative aspect-[1/1.07] overflow-hidden bg-espresso-700">
      {photo ? (
        <Image
          src={photo}
          alt={drink.name}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-105"
        />
      ) : (
        drink.image_url && (
          <div className="absolute inset-0 bg-sand-300">
            <Image src={drink.image_url} alt={drink.name} fill sizes="320px" className="object-contain p-10 pb-24" />
          </div>
        )
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h4 className="text-xl leading-tight font-bold text-cream">{drink.name}</h4>
        <div className="mt-3 flex items-end justify-between gap-3 border-t border-cream/15 pt-3">
          <div>
            <p className="label-caps text-[0.6rem] text-cream/70">{drink.price != null ? "Price" : "Signature"}</p>
            <p className="mt-1 text-sm font-bold text-sand">{drink.price != null ? aed(drink.price) : "At your event"}</p>
          </div>
          <Link
            href="/book"
            aria-label={`Book ${drink.name} for your event`}
            className="grid size-10 place-items-center rounded-full border border-cream/25 bg-espresso-900/40 text-cream transition-colors hover:bg-cream hover:text-espresso"
          >
            <Plus className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
