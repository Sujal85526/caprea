"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const words = ["Specialty coffee", "Ceremonial matcha", "Signature drinks", "Weddings", "Graduations", "Gatherings"];

/** Slow endless band of words between sections. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(".mq-track", { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
    },
    { scope: ref },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 font-display text-2xl whitespace-nowrap uppercase sm:px-10 sm:text-4xl">{w}</span>
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-sand/50" fill="currentColor" aria-hidden>
            <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="overflow-hidden bg-espresso py-5 text-sand" aria-hidden>
      <div className="mq-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
