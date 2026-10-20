"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { FrameSequence } from "@/components/home/frame-sequence";
import { useSiteReady } from "@/components/site/loader";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const floaters = [
  { src: "/menu/salted-vanilla-matcha.webp", alt: "Salted vanilla matcha", cls: "left-[3%] top-[38%] w-16 sm:w-28 lg:left-[31%] lg:top-[20%] lg:w-32", speed: -0.35, rot: -10 },
  { src: "/menu/velvet-sunset.webp", alt: "Velvet sunset", cls: "hidden sm:block right-[4%] top-[36%] w-16 sm:w-24 lg:right-[31%] lg:top-[12%] lg:w-28", speed: -0.6, rot: 12 },
  { src: "/menu/golden-hour.webp", alt: "Golden hour", cls: "right-[8%] bottom-[22%] w-16 sm:w-24 lg:right-[30%] lg:bottom-[14%] lg:w-28", speed: -0.25, rot: -6 },
  { src: "/menu/smores-cookie.webp", alt: "S'mores cookie", cls: "hidden sm:block left-[8%] bottom-[24%] w-16 sm:w-24 lg:left-[32%] lg:bottom-[8%] lg:w-28", speed: -0.5, rot: 8 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const ready = useSiteReady();
  const [pour, setPour] = useState(false);

  useGSAP(
    () => {
      if (!ready) return;
      const split = SplitText.create(".hero-title", { type: "lines,words,chars", mask: "lines" });

      // Intro: the arch opens and the matcha pours once on its own.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-bg-logo", { opacity: 0, scale: 1.06, duration: 2.4 }, 0)
        .from(".hero-arch", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 32px 32px)", duration: 1.5, ease: "expo.inOut" }, 0)
        .call(() => setPour(true), undefined, 1.1)
        .from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.022 }, 0.6)
        .from(".hero-fade", { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.9)
        .from(".hero-float", { scale: 0.5, opacity: 0, rotate: 0, duration: 1.4, stagger: 0.1, ease: "back.out(1.5)" }, 1);

      // Slow idle float for the drink illustrations.
      gsap.utils.toArray<HTMLElement>(".hero-float img").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, rotate: i % 2 ? 2 : -2, duration: 3.4 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });

      // Scroll: a gentle parallax while the hero leaves the screen; nothing is pinned.
      const scroll = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      scroll
        .to(".hero-copy", { yPercent: -16, opacity: 0.15 }, 0)
        .to(".hero-arch-wrap", { yPercent: 14 }, 0)
        .to(".hero-bg-logo", { yPercent: 22 }, 0);
      gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el) => {
        scroll.to(el, { yPercent: Number(el.dataset.speed) * 120 }, 0);
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative bg-espresso" aria-label="Caprea">
      <div className="relative h-svh min-h-[640px] overflow-hidden grain">
        {/* Oversized wordmark, as on Caprea's packaging */}
        <div className="hero-bg-logo pointer-events-none absolute inset-x-[-10%] top-1/2 -translate-y-1/2 text-sand/[0.06]">
          <Logo className="w-full" title="" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,rgba(210,184,158,.16),transparent_70%)]" />

        {floaters.map((f) => (
          <div key={f.src} className={`hero-float pointer-events-none absolute z-30 ${f.cls}`} data-speed={f.speed} style={{ rotate: `${f.rot}deg` }}>
            <Image src={f.src} alt={f.alt} width={300} height={300} className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]" priority />
          </div>
        ))}

        <div className="relative z-20 mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr_auto] items-center px-6 pt-24 pb-6 sm:px-10 lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-1 lg:gap-12 lg:pt-20 lg:pb-0">
          <div className="hero-copy text-center lg:text-left">
            <p className="hero-fade eyebrow mb-5 text-sand">Coffee &amp; matcha catering · UAE</p>
            <h1 className="hero-title font-display text-[12vw] leading-[0.92] text-cream uppercase sm:text-7xl lg:text-[clamp(2.8rem,4.3vw,4.6rem)]">
              Poured <br />
              for your <br className="hidden lg:block" />
              <span className="text-sand">moments</span>
            </h1>
          </div>

          <div className="hero-arch-wrap relative mx-auto my-5 h-[min(40svh,520px)] sm:h-[min(48svh,560px)] lg:my-0 lg:h-[min(72svh,640px)]">
            <div
              className="hero-arch relative h-full aspect-[2/3] overflow-hidden rounded-t-full rounded-b-[2rem] bg-cream-200 shadow-[0_60px_120px_-40px_rgba(0,0,0,.8)] ring-1 ring-sand/20"
              style={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 32px 32px)" }}
            >
              <FrameSequence name="matcha" count={36} play={pour} duration={3.2} focusY={0.35} className="absolute inset-0 size-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
            </div>
          </div>

          <div className="hero-copy flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            <p className="hero-fade hidden max-w-sm text-base leading-relaxed text-cream/75 min-[400px]:block sm:text-lg">
              Caprea brings its coffee cart, barista and signature drinks to weddings, graduations and gatherings across the
              Emirates.
            </p>
            <div className="hero-fade flex flex-wrap justify-center gap-3 lg:justify-start">
              <ButtonLink href="/book">
                Book your event <ArrowUpRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/packages" variant="outline">
                View packages
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="hero-fade hero-copy absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-sand/70 lg:flex">
          <span className="eyebrow">Scroll</span>
          <ArrowDown className="size-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
