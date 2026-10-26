import type { ReactNode } from "react";
import { MixedTitle, PillLabel } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

/** Title band for inner pages: espresso, a small label, the title and one line. */
export function PageHero({
  label,
  strong,
  light,
  children,
  wide,
}: {
  label: string;
  strong: string;
  light?: string;
  children?: ReactNode;
  /** match the wider booking layout */
  wide?: boolean;
}) {
  return (
    <div className="bg-espresso text-cream">
      <Reveal immediate stagger className={cn("mx-auto pt-12 pb-14 sm:pt-16 sm:pb-20", wide ? "max-w-7xl px-5 sm:px-8" : "max-w-6xl px-6 sm:px-10")}>
        <PillLabel tone="dark">{label}</PillLabel>
        <MixedTitle as="h1" strong={strong} light={light} className="mt-5 text-cream" />
        {children && <p className="mt-4 max-w-xl leading-relaxed text-cream/65">{children}</p>}
      </Reveal>
    </div>
  );
}
