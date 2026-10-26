import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";

export function Faq({ terms, id }: { terms: { title: string; body: string }[]; id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading label="Before you book" strong="Booking" light="terms" className="mb-0 self-start sm:mb-0" />
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {terms.map((t, i) => (
              <AccordionItem key={t.title} value={String(i)} className="border-espresso/10">
                <AccordionTrigger className="min-h-11 py-4 font-sans text-base font-medium tracking-normal text-espresso normal-case hover:no-underline">{t.title}</AccordionTrigger>
                <AccordionContent className="pb-4 text-[0.95rem] leading-relaxed text-espresso/60">{t.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
