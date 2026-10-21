"use client";

import { Coffee } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "@/lib/types";
import { aed, cupTierFor, minCups } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { selectableDrinks } from "./model";
import { CheckBadge, FieldError, ItemImage, Label, QtyStepper, StepHeader, optionClass, type StepProps } from "./ui";

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
      <span className="relative block aspect-square w-full overflow-hidden rounded-2xl bg-secondary/70">
        <ItemImage
          src={item.image_url}
          alt=""
          className="size-full p-3 transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-105"
        />
        {onToggle && <CheckBadge on={selected} className="absolute top-2.5 right-2.5" />}
      </span>
      <span className="block px-1 pt-3.5 pb-1">
        <span className="eyebrow block text-[0.58rem] text-mocha">{CATEGORY_LABEL[item.category] ?? item.category}</span>
        <span className="mt-1.5 block font-display text-lg leading-tight text-espresso uppercase [overflow-wrap:anywhere]">
          {item.name}
        </span>
      </span>
    </>
  );

  const shell = cn("group flex flex-col p-3 sm:p-3.5", optionClass(selected), disabled && "opacity-50");

  if (onToggle) {
    return (
      <button
        type="button"
        data-animate
        role="checkbox"
        aria-checked={selected}
        aria-disabled={disabled}
        onClick={onToggle}
        className={shell}
      >
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
    <div
      data-animate
      className="mb-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-secondary p-1 [scrollbar-width:none]"
      role="tablist"
      aria-label="Filter drinks"
    >
      {["all", ...cats].map((c) => (
        <button
          key={c}
          type="button"
          role="tab"
          aria-selected={value === c}
          onClick={() => onChange(c)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
            value === c ? "bg-espresso text-cream" : "text-espresso/75 hover:text-espresso",
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

/** Sticky counter above a drinks grid. */
function CounterBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-animate
      className="sticky top-20 z-20 mb-6 flex items-center justify-between gap-4 rounded-full border bg-card/95 py-2.5 pr-4 pl-5 shadow-[0_12px_30px_-24px_rgba(54,31,24,.5)] backdrop-blur sm:top-24"
    >
      {children}
    </div>
  );
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

        <CounterBar>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-espresso tabular-nums">{picked.length}</span> / {max} selected
          </p>
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: max }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-5 rounded-full transition-colors duration-300",
                  i < picked.length ? "bg-espresso" : "bg-secondary",
                )}
              />
            ))}
          </div>
        </CounterBar>

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
          <div data-animate className="mt-8 flex gap-4 rounded-3xl border bg-card p-5 md:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-espresso">
              <Coffee className="size-5" weight="light" />
            </span>
            <div>
              <p className="eyebrow text-mocha">Plus our coffee selection</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The remaining servings are poured from our specialty coffee bar:{" "}
                <span className="text-espresso">{coffee.map((c) => c.name).join(", ")}</span>.
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

      <CounterBar>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-espresso tabular-nums">{totalCups}</span> cups ·{" "}
          {Object.keys(form.drinks).length} drinks
        </p>
        <p className="eyebrow text-[0.6rem] text-mocha">Estimate</p>
      </CounterBar>

      <CategoryChips cats={cats} value={cat} onChange={setCat} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {list.map((item) => {
          const cups = form.drinks[item.slug] ?? 0;
          return (
            <DrinkCard key={item.slug} item={item} selected={cups > 0}>
              <p className="px-1 text-sm text-muted-foreground">{aed(item.price ?? 0)} / cup</p>
              <div className="mt-3 flex justify-center border-t pt-3">
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

      <div data-animate className="rounded-3xl border bg-card p-6 md:p-8">
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
            <p className="text-xs text-muted-foreground">Your price</p>
            <p className="mt-1 font-display text-3xl text-espresso">
              {tier ? `${aed(tier.price_per_cup)} / cup` : `Min. ${min} cups`}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {tiers.map((t) => (
            <span
              key={t.id}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300",
                tier?.id === t.id ? "border-espresso bg-espresso text-cream" : "border-border text-muted-foreground",
              )}
            >
              {t.label} · {aed(t.price_per_cup)}
            </span>
          ))}
        </div>
        <FieldError>{errors.cups}</FieldError>
      </div>

      <h3 data-animate className="mt-12 mb-5 font-display text-2xl text-espresso uppercase sm:text-3xl">
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
