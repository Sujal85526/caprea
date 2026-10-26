import { CalendarCheck, Coffee, Package } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";

const steps = [
  { Icon: Package, title: "Pick a package", body: "Sized to your guest count." },
  { Icon: Coffee, title: "Choose your drinks", body: "Signature drinks, treats and extras." },
  { Icon: CalendarCheck, title: "Book your date", body: "Confirmed instantly. We do the rest." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading label="How it works" strong="Simple" light="from start to pour" />
        <Reveal stagger as="ol" className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {steps.map(({ Icon, title, body }) => (
            <li key={title} className="flex items-center gap-4 rounded-3xl bg-cream p-5 sm:p-6 md:flex-col md:items-start md:gap-6">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-espresso/15 text-espresso">
                <Icon className="size-6" weight="light" />
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold tracking-normal text-espresso">{title}</h3>
                <p className="mt-0.5 text-[0.95rem] text-espresso/60">{body}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
