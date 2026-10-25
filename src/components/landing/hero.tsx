"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useSiteReady } from "@/components/site/loader";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { aed } from "@/lib/pricing";

/**
 * Full-bleed hero: freshly whisked matcha fills the screen, with a large headline, a short line and the
 * booking action at the bottom left. The photograph settles from a slight zoom while the headline rises.
 */
export function Hero({ fromPrice, minGuests, maxGuests }: { fromPrice: number; minGuests: number; maxGuests: number }) {
  const root = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (!ready) {
        // Hold the copy hidden until the loader lifts (avoids a flash of the final state).
        if (!reduce) gsap.set(".hero-anim", { autoAlpha: 0 });
        return;
      }
      gsap.set(".hero-anim", { autoAlpha: 1 });
      if (reduce) return;

      const split = SplitText.create(".hero-title", { type: "lines", mask: "lines" });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-img", { scale: 1.12, duration: 2.4 }, 0)
        .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.1 }, 0.25)
        .from(".hero-fade", { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 0.6);

      // The photograph drifts a little slower than the page as the hero leaves (no pinning).
      gsap.to(".hero-media", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-espresso text-cream">
      <div className="hero-media absolute inset-0">
        <Image
          src="/photos/matcha-foam.webp"
          alt="Ceremonial matcha being whisked to a fine foam"
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover object-[50%_30%]"
        />
      </div>
      {/* Neutral shade behind the copy so small type stays legible over the foam. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/45 to-transparent" />

      <div className="hero-anim relative mx-auto flex h-full max-w-[90rem] flex-col justify-end px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-14">
        <p className="hero-fade label text-cream/85">Coffee &amp; matcha catering · Abu Dhabi</p>
        <h1 className="hero-title mt-5 font-display text-[clamp(2.9rem,13vw,5.5rem)] leading-[0.9] uppercase sm:text-[clamp(4rem,10.5vw,9.5rem)]">
          Poured for
          <br />
          your moments
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="hero-fade flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <Button asChild size="lg" variant="light" className="w-full sm:w-auto">
              <Link href="/book">
                Book your event <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover/button:rotate-45" />
              </Link>
            </Button>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-cream/80">
              Our coffee cart, a barista and our signature drinks at your wedding, graduation or gathering.
            </p>
          </div>
          <p className="hero-fade label text-cream/85 lg:text-right">
            From {aed(fromPrice)} · {minGuests}–{maxGuests} guests
          </p>
        </div>
      </div>
    </section>
  );
}
