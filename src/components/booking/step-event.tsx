"use client";

import clsx from "clsx";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { aed } from "@/lib/pricing";
import { EventDatePicker } from "./date-picker";
import { EVENT_TYPES, START_TIMES, earliestEventDate, formatEventDate, formatTime, latestEventDate } from "./model";
import { FieldError, Label, StepHeader, type StepProps } from "./ui";

function SelectShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-sand" />
    </div>
  );
}

const err = (id: string, msg?: string) =>
  msg ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};

export function StepEvent({ form, update, catalog, errors }: StepProps) {
  const { settings, regions } = catalog;
  const earliest = earliestEventDate(settings.min_notice_days);
  const latest = latestEventDate();

  return (
    <div>
      <StepHeader eyebrow="Your event" title="When & where?">
        We need at least {settings.min_notice_days} days&apos; notice. Service runs for {settings.service_hours} hours from
        your start time, including set-up.
      </StepHeader>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <fieldset data-animate className="glass rounded-3xl p-5 sm:p-7">
          <legend className="sr-only">Event date</legend>
          <EventDatePicker
            value={form.eventDate}
            onChange={(d) => update({ eventDate: d })}
            earliest={earliest}
            latest={latest}
            invalid={!!errors.eventDate}
            describedBy={errors.eventDate ? "eventDate-error" : undefined}
          />
          <div className="mt-5 flex items-center gap-3 border-t border-sand/15 pt-5 text-sm">
            <CalendarDays className="size-4 shrink-0 text-sand" />
            <span className={form.eventDate ? "text-cream" : "text-cream/45"}>
              {form.eventDate ? formatEventDate(form.eventDate) : "Select a date"}
            </span>
          </div>
          <FieldError id="eventDate-error">{errors.eventDate}</FieldError>
        </fieldset>

        <div className="space-y-6">
          <div data-animate>
            <Label htmlFor="startTime" hint={`${settings.service_hours} h service`}>
              Start time
            </Label>
            <SelectShell>
              <select
                id="startTime"
                className="input appearance-none pr-10"
                value={form.startTime}
                onChange={(e) => update({ startTime: e.target.value })}
                {...err("startTime", errors.startTime)}
              >
                <option value="" disabled>
                  Choose a time
                </option>
                {START_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {formatTime(t)}
                  </option>
                ))}
              </select>
            </SelectShell>
            <FieldError id="startTime-error">{errors.startTime}</FieldError>
          </div>

          <div data-animate>
            <Label htmlFor="eventType">Occasion</Label>
            <SelectShell>
              <select
                id="eventType"
                className="input appearance-none pr-10"
                value={form.eventType}
                onChange={(e) => update({ eventType: e.target.value })}
                {...err("eventType", errors.eventType)}
              >
                <option value="" disabled>
                  What are we celebrating?
                </option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </SelectShell>
            <FieldError id="eventType-error">{errors.eventType}</FieldError>
          </div>

          {form.kind === "custom" && (
            <div data-animate>
              <Label htmlFor="guests">Number of guests</Label>
              <input
                id="guests"
                inputMode="numeric"
                className="input"
                placeholder="e.g. 80"
                value={form.guests}
                onChange={(e) => update({ guests: e.target.value.replace(/\D/g, "").slice(0, 5) })}
                {...err("guests", errors.guests)}
              />
              <FieldError id="guests-error">{errors.guests}</FieldError>
            </div>
          )}

          <fieldset data-animate>
            <legend className="mb-2.5">
              <span className="eyebrow text-sand-300">Emirate</span>
            </legend>
            <div role="radiogroup" aria-label="Emirate" className="grid grid-cols-2 gap-2">
              {regions.map((r) => {
                const on = form.regionId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => update({ regionId: r.id })}
                    className={clsx(
                      "flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand",
                      on ? "border-sand bg-sand/12" : "border-sand/20 bg-espresso-900/40 hover:border-sand/50",
                    )}
                  >
                    <span className={clsx("text-[0.95rem]", on ? "text-cream" : "text-cream/85")}>{r.name}</span>
                    <span className="mt-0.5 text-xs text-sand/80">
                      {r.fee ? `${aed(r.fee)} transport` : "No transport fee"}
                    </span>
                  </button>
                );
              })}
            </div>
            <FieldError id="regionId-error">{errors.regionId}</FieldError>
          </fieldset>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div data-animate>
          <Label htmlFor="address">Venue address</Label>
          <textarea
            id="address"
            rows={4}
            className="input resize-none"
            placeholder="Venue name, area, building / villa, any access notes"
            value={form.address}
            maxLength={500}
            onChange={(e) => update({ address: e.target.value })}
            {...err("address", errors.address)}
          />
          <FieldError id="address-error">{errors.address}</FieldError>
        </div>
        <div data-animate>
          <Label htmlFor="notes" hint="Optional">
            Notes
          </Label>
          <textarea
            id="notes"
            rows={4}
            className="input resize-none"
            placeholder={
              form.kind === "custom"
                ? "Theme, dietary needs, anything you'd like us to know for your quote"
                : "Theme, colours, dietary needs, parking…"
            }
            value={form.notes}
            maxLength={2000}
            onChange={(e) => update({ notes: e.target.value })}
            {...err("notes", errors.notes)}
          />
          <FieldError id="notes-error">{errors.notes}</FieldError>
        </div>
      </div>
    </div>
  );
}
