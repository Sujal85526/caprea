"use client";

import clsx from "clsx";
import { Coffee } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "@/lib/types";
import { aed, cupTierFor, minCups } from "@/lib/pricing";
import { selectableDrinks } from "./model";
import { CheckBadge, FieldError, ItemImage, Label, QtyStepper, StepHeader, type StepProps } from "./ui";

const CATEGORY_LABEL: Record<string, string> = {
  signature: "Signature",
  matcha: "Matcha",
  coffee: "Coffee",
  smoothie: "Smoothies",
  refresher: "Refreshers",
};

function DrinkCard({
  item,
  selected,
  disabled,
  onToggle,
  children,
}: {
  item: MenuItem;
  selected: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}) {
  const body = (
    <>
      <span className="relative mx-auto block aspect-square w-full max-w-[9.5rem]">
        <span
          aria-hidden
          className={clsx(
            "absolute inset-[12%] rounded-full blur-2xl transition-opacity duration-500",
            selected ? "bg-sand/35 opacity-100" : "bg-sand/15 opacity-60 group-hover:opacity-100",
          )}
        />
        <ItemImage
          src={item.image_url}
          alt=""
          className="relative size-full transition-transform duration-700 ease-(--ease-luxe) group-hover:-translate-y-1 group-hover:rotate-[-2deg]"
        />
      </span>
      <span className="mt-3 block text-center">
        <span className="eyebrow block text-[0.58rem] text-sand/70">{CATEGORY_LABEL[item.category] ?? item.category}</span>
        <span className="mt-1.5 block font-display text-xl leading-tight text-cream">{item.name}</span>
      </span>
    </>
  );

  const shell = clsx(
    "group relative flex flex-col rounded-3xl border p-4 pt-5 transition-all duration-500 ease-(--ease-luxe) sm:p-5",
    selected
      ? "border-sand bg-sand/[0.09] shadow-[0_24px_50px_-28px_rgba(210,184,158,0.6)]"
      : "border-sand/15 bg-espresso-900/35 hover:border-sand/45",
    disabled && "opacity-40",
  );

  if (onToggle) {
    return (
      <button
        type="button"
        data-animate
        role="checkbox"
        aria-checked={selected}
        aria-disabled={disabled}
        onClick={onToggle}
        className={clsx(shell, "text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand")}
      >
        <CheckBadge on={selected} className="absolute top-3.5 right-3.5 z-10" />
        {body}
      </button>
    );
  }
  return (
    <div data-animate className={shell}>
      {body}
      {children}
    </div>
  );
}

function CategoryChips({ cats, value, onChange }: { cats: string[]; value: string; onChange: (c: string) => void }) {
  if (cats.length < 2) return null;
  return (
    <div data-animate className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter drinks">
      {["all", ...cats].map((c) => (
        <button
          key={c}
          type="button"
          role="tab"
          aria-selected={value === c}
          onClick={() => onChange(c)}
          className={clsx(
            "eyebrow rounded-full border px-4 py-2 text-[0.62rem] transition-colors duration-300",
            value === c ? "border-sand bg-sand text-espresso" : "border-sand/25 text-cream/70 hover:border-sand/60",
          )}
        >
          {c === "all" ? "All" : (CATEGORY_LABEL[c] ?? c)}
        </button>
      ))}
    </div>
  );
}

function useFiltered(items: MenuItem[]) {
  const [cat, setCat] = useState("all");
  const cats = [...new Set(items.map((i) => i.category))];
  return { cat, setCat, cats, list: cat === "all" ? items : items.filter((i) => i.category === cat) };
}

/** Package: choose signature drinks. Custom: drinks with cup steppers. */
export function StepDrinks({ form, update, catalog, errors }: StepProps) {
  const kind = form.kind ?? "package";
  const items = selectableDrinks(kind, catalog);
  const { cat, setCat, cats, list } = useFiltered(items);

  if (kind === "package") {
    const pkg = catalog.packages.find((p) => p.id === form.packageId);
    const max = pkg?.max_signature_drinks ?? 0;
    const picked = Object.keys(form.drinks).filter((s) => form.drinks[s] > 0);
    const full = picked.length >= max;
    const coffee = catalog.menu.filter((m) => m.catering_coffee);

    const toggle = (slug: string) => {
      if (form.drinks[slug]) {
        update((f) => {
          const next = { ...f.drinks };
          delete next[slug];
          return { drinks: next };
        });
      } else if (full) {
        toast(`Your package includes up to ${max} signature drinks`, {
          description: "Deselect one to swap it for another.",
        });
      } else {
        update((f) => ({ drinks: { ...f.drinks, [slug]: 1 } }));
      }
    };

    return (
      <div>
        <StepHeader eyebrow="Signature menu" title="Pick your signature drinks">
          {pkg
            ? `Your ${pkg.name} package includes up to ${max} signature drinks, ${pkg.cups_per_drink} cups each.`
            : "Choose a package first."}
        </StepHeader>

        <div
          data-animate
          className="sticky top-24 z-20 mb-6 flex items-center justify-between gap-4 rounded-full border border-sand/20 bg-espresso-900/80 py-2.5 pr-2.5 pl-5 backdrop-blur-xl"
        >
          <p className="text-sm text-cream/75">
            <span className="font-display text-2xl text-cream tabular-nums">{picked.length}</span>
            <span className="text-cream/50"> / {max}</span> selected
          </p>
          <div className="flex gap-1.5" aria-hidden>
            {Array.from({ length: max }, (_, i) => (
              <span
                key={i}
                className={clsx(
                  "h-1.5 w-5 rounded-full transition-colors duration-500",
                  i < picked.length ? "bg-sand" : "bg-sand/15",
                )}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {items.map((item) => (
            <DrinkCard
              key={item.slug}
              item={item}
              selected={!!form.drinks[item.slug]}
              disabled={full && !form.drinks[item.slug]}
              onToggle={() => toggle(item.slug)}
            />
          ))}
        </div>
        <FieldError>{errors.drinks}</FieldError>

        {coffee.length > 0 && (
          <div data-animate className="glass mt-8 flex gap-4 rounded-3xl p-5 md:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sand/15 text-sand">
              <Coffee className="size-5" />
            </span>
            <div>
              <p className="eyebrow text-sand">Plus our coffee selection</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/75">
                The remaining servings are poured from our specialty coffee bar:{" "}
                <span className="text-cream">{coffee.map((c) => c.name).join(", ")}</span>.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // custom request: any drink, with a cup count each
  const totalCups = Object.values(form.drinks).reduce((n, c) => n + (c > 0 ? c : 0), 0);
  const setCups = (slug: string, cups: number) =>
    update((f) => {
      const next = { ...f.drinks, [slug]: cups };
      if (!cups) delete next[slug];
      return { drinks: next };
    });

  return (
    <div>
      <StepHeader eyebrow="Your menu" title="Create your own selection">
        Add any of our drinks and how many cups of each. Prices shown are our café prices, used for your estimate.
      </StepHeader>

      <div
        data-animate
        className="sticky top-24 z-20 mb-6 flex items-center justify-between rounded-full border border-sand/20 bg-espresso-900/80 py-3 pr-5 pl-5 backdrop-blur-xl"
      >
        <p className="text-sm text-cream/75">
          <span className="font-display text-2xl text-cream tabular-nums">{totalCups}</span> cups ·{" "}
          {Object.keys(form.drinks).length} drinks
        </p>
        <p className="eyebrow text-[0.6rem] text-sand">Estimate</p>
      </div>

      <CategoryChips cats={cats} value={cat} onChange={setCat} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {list.map((item) => {
          const cups = form.drinks[item.slug] ?? 0;
          return (
            <DrinkCard key={item.slug} item={item} selected={cups > 0}>
              <p className="mt-1 text-center text-xs text-cream/50">{aed(item.price ?? 0)} / cup</p>
              <div className="mt-4 flex justify-center">
                <QtyStepper
                  size="sm"
                  label={`${item.name} cups`}
                  value={cups}
                  step={5}
                  max={2000}
                  onChange={(n) => setCups(item.slug, n)}
                />
              </div>
            </DrinkCard>
          );
        })}
      </div>
      <FieldError>{errors.drinks}</FieldError>
    </div>
  );
}

/** Per-cup order: total cups (tier priced) + which drinks to serve. */
export function StepCups({ form, update, catalog, errors }: StepProps) {
  const items = selectableDrinks("per_cup", catalog);
  const { cat, setCat, cats, list } = useFiltered(items);
  const min = minCups(catalog.cupTiers);
  const tier = cupTierFor(form.cups, catalog.cupTiers);
  const tiers = [...catalog.cupTiers].sort((a, b) => a.min_cups - b.min_cups);

  const toggle = (slug: string) =>
    update((f) => {
      const next = { ...f.drinks };
      if (next[slug]) delete next[slug];
      else next[slug] = 1;
      return { drinks: next };
    });

  return (
    <div>
      <StepHeader eyebrow="By the cup" title="How many cups?">
        Choose your total number of cups, then the drinks you&apos;d like our barista to serve. The more cups, the better the
        price.
      </StepHeader>

      <div data-animate className="glass rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label>Total cups</Label>
            <QtyStepper
              label="Total cups"
              value={form.cups}
              step={10}
              jumpTo={min}
              max={5000}
              onChange={(n) => update({ cups: n })}
            />
          </div>
          <div className="sm:text-right">
            <p className="eyebrow text-[0.6rem] text-cream/50">Your price</p>
            <p className="mt-1 font-display text-3xl text-sand">
              {tier ? `${aed(tier.price_per_cup)} / cup` : `Min. ${min} cups`}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {tiers.map((t) => (
            <span
              key={t.id}
              className={clsx(
                "rounded-full border px-4 py-2 text-xs transition-colors duration-300",
                tier?.id === t.id ? "border-sand bg-sand/15 text-cream" : "border-sand/20 text-cream/55",
              )}
            >
              {t.label} · {aed(t.price_per_cup)}
            </span>
          ))}
        </div>
        <FieldError>{errors.cups}</FieldError>
      </div>

      <h3 data-animate className="mt-12 mb-5 font-display text-3xl uppercase text-cream">
        Drinks to serve
      </h3>
      <CategoryChips cats={cats} value={cat} onChange={setCat} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {list.map((item) => (
          <DrinkCard key={item.slug} item={item} selected={!!form.drinks[item.slug]} onToggle={() => toggle(item.slug)} />
        ))}
      </div>
      <FieldError>{errors.drinks}</FieldError>
    </div>
  );
}
