import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { SplitTitle } from "@/components/site/split-title";

/** Closing call to action; sits directly above the footer on the same espresso. */
export function CtaBand() {
  return (
    <section className="bg-espresso text-cream">
      <div className="mx-auto max-w-[90rem] px-5 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-20 lg:px-12">
        <Reveal>
          <p className="label text-sand">Reserve your date</p>
        </Reveal>
        <SplitTitle className="mt-5 max-w-5xl font-display text-[clamp(2.6rem,9vw,6.5rem)] leading-[0.92] text-cream uppercase">
          Let&apos;s pour something special
        </SplitTitle>
        <Reveal className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md leading-relaxed text-cream/70">
            Book a package in a few minutes, or tell us what you have in mind and we&apos;ll design a menu for your event.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="sand">
              <Link href="/book">
                Book your event <ArrowUpRight weight="bold" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="light">
              <Link href="/book?mode=custom">Custom request</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
