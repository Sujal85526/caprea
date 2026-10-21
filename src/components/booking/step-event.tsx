"use client";

import { CalendarBlank } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { aed } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { EventDatePicker } from "./date-picker";
import { EVENT_TYPES, START_TIMES, earliestEventDate, formatEventDate, formatTime, latestEventDate } from "./model";
import { FieldError, Label, StepHeader, fieldClass, optionClass, type StepProps } from "./ui";

const err = (id: string, msg?: string) =>
  msg ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};

const triggerClass = cn(fieldClass, "w-full data-[size=default]:h-12 [&>svg]:text-espresso");

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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <fieldset data-animate className="min-w-0 rounded-3xl border bg-card p-4 sm:p-6">
          <legend className="sr-only">Event date</legend>
          <EventDatePicker
            value={form.eventDate}
            onChange={(d) => update({ eventDate: d })}
            earliest={earliest}
            latest={latest}
            invalid={!!errors.eventDate}
            describedBy={errors.eventDate ? "eventDate-error" : undefined}
          />
          <div className="mt-4 flex items-center gap-3 border-t pt-4 text-sm">
            <CalendarBlank className="size-5 shrink-0 text-mocha" weight="light" />
            <span className={form.eventDate ? "font-medium text-espresso" : "text-muted-foreground"}>
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
            <Select value={form.startTime} onValueChange={(v) => update({ startTime: v })}>
              <SelectTrigger id="startTime" className={triggerClass} {...err("startTime", errors.startTime)}>
                <SelectValue placeholder="Choose a time" />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-72 rounded-2xl">
                {START_TIMES.map((t) => (
                  <SelectItem key={t} value={t} className="rounded-lg py-2 pl-3 text-sm">
                    {formatTime(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="startTime-error">{errors.startTime}</FieldError>
          </div>

          <div data-animate>
            <Label htmlFor="eventType">Occasion</Label>
            <Select value={form.eventType} onValueChange={(v) => update({ eventType: v })}>
              <SelectTrigger id="eventType" className={triggerClass} {...err("eventType", errors.eventType)}>
                <SelectValue placeholder="What are we celebrating?" />
              </SelectTrigger>
              <SelectContent position="popper" className="rounded-2xl">
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="rounded-lg py-2 pl-3 text-sm">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="eventType-error">{errors.eventType}</FieldError>
          </div>

          {form.kind === "custom" && (
            <div data-animate>
              <Label htmlFor="guests">Number of guests</Label>
              <Input
                id="guests"
                inputMode="numeric"
                className={fieldClass}
                placeholder="e.g. 80"
                value={form.guests}
                onChange={(e) => update({ guests: e.target.value.replace(/\D/g, "").slice(0, 5) })}
                {...err("guests", errors.guests)}
              />
              <FieldError id="guests-error">{errors.guests}</FieldError>
            </div>
          )}

          <fieldset data-animate>
            <legend className="mb-2 text-sm font-medium text-espresso">Emirate</legend>
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
                    className={cn("flex flex-col items-start rounded-2xl px-4 py-3", optionClass(on))}
                  >
                    <span className="text-[0.95rem] font-medium text-espresso">{r.name}</span>
                    <span className="mt-0.5 text-xs text-muted-foreground">
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
          <Textarea
            id="address"
            rows={4}
            className={cn(fieldClass, "h-auto min-h-28 resize-none py-3 [field-sizing:fixed]")}
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
          <Textarea
            id="notes"
            rows={4}
            className={cn(fieldClass, "h-auto min-h-28 resize-none py-3 [field-sizing:fixed]")}
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
