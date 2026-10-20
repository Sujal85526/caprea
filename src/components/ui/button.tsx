import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "sand" | "outline" | "ghost" | "espresso";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.22em] transition-[transform,background-color,color,border-color] duration-500 ease-(--ease-luxe) active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  sand: "bg-sand text-espresso hover:bg-cream",
  espresso: "bg-espresso text-cream hover:bg-espresso-700",
  outline: "border border-sand/40 text-cream hover:border-sand hover:bg-sand/10",
  ghost: "text-sand hover:text-cream",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };

export function Button({ variant = "sand", className, children, ...props }: Common & ComponentProps<"button">) {
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "sand", className, children, ...props }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
