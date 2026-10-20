import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Addons } from "@/components/home/addons";
import { Cta } from "@/components/home/cta";
import { Experience } from "@/components/home/experience";
import { Gallery } from "@/components/home/gallery";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { PackageCards } from "@/components/home/package-cards";
import { Process } from "@/components/home/process";
import { SignatureDrinks } from "@/components/home/signature-drinks";
import { getCatalog } from "@/lib/catalog";

export default async function HomePage() {
  const { menu, packages, settings } = await getCatalog();

  return (
    <>
      <Hero />
      <Marquee />
      <Experience />
      <SignatureDrinks drinks={menu.filter((m) => m.catering_signature)} />
      <Process />

      <section id="packages" className="relative bg-espresso py-28 lg:py-40">
        <div className="mx-auto max-w-[96rem] px-6 sm:px-10">
          <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow mb-5 text-sand">Catering packages</p>
              <h2 className="font-display text-5xl text-cream uppercase sm:text-7xl">
                Choose your <span className="text-sand">package</span>
              </h2>
            </div>
            <div className="max-w-md text-cream/65">
              <p>
                Every package includes Caprea&apos;s cart, one barista and one waiter, and {settings.service_hours} hours of
                service. Transport is priced by emirate.
              </p>
              <Link href="/packages" className="group mt-4 inline-flex items-center gap-2 text-sm tracking-[0.22em] text-sand uppercase">
                Compare packages &amp; terms <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </div>
          </div>
          <PackageCards packages={packages} />
        </div>
      </section>

      <Addons items={menu.filter((m) => m.catering_addon)} minQty={settings.addon_min_qty} />
      <Marquee tone="espresso" />
      <Gallery />
      <Cta />
    </>
  );
}
