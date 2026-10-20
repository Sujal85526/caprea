"use client";

import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { FieldError, Label, StepHeader, type StepProps } from "./ui";

const err = (id: string, msg?: string) =>
  msg ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};

export function TermsList({ terms }: { terms: { title: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="divide-y divide-sand/10">
      {terms.map((t, i) => {
        const on = open === i;
        return (
          <li key={t.title}>
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`term-${i}`}
              onClick={() => setOpen(on ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-[0.95rem] text-cream transition-colors hover:text-sand focus-visible:outline-2 focus-visible:outline-sand"
            >
              <span className="flex items-center gap-3">
                <span className="font-display text-sm text-sand/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {t.title}
              </span>
              <ChevronDown
                className={clsx("size-4 shrink-0 text-sand transition-transform duration-500", on && "rotate-180")}
              />
            </button>
            <div
              id={`term-${i}`}
              className={clsx(
                "grid transition-[grid-template-rows] duration-500 ease-(--ease-luxe)",
                on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <p className="overflow-hidden pl-9 text-sm leading-relaxed text-cream/65">
                <span className="block pb-4">{t.body}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function StepContact({ form, update, catalog, errors }: StepProps) {
  const terms = catalog.settings.terms ?? [];
  return (
    <div>
      <StepHeader eyebrow="Almost there" title="Your details">
        We&apos;ll use these to confirm your booking and send your{" "}
        {form.kind === "custom" ? "quote" : "deposit payment link"}.
      </StepHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <div data-animate className="md:col-span-2">
          <Label htmlFor="name">Full name</Label>
          <input
            id="name"
            autoComplete="name"
            className="input"
            placeholder="Your name"
            value={form.name}
            maxLength={120}
            onChange={(e) => update({ name: e.target.value })}
            {...err("name", errors.name)}
          />
          <FieldError id="name-error">{errors.name}</FieldError>
        </div>
        <div data-animate>
          <Label htmlFor="phone" hint="WhatsApp preferred">
            Phone
          </Label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="input"
            placeholder="+971 50 123 4567"
            value={form.phone}
            maxLength={30}
            onChange={(e) => update({ phone: e.target.value })}
            {...err("phone", errors.phone)}
          />
          <FieldError id="phone-error">{errors.phone}</FieldError>
        </div>
        <div data-animate>
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            maxLength={200}
            onChange={(e) => update({ email: e.target.value })}
            {...err("email", errors.email)}
          />
          <FieldError id="email-error">{errors.email}</FieldError>
        </div>

        {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => update({ website: e.target.value })}
          />
        </div>
      </div>

      {terms.length > 0 && (
        <section id="booking-terms" data-animate className="glass mt-10 rounded-3xl px-5 py-2 sm:px-7">
          <h3 className="eyebrow pt-5 pb-1 text-sand">Booking terms</h3>
          <TermsList terms={terms} />
        </section>
      )}

      <div data-animate className="mt-6">
        <label className="group flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={form.agree}
            onChange={(e) => update({ agree: e.target.checked })}
            {...err("agree", errors.agree)}
          />
          <span
            aria-hidden
            className={clsx(
              "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sand",
              form.agree ? "border-sand bg-sand text-espresso" : "border-sand/40 group-hover:border-sand",
            )}
          >
            <Check className={clsx("size-4 transition-opacity", form.agree ? "opacity-100" : "opacity-0")} strokeWidth={3} />
          </span>
          <span className="text-sm leading-relaxed text-cream/80">
            I have read and agree to Caprea&apos;s booking terms, including the {catalog.settings.deposit_percent}%
            non-refundable deposit.
          </span>
        </label>
        <FieldError id="agree-error">{errors.agree}</FieldError>
      </div>
    </div>
  );
}
