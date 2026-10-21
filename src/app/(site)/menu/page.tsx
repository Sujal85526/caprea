import type { Metadata } from "next";
import { MenuBoard } from "@/components/menu/menu-board";
import { CtaBand } from "@/components/landing/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Menu",
  description: "Specialty coffee, matcha, smoothies, refreshers and desserts from Caprea, Abu Dhabi.",
};

export default async function MenuPage() {
  const { menu } = await getCatalog();

  return (
    <>
      <PageHero eyebrow="The Oasis Edition" title="Our menu">
        Everything we pour at the café and at your events. Catering packages are built from our signature drinks and
        coffee selection.
      </PageHero>
      <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-10 sm:pb-28">
        <MenuBoard items={menu} />
      </div>
      <CtaBand />
    </>
  );
}
