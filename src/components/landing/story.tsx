"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "story",
    label: "Our story",
    body: "Caprea is a specialty coffee & matcha café in Abu Dhabi. We bring our cart, a barista and our signature drinks to weddings, graduations and gatherings across the UAE, so your guests get the café experience wherever you celebrate.",
  },
  {
    id: "craft",
    label: "Our craft",
    body: "Every drink is made to order at your event: ceremonial matcha whisked by hand, espresso pulled fresh and our signature drinks layered exactly the way we serve them at the café.",
  },
  {
    id: "promise",
    label: "Our promise",
    body: "Pick a package, choose your drinks and see your price as you go. We arrive early, set up the cart, pour for the whole service and pack everything away when you're done.",
  },
];

const photos = [
  { src: "/photos/matcha-splash.webp", cls: "left-[4%] top-[12%] -rotate-[8deg] z-10" },
  { src: "/photos/barista-shirt.webp", cls: "left-1/2 top-0 -translate-x-1/2 rotate-[5deg] z-0" },
  { src: "/photos/trio-hands.webp", cls: "right-[4%] top-[10%] rotate-[-3deg] z-20" },
];

/** A fan of three shoot photos, then the heading, pill tabs with a paragraph each, and a link to the menu. */
export function Story() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(tabs[0].id);
  const body = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The cards start stacked in the middle and fan out as the section scrolls in.
      gsap.from(".story-card", {
        x: (i) => [160, 0, -160][i],
        y: 60,
        rotate: 0,
        autoAlpha: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".story-fan", start: "top 80%", once: true },
      });
      gsap.from(".story-in", {
        y: 30,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        scrollTrigger: { trigger: ".story-text", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  const choose = (id: string) => {
    setActive(id);
    if (body.current && !prefersReducedMotion()) gsap.fromTo(body.current, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 });
  };

  return (
    <section ref={root} className="w-full bg-cream px-4 py-16 sm:px-8 sm:py-24 md:px-16 md:py-32 lg:px-24">
      <div className="story-fan relative mx-auto aspect-[4/3.4] w-full max-w-[44rem]">
        {photos.map((p) => (
          <div
            key={p.src}
            className={cn(
              "story-card absolute aspect-[3/4] w-[46%] overflow-hidden rounded-[1.25rem] border border-cream bg-cream-200 shadow-[0_30px_60px_-30px_rgba(36,20,15,.55)] sm:rounded-[1.75rem]",
              p.cls,
            )}
          >
            <Image src={p.src} alt="" fill sizes="(min-width: 768px) 320px, 46vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="story-text mx-auto mt-10 max-w-[1100px] sm:mt-14">
        <h2 className="story-in display text-[clamp(2.25rem,6vw,4.5rem)] text-espresso">Your café, at your event</h2>

        <div role="tablist" aria-label="About Caprea" className="story-in mt-8 flex flex-wrap gap-1 border-b border-espresso/10 pb-4 sm:max-w-[42rem]">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls="story-panel"
              onClick={() => choose(t.id)}
              className={cn(
                "label-caps h-11 rounded-full px-4 text-[0.75rem] transition-colors duration-300 sm:px-5 sm:text-[0.8rem]",
                active === t.id ? "bg-espresso text-cream" : "text-espresso hover:bg-espresso/5",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p
          ref={body}
          id="story-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="story-in mt-6 min-h-[8.5rem] max-w-[42rem] text-lg leading-relaxed text-espresso/75 sm:text-xl"
        >
          {tabs.find((t) => t.id === active)!.body}
        </p>

        <Link href="/menu" className="story-in label-caps group mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-espresso">
          Discover our menu
          <ArrowRight weight="bold" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
