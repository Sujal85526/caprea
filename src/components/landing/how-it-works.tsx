import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";

const steps = [
  { title: "Choose a package", body: "From 30 to 300 guests, or tell us what you have in mind for a custom setup." },
  { title: "Pick drinks & date", body: "Select your signature drinks, treats and extras, then your date and venue." },
  { title: "We pour, you host", body: "Our cart, barista and waiter serve for four hours, from setup to pack-down." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-cream">
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <SectionHeading eyebrow="How it works" title="Three easy steps" />
        <Reveal stagger as="ol" className="grid gap-8 md:grid-cols-3 md:gap-8 lg:gap-12">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-espresso pt-6">
              <span className="label text-espresso/60 tabular-nums">Step {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-2xl text-espresso uppercase sm:text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-espresso/65">{s.body}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
