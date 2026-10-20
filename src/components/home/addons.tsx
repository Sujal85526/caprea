"use client";

import Image from "next/image";
import { useRef } from "react";
import { aed } from "@/lib/pricing";
import { gsap, useGSAP } from "@/lib/gsap";
import type { MenuItem } from "@/lib/types";

export function Addons({ items, minQty }: { items: MenuItem[]; minQty: number }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".addon", {
        y: 120,
        rotate: (i) => (i % 2 ? 12 : -12),
        opacity: 0,
        duration: 1.4,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.utils.toArray<HTMLElement>(".addon-img").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? -40 : 40, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-espresso-800 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5 text-sand">Sweet add-ons</p>
            <h2 className="font-display text-5xl text-cream uppercase sm:text-6xl">
              Something <span className="text-sand">on the side</span>
            </h2>
          </div>
          <p className="max-w-sm text-cream/60">Add treats to any package. Minimum {minQty} pieces per add-on.</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4 lg:grid-cols-7">
          {items.map((it) => (
            <div key={it.id} className="addon group text-center">
              <div className="addon-img relative mx-auto aspect-square w-full max-w-[180px]">
                {it.image_url && (
                  <Image src={it.image_url} alt={it.name} fill sizes="180px" className="object-contain drop-shadow-[0_25px_30px_rgba(0,0,0,.5)] transition-transform duration-700 ease-(--ease-luxe) group-hover:-translate-y-2 group-hover:rotate-3" />
                )}
              </div>
              <p className="mt-5 font-display text-lg leading-tight text-cream uppercase [overflow-wrap:anywhere] sm:text-xl">{it.name}</p>
              <p className="eyebrow mt-1 text-sand">{aed(it.addon_price ?? it.price ?? 0)} each</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
