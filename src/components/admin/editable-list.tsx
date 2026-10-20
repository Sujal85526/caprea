"use client";

import clsx from "clsx";
import { Plus, Trash2, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { deleteRow, reorderRows, setActive } from "@/app/admin/_actions/catalog";
import type { ActionResult } from "@/lib/admin";
import { ConfirmDialog, MoveButtons, PendingBtn, Toggle, move, useAction } from "./client";
import { Btn, Empty } from "./ui";

type Row = { id: string; active: boolean; sort: number };
type Table = "cup_tiers" | "regions" | "extras";

/**
 * Inline-editable list for small catalogue tables (cup tiers, regions, extras):
 * each row is its own little form with save, show/hide, reorder and delete.
 */
export function EditableList<T extends Row, D extends { id?: string; active: boolean }>({
  table,
  rows,
  blank,
  toDraft,
  fields,
  save,
  noun,
  emptyHint,
  gridClass,
}: {
  table: Table;
  rows: T[];
  blank: D;
  toDraft: (row: T) => D;
  fields: (draft: D, set: <K extends keyof D>(k: K, v: D[K]) => void) => ReactNode;
  save: (draft: D) => Promise<ActionResult<{ id: string }>>;
  noun: string;
  emptyHint?: string;
  gridClass: string;
}) {
  const [order, setOrder] = useState(rows);
  const [prevRows, setPrevRows] = useState(rows);
  const [adding, setAdding] = useState(false);
  const [reorderPending, runReorder] = useAction();

  if (rows !== prevRows) {
    setPrevRows(rows);
    setOrder(rows);
  }

  const reorder = async (i: number, dir: -1 | 1) => {
    const prev = order;
    const next = move(order, i, dir);
    setOrder(next);
    const ok = await runReorder(() => reorderRows(table, next.map((r) => r.id)));
    if (!ok) setOrder(prev);
  };

  return (
    <div className="space-y-2">
      {order.length === 0 && !adding && <Empty title={`No ${noun}s yet`}>{emptyHint}</Empty>}
      {order.map((r, i) => (
        <EditableRow
          key={`${r.id}:${r.active}`}
          table={table}
          id={r.id}
          initial={toDraft(r)}
          fields={fields}
          save={save}
          noun={noun}
          gridClass={gridClass}
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
      ))}
      {adding ? (
        <EditableRow
          table={table}
          initial={blank}
          fields={fields}
          save={save}
          noun={noun}
          gridClass={gridClass}
          onCancel={() => setAdding(false)}
          onCreated={() => setAdding(false)}
        />
      ) : (
        <Btn variant="outline" size="sm" onClick={() => setAdding(true)} className="mt-2">
          <Plus className="h-3.5 w-3.5" /> Add {noun}
        </Btn>
      )}
    </div>
  );
}

function EditableRow<D extends { id?: string; active: boolean }>({
  table,
  id,
  initial,
  fields,
  save,
  noun,
  gridClass,
  moveButtons,
  onCancel,
  onCreated,
}: {
  table: Table;
  id?: string;
  initial: D;
  fields: (draft: D, set: <K extends keyof D>(k: K, v: D[K]) => void) => ReactNode;
  save: (draft: D) => Promise<ActionResult<{ id: string }>>;
  noun: string;
  gridClass: string;
  moveButtons?: ReactNode;
  onCancel?: () => void;
  onCreated?: () => void;
}) {
  const [saved, setSaved] = useState(initial);
  const [d, setD] = useState(initial);
  const [pending, run] = useAction();
  const [activePending, runActive] = useAction();
  const [deletePending, runDelete] = useAction();
  const [confirm, setConfirm] = useState(false);
  const set = <K extends keyof D>(k: K, v: D[K]) => setD((x) => ({ ...x, [k]: v }));
  const isNew = !id;
  const dirty = JSON.stringify(d) !== JSON.stringify(saved);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => save({ ...d, id }), {
      success: isNew ? `${capital(noun)} added` : `${capital(noun)} saved`,
      onSuccess: () => {
        setSaved(d);
        onCreated?.();
      },
    });
  };

  return (
    <form
      onSubmit={submit}
      className={clsx(
        "glass flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:p-4",
        isNew && "border-sand/40",
        !d.active && !isNew && "opacity-60",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {moveButtons}
        <div className={clsx("grid min-w-0 flex-1 gap-3", gridClass)}>{fields(d, set)}</div>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-1.5 sm:pt-5">
        {isNew ? (
          <Toggle size="sm" checked={d.active} onChange={(v) => set("active", v as D["active"])} label={<span className="text-xs">Live</span>} />
        ) : (
          <Toggle
            size="sm"
            checked={d.active}
            disabled={activePending}
            label={<span className="text-xs">{d.active ? "Live" : "Hidden"}</span>}
            onChange={async (v) => {
              set("active", v as D["active"]);
              const ok = await runActive(() => setActive(table, id!, v), { success: v ? `${capital(noun)} is live` : `${capital(noun)} hidden` });
              if (ok) setSaved((s) => ({ ...s, active: v }));
              else set("active", !v as D["active"]);
            }}
          />
        )}
        {(dirty || isNew) && (
          <PendingBtn type="submit" size="sm" pending={pending}>
            {isNew ? "Add" : "Save"}
          </PendingBtn>
        )}
        {dirty && !isNew && (
          <Btn size="icon" variant="ghost" onClick={() => setD(saved)} aria-label="Discard changes">
            <X className="h-4 w-4" />
          </Btn>
        )}
        {isNew ? (
          <Btn size="icon" variant="ghost" onClick={onCancel} aria-label="Cancel">
            <X className="h-4 w-4" />
          </Btn>
        ) : (
          <Btn size="icon" variant="ghost" onClick={() => setConfirm(true)} aria-label={`Delete ${noun}`}>
            <Trash2 className="h-4 w-4" />
          </Btn>
        )}
      </div>
      {!isNew && (
        <ConfirmDialog
          open={confirm}
          title={`Delete this ${noun}?`}
          pending={deletePending}
          onClose={() => setConfirm(false)}
          onConfirm={() => runDelete(() => deleteRow(table, id!), { success: `${capital(noun)} deleted`, onSuccess: () => setConfirm(false) })}
        >
          Customers will no longer see it. If you might need it again, hide it instead.
        </ConfirmDialog>
      )}
    </form>
  );
}

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
