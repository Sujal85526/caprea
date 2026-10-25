"use client";

import Image from "next/image";
import { useRef } from "react";
import { InstagramLogo } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Photo = { src: string; alt: string; wide?: boolean };

// Every distinct shot from the Caprea studio shoot, ordered so colours and subjects alternate.
const photos: Photo[] = [
  { src: "/photos/strawberry-matcha.webp", alt: "Strawberry matcha in a Caprea cup" },
  { src: "/photos/barista-cups.webp", alt: "A Caprea barista holding branded cups" },
  { src: "/photos/trio-overhead.webp", alt: "Three smoothies seen from above", wide: true },
  { src: "/photos/v60-pour.webp", alt: "V60 coffee poured into a Caprea cup" },
  { src: "/photos/golden-hour.webp", alt: "Golden Hour smoothie on a wooden coaster" },
  { src: "/photos/cookie-row.webp", alt: "A row of Caprea cookies", wide: true },
  { src: "/photos/matcha-splash.webp", alt: "Matcha splashing from a Caprea cup" },
  { src: "/photos/coconut.webp", alt: "A Caprea branded coconut held in a hand" },
  { src: "/photos/latte-art.webp", alt: "Iced coffee seen from above", wide: true },
  { src: "/photos/acai.webp", alt: "Acai smoothie on a wooden coaster" },
  { src: "/photos/krispy-treat.webp", alt: "Krispy Treat layered with chocolate crisp pearls" },
  { src: "/photos/milk-pour.webp", alt: "Milk foam poured over an iced latte" },
  { src: "/photos/matcha-bowl.webp", alt: "Bamboo whisk beside a pink bowl of matcha", wide: true },
  { src: "/photos/cookies-hand.webp", alt: "A hand holding a stack of cookies" },
  { src: "/photos/cloud-nine.webp", alt: "Cloud Nine smoothie on a wooden coaster" },
  { src: "/photos/biscoff-cookie.webp", alt: "Biscoff cookie from above", wide: true },
  { src: "/photos/barista-shirt.webp", alt: "A barista in a Caprea tee holding cups" },
  { src: "/photos/cloudy-matcha.webp", alt: "Cloudy matcha poured over coconut water" },
  { src: "/photos/berry-overhead.webp", alt: "Berry refresher with ice from above", wide: true },
  { src: "/photos/iced-coffee-cup.webp", alt: "Iced coffee in a Caprea paper cup" },
  { src: "/photos/whisk.webp", alt: "A bamboo matcha whisk held above the counter" },
  { src: "/photos/smores-cookie.webp", alt: "S'mores cookie with torched marshmallow", wide: true },
  { src: "/photos/trio-hands.webp", alt: "Three Caprea smoothies held together" },
  { src: "/photos/iced-latte-pour.webp", alt: "Milk poured into an iced latte" },
  { src: "/photos/milk-choc-cookie.webp", alt: "Milk chocolate cookie from above", wide: true },
  { src: "/photos/matcha-spoon.webp", alt: "Matcha dripping from a spoon" },
  { src: "/photos/coffee-server.webp", alt: "A glass coffee server beside a Caprea cup" },
  { src: "/photos/white-choc-cookie.webp", alt: "White chocolate cookie from above", wide: true },
  { src: "/photos/layered.webp", alt: "A layered drink on a wooden coaster" },
  { src: "/photos/matcha-cup.webp", alt: "Matcha latte in a Caprea cup" },
  { src: "/photos/cookie-halves.webp", alt: "Two cookie halves side by side", wide: true },
  { src: "/photos/latte-straw.webp", alt: "Stirring an iced latte with a straw" },
  { src: "/photos/iced-americano.webp", alt: "Iced americano on a wooden coaster" },
  { src: "/photos/whisk-splash.webp", alt: "Bamboo whisk resting in spilled matcha" },
  { src: "/photos/cookie-stack.webp", alt: "A stack of Caprea cookies" },
  { src: "/photos/matcha-foam.webp", alt: "Freshly whisked matcha foam", wide: true },
];

/** A slow, endless strip of photographs from the shoot; it eases to a stop while hovered. */
export function PhotoStrip({ instagram }: { instagram: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Start fetching the pictures once the strip is near, so frames never slide in empty.
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom+=600",
        once: true,
        onEnter: () => el.querySelectorAll("img").forEach((img) => (img.loading = "eager")),
      });
      if (prefersReducedMotion()) return;

      const loop = gsap.to(".ps-track", { xPercent: -50, duration: 150, ease: "none", repeat: -1 });
      const track = el.querySelector(".ps-track");
      const slow = () => gsap.to(loop, { timeScale: 0, duration: 0.8, ease: "power2.out", overwrite: true });
      const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.in", overwrite: true });
      track?.addEventListener("pointerenter", slow);
      track?.addEventListener("pointerleave", resume);
      return () => {
        track?.removeEventListener("pointerenter", slow);
        track?.removeEventListener("pointerleave", resume);
      };
    },
    { scope: ref },
  );

  const set = (copy: number) =>
    photos.map((p) => (
      <div
        key={`${copy}-${p.src}`}
        aria-hidden={copy > 0 || undefined}
        className="h-full shrink-0 pr-3 sm:pr-4"
      >
        <div className={cn("relative h-full overflow-hidden bg-cream", p.wide ? "aspect-[3/2]" : "aspect-[2/3]")}>
          <Image src={p.src} alt={copy > 0 ? "" : p.alt} fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
        </div>
      </div>
    ));

  return (
    <section ref={ref} className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto mb-8 flex max-w-[90rem] flex-wrap items-end justify-between gap-4 px-5 sm:mb-10 sm:px-8 lg:px-12">
        <div>
          <p className="label text-espresso/60">From our cart</p>
          <h2 className="mt-4 font-display text-[2.5rem] leading-[0.95] text-espresso uppercase sm:text-6xl">Made to be shared</h2>
        </div>
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noreferrer"
          className="label inline-flex h-10 items-center gap-2 text-espresso"
        >
          <InstagramLogo className="size-4" /> <span className="link-line py-1">@{instagram}</span>
        </a>
      </div>
      <div className="ps-track flex h-60 w-max sm:h-80 lg:h-[24rem]">
        {set(0)}
        {set(1)}
      </div>
    </section>
  );
}
