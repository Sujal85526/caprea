"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { FrameSequence } from "@/components/home/frame-sequence";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

export function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".cta-title", { type: "words,chars", mask: "words" });
      gsap.from(split.chars, {
        yPercent: 110,
        stagger: 0.02,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".cta-title", start: "top 85%" },
      });
      gsap.fromTo(".cta-circle", { scale: 0.6, rotate: -20 }, {
        scale: 1,
        rotate: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
      });
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-espresso py-28 lg:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 sm:px-10 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow mb-6 text-sand">Reserve your date</p>
          <h2 className="cta-title font-display text-[15vw] leading-[0.88] text-cream uppercase sm:text-8xl lg:text-[7.5rem]">
            Book your date
          </h2>
          <p className="mt-8 max-w-md text-lg text-cream/70">
            Confirm a package in minutes, or tell us what you have in mind and we&apos;ll design a custom menu for your event.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/book">
              Book a package <ArrowUpRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/book?mode=custom" variant="outline">
              Custom request
            </ButtonLink>
          </div>
        </div>
        <div className="cta-circle relative mx-auto aspect-square w-[min(80vw,440px)] overflow-hidden rounded-full ring-1 ring-sand/30">
          <FrameSequence name="v60" count={30} trigger={root} start="top bottom" end="bottom top" focusY={0.45} className="absolute inset-0 size-full" />
        </div>
      </div>
    </section>
  );
}
