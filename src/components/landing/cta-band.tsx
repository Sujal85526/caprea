import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/site/reveal";

/** Rounded espresso card with a ring in the corner: one line, one pill button. */
export function CtaBand({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="px-4 pb-20 sm:px-8 sm:pb-24">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-espresso to-espresso-800 px-6 py-12 text-center text-cream shadow-[0_30px_60px_-30px_rgba(36,20,15,.6)] sm:px-14">
        <span aria-hidden className="pointer-events-none absolute -top-40 -right-24 size-80 rounded-full border-[28px] border-cream/[0.06]" />
        <h2 className="relative font-sans text-[clamp(1.6rem,4vw,2.4rem)] leading-tight font-bold tracking-normal">Bring Caprea to your event</h2>
        <p className="relative mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-cream/80 italic sm:text-base">
          Weddings, graduations and gatherings across the UAE. Book a package online, or message us on WhatsApp for something
          custom.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/book"
            className="label-caps group inline-flex h-11 items-center gap-2 rounded-full bg-cream px-6 text-[0.7rem] text-espresso shadow-sm transition-colors hover:bg-sand"
          >
            Book now <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="label-caps inline-flex h-11 items-center rounded-full border border-cream/30 px-6 text-[0.7rem] transition-colors hover:bg-cream/10"
          >
            WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
