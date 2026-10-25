import { ArrowLink, SectionHeading } from "@/components/landing/section-heading";
import { CtaBand } from "@/components/landing/cta-band";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ImageBand } from "@/components/landing/image-band";
import { PackageList } from "@/components/landing/package-list";
import { SignatureGrid } from "@/components/landing/signature-grid";
import { Story } from "@/components/landing/story";
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
      <SignatureGrid drinks={menu.filter((m) => m.catering_signature)} />
      <ImageBand src="/photos/matcha-foam.webp" alt="Freshly whisked matcha foam" eyebrow="Ceremonial-grade matcha">
        Made fresh, cup by cup
      </ImageBand>

      <section id="packages" className="mx-auto max-w-[90rem] scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <SectionHeading eyebrow="Catering packages" title="Choose your package" action={<ArrowLink href="/packages">Compare &amp; terms</ArrowLink>} />
        <PackageList packages={packages} />
      </section>

      <HowItWorks />
      <Story instagram={settings.instagram} />
      <Faq terms={settings.terms} />
      <CtaBand />
    </>
  );
}
