"use client";

import Image from "next/image";
import type { BookingKind } from "@/lib/types";
import { aed, minCups } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { CheckBadge, FieldError, StepHeader, optionClass, type StepProps } from "./ui";

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
        className={cn("grid gap-4", options.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2")}
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
              className={cn("group flex min-w-0 flex-col p-3 sm:p-4", optionClass(on))}
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-none bg-secondary">
                <Image
                  src={o.photo}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 28vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-[1.03]"
                />
                <CheckBadge on={on} className="absolute top-3 right-3" />
              </span>
              <span className="flex flex-1 flex-col px-1 pt-4 pb-1">
                <span className="label text-[0.64rem] text-espresso/60">{o.eyebrow}</span>
                <span className="mt-2 block font-display text-2xl leading-tight text-espresso uppercase">{o.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{o.body}</span>
                {o.foot && (
                  <span className="mt-auto block pt-4 text-sm font-medium text-espresso">{o.foot}</span>
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
