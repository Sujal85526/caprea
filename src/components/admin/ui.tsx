import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import type { BookingKind, BookingStatus, PaymentStatus } from "@/lib/types";

// Shared, presentational building blocks for the admin panel (safe in Server and Client Components).

export const inputCls = "input px-3.5 py-2.5 text-sm";
export const selectCls = "input appearance-none px-3.5 py-2.5 pr-9 text-sm";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,opacity,transform] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand";
const btnVariants = {
  primary: "bg-sand text-espresso hover:bg-cream",
  outline: "border border-sand/30 text-cream hover:border-sand hover:bg-sand/10",
  ghost: "text-sand hover:bg-sand/10 hover:text-cream",
  danger: "border border-rose-400/30 text-rose-200 hover:border-rose-300 hover:bg-rose-500/15",
  dangerSolid: "bg-rose-500/90 text-white hover:bg-rose-500",
} as const;
const btnSizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", icon: "h-8 w-8 text-sm" } as const;

export type BtnVariant = keyof typeof btnVariants;
export type BtnSize = keyof typeof btnSizes;

export function btnCls(variant: BtnVariant = "primary", size: BtnSize = "md", className?: string) {
  return clsx(btnBase, btnVariants[variant], btnSizes[size], className);
}

export function Btn({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: BtnVariant; size?: BtnSize }) {
  return <button type={type} className={btnCls(variant, size, className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className={clsx("relative", className)}>
      <select className={selectCls} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-sand/70" aria-hidden />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-2 text-sand/70">{eyebrow}</p>}
        <h1 className="text-4xl text-cream sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-cream/60">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section className={clsx("glass rounded-2xl p-5 sm:p-6", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionTitle({ children, actions, hint }: { children: ReactNode; actions?: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-sand">{children}</h2>
        {hint && <p className="mt-1 text-xs text-cream/50">{hint}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-cream/55">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-cream/40">{hint}</span>}
    </label>
  );
}

export function Empty({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sand/20 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-sand/60">{icon}</div>}
      <p className="text-cream/80">{title}</p>
      {children && <div className="mt-1 text-sm text-cream/50">{children}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-2xl bg-sand/[0.07]", className)} />;
}

export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

// Status badges ------------------------------------------------------------------

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  request: "Request",
  quoted: "Quoted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-gold/15 text-gold ring-gold/30",
  request: "bg-sky-400/10 text-sky-200 ring-sky-300/25",
  quoted: "bg-violet-400/10 text-violet-200 ring-violet-300/25",
  confirmed: "bg-matcha/15 text-[#c5d6a3] ring-matcha/35",
  completed: "bg-cream/10 text-cream/80 ring-cream/20",
  cancelled: "bg-rose-500/10 text-rose-200 ring-rose-300/25",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  deposit_paid: "Deposit paid",
  paid: "Paid",
  refunded: "Refunded",
};

const PAYMENT_STYLE: Record<PaymentStatus, string> = {
  unpaid: "bg-transparent text-cream/60 ring-cream/20",
  deposit_paid: "bg-gold/10 text-gold ring-gold/30",
  paid: "bg-matcha/15 text-[#c5d6a3] ring-matcha/35",
  refunded: "bg-transparent text-rose-200/80 ring-rose-300/25",
};

export const KIND_LABEL: Record<BookingKind, string> = {
  package: "Package",
  per_cup: "Per cup",
  custom: "Custom",
};

const badgeBase =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] ring-1 ring-inset";

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span className={clsx(badgeBase, STATUS_STYLE[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentBadge({ status, className }: { status: PaymentStatus; className?: string }) {
  return <span className={clsx(badgeBase, PAYMENT_STYLE[status], className)}>{PAYMENT_LABEL[status]}</span>;
}

export function KindBadge({ kind }: { kind: BookingKind }) {
  return <span className={clsx(badgeBase, "bg-transparent text-sand/80 ring-sand/25")}>{KIND_LABEL[kind]}</span>;
}

export function Pill({ children, tone = "sand" }: { children: ReactNode; tone?: "sand" | "matcha" | "muted" | "gold" }) {
  const tones = {
    sand: "bg-sand/10 text-sand ring-sand/25",
    matcha: "bg-matcha/15 text-[#c5d6a3] ring-matcha/35",
    gold: "bg-gold/10 text-gold ring-gold/30",
    muted: "bg-transparent text-cream/45 ring-cream/15",
  };
  return <span className={clsx(badgeBase, "normal-case tracking-[0.04em]", tones[tone])}>{children}</span>;
}
