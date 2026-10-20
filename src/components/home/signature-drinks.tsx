"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { MenuItem } from "@/lib/types";

// Card tint per drink, sampled from the illustrations.
const tints: Record<string, string> = {
  "matcha-latte": "#a9b97f",
  "velvet-sunset": "#c4475f",
  "peach-iced-tea": "#c9733a",
  "cloud-nine": "#5d86b8",
  "golden-hour": "#e5b335",
  "acai-smoothie": "#7d4f78",
};

export function SignatureDrinks({ drinks }: { drinks: MenuItem[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>(".sig-cup").forEach((cup) => {
          gsap.fromTo(cup, { rotate: -14, y: 40 }, {
            rotate: 8,
            y: -30,
            ease: "none",
            scrollTrigger: { trigger: cup, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
      });
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".sig-card").forEach((card) => {
          gsap.from(card, { y: 60, opacity: 0, duration: 1, scrollTrigger: { trigger: card, start: "top 88%" } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-espresso md:h-dvh">
      <div ref={track} className="flex flex-col gap-6 px-6 py-24 md:h-full md:w-max md:flex-row md:items-center md:gap-8 md:px-[8vw] md:py-0">
        <div className="md:w-[34vw] md:shrink-0 md:pr-10">
          <p className="eyebrow mb-6 text-sand">Signature drinks</p>
          <h2 className="font-display text-5xl text-cream uppercase sm:text-6xl lg:text-7xl">
            The Oasis <span className="text-sand">Edition</span>
          </h2>
          <p className="mt-6 max-w-sm leading-relaxed text-cream/70">
            Every package lets your guests choose from our signature drinks, with the remaining servings poured from our
            coffee selection.
          </p>
          <Link href="/menu" className="group mt-8 inline-flex items-center gap-2 text-sm tracking-[0.25em] text-sand uppercase">
            Full menu <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
          </Link>
        </div>

        {drinks.map((d) => {
          const tint = tints[d.slug] ?? "#d2b89e";
          return (
            <article
              key={d.id}
              className="sig-card group relative flex h-[68vh] min-h-[440px] w-full shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] p-8 md:w-[min(30vw,420px)]"
              style={{ background: `radial-gradient(120% 80% at 50% 30%, ${tint}55, transparent 70%), #2d1913` }}
            >
              <div className="flex min-h-7 items-start justify-end">
                {d.best_seller && <span className="eyebrow rounded-full border border-gold/50 px-3 py-1 text-gold">Best seller</span>}
              </div>
              <div className="sig-cup relative mx-auto aspect-square w-[78%]">
                <div className="absolute inset-[18%] rounded-full blur-3xl" style={{ background: tint, opacity: 0.45 }} />
                {d.image_url && (
                  <Image src={d.image_url} alt={d.name} fill sizes="320px" className="object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.5)] transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-105" />
                )}
              </div>
              <div>
                <h3 className="font-display text-3xl text-cream uppercase">{d.name}</h3>
                <p className="mt-2 text-sm text-cream/60">{d.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
