import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/landing/cta-band";
import { DrinksCarousel } from "@/components/landing/drinks-carousel";
import { Faq } from "@/components/landing/faq";
import { Gallery } from "@/components/landing/gallery";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Marquee } from "@/components/landing/marquee";
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
      <Marquee />
      <DrinksCarousel drinks={menu.filter((m) => m.catering_signature)} />
      <HowItWorks />

      <section id="packages" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 xl:max-w-7xl">
          <SectionHeading
            eyebrow="Catering packages"
            title="Choose your package"
            action={
              <Button asChild variant="outline">
                <Link href="/packages">
                  Compare &amp; terms <ArrowRight />
                </Link>
              </Button>
            }
          >
            Every package includes Caprea&apos;s cart, a barista, a waiter and {settings.service_hours} hours of service.
          </SectionHeading>
          <PackageGrid packages={packages} />
        </div>
      </section>

      <Gallery instagram={settings.instagram} />
      <Faq terms={settings.terms} />
      <CtaBand />
    </>
  );
}
