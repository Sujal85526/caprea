"use client";

import { Coffee, Package, PencilSimpleLine, type Icon } from "@phosphor-icons/react";
import type { BookingKind } from "@/lib/types";
import { aed, minCups } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { CheckBadge, FieldError, StepHeader, optionClass, type StepProps } from "./ui";

type Option = { kind: BookingKind; eyebrow: string; title: string; body: string; foot: string; Icon: Icon };

export function StepMode({ form, catalog, errors, onChoose }: StepProps & { onChoose: (k: BookingKind) => void }) {
  const { settings, packages, cupTiers } = catalog;
  const fromPrice = packages.length ? Math.min(...packages.map((p) => p.price)) : 0;
  const lowestCup = cupTiers.length ? Math.min(...cupTiers.map((t) => t.price_per_cup)) : 0;

  const options: Option[] = [
    {
      kind: "package",
      eyebrow: "Recommended",
      title: "Choose a package",
      body: "Sized to your guest count. Pick your drinks, we handle the rest.",
      foot: packages.length ? `From ${aed(fromPrice)}` : "",
      Icon: Package,
    },
    ...(settings.pricing_mode !== "packages"
      ? [
          {
            kind: "per_cup" as const,
            eyebrow: "Flexible",
            title: "Order by the cup",
            body: `Tell us how many cups you need, from ${minCups(cupTiers)}, and which drinks to pour.`,
            foot: cupTiers.length ? `From ${aed(lowestCup)} per cup` : "",
            Icon: Coffee,
          },
        ]
      : []),
    {
      kind: "custom",
      eyebrow: "Bespoke",
      title: "Create your own",
      body: "Build your own menu. We confirm a tailored quote.",
      foot: "Free quote, no commitment",
      Icon: PencilSimpleLine,
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
              className={cn("flex flex-col p-5 sm:p-6", optionClass(on))}
            >
              <span className="flex w-full items-start justify-between">
                <span className="grid size-12 place-items-center rounded-full border border-espresso/15 text-espresso">
                  <o.Icon className="size-6" weight="light" />
                </span>
                <CheckBadge on={on} />
              </span>
              <span className="flex flex-1 flex-col pt-5">
                <span className="eyebrow text-[0.62rem] text-espresso/55">{o.eyebrow}</span>
                <span className="mt-2 block font-sans text-xl leading-tight font-semibold text-espresso">{o.title}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-espresso/60">{o.body}</span>
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
