"use client";

import { CaretUp, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Catalog } from "@/lib/types";
import { aed, type Quote } from "@/lib/pricing";
import type { BookingForm } from "./model";
import { formatEventDate, formatTime } from "./model";
import { TermsList } from "./step-contact";

const KIND_TITLE = { package: "Package booking", per_cup: "Order by the cup", custom: "Custom request" } as const;

type Props = { form: BookingForm; catalog: Catalog; quote: Quote };

export function SummaryBody({ form, catalog, quote }: Props) {
  const pkg = form.kind === "package" ? catalog.packages.find((p) => p.id === form.packageId) : undefined;
  const bySlug = new Map(catalog.menu.map((m) => [m.slug, m]));
  const drinks = Object.entries(form.drinks)
    .filter(([, n]) => n > 0)
    .map(([slug, n]) => ({ name: bySlug.get(slug)?.name ?? slug, n }));
  const estimate = form.kind === "custom";
  const region = catalog.regions.find((r) => r.id === form.regionId);

  return (
    <div>
      <p className="eyebrow text-espresso/55">Your booking</p>
      <p className="mt-2 font-sans text-xl leading-tight font-semibold tracking-normal text-espresso">
        {form.kind ? KIND_TITLE[form.kind] : "Getting started"}
      </p>

      {pkg && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-secondary/70 p-4">
          <span className="font-sans text-3xl leading-none font-semibold text-espresso">{pkg.guests}</span>
          <span className="text-sm text-espresso">
            guests · {pkg.name}
            <span className="block text-xs text-muted-foreground">
              {pkg.max_signature_drinks} signature drinks · {pkg.cups_per_drink} cups each
            </span>
          </span>
        </div>
      )}

      {(form.eventDate || region) && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {form.eventDate && formatEventDate(form.eventDate)}
          {form.startTime && ` · ${formatTime(form.startTime)}`}
          {region && <span className="block">{region.name}</span>}
        </p>
      )}

      {drinks.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">Drinks</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {drinks.map((d) => (
              <li key={d.name} className="rounded-full border bg-card px-3 py-1 text-xs text-espresso">
                {d.name}
                {form.kind === "custom" && <span className="text-muted-foreground"> × {d.n}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator className="my-5" />

      {quote.lines.length === 0 ? (
        <p className="text-sm text-muted-foreground">Your selections and live price will appear here.</p>
      ) : (
        <ul className="space-y-3">
          {quote.lines.map((l, i) => (
            <li key={`${l.label}-${i}`} className="flex items-start justify-between gap-4 text-sm">
              <span className="min-w-0 text-espresso">
                {l.label}
                {l.detail && <span className="block text-xs text-muted-foreground">{l.detail}</span>}
              </span>
              <span className="shrink-0 text-espresso tabular-nums">{l.amount == null ? "On request" : aed(l.amount)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 rounded-2xl bg-secondary/70 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-espresso">{estimate ? "Estimated total" : "Total"}</span>
          <span className="font-sans text-2xl font-semibold whitespace-nowrap text-espresso tabular-nums">{aed(quote.total)}</span>
        </div>
        {estimate ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            An estimate from our menu prices. Our team will confirm your final quote.
          </p>
        ) : (
          <div className="mt-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{catalog.settings.deposit_percent}% deposit to secure your date</span>
            <span className="font-medium text-espresso tabular-nums">{aed(quote.deposit)}</span>
          </div>
        )}
        {quote.hasOnRequest && (
          <p className="mt-2 text-xs text-muted-foreground">Items &ldquo;on request&rdquo; are priced separately.</p>
        )}
      </div>

      {catalog.settings.terms?.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="link" size="sm" className="mt-3 h-auto px-0 text-muted-foreground hover:text-espresso">
              <ShieldCheck weight="light" className="size-4" /> Booking terms
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl bg-card p-6 sm:max-w-lg sm:p-8">
            <DialogTitle className="font-sans text-xl font-semibold tracking-normal text-espresso">Booking terms</DialogTitle>
            <TermsList terms={catalog.settings.terms} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/** Sticky card on desktop. */
export function SummaryCard(props: Props) {
  return (
    <aside aria-label="Booking summary" className="sticky top-24 hidden self-start lg:block">
      <div className="rounded-3xl border bg-card p-7 shadow-[0_24px_60px_-40px_rgba(54,31,24,.35)]">
        <SummaryBody {...props} />
      </div>
    </aside>
  );
}

/** Mobile: bottom bar with total + deposit always visible; opens the full summary in a bottom sheet. */
export function SummarySheet(props: Props) {
  const estimate = props.form.kind === "custom";
  const { total, deposit } = props.quote;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 shadow-[0_-16px_40px_-24px_rgba(54,31,24,.35)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{estimate ? "Estimated total" : "Total"}</p>
          <p className="flex min-w-0 items-baseline gap-2">
            <span className="font-sans text-xl leading-tight font-semibold whitespace-nowrap text-espresso tabular-nums">{aed(total)}</span>
            {!estimate && total > 0 && (
              <span className="truncate text-xs text-muted-foreground">Deposit {aed(deposit)}</span>
            )}
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="shrink-0">
              Summary <CaretUp weight="bold" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] gap-0 rounded-t-3xl bg-card p-0">
            <SheetTitle className="sr-only">Booking summary</SheetTitle>
            <SheetDescription className="sr-only">Your selections, total and deposit.</SheetDescription>
            <span aria-hidden className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />
            <div className="overflow-y-auto px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <SummaryBody {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
