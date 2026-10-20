import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { MenuBoard } from "@/components/menu/menu-board";
import { PageHero } from "@/components/site/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Menu",
  description: "Specialty coffee, matcha, smoothies, refreshers and desserts from Caprea, Abu Dhabi.",
};

export default async function MenuPage() {
  const { menu } = await getCatalog();

  return (
    <div className="bg-espresso pb-32">
      <PageHero eyebrow="The Oasis Edition" title={<>Our <span className="text-sand">menu</span></>}>
        Everything we pour at the café and at your events. Catering packages are built from our signature drinks and
        coffee selection.
      </PageHero>
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <MenuBoard items={menu} />
        <div className="mt-28 flex flex-col items-center gap-6 rounded-[2rem] border border-sand/15 bg-espresso-800 p-10 text-center sm:p-16">
          <h2 className="font-display text-4xl text-cream uppercase sm:text-5xl">Serve these at your event</h2>
          <p className="max-w-lg text-cream/65">Pick a package and choose your signature drinks, or build a custom menu.</p>
          <ButtonLink href="/book">
            Book your event <ArrowUpRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
