"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useSiteReady } from "@/components/site/loader";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** animate direct children one after another instead of the block as a whole */
  stagger?: boolean;
  delay?: number;
  /** play on mount instead of when scrolled into view (for content above the fold) */
  immediate?: boolean;
};

/** Fades content up once as it enters the viewport. Short and quiet by design: no pinning, no scrubbing. */
export function Reveal({ children, className, as: Tag = "div", stagger, delay = 0, immediate }: Props) {
  const ref = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      // Above-the-fold content waits (hidden) for the intro loader to lift.
      if (immediate && !ready) {
        gsap.set(stagger ? Array.from(el.children) : el, { autoAlpha: 0 });
        return;
      }
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.06 : 0,
        clearProps: "transform,opacity,visibility",
        scrollTrigger: immediate ? undefined : { trigger: el, start: "top 94%", once: true },
      });
    },
    { scope: ref, dependencies: [ready] },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
