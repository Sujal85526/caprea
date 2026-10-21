"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Card with a soft light that follows the pointer. */
export function SpotlightCard({ className, children, ...props }: ComponentProps<"article">) {
  return (
    <article
      {...props}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn("group/spot", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--x) var(--y), rgba(210,184,158,.22), transparent 65%)" }}
      />
      {children}
    </article>
  );
}
