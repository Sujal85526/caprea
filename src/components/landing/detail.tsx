"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Centred statement with a hand-drawn underline that draws itself in. */
export function Detail() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      tl.from(".detail-line", { yPercent: 100, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "expo.out" })
        .fromTo(".detail-stroke", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, ease: "power2.inOut" }, 0.3)
        .from(".detail-copy", { y: 20, autoAlpha: 0, duration: 0.8 }, 0.5);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative z-20 w-full bg-cream px-4 py-24 sm:px-12 sm:py-32 md:px-20">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="display text-[clamp(2.4rem,7vw,4.25rem)] text-espresso">
          <span className="block overflow-hidden pb-1">
            <span className="detail-line block">Poured</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="detail-line block">by hand</span>
          </span>
        </h2>
        <svg aria-hidden viewBox="0 0 320 14" className="mt-6 w-56 text-espresso sm:w-80" fill="none">
          <path className="detail-stroke" d="M4 9 C 70 4, 150 3, 220 6 S 300 9, 316 7" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <p className="detail-copy mt-9 text-lg leading-relaxed text-espresso/75 sm:text-xl">
          From the matcha we whisk to the milk we steam, every drink is made to order at your event. It&apos;s the care we
          put into our café, brought to your celebration.
        </p>
      </div>
    </section>
  );
}
