"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Full-bleed photograph between sections, drifting gently as it passes (no pinning). */
export function ImageBand({ src, alt, eyebrow, children }: { src: string; alt: string; eyebrow?: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".band-img",
        { yPercent: -7 },
        { yPercent: 7, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
      );
      gsap.from(".band-copy > *", {
        y: 24,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative h-[72svh] min-h-[26rem] overflow-hidden bg-espresso lg:h-[88vh]">
      <div className="band-img absolute -inset-y-[9%] inset-x-0">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
      {children && (
        <div className="band-copy absolute inset-x-0 bottom-0 mx-auto max-w-[90rem] px-5 pb-10 text-cream sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
          {eyebrow && <p className="label text-cream/85">{eyebrow}</p>}
          <p className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,9vw,7rem)] leading-[0.92] uppercase">{children}</p>
        </div>
      )}
    </section>
  );
}
