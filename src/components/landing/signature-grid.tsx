import { ArrowLink, SectionHeading } from "@/components/landing/section-heading";
import { ProductTile } from "@/components/menu/product-tile";
import { Reveal } from "@/components/site/reveal";
import type { MenuItem } from "@/lib/types";

/** "The Oasis Edition": the signature drinks guests choose from, as a quiet product grid. */
export function SignatureGrid({ drinks }: { drinks: MenuItem[] }) {
  return (
    <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <SectionHeading eyebrow="Signature drinks" title="The Oasis Edition" action={<ArrowLink href="/menu">Full menu</ArrowLink>}>
        Your guests choose from our signature drinks; the rest is poured from our specialty coffee bar.
      </SectionHeading>
      <Reveal stagger className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-6">
        {drinks.map((d) => (
          <ProductTile key={d.id} item={d} compact showSignature={false} sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 46vw" />
        ))}
      </Reveal>
    </section>
  );
}
