"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FieldError, Label, StepHeader, fieldClass, type StepProps } from "./ui";

const err = (id: string, msg?: string) =>
  msg ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};

export function TermsList({ terms }: { terms: { title: string; body: string }[] }) {
  return (
    <Accordion type="single" collapsible>
      {terms.map((t, i) => (
        <AccordionItem key={t.title} value={`term-${i}`}>
          <AccordionTrigger className="gap-4 py-4 text-[0.95rem] font-normal text-espresso hover:no-underline">
            <span className="flex items-baseline gap-3">
              <span className="text-xs text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              {t.title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-8 text-sm leading-relaxed text-muted-foreground">{t.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
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

      <div className="relative grid gap-6 md:grid-cols-2">
        <div data-animate className="md:col-span-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            className={fieldClass}
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
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
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
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className={fieldClass}
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
        <section id="booking-terms" data-animate className="mt-10 rounded-3xl border bg-card px-5 py-2 sm:px-7">
          <h3 className="eyebrow pt-5 pb-1 font-sans text-mocha">Booking terms</h3>
          <TermsList terms={terms} />
        </section>
      )}

      <div data-animate className="mt-6">
        <div className="flex items-start gap-3">
          <Checkbox
            id="agree"
            checked={form.agree}
            onCheckedChange={(v) => update({ agree: v === true })}
            className="mt-0.5 size-5 rounded-md border-input bg-card [&_svg]:size-3.5"
            {...err("agree", errors.agree)}
          />
          <label htmlFor="agree" className="cursor-pointer text-sm leading-relaxed text-espresso/85">
            I have read and agree to Caprea&apos;s booking terms, including the {catalog.settings.deposit_percent}%
            non-refundable deposit.
          </label>
        </div>
        <FieldError id="agree-error">{errors.agree}</FieldError>
      </div>
    </div>
  );
}
