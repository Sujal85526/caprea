"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { Coffee, Sparkle } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// Four-point sparkle, coloured by `currentColor`.
const SPARK = "M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z";

const sparkles = [
  { cls: "left-[6%] top-[58%] size-9 text-sand md:left-[10%] md:size-12", d: "4.5s" },
  { cls: "left-[16%] top-[18%] size-6 text-cream md:size-8", d: "3.6s" },
  { cls: "right-[7%] top-[14%] size-8 text-sand-300 md:right-[12%] md:size-10", d: "5s" },
  { cls: "right-[12%] top-[70%] size-6 text-cream md:right-[17%] md:size-7", d: "4s" },
];

// Bubbles drift up out of the matcha foam.
const bubbles = [
  { x: "-16%", size: 10, dur: "4.2s", delay: "0s", drift: "-14px" },
  { x: "-4%", size: 6, dur: "3.4s", delay: "1.1s", drift: "10px" },
  { x: "6%", size: 8, dur: "4.8s", delay: "2s", drift: "-6px" },
  { x: "-10%", size: 5, dur: "3.1s", delay: "2.7s", drift: "16px" },
  { x: "12%", size: 7, dur: "4.4s", delay: "0.6s", drift: "8px" },
];

const BADGE_TEXT = "CAPREA · MADE FRESH · ABU DHABI · ";

/**
 * "Made for your guests": a cut-out Caprea cup rises through the headline, leans and grows as the page
 * scrolls, bobs gently, tilts towards the pointer and lets bubbles float out of the foam. Around it a
 * spinning badge, a cookie and a logo sticker float while sparkles pop in and twinkle.
 */
export function GuestsHero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".gh-title", {
        yPercent: 60,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      gsap.fromTo(".gh-pill", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
      gsap.fromTo(
        ".gh-underline",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", delay: 0.5, scrollTrigger: { trigger: root.current, start: "top 70%", once: true } },
      );

      // The cup flies up and pops into place, then follows the scroll: lean left → upright and larger → lean right.
      gsap.fromTo(
        ".gh-pop",
        { y: 160, scale: 0.6, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 1.3, ease: "back.out(1.5)", scrollTrigger: { trigger: stage.current, start: "top 85%", once: true } },
      );
      gsap
        .timeline({ scrollTrigger: { trigger: stage.current, start: "top bottom", end: "bottom top", scrub: 0.4 } })
        .fromTo(".gh-cup", { y: 50, scale: 0.92, rotate: -9 }, { y: 0, scale: 1.04, rotate: 0, ease: "none" })
        .to(".gh-cup", { y: -40, scale: 0.97, rotate: 7, ease: "none" });

      // Stickers and sparkles pop in with a little overshoot.
      gsap.fromTo(
        ".gh-sticker, .gh-spark",
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.9,
          ease: "back.out(2.2)",
          stagger: 0.08,
          delay: 0.35,
          scrollTrigger: { trigger: stage.current, start: "top 80%", once: true },
        },
      );
      // Stickers drift a little against the scroll for depth.
      gsap.to(".gh-sticker-l", { yPercent: -40, ease: "none", scrollTrigger: { trigger: stage.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to(".gh-sticker-r", { yPercent: -70, ease: "none", scrollTrigger: { trigger: stage.current, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: root },
  );

  // Pointer tilt: the cup turns slightly towards the cursor.
  const tilt = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion() || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(".gh-tilt", { rotateY: dx * 18, rotateX: -dy * 12, duration: 0.6, ease: "power3.out", overwrite: true });
  };
  const untilt = () => gsap.to(".gh-tilt", { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1, 0.5)", overwrite: true });

  return (
    <div ref={root} className="relative mx-auto flex max-w-[1400px] flex-col items-center text-center">
      <span className="gh-pill label-caps relative z-20 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-[0.62rem] text-espresso sm:text-[0.7rem]">
        <Sparkle weight="fill" className="size-3 text-sand-600" /> Homegrown in Abu Dhabi
      </span>

      <h2 className="display relative z-0 mt-5 text-[clamp(2.3rem,10vw,7.5rem)] leading-[0.88] text-cream">
        <span className="block overflow-hidden pb-1">
          <span className="gh-title block">Made for</span>
        </span>
        <span className="block overflow-hidden pb-4">
          <span className="gh-title relative inline-block whitespace-nowrap">
            your guests
            <svg aria-hidden viewBox="0 0 400 16" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-[0.14em] w-full text-sand" fill="none">
              <path className="gh-underline" d="M3 10 C 90 4, 200 3, 300 7 S 380 11, 397 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </h2>

      <div
        ref={stage}
        onPointerMove={tilt}
        onPointerLeave={untilt}
        className="relative z-10 -mt-[clamp(3rem,11vw,9.5rem)] h-[340px] w-full min-[400px]:h-[400px] sm:h-[480px] md:h-[600px] lg:h-[660px]"
      >
        {sparkles.map((s, i) => (
          <svg key={i} aria-hidden viewBox="0 0 24 24" className={`gh-spark absolute ${s.cls}`}>
            <g className="anim-twinkle origin-center" style={{ "--dur": s.d } as CSSProperties}>
              <path d={SPARK} fill="currentColor" />
            </g>
          </svg>
        ))}

        {/* Spinning badge */}
        <div className="gh-sticker-l absolute top-[46%] left-[2%] z-20 sm:left-[8%] md:left-[16%]">
          <div className="gh-sticker relative size-24 rounded-full bg-cream text-espresso shadow-[0_16px_30px_rgba(0,0,0,.3)] sm:size-32 md:size-40">
            <svg aria-hidden viewBox="0 0 100 100" className="anim-spin-slow absolute inset-0 size-full">
              <defs>
                <path id="gh-badge-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <text className="label-caps" fontSize="9.2" letterSpacing="1.4" fill="currentColor">
                <textPath href="#gh-badge-circle">{BADGE_TEXT}</textPath>
              </text>
            </svg>
            <Coffee weight="fill" className="absolute top-1/2 left-1/2 size-7 -translate-1/2 sm:size-9 md:size-11" />
          </div>
        </div>

        {/* Logo sticker */}
        <div className="gh-sticker-r absolute top-[34%] right-[2%] z-20 hidden sm:block sm:right-[8%] md:right-[18%]">
          <div className="gh-sticker anim-floaty rounded-2xl bg-sand px-4 py-3 text-espresso shadow-[0_14px_28px_rgba(0,0,0,.28)]" style={{ "--r": "-8deg", "--dur": "6s" } as CSSProperties}>
            <Logo className="w-20 sm:w-24 md:w-28" title="" />
          </div>
        </div>

        {/* Cookie */}
        <div className="gh-sticker-r absolute top-[60%] right-[4%] z-20 sm:right-[10%] md:right-[20%]">
          <div className="gh-sticker anim-floaty w-20 drop-shadow-[0_18px_22px_rgba(0,0,0,.35)] sm:w-28 md:w-36" style={{ "--r": "10deg", "--dur": "7s", "--delay": "-2s" } as CSSProperties}>
            <Image src="/cutouts/biscoff-cookie.webp" alt="" width={360} height={369} className="h-auto w-full" />
          </div>
        </div>

        {/* The cup */}
        <div className="gh-cup absolute inset-0 z-10 flex justify-center">
          <div className="gh-pop relative h-full" style={{ perspective: "1200px" }}>
            <div className="gh-tilt relative h-full" style={{ transformStyle: "preserve-3d" }}>
              <div className="anim-bob relative h-full" style={{ "--dur": "5s" } as CSSProperties}>
                {bubbles.map((b, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="anim-bubble absolute top-[4%] left-1/2 rounded-full border-[1.5px] border-cream/70"
                    style={
                      {
                        width: b.size,
                        height: b.size,
                        marginLeft: b.x,
                        "--dur": b.dur,
                        "--delay": b.delay,
                        "--drift": b.drift,
                      } as CSSProperties
                    }
                  />
                ))}
                <Image
                  src="/cutouts/matcha-splash-cup.webp"
                  alt="Caprea matcha splashing out of the cup"
                  width={773}
                  height={1054}
                  sizes="(min-width: 768px) 480px, 300px"
                  className="h-full w-auto drop-shadow-[0_40px_50px_rgba(0,0,0,.45)] select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
