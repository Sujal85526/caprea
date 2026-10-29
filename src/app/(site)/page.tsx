import { ArcMarquee } from "@/components/landing/arc-marquee";
import { Community } from "@/components/landing/community";
import { CtaBand } from "@/components/landing/cta-band";
import { Detail } from "@/components/landing/detail";
import { Discover } from "@/components/landing/discover";
import { Follow } from "@/components/landing/follow";
import { Hero } from "@/components/landing/hero";
import { Story } from "@/components/landing/story";
import { getCatalog } from "@/lib/catalog";
import { aed } from "@/lib/pricing";

export default async function HomePage() {
  const { menu, packages, settings } = await getCatalog();
  const fromPrice = packages.length ? `From ${aed(Math.min(...packages.map((p) => p.price)))}` : "Sized to your guest count";

  return (
    <>
      <Hero />
      <Story />
      <ArcMarquee />
      <Detail />
      <Community drinks={menu.filter((m) => m.catering_signature)} />
      <Discover fromLabel={fromPrice} />
      <Follow instagram={settings.instagram} />
      <CtaBand />
    </>
  );
}
