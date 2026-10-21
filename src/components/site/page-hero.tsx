import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";

/** Title block for inner pages. */
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Reveal immediate stagger className="mx-auto max-w-6xl px-6 pt-32 pb-10 sm:px-10 sm:pt-40 sm:pb-14">
      <p className="eyebrow text-mocha">{eyebrow}</p>
      <h1 className="mt-4 font-display text-5xl leading-[1] text-espresso uppercase sm:text-7xl">{title}</h1>
      {children && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{children}</p>}
    </Reveal>
  );
}
