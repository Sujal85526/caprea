import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/** Small pill label above a heading, e.g. "+ Packages". */
export function PillLabel({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.62rem] font-semibold",
        tone === "dark" ? "bg-cream/10 text-cream" : "bg-espresso/[0.07] text-espresso",
        className,
      )}
    >
      <span aria-hidden>+</span>
      {children}
    </span>
  );
}

/** Heading that pairs a bold word with a light phrase: "**Packages** for every gathering". */
export function MixedTitle({
  strong,
  light,
  as: Tag = "h2",
  className,
}: {
  strong: string;
  light?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={cn("font-sans text-[2rem] leading-[1.08] tracking-[-0.01em] sm:text-5xl", className)}>
      <span className="font-semibold">{strong}</span>
      {light && <span className="font-light"> {light}</span>}
    </Tag>
  );
}

export function SectionHeading({
  label,
  strong,
  light,
  children,
  action,
  className,
  tone = "light",
}: {
  label: string;
  strong: string;
  light?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Reveal className={cn("mb-10 flex flex-col justify-between gap-6 sm:mb-12 md:flex-row md:items-end", className)}>
      <div className="max-w-2xl">
        <PillLabel tone={tone}>{label}</PillLabel>
        <MixedTitle strong={strong} light={light} className={cn("mt-5", tone === "dark" ? "text-cream" : "text-espresso")} />
        {children && <p className={cn("mt-4 leading-relaxed", tone === "dark" ? "text-cream/65" : "text-espresso/60")}>{children}</p>}
      </div>
      {action}
    </Reveal>
  );
}
