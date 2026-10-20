"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const stats = [
  { value: "300", label: "Guests in our largest package" },
  { value: "4h", label: "Of live barista service included" },
  { value: "30+", label: "Drinks and treats on the menu" },
];

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Words light up as the paragraph scrolls through the viewport.
      const split = SplitText.create(".exp-text", { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".exp-text", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>(".exp-photo").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(18% 18% 18% 18% round 24px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
        });
        gsap.fromTo(el.querySelector("img"), { yPercent: -10, scale: 1.2 }, {
          yPercent: 10,
          scale: 1.05,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      gsap.from(".exp-stat", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        scrollTrigger: { trigger: ".exp-stats", start: "top 85%" },
      });

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} className="relative overflow-hidden bg-cream text-espresso">
      <div className="mx-auto max-w-7xl px-6 py-28 sm:px-10 lg:py-40">
        <p className="eyebrow mb-10 text-mocha">The Caprea experience</p>
        <p className="exp-text max-w-5xl font-display text-[1.9rem] leading-[1.15] uppercase sm:text-[2.6rem] lg:text-[3.3rem]">
          A café-grade bar, wheeled into your celebration. Our baristas pour specialty coffee, ceremonial matcha and
          signature drinks to order, while your guests gather around the cart.
        </p>

        <div className="mt-20 grid gap-6 sm:grid-cols-12 lg:mt-28">
          <div className="exp-photo relative aspect-[4/5] overflow-hidden rounded-3xl sm:col-span-5">
            <Image src="/photos/barista-cups.webp" alt="Caprea barista holding branded cups" fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-between gap-6 sm:col-span-7">
            <div className="exp-photo relative aspect-[16/11] overflow-hidden rounded-3xl">
              <Image src="/photos/latte-art.webp" alt="Iced coffee from above" fill sizes="(min-width: 640px) 55vw, 100vw" className="object-cover object-[50%_40%]" />
            </div>
            <div className="exp-stats grid grid-cols-3 gap-4 border-t border-espresso/15 pt-8">
              {stats.map((s) => (
                <div key={s.label} className="exp-stat">
                  <p className="font-display text-5xl text-espresso sm:text-7xl">{s.value}</p>
                  <p className="mt-2 text-xs leading-relaxed tracking-wide text-mocha sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
