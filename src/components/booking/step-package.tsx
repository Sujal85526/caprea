"use client";

import { Check } from "@phosphor-icons/react";
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
        Your signature drinks, plus our coffee selection for the rest.
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
              className={cn("flex flex-col p-5 sm:p-6", optionClass(on))}
            >
              <span className="flex w-full items-center justify-between gap-3">
                <span className="text-base font-semibold text-espresso">{p.name}</span>
                <span className="flex items-center gap-2">
                  {p.featured && (
                    <span className="eyebrow rounded-full bg-sand px-2.5 py-1 text-[0.55rem] font-semibold text-espresso">Popular</span>
                  )}
                  <CheckBadge on={on} />
                </span>
              </span>
              <span className="mt-1 text-sm text-espresso/55">Up to {p.guests} guests</span>
              <span className="mt-4 text-2xl leading-none font-semibold text-espresso">{aed(p.price)}</span>

              <ul className="mt-5 space-y-2 text-sm text-espresso/75">
                {[`${p.max_signature_drinks} signature drinks`, `${p.cups_per_drink} cups each`, ...p.includes].slice(0, 4).map((inc) => (
                  <li key={inc} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-espresso/50" weight="bold" /> {inc}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      <FieldError>{errors.packageId}</FieldError>
    </div>
  );
}
