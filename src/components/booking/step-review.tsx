"use client";

import { PencilSimple } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Quote } from "@/lib/pricing";
import { formatEventDate, formatTime, type StepId } from "./model";
import { SummaryBody } from "./summary";
import { StepHeader, type StepProps } from "./ui";

function Block({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section data-animate className="rounded-none border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="label font-sans text-espresso/60">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="-mr-2 text-muted-foreground hover:text-espresso"
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          <PencilSimple weight="light" /> Edit
        </Button>
      </div>
      <dl className="mt-3 divide-y text-sm">{children}</dl>
    </section>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-6 py-2.5">
      <dt className="shrink-0 text-muted-foreground">{k}</dt>
      <dd className="min-w-0 text-right text-espresso">{v}</dd>
    </div>
  );
}

export function StepReview({ form, catalog, quote, onEdit }: StepProps & { quote: Quote; onEdit: (s: StepId) => void }) {
  const region = catalog.regions.find((r) => r.id === form.regionId);
  const isRequest = form.kind === "custom";
  return (
    <div>
      <StepHeader eyebrow="Final step" title={isRequest ? "Review your request" : "Review & confirm"}>
        {isRequest
          ? "Check everything below. Our team will review your request and send you a confirmed quote."
          : `Check everything below. Once confirmed, we'll send your ${catalog.settings.deposit_percent}% deposit link to secure your date.`}
      </StepHeader>

      <div className="grid gap-4 md:grid-cols-2">
        <Block title="Event" onEdit={() => onEdit("event")}>
          <Row k="Date" v={form.eventDate ? formatEventDate(form.eventDate) : "—"} />
          <Row k="Start" v={form.startTime ? formatTime(form.startTime) : "—"} />
          <Row k="Occasion" v={form.eventType || "—"} />
          {form.kind === "custom" && <Row k="Guests" v={form.guests || "—"} />}
          <Row k="Emirate" v={region?.name ?? "—"} />
          <Row k="Address" v={<span className="whitespace-pre-line">{form.address || "—"}</span>} />
        </Block>
        <Block title="Contact" onEdit={() => onEdit("contact")}>
          <Row k="Name" v={form.name} />
          <Row k="Phone" v={form.phone} />
          <Row k="Email" v={<span className="break-all">{form.email}</span>} />
          {form.notes && <Row k="Notes" v={<span className="whitespace-pre-line">{form.notes}</span>} />}
        </Block>
      </div>

      <section data-animate className="mt-4 rounded-none border bg-card p-5 sm:p-6 lg:hidden">
        <SummaryBody form={form} catalog={catalog} quote={quote} />
      </section>
    </div>
  );
}
