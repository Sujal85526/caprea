"use client";

import clsx from "clsx";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/admin";
import { Btn, type BtnSize, type BtnVariant } from "./ui";

/**
 * Runs a server action inside a transition and shows a toast with the result.
 * Returns [pending, run]; `run` resolves to true on success.
 */
export function useAction() {
  const [pending, startTransition] = useTransition();
  const run = <T,>(
    action: () => Promise<ActionResult<T>>,
    { success, onSuccess }: { success?: string; onSuccess?: (data: T | undefined) => void } = {},
  ) =>
    new Promise<boolean>((resolve) => {
      startTransition(async () => {
        try {
          const result = await action();
          if (result.ok) {
            if (success) toast.success(success);
            onSuccess?.(result.data);
            resolve(true);
          } else {
            toast.error(result.error);
            resolve(false);
          }
        } catch {
          toast.error("Network error. Please try again.");
          resolve(false);
        }
      });
    });
  return [pending, run] as const;
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={clsx("h-4 w-4 animate-spin", className)} aria-hidden />;
}

export function PendingBtn({
  pending,
  children,
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<"button"> & { pending?: boolean; variant?: BtnVariant; size?: BtnSize }) {
  return (
    <Btn variant={variant} size={size} className={className} disabled={pending || props.disabled} aria-busy={pending} {...props}>
      {pending && <Spinner />}
      {children}
    </Btn>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <label className={clsx("inline-flex cursor-pointer select-none items-center gap-2.5", disabled && "pointer-events-none opacity-50")}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative shrink-0 rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand",
          size === "sm" ? "h-5 w-9" : "h-6 w-11",
          checked ? "bg-sand" : "bg-cream/15",
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 left-0.5 rounded-full shadow transition-transform duration-300 ease-(--ease-luxe)",
            size === "sm" ? "h-4 w-4" : "h-5 w-5",
            checked ? (size === "sm" ? "translate-x-4 bg-espresso" : "translate-x-5 bg-espresso") : "bg-cream/70",
          )}
        />
      </button>
      <span className="text-sm text-cream/80">{label}</span>
    </label>
  );
}

/** Modal confirm dialog built on the native <dialog> element. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Delete",
  pending,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && !pending && onClose()}
      className="m-auto w-[min(92vw,26rem)] rounded-2xl border border-sand/20 bg-espresso-900 p-0 text-cream shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <h2 className="font-sans text-lg font-semibold tracking-normal">{title}</h2>
        {children && <div className="mt-2 text-sm text-cream/65">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={onClose} disabled={pending}>
            Cancel
          </Btn>
          <PendingBtn variant="dangerSolid" pending={pending} onClick={onConfirm}>
            {confirmLabel}
          </PendingBtn>
        </div>
      </div>
    </dialog>
  );
}

/** Number input that keeps a string while typing and reports number | null. */
export function NumberInput({
  value,
  onChange,
  className,
  allowEmpty,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
  value: number | null;
  onChange: (v: number | null) => void;
  allowEmpty?: boolean;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      className={className}
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") return onChange(allowEmpty ? null : 0);
        const n = Number(raw);
        if (!Number.isNaN(n)) onChange(n);
      }}
      {...props}
    />
  );
}

export function MoveButtons({
  onUp,
  onDown,
  disableUp,
  disableDown,
  disabled,
}: {
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-label="Move up"
        onClick={onUp}
        disabled={disabled || disableUp}
        className="rounded-md p-0.5 text-sand/70 hover:bg-sand/10 hover:text-cream disabled:opacity-25"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Move down"
        onClick={onDown}
        disabled={disabled || disableDown}
        className="rounded-md p-0.5 text-sand/70 hover:bg-sand/10 hover:text-cream disabled:opacity-25"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}

export function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = [...list];
  const j = index + dir;
  if (j < 0 || j >= next.length) return list;
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}
