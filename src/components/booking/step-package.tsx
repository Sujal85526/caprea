"use client";

import { Check } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { aed } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { CheckBadge, FieldError, StepHeader, optionClass, type StepProps } from "./ui";

export function StepPackage({ form, update, catalog, errors }: StepProps) {
  const choose = (id: string) =>
    update((f) => {
      const pkg = catalog.packages.find((p) => p.id === id);
      // trim signature picks if the new package allows fewer
      const picked = Object.keys(f.drinks).filter((s) => f.drinks[s] > 0);
      const keep = pkg ? picked.slice(0, pkg.max_signature_drinks) : picked;
      return { packageId: id, drinks: Object.fromEntries(keep.map((s) => [s, 1])) };
    });

  return (
    <div>
      <StepHeader eyebrow="Packages" title="Choose your package">
        Each package includes your signature drinks plus our specialty coffee selection for the remaining servings.
      </StepHeader>

      <div role="radiogroup" aria-label="Package" className="grid gap-4 sm:grid-cols-2">
        {catalog.packages.map((p) => {
          const on = form.packageId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              data-animate
              onClick={() => choose(p.id)}
              className={cn("flex flex-col p-6", optionClass(on))}
            >
              <span className="flex w-full items-center justify-between gap-3">
                <span className="eyebrow text-mocha">{p.name}</span>
                <span className="flex items-center gap-2">
                  {p.featured && <Badge className="bg-sand text-espresso">Popular</Badge>}
                  <CheckBadge on={on} />
                </span>
              </span>

              <span className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-6xl leading-none text-espresso">{p.guests}</span>
                <span className="text-sm text-muted-foreground">guests</span>
              </span>

              <ul className="mt-6 mb-6 space-y-2.5 text-sm text-espresso">
                {[`Up to ${p.max_signature_drinks} signature drinks`, `${p.cups_per_drink} cups each`, ...p.includes].map(
                  (inc) => (
                    <li key={inc} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-mocha" weight="bold" /> {inc}
                    </li>
                  ),
                )}
              </ul>

              <span className="mt-auto flex w-full items-end justify-between border-t pt-5">
                <span className="text-xs text-muted-foreground">Package price</span>
                <span className="font-display text-3xl leading-none text-espresso">{aed(p.price)}</span>
              </span>
            </button>
          );
        })}
      </div>
      <FieldError>{errors.packageId}</FieldError>
    </div>
  );
}
