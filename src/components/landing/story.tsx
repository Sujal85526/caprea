import Image from "next/image";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/site/reveal";
import { RevealImage } from "@/components/site/reveal-image";
import { SplitTitle } from "@/components/site/split-title";

const facts = [
  ["Specialty coffee", "Espresso, V60 and signature lattes"],
  ["Ceremonial matcha", "Ceremonial grade, made to order"],
  ["Four hours", "Setup to pack-down, included"],
  ["Across the UAE", "Based in Abu Dhabi"],
];

const gallery = [
  { src: "/photos/v60-pour.webp", alt: "V60 coffee poured into a Caprea cup" },
  { src: "/photos/trio-hands.webp", alt: "Three Caprea smoothies held together" },
  { src: "/photos/cookies-hand.webp", alt: "A hand holding a stack of cookies" },
  { src: "/photos/coconut.webp", alt: "A Caprea branded coconut" },
];

/** Short brand story with a portrait, then a strip of photographs that links to Instagram. */
export function Story({ instagram }: { instagram: string }) {
  return (
    <section className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <RevealImage className="aspect-[4/5] bg-cream">
          <Image src="/photos/barista-cups.webp" alt="A Caprea barista holding branded cups" fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
        </RevealImage>

        <div className="flex flex-col justify-between gap-12">
          <div>
            <Reveal>
              <p className="label text-espresso/60">About Caprea</p>
            </Reveal>
            <SplitTitle className="mt-4 font-display text-[2.5rem] leading-[0.95] text-espresso uppercase sm:text-6xl">
              A café cart for the moments you share
            </SplitTitle>
            <Reveal stagger className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-espresso/70">
              <p>
                Caprea is a specialty coffee and matcha café from Abu Dhabi. We bring our cart, our baristas and our
                recipes to weddings, graduations, birthdays and office gatherings.
              </p>
              <p>Every drink is made to order in front of your guests, so the cart becomes part of the celebration.</p>
            </Reveal>
          </div>

          <Reveal stagger as="dl" className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-espresso/15 pt-8">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-display text-xl text-espresso uppercase sm:text-2xl">{k}</dt>
                <dd className="mt-1 text-sm text-espresso/60">{v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <div className="mt-24 sm:mt-32">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SplitTitle className="font-display text-3xl text-espresso uppercase sm:text-5xl">Made to be shared</SplitTitle>
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            className="label group inline-flex h-10 items-center gap-2 text-espresso"
          >
            <InstagramLogo className="size-4" /> <span className="link-line py-1">@{instagram}</span>
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {gallery.map((p, i) => (
            <RevealImage key={p.src} delay={i * 0.08} className="group aspect-[3/4] bg-cream">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 24vw, 48vw"
                className="object-cover transition-transform duration-1000 ease-(--ease-luxe) group-hover:scale-[1.04]"
              />
            </RevealImage>
          ))}
        </div>
      </div>
    </section>
  );
}
