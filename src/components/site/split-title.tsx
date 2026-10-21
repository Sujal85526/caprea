"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useSiteReady } from "@/components/site/loader";

/** Heading whose lines slide up from behind a mask, once, when it scrolls into view. */
export function SplitTitle({ as: Tag = "h2", className, children, immediate }: { as?: ElementType; className?: string; children: ReactNode; immediate?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || (immediate && !ready)) return;
      const split = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
      });
      return () => split.revert();
    },
    { scope: ref, dependencies: [ready] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
