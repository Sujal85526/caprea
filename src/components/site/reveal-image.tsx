"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Image frame that opens from the bottom while its picture settles from a slight zoom. Plays once. */
export function RevealImage({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      tl.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", clearProps: "clipPath" }).from(
        el.querySelectorAll("img"),
        { scale: 1.2, duration: 1.6, ease: "expo.out" },
        0.1,
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
