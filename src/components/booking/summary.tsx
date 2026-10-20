"use client";

import clsx from "clsx";
import { ChevronUp, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Catalog } from "@/lib/types";
import { aed, type Quote } from "@/lib/pricing";
import type { BookingForm } from "./model";
import { formatEventDate, formatTime } from "./model";
import { useLenis } from "@/components/site/smooth-scroll";
import { TermsList } from "./step-contact";

const KIND_TITLE = { package: "Package booking", per_cup: "Order by the cup", custom: "Custom request" } as const;

export function SummaryBody({ form, catalog, quote }: { form: BookingForm; catalog: Catalog; quote: Quote }) {
  const pkg = form.kind === "package" ? catalog.packages.find((p) => p.id === form.packageId) : undefined;
  const bySlug = new Map(catalog.menu.map((m) => [m.slug, m]));
  const drinks = Object.entries(form.drinks)
    .filter(([, n]) => n > 0)
    .map(([slug, n]) => ({ name: bySlug.get(slug)?.name ?? slug, n }));
  const estimate = form.kind === "custom";
  const region = catalog.regions.find((r) => r.id === form.regionId);
  const termsRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <p className="eyebrow text-sand">Your booking</p>
      <p className="mt-2 font-display text-3xl uppercase leading-none text-cream">
        {form.kind ? KIND_TITLE[form.kind] : "Getting started"}
      </p>

      {pkg && (
        <div className="mt-5 flex items-end gap-3 rounded-2xl border border-sand/15 bg-sand/[0.06] p-4">
          <span className="font-display text-5xl leading-[0.8] text-cream">{pkg.guests}</span>
          <span className="pb-0.5 text-sm text-cream/70">
            guests · {pkg.name}
            <span className="block text-xs text-cream/45">
              {pkg.max_signature_drinks} signature drinks · {pkg.cups_per_drink} cups each
            </span>
          </span>
        </div>
      )}

      {(form.eventDate || region) && (
        <p className="mt-4 text-sm leading-relaxed text-cream/65">
          {form.eventDate && formatEventDate(form.eventDate)}
          {form.startTime && ` · ${formatTime(form.startTime)}`}
          {region && <span className="block">{region.name}</span>}
        </p>
      )}

      {drinks.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow text-[0.6rem] text-cream/45">Drinks</p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {drinks.map((d) => (
              <li key={d.name} className="rounded-full border border-sand/20 px-3 py-1 text-xs text-cream/85">
                {d.name}
                {form.kind === "custom" && <span className="text-sand"> × {d.n}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="my-5 h-px bg-sand/15" />

      {quote.lines.length === 0 ? (
        <p className="text-sm text-cream/45">Your selections and live price will appear here.</p>
      ) : (
        <ul className="space-y-3">
          {quote.lines.map((l, i) => (
            <li key={`${l.label}-${i}`} className="flex items-start justify-between gap-4 text-sm">
              <span className="min-w-0 text-cream/85">
                {l.label}
                {l.detail && <span className="block text-xs text-cream/45">{l.detail}</span>}
              </span>
              <span className="shrink-0 tabular-nums text-cream">{l.amount == null ? "On request" : aed(l.amount)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-2xl bg-sand/[0.08] p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow text-sand-300">{estimate ? "Estimated total" : "Total"}</span>
          <span className="font-display text-3xl text-cream tabular-nums">{aed(quote.total)}</span>
        </div>
        {estimate ? (
          <p className="mt-2 text-xs leading-relaxed text-cream/55">
            An estimate from our menu prices. Our team will confirm your final quote.
          </p>
        ) : (
          <div className="mt-2 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-cream/60">{catalog.settings.deposit_percent}% deposit to secure your date</span>
            <span className="tabular-nums text-sand">{aed(quote.deposit)}</span>
          </div>
        )}
        {quote.hasOnRequest && (
          <p className="mt-2 text-xs text-cream/50">Items &ldquo;on request&rdquo; are priced separately.</p>
        )}
      </div>

      {catalog.settings.terms?.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => termsRef.current?.showModal()}
            className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.12em] text-sand/80 uppercase underline-offset-4 hover:text-sand hover:underline"
          >
            <ShieldCheck className="size-3.5" /> Booking terms
          </button>
          <dialog
            ref={termsRef}
            aria-label="Booking terms"
            onClick={(e) => e.target === termsRef.current && termsRef.current?.close()}
            className="m-auto w-[min(92vw,34rem)] rounded-3xl border border-sand/20 bg-espresso-800 p-0 text-cream backdrop:bg-espresso-900/70 backdrop:backdrop-blur-sm"
          >
            <div className="p-6 sm:p-8" data-lenis-prevent>
              <div className="flex items-center justify-between">
                <p className="font-display text-3xl uppercase">Booking terms</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => termsRef.current?.close()}
                  className="grid size-9 place-items-center rounded-full border border-sand/25 text-sand hover:bg-sand hover:text-espresso"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <TermsList terms={catalog.settings.terms} />
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}

/** Sticky card on desktop. */
export function SummaryCard(props: { form: BookingForm; catalog: Catalog; quote: Quote }) {
  return (
    <aside aria-label="Booking summary" className="sticky top-28 hidden self-start lg:block">
      <div className="glass relative overflow-hidden rounded-3xl p-7">
        <div className="relative">
          <SummaryBody {...props} />
        </div>
      </div>
    </aside>
  );
}

/** Bottom bar + expandable sheet on mobile. */
export function SummarySheet(props: { form: BookingForm; catalog: Catalog; quote: Quote }) {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const estimate = props.form.kind === "custom";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <div className="lg:hidden">
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={clsx(
          "fixed inset-0 z-40 bg-espresso-900/70 backdrop-blur-sm transition-opacity duration-500",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        className={clsx(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-sand/20 bg-espresso-800/95 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform duration-500 ease-(--ease-luxe)",
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="summary-sheet"
          onClick={() => setOpen((o) => !o)}
          className="relative flex w-full items-center justify-between gap-4 px-5 pt-5 pb-[max(0.9rem,env(safe-area-inset-bottom))] text-left"
        >
          <span aria-hidden className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-sand/30" />
          <span>
            <span className="eyebrow block text-[0.6rem] text-sand">{estimate ? "Estimated total" : "Total"}</span>
            <span className="font-display text-2xl text-cream tabular-nums">{aed(props.quote.total)}</span>
            {!estimate && props.quote.total > 0 && (
              <span className="ml-2 text-xs text-cream/55">Deposit {aed(props.quote.deposit)}</span>
            )}
          </span>
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-sand/30 px-4 py-2.5 text-[0.62rem] text-cream">
            {open ? "Close" : "Summary"}
            <ChevronUp className={clsx("size-3.5 transition-transform duration-500", open && "rotate-180")} />
          </span>
        </button>
        <div
          id="summary-sheet"
          className={clsx(
            "grid transition-[grid-template-rows] duration-500 ease-(--ease-luxe)",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden" inert={!open}>
            <div data-lenis-prevent className="max-h-[68vh] overflow-y-auto border-t border-sand/10 px-5 pt-5 pb-8">
              <SummaryBody {...props} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
