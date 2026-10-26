"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useSiteReady } from "@/components/site/loader";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { aed } from "@/lib/pricing";

/** Typographic espresso hero: the wordmark, one line and two pills, with thin-line circles for decoration. */
export function Hero({ fromPrice, minGuests, maxGuests }: { fromPrice: number; minGuests: number; maxGuests: number }) {
  const root = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (!ready) {
        // Hold everything hidden until the loader lifts (avoids a flash of the final state).
        if (!reduce) gsap.set(".hero-in, .hero-ring, .hero-dots", { autoAlpha: 0 });
        return;
      }
      if (reduce) return;

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".hero-in", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09 }, 0)
        .fromTo(".hero-ring", { autoAlpha: 1, drawSVG: "0%" }, { drawSVG: "100%", duration: 2, stagger: 0.15, ease: "power2.inOut" }, 0.1)
        .fromTo(".hero-dots", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 0.8);
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-espresso text-cream">
      {/* Thin-line decoration */}
      <svg
        aria-hidden
        viewBox="0 0 600 600"
        fill="none"
        className="pointer-events-none absolute top-1/2 -right-[45%] w-[150%] max-w-none -translate-y-1/2 text-sand/25 sm:-right-[20%] sm:w-[95%] lg:-right-[6%] lg:w-[54%]"
      >
        {[290, 225, 160].map((r) => (
          <circle key={r} className="hero-ring" cx="300" cy="300" r={r} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <g className="hero-dots max-sm:hidden" fill="currentColor">
          {Array.from({ length: 25 }, (_, i) => (
            <circle key={i} cx={420 + (i % 5) * 18} cy={400 + Math.floor(i / 5) * 18} r={i % 2 ? 2 : 2.8} />
          ))}
        </g>
      </svg>

      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32 lg:pt-32 lg:pb-36">
        <h1 className="hero-in">
          <Logo className="w-[min(78vw,34rem)] text-cream" title="Caprea" />
        </h1>
        <p className="hero-in eyebrow mt-6 text-[0.7rem] text-sand sm:mt-8 sm:text-xs">Coffee &amp; matcha catering</p>
        <p className="hero-in mt-5 max-w-md text-lg leading-relaxed font-light text-cream/85 sm:text-xl">
          Our cart, a barista and our signature drinks, poured at your event.
        </p>
        <div className="hero-in mt-9 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
          <Button asChild size="lg" variant="sand">
            <Link href="/book">
              Book your event <ArrowUpRight weight="bold" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-cream/30 bg-transparent text-cream hover:bg-cream/10 hover:text-cream">
            <Link href="#packages">View packages</Link>
          </Button>
        </div>
        <p className="hero-in mt-8 text-sm text-cream/55">
          {minGuests}–{maxGuests} guests · from {aed(fromPrice)}
        </p>
      </div>
    </section>
  );
}
