"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { aed } from "@/lib/pricing";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/components/site/smooth-scroll";
import type { MenuCategory, MenuItem } from "@/lib/types";

const sections: { key: MenuCategory; title: string; blurb: string }[] = [
  { key: "matcha", title: "Matcha", blurb: "Stone-ground, whisked to order." },
  { key: "coffee", title: "Coffee", blurb: "Specialty beans, hot or iced." },
  { key: "smoothie", title: "Smoothies", blurb: "Blended fruit, nothing artificial." },
  { key: "refresher", title: "Refreshers", blurb: "Bright, iced and easy." },
  { key: "dessert", title: "Desserts", blurb: "The sweet side of the cart." },
  { key: "box", title: "Gathering boxes", blurb: "Made to share at home." },
];

export function MenuBoard({ items }: { items: MenuItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const groups = useMemo(
    () => sections.map((s) => ({ ...s, items: items.filter((i) => i.category === s.key) })).filter((g) => g.items.length),
    [items],
  );
  const [active, setActive] = useState(groups[0]?.key);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id as MenuCategory)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    groups.forEach((g) => {
      const el = document.getElementById(g.key);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [groups]);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".menu-section").forEach((sec) => {
        gsap.from(sec.querySelectorAll(".menu-card"), {
          y: 70,
          opacity: 0,
          duration: 1.1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: sec, start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  const jump = (key: string) => {
    const el = document.getElementById(key);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -150 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={root}>
      <div className="sticky top-24 z-30 mb-16 flex justify-center px-4">
        <div className="glass flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5" data-lenis-prevent>
          {groups.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => jump(g.key)}
              className={clsx(
                "shrink-0 rounded-full px-4 py-2 text-[0.7rem] tracking-[0.2em] uppercase transition-colors duration-500",
                active === g.key ? "bg-sand text-espresso" : "text-cream/70 hover:text-cream",
              )}
            >
              {g.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-28">
        {groups.map((g) => (
          <section key={g.key} id={g.key} className="menu-section scroll-mt-40">
            <div className="mb-10 flex items-end justify-between gap-6 border-b border-sand/15 pb-6">
              <h2 className="font-display text-5xl text-cream uppercase sm:text-6xl">{g.title}</h2>
              <p className="hidden text-cream/50 sm:block">{g.blurb}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {g.items.map((it) => (
                <article
                  key={it.id}
                  className="menu-card group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-sand/10 bg-espresso-800 p-4 transition-colors duration-500 hover:border-sand/40 sm:p-6"
                >
                  {it.best_seller && (
                    <Image src="/menu/best-seller.webp" alt="Best seller" width={64} height={64} className="absolute top-3 right-3 z-10 w-12 rotate-12 sm:w-14" />
                  )}
                  <div className={clsx("relative mx-auto aspect-square w-full", g.key === "box" ? "overflow-hidden rounded-2xl" : "max-w-[200px]")}>
                    {it.image_url && (
                      <Image
                        src={it.image_url}
                        alt={it.name}
                        fill
                        sizes="(min-width: 1024px) 220px, 45vw"
                        className={clsx(
                          "transition-transform duration-700 ease-(--ease-luxe) group-hover:-translate-y-2 group-hover:scale-105",
                          g.key === "box" ? "object-cover" : "object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,.45)]",
                        )}
                      />
                    )}
                  </div>
                  <div className="mt-5 flex flex-1 flex-col">
                    <h3 className="font-display text-[1.05rem] leading-tight text-cream uppercase [overflow-wrap:anywhere] sm:text-2xl">{it.name}</h3>
                    {it.description && <p className="mt-1 text-xs text-cream/55 sm:text-sm">{it.description}</p>}
                    {it.price != null && <p className="eyebrow mt-auto pt-4 text-sand">{aed(it.price)}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
