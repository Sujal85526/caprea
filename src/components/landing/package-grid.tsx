import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/site/reveal";
import { aed } from "@/lib/pricing";
import type { Package } from "@/lib/types";
import { cn } from "@/lib/utils";

const PHOTOS = ["/photos/matcha-cup.webp", "/photos/cloud-nine.webp", "/photos/golden-hour.webp", "/photos/strawberry-matcha.webp", "/photos/acai.webp"];

/** White rounded package cards: a photo, the name, spec pills, price and a footer line. */
export function PackageGrid({ packages }: { packages: Package[] }) {
  return (
    <Reveal stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {packages.map((p, i) => {
        const dark = p.featured;
        return (
          <article
            key={p.id}
            className={cn(
              "flex flex-col items-center rounded-[2rem] px-6 pt-8 pb-7 text-center shadow-[0_24px_50px_-36px_rgba(54,31,24,.45)] sm:px-8",
              dark ? "bg-espresso text-cream" : "bg-card text-espresso",
            )}
          >
            <div className="relative isolate aspect-[4/5] w-40 overflow-hidden rounded-xl bg-cream-200">
              <Image src={PHOTOS[i % PHOTOS.length]} alt="" fill sizes="160px" className="object-cover" />
            </div>
            <div className="mt-6 flex items-center gap-2">
              <h3 className="display text-[1.75rem]">{p.name}</h3>
              {dark && <span className="label-caps rounded-full bg-sand px-2.5 py-1 text-[0.55rem] text-espresso">Popular</span>}
            </div>
            <p className={cn("mt-1 text-sm", dark ? "text-cream/70" : "text-espresso/60")}>Up to {p.guests} guests</p>

            <ul className="mt-5 w-full max-w-[17rem] space-y-2 text-sm">
              {[
                ["Signature drinks", String(p.max_signature_drinks)],
                ["Cups per drink", String(p.cups_per_drink)],
                ["Package price", aed(p.price)],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className={cn("flex items-center justify-between gap-4 rounded-xl px-4 py-2.5", dark ? "bg-cream/10" : "bg-cream")}
                >
                  <span className="font-bold">{k}</span>
                  <span className={dark ? "text-cream/80" : "text-espresso/70"}>{v}</span>
                </li>
              ))}
            </ul>

            <div className={cn("mt-6 w-full border-t pt-5", dark ? "border-cream/15" : "border-espresso/10")}>
              <p className={cn("label-caps text-[0.65rem] leading-relaxed", dark ? "text-sand" : "text-espresso/60")}>
                {p.includes.slice(0, 3).join(" · ")}
              </p>
              <Link
                href={`/book?package=${p.id}`}
                aria-label={`Book the ${p.name} package`}
                className={cn(
                  "label-caps group mt-5 inline-flex h-11 items-center gap-2 rounded-full px-6 text-[0.7rem] transition-colors",
                  dark ? "bg-cream text-espresso hover:bg-sand" : "bg-espresso text-cream hover:bg-espresso-700",
                )}
              >
                Book this package <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </article>
        );
      })}
    </Reveal>
  );
}
