import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";

export function Faq({ terms, id }: { terms: { title: string; body: string }[]; id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading eyebrow="Before you book" title="Booking terms" className="mb-0 sm:mb-0">
          The short version of how deposits, timings and changes work.
        </SectionHeading>
        <Reveal>
          <Accordion type="single" collapsible defaultValue="0" className="w-full">
            {terms.map((t, i) => (
              <AccordionItem key={t.title} value={String(i)}>
                <AccordionTrigger className="py-5 text-base text-espresso hover:no-underline">{t.title}</AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">{t.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
