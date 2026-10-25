import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";
import { SplitTitle } from "@/components/site/split-title";
import { cn } from "@/lib/utils";

/** Title block for inner pages: a large display title on linen with the intro set to the right. */
export function PageHero({
  eyebrow,
  title,
  children,
  compact,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  /** smaller title, for pages where the content should start near the top */
  compact?: boolean;
}) {
  return (
    <header className={cn("mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12", compact ? "pt-28 pb-10 sm:pt-32 sm:pb-14" : "pt-32 pb-14 sm:pt-40 sm:pb-20")}>
      <Reveal immediate>
        <p className="label text-espresso/60">{eyebrow}</p>
      </Reveal>
      <div className={cn("mt-5 grid gap-8 border-b border-espresso/15 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16", compact ? "pb-8 sm:pb-10" : "pb-10 sm:pb-14")}>
        <SplitTitle
          as="h1"
          immediate
          className={cn(
            "font-display leading-[0.9] text-espresso uppercase",
            compact ? "text-[clamp(2.6rem,10vw,5.5rem)]" : "text-[clamp(2.6rem,11vw,8rem)]",
          )}
        >
          {title}
        </SplitTitle>
        {children && (
          <Reveal immediate delay={0.2}>
            <p className="max-w-md leading-relaxed text-espresso/70 sm:text-lg lg:ml-auto">{children}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
