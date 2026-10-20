"use client";

import clsx from "clsx";
import { GripVertical, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { deleteRow, reorderRows, savePackage, setActive } from "@/app/admin/_actions/catalog";
import type { Package } from "@/lib/types";
import { ConfirmDialog, MoveButtons, NumberInput, PendingBtn, Toggle, move, useAction } from "./client";
import { aed } from "./format";
import { Btn, Empty, Field, Pill, inputCls } from "./ui";

type Draft = Omit<Package, "id" | "sort"> & { id?: string };

const blank: Draft = {
  name: "",
  guests: 50,
  max_signature_drinks: 2,
  cups_per_drink: 25,
  price: 0,
  includes: ["Caprea's cart", "1 barista & 1 waiter", "4 hours of service"],
  featured: false,
  active: true,
};

export function PackagesEditor({ packages }: { packages: Package[] }) {
  const [order, setOrder] = useState(packages);
  const [prevPackages, setPrevPackages] = useState(packages);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [reorderPending, runReorder] = useAction();

  // Re-sync when the server sends fresh data (after a save or refresh).
  if (packages !== prevPackages) {
    setPrevPackages(packages);
    setOrder(packages);
  }

  const reorder = async (index: number, dir: -1 | 1) => {
    const prev = order;
    const next = move(order, index, dir);
    setOrder(next);
    const ok = await runReorder(() => reorderRows("packages", next.map((p) => p.id)));
    if (!ok) setOrder(prev);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Btn onClick={() => setEditing("new")} disabled={editing === "new"}>
          <Plus className="h-4 w-4" /> New package
        </Btn>
      </div>

      {editing === "new" && <PackageForm initial={blank} onDone={() => setEditing(null)} />}

      {order.length === 0 && editing !== "new" && <Empty title="No packages yet">Create your first catering package.</Empty>}

      <ul className="space-y-3">
        {order.map((p, i) =>
          editing === p.id ? (
            <li key={p.id}>
              <PackageForm initial={p} onDone={() => setEditing(null)} />
            </li>
          ) : (
            <li key={p.id}>
              <PackageRow
                key={`${p.id}:${p.active}`}
                pkg={p}
                onEdit={() => setEditing(p.id)}
                moveButtons={
                  <MoveButtons
                    disabled={reorderPending}
                    disableUp={i === 0}
                    disableDown={i === order.length - 1}
                    onUp={() => reorder(i, -1)}
                    onDown={() => reorder(i, 1)}
                  />
                }
              />
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

function PackageRow({ pkg: p, onEdit, moveButtons }: { pkg: Package; onEdit: () => void; moveButtons: React.ReactNode }) {
  const [active, setActiveState] = useState(p.active);
  const [activePending, runActive] = useAction();
  const [deletePending, runDelete] = useAction();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className={clsx("glass flex items-stretch gap-3 rounded-2xl p-4 sm:gap-5 sm:p-5", !active && "opacity-60")}>
      <div className="flex items-center text-sand/30">
        <GripVertical className="hidden h-4 w-4 sm:block" aria-hidden />
        {moveButtons}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-sans text-lg font-medium tracking-normal text-cream">{p.name}</h3>
          {p.featured && (
            <Pill tone="gold">
              <Star className="h-3 w-3" /> Featured
            </Pill>
          )}
          {!active && <Pill tone="muted">Hidden</Pill>}
        </div>
        <p className="mt-1 text-sm text-cream/60">
          {p.guests} guests · up to {p.max_signature_drinks} signature drinks · {p.cups_per_drink} cups per drink
        </p>
        {p.includes.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {p.includes.map((inc, i) => (
              <Pill key={i} tone="muted">
                {inc}
              </Pill>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end justify-between gap-3">
        <p className="font-display text-2xl text-cream sm:text-3xl">{aed(p.price)}</p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Toggle
            size="sm"
            checked={active}
            disabled={activePending}
            label={<span className="text-xs">{active ? "Live" : "Hidden"}</span>}
            onChange={async (v) => {
              setActiveState(v);
              const ok = await runActive(() => setActive("packages", p.id, v), { success: v ? "Package is live" : "Package hidden" });
              if (!ok) setActiveState(!v);
            }}
          />
          <Btn size="icon" variant="ghost" onClick={onEdit} aria-label={`Edit ${p.name}`}>
            <Pencil className="h-4 w-4" />
          </Btn>
          <Btn size="icon" variant="ghost" onClick={() => setConfirm(true)} aria-label={`Delete ${p.name}`}>
            <Trash2 className="h-4 w-4" />
          </Btn>
        </div>
      </div>
      <ConfirmDialog
        open={confirm}
        title={`Delete the ${p.name} package?`}
        pending={deletePending}
        onClose={() => setConfirm(false)}
        onConfirm={() => runDelete(() => deleteRow("packages", p.id), { success: "Package deleted", onSuccess: () => setConfirm(false) })}
      >
        Customers will no longer see it. If bookings already use it, hide it instead.
      </ConfirmDialog>
    </div>
  );
}

function PackageForm({ initial, onDone }: { initial: Draft; onDone: () => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [newInclude, setNewInclude] = useState("");
  const [pending, run] = useAction();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const addInclude = () => {
    const v = newInclude.trim();
    if (!v) return;
    set("includes", [...d.includes, v]);
    setNewInclude("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(
      () =>
        savePackage({
          id: d.id,
          name: d.name,
          guests: d.guests,
          max_signature_drinks: d.max_signature_drinks,
          cups_per_drink: d.cups_per_drink,
          price: d.price,
          includes: d.includes,
          featured: d.featured,
          active: d.active,
        }),
      { success: d.id ? "Package saved" : "Package created", onSuccess: onDone },
    );
  };

  return (
    <form onSubmit={submit} className="glass rounded-2xl border-sand/40 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-sans text-base font-semibold tracking-normal text-cream">{d.id ? `Edit ${initial.name}` : "New package"}</h3>
        <Btn size="icon" variant="ghost" onClick={onDone} aria-label="Close editor">
          <X className="h-4 w-4" />
        </Btn>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Field label="Name" className="col-span-2">
          <input required className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Celebration" />
        </Field>
        <Field label="Guests">
          <NumberInput required min={1} step={1} className={inputCls} value={d.guests} onChange={(v) => set("guests", v ?? 0)} />
        </Field>
        <Field label="Signature drinks" hint="Max choices">
          <NumberInput
            required
            min={0}
            step={1}
            className={inputCls}
            value={d.max_signature_drinks}
            onChange={(v) => set("max_signature_drinks", v ?? 0)}
          />
        </Field>
        <Field label="Cups per drink">
          <NumberInput required min={0} step={1} className={inputCls} value={d.cups_per_drink} onChange={(v) => set("cups_per_drink", v ?? 0)} />
        </Field>
        <Field label="Price (AED)" className="col-span-2 md:col-span-1">
          <NumberInput required min={0} step="0.01" className={inputCls} value={d.price} onChange={(v) => set("price", v ?? 0)} />
        </Field>
        <div className="col-span-2 md:col-span-4">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-cream/55">What&apos;s included</span>
          <div className="flex flex-wrap gap-2">
            {d.includes.map((inc, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full border border-sand/25 bg-sand/[0.06] py-1 pr-1 pl-3 text-sm">
                <input
                  className="w-auto min-w-0 bg-transparent outline-none"
                  size={Math.max(4, inc.length)}
                  value={inc}
                  aria-label={`Included item ${i + 1}`}
                  onChange={(e) => set("includes", d.includes.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <button
                  type="button"
                  aria-label={`Remove ${inc}`}
                  onClick={() => set("includes", d.includes.filter((_, j) => j !== i))}
                  className="rounded-full p-1 text-sand/60 hover:bg-sand/15 hover:text-cream"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <span className="inline-flex items-center gap-1">
              <input
                className={clsx(inputCls, "w-48 rounded-full py-1.5")}
                placeholder="Add an item…"
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInclude();
                  }
                }}
              />
              <Btn size="icon" variant="outline" onClick={addInclude} aria-label="Add item" disabled={!newInclude.trim()}>
                <Plus className="h-4 w-4" />
              </Btn>
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-sand/10 pt-5">
        <div className="flex flex-wrap gap-5">
          <Toggle checked={d.featured} onChange={(v) => set("featured", v)} label="Featured (highlighted)" />
          <Toggle checked={d.active} onChange={(v) => set("active", v)} label="Visible on website" />
        </div>
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onDone}>
            Cancel
          </Btn>
          <PendingBtn type="submit" pending={pending}>
            {d.id ? "Save package" : "Create package"}
          </PendingBtn>
        </div>
      </div>
    </form>
  );
}
