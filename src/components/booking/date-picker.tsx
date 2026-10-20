"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

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
      <DayPicker
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
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />,
        }}
        classNames={{
          root: "relative w-full select-none",
          months: "w-full",
          month: "w-full",
          month_caption: "flex h-10 items-center px-1",
          caption_label: "font-display text-2xl uppercase tracking-wide text-cream",
          nav: "absolute top-0 right-0 z-10 flex items-center gap-2",
          button_previous:
            "grid size-10 place-items-center rounded-full border border-sand/25 text-sand transition-colors hover:border-sand hover:bg-sand hover:text-espresso disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-sand",
          button_next:
            "grid size-10 place-items-center rounded-full border border-sand/25 text-sand transition-colors hover:border-sand hover:bg-sand hover:text-espresso disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-sand",
          chevron: "",
          month_grid: "mt-5 w-full border-collapse",
          weekdays: "",
          weekday: "eyebrow pb-3 text-center text-[0.6rem] font-normal text-sand/60",
          weeks: "",
          week: "",
          day: "p-0.5 text-center align-middle",
          day_button:
            "mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-[0.95rem] tabular-nums text-cream transition-all duration-300 ease-(--ease-luxe) hover:bg-sand/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sand",
          selected:
            "[&>button]:bg-sand [&>button]:font-semibold [&>button]:text-espresso [&>button]:shadow-[0_8px_24px_-6px_rgba(210,184,158,0.65)] [&>button:hover]:bg-sand",
          today: "[&>button]:ring-1 [&>button]:ring-sand/40",
          disabled: "[&>button]:cursor-not-allowed [&>button]:text-cream/20 [&>button]:line-through [&>button:hover]:bg-transparent",
          outside: "[&>button]:text-cream/25",
          hidden: "invisible",
          focused: "",
        }}
      />
    </div>
  );
}
