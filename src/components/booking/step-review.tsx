"use client";

import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import type { Quote } from "@/lib/pricing";
import { formatEventDate, formatTime, type StepId } from "./model";
import { SummaryBody } from "./summary";
import { StepHeader, type StepProps } from "./ui";

function Block({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section data-animate className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="eyebrow text-sand">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs tracking-[0.14em] text-cream/60 uppercase transition-colors hover:bg-sand/10 hover:text-sand focus-visible:outline-2 focus-visible:outline-sand"
          aria-label={`Edit ${title.toLowerCase()}`}
        >
          <Pencil className="size-3" /> Edit
        </button>
      </div>
      <dl className="mt-4 space-y-2.5 text-sm">{children}</dl>
    </section>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="text-cream/50">{k}</dt>
      <dd className="text-right text-cream">{v}</dd>
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

      <section data-animate className="glass mt-4 rounded-3xl p-5 sm:p-6 lg:hidden">
        <SummaryBody form={form} catalog={catalog} quote={quote} />
      </section>
    </div>
  );
}
