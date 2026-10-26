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
  const { menu, settings } = await getCatalog();

  return (
    <>
      <PageHero label="Menu" strong="Our" light="menu">
        Everything we pour at the café and at your events.
      </PageHero>
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-4 sm:px-10 sm:pt-10">
        <MenuBoard items={menu} />
      </div>
      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
