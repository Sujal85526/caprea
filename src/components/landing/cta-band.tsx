"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Four-point sparkle, coloured by `currentColor`.
const SPARK = "M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z";

/**
 * Rounded espresso card: one line, one button, and a stack of Caprea cookies that flies in, bobs gently and
 * turns to follow the cursor (no scroll-driven motion here).
 */
export function CtaBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const trigger = { trigger: root.current, start: "top 80%", once: true };

      gsap.from(".cta-in", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: trigger });
      gsap.fromTo(
        ".cta-pop",
        { y: 140, scale: 0.6, rotate: -12, autoAlpha: 0 },
        { y: 0, scale: 1, rotate: 0, autoAlpha: 1, duration: 1.3, ease: "back.out(1.5)", delay: 0.15, scrollTrigger: trigger },
      );
      gsap.fromTo(
        ".cta-spark",
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.9, ease: "back.out(2.2)", stagger: 0.1, delay: 0.5, scrollTrigger: trigger },
      );

      // The stack turns in place to follow the cursor, wherever it is on the page (mouse only).
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const stack = root.current?.querySelector<HTMLElement>(".cta-tilt");
      if (!stack) return;
      const turnY = gsap.quickTo(stack, "rotationY", { duration: 0.8, ease: "power3.out" });
      const turnX = gsap.quickTo(stack, "rotationX", { duration: 0.8, ease: "power3.out" });
      const turnZ = gsap.quickTo(stack, "rotation", { duration: 1, ease: "power3.out" });
      const follow = (e: PointerEvent) => {
        const r = stack.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
        const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
        turnY(dx * 28);
        turnX(-dy * 16);
        turnZ(dx * 6);
      };
      window.addEventListener("pointermove", follow, { passive: true });
      return () => window.removeEventListener("pointermove", follow);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="px-4 pt-24 pb-20 sm:px-8 sm:pb-24 md:pt-16">
      <div className="relative mx-auto max-w-5xl rounded-[1.5rem] bg-gradient-to-br from-espresso to-espresso-800 text-cream shadow-[0_30px_60px_-30px_rgba(36,20,15,.6)]">
        {/* Decorative ring, clipped to the card (the cookies are allowed to break out of it) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.5rem]">
          <span className="absolute -top-40 -right-24 size-80 rounded-full border-[28px] border-cream/[0.06]" />
        </div>

        <div className="relative grid items-center md:grid-cols-[1.25fr_1fr]">
          {/* Cookie stack: above the text on phones, on the right (breaking out of the card) from tablet up */}
          <div className="relative order-first -mt-14 flex justify-center md:order-last md:-my-14 md:mt-0">
            <svg aria-hidden viewBox="0 0 24 24" className="cta-spark absolute top-[18%] left-[16%] z-20 size-7 text-sand md:left-[4%]">
              <g className="anim-twinkle" style={{ "--dur": "4.2s" } as CSSProperties}>
                <path d={SPARK} fill="currentColor" />
              </g>
            </svg>
            <svg aria-hidden viewBox="0 0 24 24" className="cta-spark absolute right-[16%] bottom-[16%] z-20 size-5 text-cream md:right-[6%]">
              <g className="anim-twinkle" style={{ "--dur": "3.4s", "--delay": "-1s" } as CSSProperties}>
                <path d={SPARK} fill="currentColor" />
              </g>
            </svg>
            <div className="cta-pop relative" style={{ perspective: "1200px" }}>
              <div className="cta-tilt" style={{ transformStyle: "preserve-3d" }}>
                <div className="anim-bob" style={{ "--dur": "5s" } as CSSProperties}>
                  <Image
                    src="/cutouts/cookie-stack.webp"
                    alt="A stack of Caprea cookies"
                    width={644}
                    height={773}
                    sizes="(min-width: 768px) 300px, 200px"
                    className="h-auto w-[min(36vw,9rem)] drop-shadow-[0_30px_40px_rgba(0,0,0,.45)] select-none md:w-[17rem] lg:w-[19rem]"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-8 pb-12 text-center sm:px-14 md:py-16 md:pr-4 md:text-left">
            <h2 className="cta-in font-sans text-[clamp(1.6rem,4vw,2.4rem)] leading-tight font-bold tracking-normal">Bring Caprea to your event</h2>
            <p className="cta-in mt-3 text-sm leading-relaxed text-cream/80 italic sm:text-base md:max-w-md">
              Weddings, graduations and gatherings across the UAE. Choose a package online or build your own menu.
            </p>
            <div className="cta-in mt-7">
              <Link
                href="/book"
                className="label-caps group inline-flex h-11 items-center gap-2 rounded-full bg-cream px-6 text-[0.7rem] text-espresso shadow-sm transition-colors hover:bg-sand"
              >
                Plan your event <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
