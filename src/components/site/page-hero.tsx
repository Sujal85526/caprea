"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { useSiteReady } from "@/components/site/loader";

/** Title block for inner pages: masked line reveal once the loader has lifted. */
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      if (!ready) return;
      const split = SplitText.create(".ph-title", { type: "lines,words", mask: "lines" });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.08 })
        .from(".ph-fade", { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, "-=1");
      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <div ref={root} className="mx-auto max-w-7xl px-6 pt-40 pb-16 sm:px-10 lg:pt-48">
      <p className="ph-fade eyebrow mb-6 text-sand">{eyebrow}</p>
      <h1 className="ph-title font-display text-[14vw] leading-[0.9] text-cream uppercase sm:text-8xl lg:text-[8.5rem]">{title}</h1>
      {children && <div className="ph-fade mt-8 max-w-2xl text-lg leading-relaxed text-cream/70">{children}</div>}
    </div>
  );
}
