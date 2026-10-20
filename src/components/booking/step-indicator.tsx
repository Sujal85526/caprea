"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import { STEP_LABELS, type StepId } from "./model";

export function StepIndicator({
  steps,
  current,
  maxReached,
  onJump,
}: {
  steps: StepId[];
  current: number;
  maxReached: number;
  onJump: (index: number) => void;
}) {
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;
  return (
    <nav aria-label="Booking progress" className="mb-10 md:mb-14">
      {/* Mobile: compact label + bar */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow text-sand">
            Step {current + 1} of {steps.length}
          </p>
          <p className="font-display text-xl uppercase text-cream">{STEP_LABELS[steps[current]]}</p>
        </div>
        <div className="mt-3 h-px w-full bg-sand/15">
          <div
            className="h-px bg-sand transition-[width] duration-700 ease-(--ease-luxe)"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: numbered dots on a progress line */}
      <ol className="relative hidden items-start justify-between md:flex">
        <span aria-hidden className="absolute top-5 right-5 left-5 h-px bg-sand/15" />
        <span
          aria-hidden
          className="absolute top-5 left-5 h-px origin-left bg-sand transition-transform duration-700 ease-(--ease-luxe)"
          style={{ right: "1.25rem", transform: `scaleX(${progress})` }}
        />
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxReached && i !== current;
          return (
            <li key={s} className="relative z-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${STEP_LABELS[s]}${done ? " (done)" : ""}`}
                className={clsx(
                  "grid size-10 place-items-center rounded-full border text-sm tabular-nums transition-all duration-500 ease-(--ease-luxe) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sand",
                  active && "scale-110 border-sand bg-sand text-espresso shadow-[0_0_0_6px_rgba(210,184,158,0.12)]",
                  done && "border-sand bg-espresso text-sand hover:bg-sand hover:text-espresso",
                  !active && !done && "border-sand/25 bg-espresso text-cream/50",
                  reachable ? "cursor-pointer" : "cursor-default",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={2.5} /> : i + 1}
              </button>
              <span
                className={clsx(
                  "eyebrow text-[0.62rem] transition-colors duration-500",
                  active ? "text-cream" : done ? "text-sand" : "text-cream/40",
                )}
              >
                {STEP_LABELS[s]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
