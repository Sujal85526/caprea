"use client";

import { format } from "date-fns";
import { CaretDown, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const toDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function EventDatePicker({
  value,
  onChange,
  earliest,
  latest,
  invalid,
  describedBy,
}: {
  value: string | null;
  onChange: (iso: string | null) => void;
  earliest: string;
  latest: string;
  invalid?: boolean;
  describedBy?: string;
}) {
  const selected = value ? toDate(value) : undefined;
  const start = toDate(earliest);
  const end = toDate(latest);

  return (
    <div aria-invalid={invalid || undefined} aria-describedby={describedBy}>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : null)}
        defaultMonth={selected ?? start}
        startMonth={start}
        endMonth={end}
        disabled={[{ before: start }, { after: end }]}
        weekStartsOn={1}
        showOutsideDays
        fixedWeeks
        className="w-full bg-transparent p-0 [--cell-radius:9999px] [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(11)]"
        classNames={{
          root: "w-full",
          caption_label: "font-sans text-base font-semibold text-espresso select-none",
          weekday: "flex-1 pb-1 text-[0.72rem] font-normal tracking-[0.12em] text-muted-foreground uppercase select-none",
          disabled: "text-muted-foreground/45 opacity-100 [&>button]:line-through [&>button]:decoration-muted-foreground/40",
          today: "rounded-full [&>button]:ring-1 [&>button]:ring-sand",
        }}
        components={{
          Chevron: ({ orientation, className }) => {
            const Icon = orientation === "left" ? CaretLeft : orientation === "right" ? CaretRight : CaretDown;
            return <Icon className={cn("size-4", className)} weight="bold" />;
          },
        }}
      />
    </div>
  );
}
