"use client";

import clsx from "clsx";
import { Check, Sparkles } from "lucide-react";
import { aed } from "@/lib/pricing";
import { CheckBadge, FieldError, StepHeader, type StepProps } from "./ui";

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

      <div role="radiogroup" aria-label="Package" className="grid gap-5 sm:grid-cols-2">
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
              className={clsx(
                "group relative flex flex-col overflow-hidden rounded-3xl border p-6 text-left transition-all duration-500 ease-(--ease-luxe) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand md:p-7",
                on
                  ? "border-sand bg-sand/[0.09] shadow-[0_30px_60px_-30px_rgba(210,184,158,0.5)]"
                  : p.featured
                    ? "glass border-sand/45 hover:-translate-y-1"
                    : "glass hover:-translate-y-1 hover:border-sand/45",
              )}
            >
              {p.featured && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(210,184,158,0.22),transparent_55%)]"
                />
              )}
              <span className="relative flex items-start justify-between">
                <span className="eyebrow text-sand">{p.name}</span>
                {p.featured ? (
                  <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-[0.58rem] text-espresso">
                    <Sparkles className="size-3" /> Popular
                  </span>
                ) : (
                  <CheckBadge on={on} />
                )}
              </span>

              <span className="relative mt-6 flex items-end gap-3">
                <span className="font-display text-7xl leading-[0.8] text-cream">{p.guests}</span>
                <span className="eyebrow pb-1 text-cream/60">guests</span>
              </span>

              <span className="relative mt-5 block text-sm text-cream/80">
                Up to {p.max_signature_drinks} signature drinks · {p.cups_per_drink} cups each
              </span>

              <span className="relative my-6 block h-px bg-sand/20" />

              <ul className="relative space-y-2.5 text-sm text-cream/70">
                {p.includes.map((inc) => (
                  <li key={inc} className="flex items-center gap-2.5">
                    <Check className="size-3.5 shrink-0 text-sand" strokeWidth={2.5} /> {inc}
                  </li>
                ))}
              </ul>

              <span className="relative mt-auto flex items-end justify-between pt-8">
                <span>
                  <span className="eyebrow block text-[0.6rem] text-cream/45">Package price</span>
                  <span className="mt-1 block font-display text-3xl text-sand">{aed(p.price)}</span>
                </span>
                {p.featured && <CheckBadge on={on} />}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError>{errors.packageId}</FieldError>
    </div>
  );
}
