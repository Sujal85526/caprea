import Link from "next/link";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { MixedTitle, PillLabel } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";

/** Rounded espresso card: book, or talk to us on WhatsApp. */
export function CtaBand({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-10 sm:py-24">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-espresso px-6 py-12 text-cream sm:px-14 sm:py-16">
        {/* Thin-line sunburst in the corner */}
        <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -top-16 -right-16 w-56 text-sand/20 sm:w-72">
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} x1="100" y1="100" x2="100" y2="8" stroke="currentColor" strokeWidth="1.2" transform={`rotate(${i * 15} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="34" fill="var(--color-espresso)" />
        </svg>

        <div className="relative max-w-xl">
          <PillLabel tone="dark">Catering</PillLabel>
          <MixedTitle strong="Bring Caprea" light="to your event" className="mt-5 text-cream" />
          <p className="mt-4 leading-relaxed text-cream/65">
            Weddings, graduations and gatherings across the UAE. Book a package online, or message us for something custom.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
            <Button asChild size="lg" variant="sand">
              <Link href="/book">
                Book your event <ArrowUpRight weight="bold" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cream/30 bg-transparent text-cream hover:bg-cream/10 hover:text-cream">
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
                <WhatsappLogo /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
