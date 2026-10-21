import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { RevealImage } from "@/components/site/reveal-image";

export function CtaBand() {
  return (
    <section className="px-3 pb-3 sm:px-6 sm:pb-6">
      <Reveal className="relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-espresso text-cream md:grid-cols-[1.2fr_0.8fr]">
        <div className="p-8 sm:p-14">
          <p className="eyebrow text-sand">Reserve your date</p>
          <h2 className="mt-4 font-display text-4xl uppercase sm:text-6xl">Let&apos;s pour something special</h2>
          <p className="mt-5 max-w-md leading-relaxed text-cream/65">
            Book a package in a few minutes, or tell us what you have in mind and we&apos;ll design a menu for your event.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="sand">
              <Link href="/book">
                Book a package <ArrowUpRight weight="bold" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cream/25 bg-transparent text-cream hover:bg-cream/10 hover:text-cream">
              <Link href="/book?mode=custom">Custom request</Link>
            </Button>
          </div>
        </div>
        <RevealImage className="hidden min-h-72 md:block">
          <Image src="/photos/matcha-cup.webp" alt="Matcha in a Caprea cup" fill sizes="40vw" className="object-cover" />
        </RevealImage>
      </Reveal>
    </section>
  );
}
