"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useSiteReady } from "@/components/site/loader";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { aed } from "@/lib/pricing";

const slides = [
  { src: "/photos/strawberry-matcha.webp", alt: "Strawberry matcha in a Caprea cup", name: "Strawberry matcha" },
  { src: "/photos/matcha-splash.webp", alt: "Matcha splashing from a Caprea cup", name: "Ceremonial matcha" },
  { src: "/photos/iced-latte-pour.webp", alt: "Milk poured into an iced latte", name: "Iced latte" },
];

const SLIDE_SECONDS = 5.5;

/**
 * Split hero: the headline on linen, a full-height photograph on the right (top on phones). After the intro,
 * the photographs take turns, each one wiping in from the right while it settles from a slight zoom.
 */
export function Hero({ fromPrice, minGuests, maxGuests }: { fromPrice: number; minGuests: number; maxGuests: number }) {
  const root = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (!ready) {
        // Hold everything hidden until the loader lifts (avoids a flash of the final state).
        if (!reduce) gsap.set(".hero-anim", { autoAlpha: 0 });
        return;
      }
      gsap.set(".hero-anim", { autoAlpha: 1 });
      if (reduce) return;

      const split = SplitText.create(".hero-title", { type: "lines", mask: "lines", linesClass: "hero-line" });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-media", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.4, ease: "expo.inOut" }, 0)
        .from(".hero-slide-0 img", { scale: 1.2, duration: 2 }, 0)
        .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.09 }, 0.35)
        .from(".hero-fade", { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 0.7);

      // Calm slideshow: one wipe every few seconds, never on a timer that can stack up.
      const slidesEl = gsap.utils.toArray<HTMLElement>(".hero-slide");
      let current = 0;
      const advance = () => {
        const prev = slidesEl[current];
        current = (current + 1) % slidesEl.length;
        const next = slidesEl[current];
        gsap.set(slidesEl, { zIndex: 0 });
        gsap.set(prev, { zIndex: 1 });
        gsap.set(next, { zIndex: 2 });
        setActive(current);
        gsap
          .timeline()
          .fromTo(next, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" })
          .fromTo(next.querySelector("img"), { scale: 1.12, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 2, ease: "expo.out" }, 0)
          .to(prev.querySelector("img"), { xPercent: -8, duration: 1.3, ease: "expo.inOut" }, 0)
          .set(prev.querySelector("img"), { xPercent: 0 });
      };
      let call: gsap.core.Tween;
      const schedule = (seconds: number) => {
        call = gsap.delayedCall(seconds, () => {
          advance();
          schedule(SLIDE_SECONDS);
        });
      };
      schedule(SLIDE_SECONDS + 1.2);

      return () => {
        split.revert();
        call.kill();
      };
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col bg-linen lg:grid lg:grid-cols-2">
      {/* Photograph: top on phones, right half from desktop */}
      <div className="hero-anim relative order-1 h-[58svh] min-h-80 lg:order-2 lg:h-auto lg:min-h-full">
        <div className="hero-media absolute inset-0 overflow-hidden bg-cream">
          {slides.map((s, i) => (
            <div key={s.src} className={`hero-slide hero-slide-${i} absolute inset-0 overflow-hidden`} style={{ zIndex: i === 0 ? 1 : 0 }}>
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[50%_60%]"
              />
            </div>
          ))}
        </div>
        <div className="hero-fade absolute right-5 bottom-5 left-5 z-10 flex items-center justify-between gap-4 sm:right-8 sm:left-auto lg:right-12 lg:bottom-10">
          <p className="label whitespace-nowrap text-espresso" aria-live="polite">
            <span className="tabular-nums">0{active + 1}</span>
            <span className="mx-2 text-espresso/40">/</span>
            {slides[active].name}
          </p>
          <span aria-hidden className="hidden gap-1.5 min-[400px]:flex">
            {slides.map((s, i) => (
              <span key={s.src} className={`h-px w-6 transition-colors duration-700 ${i === active ? "bg-espresso" : "bg-espresso/25"}`} />
            ))}
          </span>
        </div>
      </div>

      {/* Copy */}
      <div className="hero-anim relative order-2 flex flex-1 flex-col justify-between gap-10 px-5 pt-9 pb-10 sm:px-8 lg:order-1 lg:px-12 lg:pt-36 lg:pb-12">
        <p className="hero-fade label hidden text-espresso/60 lg:block">Coffee &amp; matcha catering · Abu Dhabi</p>

        <div>
          <p className="hero-fade label mb-5 text-espresso/60 lg:hidden">Coffee &amp; matcha catering · Abu Dhabi</p>
          <h1 className="hero-title font-display text-[clamp(2.6rem,12.4vw,4.6rem)] leading-[0.92] text-espresso uppercase lg:text-[clamp(3.5rem,6.2vw,7.6rem)]">
            Poured for
            <br />
            your moments
          </h1>

          <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:mt-12">
            <p className="hero-fade max-w-sm leading-relaxed text-espresso/70">
              Caprea brings its coffee cart, a barista and our signature drinks to weddings, graduations and gatherings across
              the UAE.
            </p>
            <p className="hero-fade label text-espresso/60 sm:text-right">
              From {aed(fromPrice)}
              <span className="block pt-1">
                {minGuests} – {maxGuests} guests
              </span>
            </p>
          </div>

          <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/book">
                Book your event <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover/button:rotate-45" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/packages">View packages</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
