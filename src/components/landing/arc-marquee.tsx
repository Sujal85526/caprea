"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const PHRASE = "CAPREA · COFFEE & MATCHA · CATERING · ABU DHABI · ";
const REPEAT = 6;
// A wide arch that runs off both edges of the screen.
const ARC = "M -200 330 Q 720 -90 1640 330";

/** An espresso band curved like an arch, with Caprea's words sliding along it endlessly. */
export function ArcMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const svg = root.current?.querySelector("svg");
      const path = root.current?.querySelector<SVGTextPathElement>("textPath");
      const text = root.current?.querySelector<SVGTextElement>("text");
      if (!svg || !path || !text || prefersReducedMotion()) return;
      // One phrase's length in user units, so the loop restarts exactly one phrase along.
      const unit = text.getComputedTextLength() / REPEAT;
      const loop = gsap.fromTo(path, { attr: { startOffset: 0 } }, { attr: { startOffset: -unit }, duration: 14, ease: "none", repeat: -1 });
      // Scrolling nudges the speed, like the reference's scroll-driven band.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (st) =>
          gsap.to(loop, {
            timeScale: 1 + Math.min(Math.abs(st.getVelocity()) / 400, 4),
            duration: 0.2,
            overwrite: true,
            onComplete: () => void gsap.to(loop, { timeScale: 1, duration: 0.8 }),
          }),
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none relative z-30 -my-[6vw] overflow-hidden bg-transparent select-none">
      <svg viewBox="0 0 1440 400" className="block w-[160%] max-w-none -translate-x-[18.75%] sm:w-full sm:translate-x-0">
        <defs>
          <path id="arc-path" d={ARC} />
        </defs>
        <path d={ARC} fill="none" stroke="var(--color-espresso)" strokeWidth="118" />
        <text className="display" fontSize="76" fill="var(--color-cream)" dominantBaseline="central" letterSpacing="1">
          <textPath href="#arc-path" startOffset="0">
            {PHRASE.repeat(REPEAT)}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
