import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";
import { SplitTitle } from "@/components/site/split-title";
import { cn } from "@/lib/utils";

/** Section intro: small label, large display title, optional note and an action aligned to the right. */
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
  const dark = tone === "dark";
  return (
    <div className={cn("mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end", className)}>
      <div className="max-w-2xl">
        <Reveal>
          <p className={cn("label", dark ? "text-sand" : "text-espresso/60")}>{eyebrow}</p>
        </Reveal>
        <SplitTitle className={cn("mt-4 font-display text-[2.5rem] leading-[0.95] uppercase sm:text-6xl", dark ? "text-cream" : "text-espresso")}>
          {title}
        </SplitTitle>
        {children && (
          <Reveal>
            <p className={cn("mt-5 max-w-lg leading-relaxed", dark ? "text-cream/70" : "text-espresso/65")}>{children}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal className="shrink-0">{action}</Reveal>}
    </div>
  );
}

/** Quiet arrow link used as a section action. */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("label group/al inline-flex h-10 items-center gap-3 text-espresso", className)}>
      <span className="link-line py-1">{children}</span>
      <span aria-hidden className="transition-transform duration-500 ease-(--ease-luxe) group-hover/al:translate-x-1">
        →
      </span>
    </Link>
  );
}
