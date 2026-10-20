"use client";

import clsx from "clsx";
import { Check, CupSoda, Layers, Package as PackageIcon } from "lucide-react";
import { useState } from "react";
import { saveCupTier, saveExtra, saveRegion } from "@/app/admin/_actions/catalog";
import { setPricingMode } from "@/app/admin/_actions/settings";
import type { CupTier, Extra, ExtraUnit, PricingMode, Region } from "@/lib/types";
import { NumberInput, Spinner, useAction } from "./client";
import { EditableList } from "./editable-list";
import { Card, Field, SectionTitle, Select, inputCls } from "./ui";

const MODES: { value: PricingMode; label: string; desc: string; icon: typeof PackageIcon }[] = [
  { value: "packages", label: "Packages only", desc: "Customers pick a guest-tier package.", icon: PackageIcon },
  { value: "per_cup", label: "Per cup only", desc: "Customers order a number of cups at tier prices.", icon: CupSoda },
  { value: "both", label: "Both", desc: "Customers choose packages or per-cup ordering.", icon: Layers },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export function PricingEditor({
  mode,
  cupTiers,
  regions,
  extras,
}: {
  mode: PricingMode;
  cupTiers: CupTier[];
  regions: Region[];
  extras: Extra[];
}) {
  const [current, setCurrent] = useState(mode);
  const [target, setTarget] = useState<PricingMode | null>(null);
  const [pending, run] = useAction();

  const changeMode = async (m: PricingMode) => {
    if (m === current || pending) return;
    const prev = current;
    setCurrent(m);
    setTarget(m);
    const ok = await run(() => setPricingMode(m), { success: `Booking options: ${MODES.find((x) => x.value === m)!.label.toLowerCase()}` });
    if (!ok) setCurrent(prev);
    setTarget(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle hint="Controls which booking options customers see on the website.">Pricing mode</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Pricing mode">
          {MODES.map(({ value, label, desc, icon: Icon }) => {
            const selected = current === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={pending}
                onClick={() => changeMode(value)}
                className={clsx(
                  "relative rounded-2xl border p-4 text-left transition-colors duration-300 disabled:cursor-wait",
                  selected ? "border-sand bg-sand/10" : "border-sand/15 hover:border-sand/40 hover:bg-sand/[0.04]",
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon className={clsx("h-5 w-5", selected ? "text-sand" : "text-sand/50")} />
                  {pending && target === value ? (
                    <Spinner className="text-sand" />
                  ) : (
                    selected && (
                      <span className="rounded-full bg-sand p-0.5 text-espresso">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )
                  )}
                </div>
                <p className="mt-3 font-medium text-cream">{label}</p>
                <p className="mt-1 text-xs text-cream/55">{desc}</p>
              </button>
            );
          })}
        </div>
        {current !== "packages" && cupTiers.filter((t) => t.active).length === 0 && (
          <p className="mt-3 text-sm text-gold">Per-cup ordering is on, but there are no live cup tiers. Add one below.</p>
        )}
      </Card>

      <Card>
        <SectionTitle hint="Price per cup by order size, used for per-cup bookings. Leave max empty for “and above”.">Cup tiers</SectionTitle>
        <EditableList
          table="cup_tiers"
          noun="tier"
          rows={cupTiers}
          gridClass="grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]"
          blank={{ label: "", min_cups: 30, max_cups: null as number | null, price_per_cup: 0, active: true } as TierDraft}
          toDraft={(t): TierDraft => ({ label: t.label, min_cups: t.min_cups, max_cups: t.max_cups, price_per_cup: t.price_per_cup, active: t.active })}
          save={(d) => saveCupTier(d)}
          fields={(d, set) => (
            <>
              <Field label="Label" className="col-span-2 md:col-span-1">
                <input required className={inputCls} value={d.label} placeholder="e.g. 30 – 99 cups" onChange={(e) => set("label", e.target.value)} />
              </Field>
              <Field label="Min cups">
                <NumberInput required min={1} step={1} className={inputCls} value={d.min_cups} onChange={(v) => set("min_cups", v ?? 0)} />
              </Field>
              <Field label="Max cups">
                <NumberInput min={1} step={1} allowEmpty placeholder="No limit" className={inputCls} value={d.max_cups} onChange={(v) => set("max_cups", v)} />
              </Field>
              <Field label="AED per cup">
                <NumberInput required min={0} step="0.01" className={inputCls} value={d.price_per_cup} onChange={(v) => set("price_per_cup", v ?? 0)} />
              </Field>
            </>
          )}
        />
      </Card>

      <Card>
        <SectionTitle hint="Emirates you serve and the transport fee added to each booking.">Areas &amp; transport</SectionTitle>
        <EditableList
          table="regions"
          noun="area"
          rows={regions}
          gridClass="grid-cols-2 md:grid-cols-[2fr_1fr]"
          blank={{ name: "", fee: 0, active: true } as RegionDraft}
          toDraft={(r): RegionDraft => ({ name: r.name, fee: r.fee, active: r.active })}
          save={(d) => saveRegion(d)}
          fields={(d, set) => (
            <>
              <Field label="Emirate / area">
                <input required className={inputCls} value={d.name} placeholder="e.g. Abu Dhabi" onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Transport fee (AED)">
                <NumberInput required min={0} step="0.01" className={inputCls} value={d.fee} onChange={(v) => set("fee", v ?? 0)} />
              </Field>
            </>
          )}
        />
      </Card>

      <Card>
        <SectionTitle hint="Optional extras customers can add, like custom cups or extra hours.">Extras</SectionTitle>
        <EditableList
          table="extras"
          noun="extra"
          rows={extras}
          gridClass="grid-cols-2 md:grid-cols-[1.2fr_1.6fr_0.9fr_0.9fr]"
          blank={{ slug: "", name: "", description: "", price: 0, unit: "flat", active: true } as ExtraDraft}
          toDraft={(e): ExtraDraft => ({
            slug: e.slug,
            name: e.name,
            description: e.description ?? "",
            price: e.price,
            unit: e.unit,
            active: e.active,
          })}
          save={(d) =>
            saveExtra({
              ...d,
              slug: d.slug || slugify(d.name),
              description: d.description || null,
              price: d.unit === "on_request" ? null : d.price,
            })
          }
          fields={(d, set) => (
            <>
              <Field label="Name">
                <input required className={inputCls} value={d.name} placeholder="e.g. Customised cups" onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Description">
                <input className={inputCls} value={d.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <Field label="Price (AED)">
                <NumberInput
                  min={0}
                  step="0.01"
                  allowEmpty
                  disabled={d.unit === "on_request"}
                  placeholder={d.unit === "on_request" ? "On request" : "0"}
                  className={inputCls}
                  value={d.unit === "on_request" ? null : d.price}
                  onChange={(v) => set("price", v)}
                />
              </Field>
              <Field label="Charged">
                <Select value={d.unit} onChange={(e) => set("unit", e.target.value as ExtraUnit)}>
                  <option value="flat">Flat</option>
                  <option value="per_hour">Per hour</option>
                  <option value="on_request">On request</option>
                </Select>
              </Field>
            </>
          )}
        />
      </Card>
    </div>
  );
}

type TierDraft = { id?: string; label: string; min_cups: number; max_cups: number | null; price_per_cup: number; active: boolean };
type RegionDraft = { id?: string; name: string; fee: number; active: boolean };
type ExtraDraft = { id?: string; slug: string; name: string; description: string; price: number | null; unit: ExtraUnit; active: boolean };
