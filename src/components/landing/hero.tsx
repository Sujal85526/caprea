"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { useSiteReady } from "@/components/site/loader";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Full-screen photo hero: the wordmark set huge over a darkened shoot photo, one link underneath. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (!ready) {
        if (!reduce) gsap.set(".hero-word path, .hero-cta", { autoAlpha: 0 });
        return;
      }
      if (reduce) return;

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(".hero-img", { scale: 1.18 }, { scale: 1.05, duration: 2.4 }, 0)
        .fromTo(".hero-word path", { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 1.3, stagger: 0.06 }, 0.1)
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
        <Image
          src="/photos/v60-pour.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-img scale-105 object-cover object-[50%_40%]"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-espresso-900/60" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso-900/70 to-transparent" />

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-cream">
        <h1 className="w-full">
          <Logo className="hero-word mx-auto w-[min(88vw,58rem)]" title="Caprea" />
        </h1>
        <p className="hero-cta label-caps mt-6 text-[0.62rem] text-sand sm:mt-8 sm:text-xs">Coffee &amp; matcha catering · Abu Dhabi</p>
        <Link
          href="/book"
          className="hero-cta label-caps group mt-8 inline-flex min-h-11 items-center gap-2 text-sm tracking-[0.08em] sm:mt-10"
        >
          Book your event
          <ArrowRight weight="bold" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
