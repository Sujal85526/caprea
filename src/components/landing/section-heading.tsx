import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  children,
  action,
  className,
  tone = "light",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Reveal className={cn("mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end", className)}>
      <div className="max-w-xl">
        <p className={cn("eyebrow", tone === "dark" ? "text-sand" : "text-mocha")}>{eyebrow}</p>
        <h2 className={cn("mt-4 font-display text-4xl uppercase sm:text-5xl", tone === "dark" ? "text-cream" : "text-espresso")}>{title}</h2>
        {children && <p className={cn("mt-4 leading-relaxed", tone === "dark" ? "text-cream/65" : "text-muted-foreground")}>{children}</p>}
      </div>
      {action}
    </Reveal>
  );
}
