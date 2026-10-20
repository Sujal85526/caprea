"use client";

import clsx from "clsx";
import Image from "next/image";
import type { BookingKind } from "@/lib/types";
import { aed, minCups } from "@/lib/pricing";
import { CheckBadge, FieldError, StepHeader, type StepProps } from "./ui";

type Option = { kind: BookingKind; eyebrow: string; title: string; body: string; foot: string; photo: string };

export function StepMode({ form, catalog, errors, onChoose }: StepProps & { onChoose: (k: BookingKind) => void }) {
  const { settings, packages, cupTiers } = catalog;
  const fromPrice = packages.length ? Math.min(...packages.map((p) => p.price)) : 0;
  const lowestCup = cupTiers.length ? Math.min(...cupTiers.map((t) => t.price_per_cup)) : 0;

  const options: Option[] = [
    {
      kind: "package",
      eyebrow: "Recommended",
      title: "Choose a package",
      body: "Curated for your guest count. Pick your signature drinks and we handle the rest.",
      foot: packages.length ? `From ${aed(fromPrice)}` : "",
      photo: "/photos/trio-overhead.webp",
    },
    ...(settings.pricing_mode !== "packages"
      ? [
          {
            kind: "per_cup" as const,
            eyebrow: "Flexible",
            title: "Order by the cup",
            body: `Tell us how many cups you need, from ${minCups(cupTiers)}, and which drinks to pour.`,
            foot: cupTiers.length ? `From ${aed(lowestCup)} per cup` : "",
            photo: "/photos/latte-art.webp",
          },
        ]
      : []),
    {
      kind: "custom",
      eyebrow: "Bespoke",
      title: "Create your own",
      body: "Build your own menu, cup by cup. Our team reviews it and confirms a tailored quote.",
      foot: "Free quote, no commitment",
      photo: "/photos/matcha-splash.webp",
    },
  ];

  return (
    <div>
      <StepHeader eyebrow="Let's begin" title="How would you like to book?">
        Every event comes with our coffee cart, a dedicated barista and {settings.service_hours} hours of service.
      </StepHeader>

      <div
        role="radiogroup"
        aria-label="Booking type"
        className={clsx("grid gap-5", options.length === 3 ? "lg:grid-cols-3" : "sm:grid-cols-2")}
      >
        {options.map((o) => {
          const on = form.kind === o.kind;
          return (
            <button
              key={o.kind}
              type="button"
              role="radio"
              aria-checked={on}
              data-animate
              onClick={() => onChoose(o.kind)}
              className={clsx(
                "group relative flex min-h-[22rem] flex-col overflow-hidden rounded-3xl border text-left transition-all duration-500 ease-(--ease-luxe) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand",
                on
                  ? "border-sand shadow-[0_30px_60px_-30px_rgba(210,184,158,0.45)]"
                  : "border-sand/15 hover:-translate-y-1 hover:border-sand/50",
              )}
            >
              <Image
                src={o.photo}
                alt=""
                fill
                sizes="(min-width: 1024px) 22vw, 100vw"
                className={clsx(
                  "object-cover transition-transform duration-[1.2s] ease-(--ease-luxe) group-hover:scale-105",
                  on ? "scale-105 opacity-60" : "opacity-40",
                )}
              />
              <span className="absolute inset-0 bg-linear-to-t from-espresso-900 via-espresso-900/80 to-espresso-900/10" />
              <span className="relative flex items-center justify-between p-6">
                <span className="eyebrow rounded-full border border-sand/30 bg-espresso-900/50 px-3 py-1.5 text-[0.6rem] text-sand backdrop-blur">
                  {o.eyebrow}
                </span>
                <CheckBadge on={on} />
              </span>
              <span className="relative mt-auto block p-6 pt-0">
                <span className="block font-display text-3xl uppercase leading-none text-cream">{o.title}</span>
                <span className="mt-3 block text-sm leading-relaxed text-cream/70">{o.body}</span>
                {o.foot && (
                  <span className="mt-5 block border-t border-sand/20 pt-4 text-xs tracking-[0.18em] text-sand uppercase">
                    {o.foot}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError>{errors.kind}</FieldError>
    </div>
  );
}
