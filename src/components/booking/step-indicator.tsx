"use client";

import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
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
  return (
    <nav aria-label="Booking progress" className="mb-10 md:mb-12">
      {/* Mobile: compact label + thin bar */}
      <div className="md:hidden">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow text-[0.65rem] text-muted-foreground">
            Step {current + 1} of {steps.length}
          </p>
          <p className="text-sm font-medium text-espresso">{STEP_LABELS[steps[current]]}</p>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-espresso transition-[width] duration-500 ease-(--ease-luxe)"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: small numbered steps in a row */}
      <ol className="hidden items-center gap-2 md:flex">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxReached && i !== current;
          return (
            <li key={s} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
              <button
                type="button"
                onClick={() => reachable && onJump(i)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${STEP_LABELS[s]}${done ? " (done)" : ""}`}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2 rounded-full pr-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
                  reachable ? "cursor-pointer" : "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full border text-xs tabular-nums transition-colors duration-300",
                    active && "border-espresso bg-espresso text-cream",
                    done && "border-espresso bg-card text-espresso",
                    !active && !done && "border-border bg-card text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" weight="bold" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-[0.8rem] whitespace-nowrap transition-colors duration-300",
                    active ? "font-medium text-espresso" : done ? "text-espresso" : "text-muted-foreground",
                    reachable && "hover:underline hover:underline-offset-4",
                  )}
                >
                  {STEP_LABELS[s]}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span aria-hidden className={cn("h-px min-w-3 flex-1", done ? "bg-espresso/60" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
