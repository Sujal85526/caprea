"use client";

import { Clock, Coffee, Palette, Sparkle } from "@phosphor-icons/react";
import type { Extra } from "@/lib/types";
import { aed } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { MAX_EXTRA_HOURS } from "./model";
import { FieldError, ItemImage, QtyStepper, StepHeader, Toggle, type StepProps } from "./ui";

const extraIcon = (x: Extra) =>
  x.unit === "per_hour" ? Clock : x.unit === "on_request" ? Coffee : x.slug.includes("corner") ? Palette : Sparkle;

export function StepExtras({ form, update, catalog, errors }: StepProps) {
  const { settings } = catalog;
  const addons = catalog.menu.filter((m) => m.catering_addon);
  const min = settings.addon_min_qty;

  const setAddon = (slug: string, qty: number) =>
    update((f) => {
      const next = { ...f.addons, [slug]: qty };
      if (!qty) delete next[slug];
      return { addons: next };
    });
  const setExtra = (slug: string, qty: number) =>
    update((f) => {
      const next = { ...f.extras, [slug]: qty };
      if (!qty) delete next[slug];
      return { extras: next };
    });

  return (
    <div>
      <StepHeader eyebrow="Optional" title="Sweet add-ons & extras">
        Pair your drinks with our house-made treats (minimum {min} pieces each) and make the cart your own.
      </StepHeader>

      {addons.length > 0 && (
        <section aria-labelledby="addons-title">
          <h3 id="addons-title" data-animate className="eyebrow mb-4 font-sans text-mocha">
            Add-ons
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {addons.map((a) => {
              const qty = form.addons[a.slug] ?? 0;
              const unit = a.addon_price ?? a.price ?? 0;
              return (
                <div
                  key={a.slug}
                  data-animate
                  className={cn(
                    "flex items-center gap-4 rounded-3xl border bg-card p-3 pr-4 transition-[border-color,background-color,box-shadow] duration-300",
                    qty > 0 ? "border-espresso bg-secondary/45 ring-1 ring-espresso" : "border-border",
                  )}
                >
                  <span className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-secondary/70">
                    <ItemImage src={a.image_url} alt="" className="size-20" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-espresso uppercase [overflow-wrap:anywhere]">
                      {a.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {aed(unit)} each
                      {qty > 0 && <span className="font-medium text-espresso"> · {aed(unit * qty)}</span>}
                    </p>
                    <div className="mt-2.5">
                      <QtyStepper
                        size="sm"
                        label={`${a.name} pieces`}
                        value={qty}
                        jumpTo={min}
                        step={5}
                        max={2000}
                        onChange={(n) => setAddon(a.slug, n > 0 && n < min ? min : n)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <FieldError>{errors.addons}</FieldError>
        </section>
      )}

      {catalog.extras.length > 0 && (
        <section aria-labelledby="extras-title" className="mt-12">
          <h3 id="extras-title" data-animate className="eyebrow mb-4 font-sans text-mocha">
            Extras
          </h3>
          <div className="divide-y overflow-hidden rounded-3xl border bg-card">
            {catalog.extras.map((x) => {
              const Icon = extraIcon(x);
              const qty = form.extras[x.slug] ?? 0;
              return (
                <div key={x.slug} data-animate className="flex flex-wrap items-center gap-x-4 gap-y-3 p-5 md:px-6">
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-300",
                      qty > 0 ? "bg-espresso text-cream" : "bg-secondary text-espresso",
                    )}
                  >
                    <Icon className="size-5" weight="light" />
                  </span>
                  <div className="min-w-[10rem] flex-1">
                    <p className="text-[0.95rem] font-medium text-espresso">{x.name}</p>
                    {x.description && <p className="mt-0.5 text-sm text-muted-foreground">{x.description}</p>}
                  </div>
                  <div className="flex items-center gap-4 max-sm:w-full max-sm:justify-between max-sm:pl-15">
                    <p className="text-sm whitespace-nowrap text-espresso">
                      {x.unit === "on_request" || x.price == null
                        ? "Priced on request"
                        : x.unit === "per_hour"
                          ? `${aed(x.price)} / hour`
                          : aed(x.price)}
                    </p>
                    {x.unit === "per_hour" ? (
                      <QtyStepper
                        size="sm"
                        label={`${x.name} hours`}
                        value={qty}
                        max={MAX_EXTRA_HOURS}
                        onChange={(n) => setExtra(x.slug, n)}
                      />
                    ) : (
                      <Toggle label={x.name} on={qty > 0} onChange={(v) => setExtra(x.slug, v ? 1 : 0)} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <FieldError>{errors.extras}</FieldError>
          <p data-animate className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Extra cups are agreed with your barista and settled before service begins. Standard service is{" "}
            {settings.service_hours} hours.
          </p>
        </section>
      )}
    </div>
  );
}
