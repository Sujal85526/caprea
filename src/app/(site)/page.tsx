import { ArrowLink, SectionHeading } from "@/components/landing/section-heading";
import { CtaBand } from "@/components/landing/cta-band";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PackageList } from "@/components/landing/package-list";
import { PhotoStrip } from "@/components/landing/photo-strip";
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

      <section id="packages" className="scroll-mt-20 border-t border-espresso/10">
        <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <SectionHeading eyebrow="Catering packages" title="Choose your package" action={<ArrowLink href="/packages">Compare &amp; terms</ArrowLink>} />
          <PackageList packages={packages} />
        </div>
      </section>

      <HowItWorks />
      <PhotoStrip instagram={settings.instagram} />
      <Story />
      <CtaBand />
    </>
  );
}
