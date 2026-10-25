import { Reveal } from "@/components/site/reveal";
import { SplitTitle } from "@/components/site/split-title";

const facts = [
  ["Specialty coffee", "Espresso, V60 and signature lattes"],
  ["Ceremonial matcha", "Ceremonial grade, made to order"],
  ["Four hours", "Setup to pack-down, included"],
  ["Across the UAE", "Based in Abu Dhabi"],
];

/** Short "about us" block: a few lines of story and four facts. */
export function Story() {
  return (
    <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="label text-espresso/60">About Caprea</p>
          </Reveal>
          <SplitTitle className="mt-4 font-display text-[2.5rem] leading-[0.95] text-espresso uppercase sm:text-6xl">
            A café cart for the moments you share
          </SplitTitle>
        </div>
        <div className="lg:pt-9">
          <Reveal>
            <p className="max-w-xl text-lg leading-relaxed text-espresso/70">
              Caprea is a specialty coffee and matcha café from Abu Dhabi. We bring our cart, our baristas and our recipes
              to weddings, graduations, birthdays and office gatherings, and make every drink to order in front of your
              guests.
            </p>
          </Reveal>
          <Reveal stagger as="dl" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-espresso/15 pt-8 xl:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-display text-lg text-espresso uppercase sm:text-xl">{k}</dt>
                <dd className="mt-1 text-sm text-espresso/60">{v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
