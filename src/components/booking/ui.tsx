"use client";

import Image from "next/image";
import { Check, Minus, Plus, WarningCircle } from "@phosphor-icons/react";
import { createContext, useContext, type ReactNode } from "react";
import { Label as UiLabel } from "@/components/ui/label";
import type { Catalog } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { BookingForm, FieldErrors } from "./model";

export type StepProps = {
  form: BookingForm;
  update: (patch: Partial<BookingForm> | ((f: BookingForm) => Partial<BookingForm>)) => void;
  catalog: Catalog;
  errors: FieldErrors;
};

/** Shared look for text inputs / textareas / select triggers on the booking page. */
export const fieldClass =
  "h-12 rounded-xl border-espresso/10 bg-cream/60 px-4 text-[0.95rem] shadow-none md:text-[0.95rem] placeholder:text-muted-foreground/70 focus-visible:bg-card";

/** Selectable card: soft cream with a thin border; selected = espresso ring + raised shadow. */
export const optionClass = (on: boolean) =>
  cn(
    "rounded-[1.5rem] border text-left transition-[border-color,box-shadow,background-color] duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
    on
      ? "border-espresso bg-cream ring-1 ring-espresso shadow-[0_18px_40px_-28px_rgba(54,31,24,.55)]"
      : "border-espresso/10 bg-cream/40 hover:border-espresso/30 hover:bg-cream/70",
  );

/** The current step's number, so each step's heading reads "2. Choose your drinks". */
export const StepNumber = createContext<number | null>(null);

export function StepHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  const n = useContext(StepNumber);
  return (
    <header data-animate className="mb-8 border-b border-espresso/10 pb-6 md:mb-10">
      <p className="text-espresso/60 italic">{eyebrow}</p>
      <h2 className="display mt-2 text-[1.65rem] leading-[1.05] text-espresso sm:text-[2.1rem]">
        {n != null && <span>{n}. </span>}
        {title}
      </h2>
      {children && <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">{children}</p>}
    </header>
  );
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-destructive">
      <WarningCircle aria-hidden weight="light" className="mt-px size-4 shrink-0" />
      {children}
    </p>
  );
}

export function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <UiLabel htmlFor={htmlFor} className="label-caps text-[0.68rem] text-espresso">
        {children}
      </UiLabel>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

export function CheckBadge({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-300",
        on ? "border-espresso bg-espresso text-cream" : "border-border bg-card text-transparent",
        className,
      )}
    >
      <Check className="size-3.5" weight="bold" />
    </span>
  );
}

export function QtyStepper({
  value,
  onChange,
  min = 0,
  max = 5000,
  step = 1,
  jumpTo,
  label,
  unit,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** when going up from 0, jump straight to this (e.g. add-on minimum) */
  jumpTo?: number;
  label: string;
  unit?: string;
  size?: "sm" | "md";
}) {
  const dec = () => {
    const next = jumpTo && value <= jumpTo ? 0 : value - step;
    onChange(Math.max(min, next));
  };
  const inc = () => {
    const next = jumpTo && value < jumpTo ? jumpTo : value + step;
    onChange(Math.min(max, next));
  };
  const btn = cn(
    "grid shrink-0 place-items-center rounded-full border border-border bg-card text-espresso transition-colors duration-200 outline-none hover:border-espresso hover:bg-espresso hover:text-cream focus-visible:ring-3 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-35",
    size === "sm" ? "size-10" : "size-11",
  );
  return (
    <div className="inline-flex items-center gap-1.5" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={dec} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <Minus className="size-3.5" weight="bold" />
      </button>
      <input
        inputMode="numeric"
        aria-label={label}
        value={value || ""}
        placeholder="0"
        onChange={(e) => {
          const n = Number(e.target.value.replace(/\D/g, "").slice(0, 5));
          onChange(Math.min(max, Math.max(min, n)));
        }}
        className={cn(
          "rounded-lg bg-transparent text-center font-medium text-espresso tabular-nums outline-none placeholder:text-muted-foreground/60 focus:bg-secondary",
          size === "sm" ? "h-8 w-12 text-sm" : "h-10 w-16 text-base",
        )}
      />
      {unit && <span className="sr-only">{unit}</span>}
      <button type="button" className={btn} onClick={inc} disabled={value >= max} aria-label={`Increase ${label}`}>
        <Plus className="size-3.5" weight="bold" />
      </button>
    </div>
  );
}

export function ItemImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (!src) return <div className={cn("rounded-full bg-sand/20", className)} />;
  return (
    <Image
      src={src}
      alt={alt}
      width={320}
      height={320}
      unoptimized={src.startsWith("http")}
      className={cn("object-contain drop-shadow-[0_14px_14px_rgba(54,31,24,.18)]", className)}
    />
  );
}

/** On/off switch. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
        on ? "border-espresso bg-espresso" : "border-input bg-secondary",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-card shadow-sm transition-[left] duration-300 ease-(--ease-luxe)",
          on ? "left-[1.45rem]" : "left-1",
        )}
      />
    </button>
  );
}
