"use client";

import clsx from "clsx";
import Image from "next/image";
import { Check, Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import type { BookingForm, FieldErrors } from "./model";
import type { Catalog } from "@/lib/types";

export type StepProps = {
  form: BookingForm;
  update: (patch: Partial<BookingForm> | ((f: BookingForm) => Partial<BookingForm>)) => void;
  catalog: Catalog;
  errors: FieldErrors;
};

export function StepHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header data-animate className="mb-8 md:mb-10">
      <p className="eyebrow text-sand">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl uppercase text-cream md:text-5xl">{title}</h2>
      {children && <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-cream/70">{children}</p>}
    </header>
  );
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-2 text-sm text-[#f0a48a]">
      <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-[#f0a48a]" />
      {children}
    </p>
  );
}

export function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2.5 flex items-baseline justify-between gap-3">
      <span className="eyebrow text-sand-300">{children}</span>
      {hint && <span className="text-xs text-cream/45">{hint}</span>}
    </label>
  );
}

export function CheckBadge({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "grid size-7 place-items-center rounded-full border transition-all duration-300 ease-(--ease-luxe)",
        on ? "scale-100 border-sand bg-sand text-espresso" : "scale-90 border-sand/30 text-transparent",
        className,
      )}
    >
      <Check className="size-4" strokeWidth={2.5} />
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
  const btn =
    "grid place-items-center rounded-full border border-sand/30 text-sand transition-colors duration-300 hover:border-sand hover:bg-sand hover:text-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand disabled:pointer-events-none disabled:opacity-30";
  const s = size === "sm" ? "size-8" : "size-10";
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button type="button" className={clsx(btn, s)} onClick={dec} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <Minus className="size-4" />
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
        className={clsx(
          "rounded-full bg-transparent text-center tabular-nums text-cream outline-none placeholder:text-cream/30 focus:bg-espresso-900/60",
          size === "sm" ? "w-12 text-base" : "w-16 text-lg",
        )}
      />
      {unit && <span className="sr-only">{unit}</span>}
      <button type="button" className={clsx(btn, s)} onClick={inc} disabled={value >= max} aria-label={`Increase ${label}`}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function ItemImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (!src) return <div className={clsx("rounded-full bg-sand/10", className)} />;
  return (
    <Image
      src={src}
      alt={alt}
      width={320}
      height={320}
      unoptimized={src.startsWith("http")}
      className={clsx("object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]", className)}
    />
  );
}

/** Toggle switch styled as a pill. */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={clsx(
        "relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand",
        on ? "border-sand bg-sand" : "border-sand/30 bg-espresso-900/60",
      )}
    >
      <span
        className={clsx(
          "absolute top-1/2 size-5 -translate-y-1/2 rounded-full transition-all duration-300 ease-(--ease-luxe)",
          on ? "left-[1.45rem] bg-espresso" : "left-1 bg-sand/70",
        )}
      />
    </button>
  );
}
