"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { useSiteReady } from "@/components/site/loader";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Wide terrace shot on landscape screens, the tall version on phones held upright. Images are served
// unoptimized (see next.config.ts), so the <picture> points straight at the pre-compressed files.
const HERO_WIDE = "/photos/hero-terrace.webp";
const HERO_TALL = "/photos/hero-terrace-portrait.webp";

/** Full-screen photo hero: the tagline set large over a warm terrace photo, one link underneath. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (!ready) {
        if (!reduce) gsap.set(".hero-word, .hero-cta", { autoAlpha: 0 });
        return;
      }
      if (reduce) return;

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".hero-img", { scale: 1.18 }, { scale: 1.05, duration: 2.4 }, 0)
        .fromTo(".hero-word", { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 1.3, stagger: 0.1 }, 0.1)
        .fromTo(".hero-cta", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.6);

      // Photo drifts slower than the page as you scroll away.
      gsap.to(".hero-img-wrap", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-espresso-900">
      <div className="hero-img-wrap absolute inset-0">
        <picture>
          <source media="(orientation: landscape)" srcSet={HERO_WIDE} />
          <img
            src={HERO_TALL}
            alt="Caprea iced latte and matcha on a terrace at golden hour"
            fetchPriority="high"
            className="hero-img absolute inset-0 size-full scale-105 object-cover object-center"
          />
        </picture>
      </div>
      <div aria-hidden className="absolute inset-0 bg-espresso-900/25" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-espresso-900/70 via-espresso-900/20 via-55% to-espresso-900/40" />

      <div className="relative flex h-full flex-col items-center px-4 pt-[max(7.5rem,20svh)] text-center text-cream">
        <h1 className="display text-[clamp(3rem,11vw,8rem)] leading-[0.9] text-cream drop-shadow-[0_4px_24px_rgba(36,20,15,.35)]">
          <span className="sr-only">Caprea: </span>
          <span className="block overflow-hidden pb-1">
            <span className="hero-word block">Blame</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="hero-word block">the brew</span>
          </span>
        </h1>
        <Link
          href="/book"
          className="hero-cta label-caps group mt-6 inline-flex min-h-11 items-center gap-2 text-sm tracking-[0.08em] sm:mt-8"
        >
          Book your event
          <ArrowRight weight="bold" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
