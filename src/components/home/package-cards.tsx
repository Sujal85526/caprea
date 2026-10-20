"use client";

import Link from "next/link";
import { useRef } from "react";
import clsx from "clsx";
import { ArrowUpRight, Check } from "lucide-react";
import { aed } from "@/lib/pricing";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Package } from "@/lib/types";

export function PackageCards({ packages }: { packages: Package[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".pkg-card", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    },
    { scope: root },
  );

  // Soft spotlight that follows the pointer.
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={root} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {packages.map((p) => (
        <article
          key={p.id}
          onPointerMove={onMove}
          className={clsx(
            "pkg-card group relative flex flex-col overflow-hidden rounded-[2rem] border p-7 transition-[transform,border-color] duration-700 ease-(--ease-luxe) hover:-translate-y-2",
            p.featured ? "border-sand/70 bg-sand text-espresso" : "border-sand/15 bg-espresso-800 text-cream hover:border-sand/50",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(320px circle at var(--x) var(--y), rgba(255,255,255,.14), transparent 60%)" }}
          />
          {p.featured && (
            <span className="eyebrow absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl bg-espresso px-3 pt-1 pb-1.5 text-[0.55rem] tracking-[0.2em] whitespace-nowrap text-sand">
              Recommended
            </span>
          )}
          <p className={clsx("eyebrow", p.featured ? "text-mocha" : "text-sand")}>{p.name}</p>
          <p className="mt-6 font-display text-7xl leading-none">{p.guests}</p>
          <p className={clsx("eyebrow mt-2", p.featured ? "text-espresso/70" : "text-cream/60")}>Guests</p>

          <div className={clsx("my-7 h-px", p.featured ? "bg-espresso/15" : "bg-sand/15")} />

          <p className="text-lg">Up to {p.max_signature_drinks} signature drinks</p>
          <p className={clsx("text-sm", p.featured ? "text-espresso/70" : "text-cream/60")}>{p.cups_per_drink} cups each · rest from our coffee bar</p>

          <ul className="mt-6 space-y-2 text-sm">
            {p.includes.map((inc) => (
              <li key={inc} className="flex items-center gap-2">
                <Check className={clsx("size-4 shrink-0", p.featured ? "text-mocha" : "text-sand")} /> {inc}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            <p className="font-display text-3xl">{aed(p.price)}</p>
            <Link
              href={`/book?package=${p.id}`}
              className={clsx(
                "mt-5 flex items-center justify-between rounded-full px-5 py-3 text-[0.72rem] font-medium tracking-[0.2em] uppercase transition-colors duration-500",
                p.featured ? "bg-espresso text-cream hover:bg-espresso-700" : "bg-sand/10 text-sand hover:bg-sand hover:text-espresso",
              )}
            >
              Book this package <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
