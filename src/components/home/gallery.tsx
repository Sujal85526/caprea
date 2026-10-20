"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const columns = [
  [
    { src: "/photos/matcha-splash.webp", alt: "Matcha splashing from a Caprea cup", ratio: "aspect-[3/4]" },
    { src: "/photos/trio-overhead.webp", alt: "Three smoothies from above", ratio: "aspect-[4/5]" },
  ],
  [
    { src: "/photos/iced-latte-pour.webp", alt: "Milk poured into an iced latte", ratio: "aspect-[4/5]" },
    { src: "/photos/cookies-hand.webp", alt: "A hand holding a stack of cookies", ratio: "aspect-[3/4]" },
    { src: "/photos/whisk.webp", alt: "Matcha whisk", ratio: "aspect-square" },
  ],
  [
    { src: "/photos/coconut.webp", alt: "Caprea branded coconut", ratio: "aspect-[3/4]" },
    { src: "/photos/acai.webp", alt: "Acai smoothie on a wooden stand", ratio: "aspect-[4/5]" },
  ],
  [
    { src: "/photos/cloudy-matcha.webp", alt: "Cloudy matcha being poured", ratio: "aspect-[4/5]" },
    { src: "/photos/v60-pour.webp", alt: "V60 coffee poured into a cup", ratio: "aspect-[3/4]" },
  ],
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".gal-col").forEach((col, i) => {
        gsap.fromTo(col, { yPercent: i % 2 ? 6 : -6 }, {
          yPercent: i % 2 ? -14 : 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".gal-item").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(100% 0% 0% 0% round 24px)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
      gsap.from(".gal-title span", { yPercent: 100, stagger: 0.1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".gal-title", start: "top 85%" } });
    },
    { scope: root },
  );

  return (
    <section id="gallery" ref={root} className="relative overflow-hidden bg-cream py-28 text-espresso lg:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="gal-title font-display text-5xl uppercase sm:text-7xl">
            <span className="block overflow-hidden"><span className="inline-block">Made to</span></span>
            <span className="block overflow-hidden text-mocha"><span className="inline-block">be shared</span></span>
          </h2>
          <a href="https://instagram.com/caprea.ae" target="_blank" rel="noreferrer" className="eyebrow border-b border-espresso/30 pb-1 hover:border-espresso">
            Follow @caprea.ae
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {columns.map((col, i) => (
            <div key={i} className={`gal-col flex flex-col gap-4 md:gap-6 ${i % 2 ? "md:pt-24" : ""}`}>
              {col.map((p) => (
                <div key={p.src} className={`gal-item group relative overflow-hidden rounded-3xl ${p.ratio}`}>
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-[1.2s] ease-(--ease-luxe) group-hover:scale-105" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
