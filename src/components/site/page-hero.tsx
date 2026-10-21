import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";
import { SplitTitle } from "@/components/site/split-title";

/** Title block for inner pages. */
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="relative mb-12 overflow-hidden rounded-b-[3rem] bg-espresso text-cream sm:mb-16">
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-mocha/50 blur-3xl" />
      <div aria-hidden className="absolute inset-0 grain" />
      <Reveal immediate stagger className="relative mx-auto max-w-6xl px-6 pt-32 pb-14 sm:px-10 sm:pt-40 sm:pb-20">
        <p className="eyebrow text-sand">{eyebrow}</p>
        <SplitTitle as="h1" immediate className="mt-4 font-display text-5xl leading-[1] text-cream uppercase sm:text-7xl">{title}</SplitTitle>
        {children && <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">{children}</p>}
      </Reveal>
    </div>
  );
}
