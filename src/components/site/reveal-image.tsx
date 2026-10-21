"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Image frame that opens from the bottom while its picture settles from a slight zoom. Plays once. */
export function RevealImage({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const imgs = Array.from(el.querySelectorAll("img"));
      // Fetch now rather than when scrolled near, so the frame never opens onto an empty box.
      imgs.forEach((img) => (img.loading = "eager"));
      if (prefersReducedMotion()) return;

      gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
      const play = () => {
        // Wait for the picture to be decoded, but never hold the reveal for more than half a second.
        const decoded = Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined))));
        Promise.race([decoded, new Promise((r) => setTimeout(r, 500))]).then(() => {
          gsap
            .timeline({ delay })
            .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.out", clearProps: "clipPath" })
            .from(imgs, { scale: 1.12, duration: 1.1, ease: "power3.out" }, 0);
        });
      };
      ScrollTrigger.create({ trigger: el, start: "top bottom-=40", once: true, onEnter: play });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
