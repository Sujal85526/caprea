import Image from "next/image";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/landing/section-heading";
import { Reveal } from "@/components/site/reveal";

const photos = [
  { src: "/photos/matcha-splash.webp", alt: "Matcha splashing from a Caprea cup", cls: "col-span-2 row-span-2" },
  { src: "/photos/coconut.webp", alt: "Caprea branded coconut", cls: "" },
  { src: "/photos/cookies-hand.webp", alt: "A hand holding a stack of cookies", cls: "" },
  { src: "/photos/trio-hands.webp", alt: "Three smoothies held together", cls: "" },
  { src: "/photos/v60-pour.webp", alt: "V60 coffee poured into a cup", cls: "" },
];

export function Gallery({ instagram }: { instagram: string }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <SectionHeading
          eyebrow="Gallery"
          title="Made to be shared"
          action={
            <Button asChild variant="outline">
              <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer">
                <InstagramLogo /> @{instagram}
              </a>
            </Button>
          }
        />
        <Reveal stagger className="grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 md:grid-cols-4">
          {photos.map((p) => (
            <div key={p.src} className={`group relative overflow-hidden rounded-3xl bg-cream-200 ${p.cls}`}>
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 ease-(--ease-luxe) group-hover:scale-[1.04]" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
