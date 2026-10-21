import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Coffee, Leaf, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { aed } from "@/lib/pricing";

const facts = [
  { Icon: Coffee, label: "Specialty coffee" },
  { Icon: Leaf, label: "Ceremonial matcha" },
  { Icon: Clock, label: "4 hours of service" },
  { Icon: MapPin, label: "Across the UAE" },
];

export function Hero({ fromPrice, minGuests, maxGuests }: { fromPrice: number; minGuests: number; maxGuests: number }) {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal immediate stagger className="order-2 lg:order-1">
          <p className="eyebrow text-mocha">Coffee &amp; matcha catering · Abu Dhabi</p>
          <h1 className="mt-5 font-display text-[2.9rem] leading-[1] text-espresso uppercase sm:text-6xl lg:text-7xl">
            Poured for <br className="hidden sm:block" />
            your moments
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Caprea brings its coffee cart, a barista and our signature drinks to weddings, graduations and gatherings.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/book">
                Book your event <ArrowUpRight weight="bold" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/packages">View packages</Link>
            </Button>
          </div>
          <ul className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3">
            {facts.map(({ Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-espresso/80">
                <Icon className="size-5 text-mocha" weight="light" /> {label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal immediate delay={0.15} className="relative order-1 mx-auto w-full max-w-[17rem] sm:max-w-[22rem] lg:order-2 lg:max-w-[26rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-[2rem] bg-cream-200">
            <Image
              src="/photos/strawberry-matcha.webp"
              alt="Strawberry matcha in a Caprea cup"
              fill
              priority
              sizes="(min-width: 1024px) 26rem, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:-left-10 sm:w-36 lg:w-40">
            <div className="relative aspect-[4/5]">
              <Image src="/photos/iced-latte-pour.webp" alt="Milk poured into an iced latte" fill sizes="160px" className="object-cover" />
            </div>
          </div>
          <div className="absolute top-6 -right-2 rounded-2xl bg-card px-4 py-3 shadow-lg sm:-right-6">
            <p className="eyebrow text-[0.6rem] text-muted-foreground">Packages from</p>
            <p className="font-display text-2xl text-espresso">{aed(fromPrice)}</p>
            <p className="text-xs text-muted-foreground">
              {minGuests} – {maxGuests} guests
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
