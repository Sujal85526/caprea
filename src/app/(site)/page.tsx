import { CtaBand } from "@/components/landing/cta-band";
import { DrinksCarousel } from "@/components/landing/drinks-carousel";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PackageGrid } from "@/components/landing/package-grid";
import { SectionHeading } from "@/components/landing/section-heading";
import { getCatalog } from "@/lib/catalog";

export default async function HomePage() {
  const { menu, packages, settings } = await getCatalog();
  const guests = packages.map((p) => p.guests);

  return (
    <>
      <Hero
        fromPrice={Math.min(...packages.map((p) => p.price))}
        minGuests={Math.min(...guests)}
        maxGuests={Math.max(...guests)}
      />
      <HowItWorks />

      <section id="packages" className="scroll-mt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <SectionHeading label="Packages" strong="Packages" light="for every gathering">
            Cart, barista, waiter and {settings.service_hours} hours of service in every package.
          </SectionHeading>
          <PackageGrid packages={packages} />
        </div>
      </section>

      <DrinksCarousel drinks={menu.filter((m) => m.catering_signature)} />
      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
