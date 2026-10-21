"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight, Clock, Coffee, Leaf, MapPin } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/site/magnetic";
import { useSiteReady } from "@/components/site/loader";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { aed } from "@/lib/pricing";

const facts = [
  { Icon: Coffee, label: "Specialty coffee" },
  { Icon: Leaf, label: "Ceremonial matcha" },
  { Icon: Clock, label: "4 hours of service" },
  { Icon: MapPin, label: "Across the UAE" },
];

// Drink illustrations that float around the arch; depth drives mouse and scroll parallax.
const floaters = [
  { src: "/menu/matcha-latte.webp", alt: "Matcha latte", cls: "-left-10 top-[18%] w-20 sm:-left-16 sm:w-28", depth: 1.4, rot: -12 },
  { src: "/menu/velvet-sunset.webp", alt: "Velvet sunset", cls: "-right-8 bottom-[22%] w-16 sm:-right-14 sm:w-24", depth: 1, rot: 10 },
  { src: "/menu/smores-cookie.webp", alt: "S'mores cookie", cls: "hidden sm:block -right-10 -top-6 w-20", depth: 0.7, rot: 8 },
];

export function Hero({ fromPrice, minGuests, maxGuests }: { fromPrice: number; minGuests: number; maxGuests: number }) {
  const root = useRef<HTMLElement>(null);
  const ready = useSiteReady();

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (!ready) {
        // Hold everything hidden until the loader lifts (avoids a flash of the final state).
        if (!reduce) gsap.set(".hero-anim", { autoAlpha: 0 });
        return;
      }
      if (reduce) {
        gsap.set(".hero-anim", { autoAlpha: 1 });
        return;
      }

      gsap.set(".hero-anim", { autoAlpha: 1 });
      const split = SplitText.create(".hero-title", { type: "lines", mask: "lines" });

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-panel", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" }, 0)
        .from(".hero-eyebrow", { y: 12, opacity: 0, duration: 0.8 }, 0.1)
        .from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.05)
        .from(".hero-arch", { clipPath: "inset(100% 0% 0% 0% round 12rem 12rem 2rem 2rem)", duration: 1.4, ease: "expo.inOut" }, 0)
        .from(".hero-arch img", { scale: 1.25, duration: 1.8 }, 0)
        .from(".hero-copy", { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.45)
        .from(".hero-fact", { y: 12, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.7)
        .from(".hero-thumb", { x: -30, y: 30, opacity: 0, rotate: -6, duration: 1.1 }, 0.7)
        .from(".hero-chip", { y: -16, opacity: 0, scale: 0.9, duration: 0.9, ease: "back.out(1.6)" }, 0.85)
        .from(".hero-float", { scale: 0, opacity: 0, rotate: 0, duration: 1.1, stagger: 0.12, ease: "back.out(1.7)" }, 0.9);

      // Gentle idle float on the illustrations.
      gsap.utils.toArray<HTMLElement>(".hero-float img").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, rotate: i % 2 ? 3 : -3, duration: 3 + i * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });

      // Soft scroll parallax while the hero leaves the screen (no pinning).
      gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el) => {
        gsap.to(el, {
          yPercent: -60 * Number(el.dataset.depth),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      gsap.to(".hero-arch img", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Pointer parallax on devices with a mouse.
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const movers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
          d: Number(el.dataset.depth),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * 24 * m.d);
            m.y(ny * 18 * m.d);
          });
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });

      return () => split.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section ref={root} className="relative overflow-hidden pt-24 pb-20 sm:pt-36 lg:pt-40 lg:pb-28">
      {/* Espresso panel behind the photo: top band on phones, right column on desktop */}
      <div
        aria-hidden
        className="hero-panel pointer-events-none absolute inset-x-0 top-0 h-[27rem] rounded-b-[3rem] bg-espresso sm:h-[34rem] lg:inset-x-auto lg:right-0 lg:left-1/2 lg:bottom-0 lg:h-auto lg:rounded-b-none lg:rounded-bl-[12rem]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="hero-anim order-2 lg:order-1">
          <p className="hero-eyebrow eyebrow text-mocha">Coffee &amp; matcha catering · Abu Dhabi</p>
          <h1 className="hero-title mt-5 font-display text-[2.45rem] min-[400px]:text-[2.7rem] leading-[1] text-espresso uppercase sm:text-6xl lg:text-7xl">
            Poured for <br className="hidden sm:block" />
            your <span className="text-mocha">moments</span>
          </h1>
          <p className="hero-copy mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Caprea brings its coffee cart, a barista and our signature drinks to weddings, graduations and gatherings.
          </p>
          <div className="hero-copy mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild size="lg">
                <Link href="/book">
                  Book your event <ArrowUpRight weight="bold" className="transition-transform duration-300 group-hover/button:rotate-45" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="outline">
              <Link href="/packages">View packages</Link>
            </Button>
          </div>
          <ul className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3">
            {facts.map(({ Icon, label }) => (
              <li key={label} className="hero-fact flex items-center gap-2.5 text-sm text-espresso/80">
                <Icon className="size-5 text-mocha" weight="light" /> {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-anim relative order-1 mx-auto w-full max-w-[17rem] sm:max-w-[22rem] lg:order-2 lg:max-w-[26rem]">
          <div data-depth="0.35">
            <div
              className="hero-arch relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-cream-200"
              style={{ clipPath: "inset(0% 0% 0% 0% round 12rem 12rem 2rem 2rem)" }}
            >
              <Image
                src="/photos/strawberry-matcha.webp"
                alt="Strawberry matcha in a Caprea cup"
                fill
                priority
                sizes="(min-width: 1024px) 26rem, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          <div data-depth="0.8" className="hero-thumb absolute -bottom-6 -left-6 w-24 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:-left-10 sm:w-36 lg:w-40">
            <div className="relative aspect-[4/5]">
              <Image src="/photos/iced-latte-pour.webp" alt="Milk poured into an iced latte" fill sizes="160px" className="object-cover" />
            </div>
          </div>

          <div data-depth="0.6" className="hero-chip absolute top-6 -right-2 rounded-2xl bg-card/90 px-4 py-3 shadow-lg backdrop-blur sm:-right-6">
            <p className="eyebrow text-[0.6rem] text-muted-foreground">Packages from</p>
            <p className="font-display text-2xl text-espresso">{aed(fromPrice)}</p>
            <p className="text-xs text-muted-foreground">
              {minGuests} – {maxGuests} guests
            </p>
          </div>

          {floaters.map((f) => (
            <div key={f.src} data-depth={f.depth} className={`hero-float pointer-events-none absolute z-10 ${f.cls}`} style={{ rotate: `${f.rot}deg` }}>
              <Image src={f.src} alt={f.alt} width={200} height={200} className="h-auto w-full drop-shadow-[0_18px_22px_rgba(54,31,24,.25)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
