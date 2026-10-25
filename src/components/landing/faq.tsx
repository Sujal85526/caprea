import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";

export function Faq({ terms, id }: { terms: { title: string; body: string }[]; id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-espresso/10">
      <div className="mx-auto grid max-w-[90rem] gap-4 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:px-12">
        <SectionHeading eyebrow="Before you book" title="Booking terms" className="mb-6 sm:mb-6 md:items-start">
          The short version of how deposits, timings and changes work.
        </SectionHeading>
        <Reveal>
          <Accordion type="single" collapsible defaultValue="0" className="w-full border-t border-espresso/15">
            {terms.map((t, i) => (
              <AccordionItem key={t.title} value={String(i)} className="border-espresso/15 last:border-b">
                <AccordionTrigger className="items-center gap-6 rounded-none py-6 font-sans text-base tracking-normal text-espresso normal-case hover:no-underline sm:text-lg [&_svg]:text-espresso">
                  <span className="flex items-baseline gap-5">
                    <span className="label text-espresso/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {t.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-[2.35rem] text-base leading-relaxed text-espresso/65">{t.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
