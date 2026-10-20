"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const words = ["Specialty coffee", "Ceremonial matcha", "Signature drinks", "Event catering", "Abu Dhabi"];

/** Endless ticker that speeds up and reverses with scroll direction. */
export function Marquee({ tone = "sand" }: { tone?: "sand" | "espresso" }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      let reset: gsap.core.Tween | undefined;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity() / 300;
          const dir = self.direction;
          loop.timeScale(dir * Math.min(5, 1 + Math.abs(v)));
          reset?.kill();
          reset = gsap.to(loop, { timeScale: dir, duration: 1.2, ease: "power2.out", delay: 0.1 });
        },
      });
    },
    { scope: root },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-8 font-display text-4xl whitespace-nowrap uppercase sm:text-6xl">{w}</span>
          <svg viewBox="0 0 24 24" className="size-6 shrink-0 opacity-70" fill="currentColor" aria-hidden>
            <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className={tone === "sand" ? "overflow-hidden bg-sand py-6 text-espresso" : "overflow-hidden bg-espresso-900 py-6 text-sand"}
      aria-hidden
    >
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
