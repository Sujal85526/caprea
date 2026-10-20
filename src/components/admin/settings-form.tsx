"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { saveSettings, type SettingsInput } from "@/app/admin/_actions/settings";
import type { Settings } from "@/lib/types";
import { MoveButtons, NumberInput, PendingBtn, move, useAction } from "./client";
import { Btn, Card, Field, SectionTitle, inputCls } from "./ui";

type Draft = Omit<Settings, "pricing_mode">;

export function SettingsForm({ settings }: { settings: Settings }) {
  const { pricing_mode: _mode, ...rest } = settings;
  void _mode;
  const [saved, setSaved] = useState<Draft>(rest);
  const [d, setD] = useState<Draft>(rest);
  const [pending, run] = useAction();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const dirty = JSON.stringify(d) !== JSON.stringify(saved);

  const setTerm = (i: number, patch: Partial<Draft["terms"][number]>) =>
    set(
      "terms",
      d.terms.map((t, j) => (j === i ? { ...t, ...patch } : t)),
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: SettingsInput = { ...d };
    run(() => saveSettings(input), { success: "Settings saved", onSuccess: () => setSaved(d) });
  };

  return (
    <form onSubmit={submit} className="space-y-6 pb-24">
      <Card>
        <SectionTitle hint="Used to calculate prices and validate bookings on the website.">Booking rules</SectionTitle>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          <Field label="Deposit %" hint="Of the total, due to confirm">
            <NumberInput required min={0} max={100} step={1} className={inputCls} value={d.deposit_percent} onChange={(v) => set("deposit_percent", v ?? 0)} />
          </Field>
          <Field label="Service hours" hint="Included in every booking">
            <NumberInput required min={1} max={24} step={1} className={inputCls} value={d.service_hours} onChange={(v) => set("service_hours", v ?? 0)} />
          </Field>
          <Field label="Extra hour (AED)">
            <NumberInput required min={0} step="0.01" className={inputCls} value={d.extra_hour_price} onChange={(v) => set("extra_hour_price", v ?? 0)} />
          </Field>
          <Field label="Min notice (days)" hint="Earliest bookable date">
            <NumberInput required min={0} step={1} className={inputCls} value={d.min_notice_days} onChange={(v) => set("min_notice_days", v ?? 0)} />
          </Field>
          <Field label="Add-on min qty" hint="Minimum pieces per add-on">
            <NumberInput required min={0} step={1} className={inputCls} value={d.addon_min_qty} onChange={(v) => set("addon_min_qty", v ?? 0)} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle hint="Shown on the website and in customer emails.">Contact details</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone">
            <input required type="tel" className={inputCls} value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+971 52 225 0022" />
          </Field>
          <Field label="WhatsApp number" hint="Digits with country code, e.g. 971522250022">
            <input required inputMode="tel" className={inputCls} value={d.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </Field>
          <Field label="Email">
            <input required type="email" className={inputCls} value={d.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Instagram" hint="Handle without @">
            <input required className={inputCls} value={d.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </Field>
          <Field label="Notification email" hint="New bookings and requests are sent here." className="md:col-span-2">
            <input required type="email" className={inputCls} value={d.notify_email} onChange={(e) => set("notify_email", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle
          hint="Shown to customers before they book."
          actions={
            <Btn size="sm" variant="outline" onClick={() => set("terms", [...d.terms, { title: "", body: "" }])}>
              <Plus className="h-3.5 w-3.5" /> Add term
            </Btn>
          }
        >
          Booking terms
        </SectionTitle>
        {d.terms.length === 0 && <p className="text-sm text-cream/50">No terms yet.</p>}
        <ol className="space-y-3">
          {d.terms.map((t, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-sand/12 bg-espresso-900/30 p-3 sm:p-4">
              <div className="flex flex-col items-center gap-1 pt-1">
                <span className="text-xs tabular-nums text-sand/60">{i + 1}</span>
                <MoveButtons
                  disableUp={i === 0}
                  disableDown={i === d.terms.length - 1}
                  onUp={() => set("terms", move(d.terms, i, -1))}
                  onDown={() => set("terms", move(d.terms, i, 1))}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  required
                  aria-label={`Term ${i + 1} title`}
                  className={`${inputCls} font-medium`}
                  placeholder="Title"
                  value={t.title}
                  onChange={(e) => setTerm(i, { title: e.target.value })}
                />
                <textarea
                  required
                  aria-label={`Term ${i + 1} text`}
                  rows={2}
                  className={`${inputCls} resize-y`}
                  placeholder="Details"
                  value={t.body}
                  onChange={(e) => setTerm(i, { body: e.target.value })}
                />
              </div>
              <Btn
                size="icon"
                variant="ghost"
                aria-label={`Remove term ${i + 1}`}
                onClick={() => set("terms", d.terms.filter((_, j) => j !== i))}
              >
                <Trash2 className="h-4 w-4" />
              </Btn>
            </li>
          ))}
        </ol>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-sand/10 bg-espresso-900/90 backdrop-blur-lg lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <span className="mr-auto text-sm text-cream/55">{dirty ? "You have unsaved changes." : "All changes saved."}</span>
          {dirty && (
            <Btn variant="ghost" onClick={() => setD(saved)}>
              Discard
            </Btn>
          )}
          <PendingBtn type="submit" pending={pending} disabled={!dirty}>
            Save settings
          </PendingBtn>
        </div>
      </div>
    </form>
  );
}
