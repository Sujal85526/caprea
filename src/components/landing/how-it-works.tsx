import Image from "next/image";
import { CalendarCheck, Confetti, Package } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";
import { RevealImage } from "@/components/site/reveal-image";

const steps = [
  { Icon: Package, title: "Choose a package", body: "From 30 to 300 guests, or ask us for a custom setup." },
  { Icon: CalendarCheck, title: "Pick drinks & date", body: "Select your signature drinks, treats and extras, then your date." },
  { Icon: Confetti, title: "We pour, you host", body: "Our cart, barista and waiter serve for four hours, setup to pack-down." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-sand/45 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <RevealImage className="mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem] lg:max-w-none">
          <Image src="/photos/barista-cups.webp" alt="Caprea barista holding branded cups" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
        </RevealImage>

        <div>
          <SectionHeading eyebrow="How it works" title="Three easy steps" className="mb-8 sm:mb-10" />
          <Reveal stagger as="ol" className="space-y-3">
            {steps.map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-5 rounded-3xl bg-linen p-5 shadow-[0_18px_40px_-30px_rgba(54,31,24,.5)] sm:p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-espresso text-sand">
                  <Icon className="size-6" weight="light" />
                </span>
                <div>
                  <h3 className="font-display text-xl text-espresso uppercase sm:text-2xl">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
