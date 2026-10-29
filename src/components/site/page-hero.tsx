import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";

/** Centred title block for inner pages: an italic line, a heavy uppercase title and one paragraph. */
export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Reveal immediate stagger className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-32 pb-10 text-center sm:pt-44 sm:pb-14">
      {eyebrow && <p className="text-lg text-espresso/65 italic sm:text-xl">{eyebrow}</p>}
      <h1 className="display mt-3 text-[clamp(2.6rem,8vw,5.25rem)] text-espresso">{title}</h1>
      {children && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-espresso/70">{children}</p>}
    </Reveal>
  );
}
