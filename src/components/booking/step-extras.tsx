"use client";

import clsx from "clsx";
import { Clock, CupSoda, Palette, Sparkles } from "lucide-react";
import type { Extra } from "@/lib/types";
import { aed } from "@/lib/pricing";
import { MAX_EXTRA_HOURS } from "./model";
import { FieldError, ItemImage, QtyStepper, StepHeader, Toggle, type StepProps } from "./ui";

const extraIcon = (x: Extra) =>
  x.unit === "per_hour" ? Clock : x.unit === "on_request" ? CupSoda : x.slug.includes("corner") ? Palette : Sparkles;

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
          <h3 id="addons-title" data-animate className="eyebrow mb-5 text-sand">
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
                  className={clsx(
                    "flex items-center gap-4 rounded-3xl border p-3 pr-4 transition-all duration-500 ease-(--ease-luxe)",
                    qty > 0 ? "border-sand bg-sand/[0.09]" : "border-sand/15 bg-espresso-900/35",
                  )}
                >
                  <span className="relative grid size-20 shrink-0 place-items-center rounded-2xl bg-sand/[0.07]">
                    <ItemImage src={a.image_url} alt="" className="size-16" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-cream">{a.name}</p>
                    <p className="mt-1 text-xs text-cream/55">
                      {aed(unit)} each{qty > 0 && <span className="text-sand"> · {aed(unit * qty)}</span>}
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
          <h3 id="extras-title" data-animate className="eyebrow mb-5 text-sand">
            Extras
          </h3>
          <div className="glass divide-y divide-sand/10 overflow-hidden rounded-3xl">
            {catalog.extras.map((x) => {
              const Icon = extraIcon(x);
              const qty = form.extras[x.slug] ?? 0;
              return (
                <div key={x.slug} data-animate className="flex flex-wrap items-center gap-4 p-5 md:px-6">
                  <span
                    className={clsx(
                      "grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-300",
                      qty > 0 ? "bg-sand text-espresso" : "bg-sand/12 text-sand",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-[10rem] flex-1">
                    <p className="text-[0.98rem] text-cream">{x.name}</p>
                    {x.description && <p className="mt-0.5 text-sm text-cream/55">{x.description}</p>}
                  </div>
                  <p className="text-sm whitespace-nowrap text-sand">
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
              );
            })}
          </div>
          <FieldError>{errors.extras}</FieldError>
          <p data-animate className="mt-4 text-xs leading-relaxed text-cream/50">
            Extra cups are agreed with your barista and settled before service begins. Standard service is{" "}
            {settings.service_hours} hours.
          </p>
        </section>
      )}
    </div>
  );
}
