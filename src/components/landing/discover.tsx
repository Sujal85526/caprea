import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

type Tile = { href: string; tag: string; title: string; body: string; src: string; big?: boolean };

/** Bento of three photo cards: one large on the left, two stacked on the right. */
export function Discover({ fromLabel }: { fromLabel: string }) {
  const tiles: Tile[] = [
    {
      href: "/packages",
      tag: "Catering",
      title: "Our packages",
      body: `Cart, barista, waiter and our signature drinks for your guests. ${fromLabel}.`,
      src: "/photos/trio-overhead.webp",
      big: true,
    },
    { href: "/menu", tag: "The menu", title: "Coffee & matcha", body: "Everything we pour at the café and at your events.", src: "/photos/whisk-splash.webp" },
    {
      href: "/book?mode=custom",
      tag: "Bespoke",
      title: "Create your own",
      body: "Build your own menu. We confirm a tailored quote.",
      src: "/photos/cookies-hand.webp",
    },
  ];

  return (
    <section className="relative z-20 w-full bg-cream px-4 py-20 sm:px-8 sm:py-28 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="display border-b border-espresso/10 pb-4 text-[clamp(2.5rem,8vw,5.5rem)] text-espresso">Discover more</h2>
        </Reveal>
        <Reveal stagger className="mt-10 grid gap-5 lg:grid-cols-[2fr_1fr] lg:grid-rows-2 lg:gap-6">
          {tiles.map((t) => (
            <TileCard key={t.href} tile={t} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function TileCard({ tile }: { tile: Tile }) {
  return (
    <Link
      href={tile.href}
      className={cn(
        "group relative isolate flex overflow-hidden rounded-[2rem] border border-espresso/20 bg-espresso text-cream",
        tile.big ? "min-h-[26rem] lg:row-span-2 lg:min-h-[31rem]" : "min-h-[15rem]",
      )}
    >
      <Image
        src={tile.src}
        alt=""
        fill
        sizes={tile.big ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
        className="object-cover transition-transform duration-[1.2s] ease-(--ease-luxe) group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso-900/90 via-espresso-900/35 to-espresso-900/10" />
      <div className={cn("relative mt-auto flex w-full items-end justify-between gap-4", tile.big ? "p-7 sm:p-10" : "p-7 sm:p-8")}>
        <div className="min-w-0">
          <span className={cn("label-caps inline-block rounded-full px-3 py-1.5 text-[0.62rem]", tile.big ? "bg-cream text-espresso" : "bg-espresso text-cream")}>
            {tile.tag}
          </span>
          <h3 className={cn("display mt-4 text-cream", tile.big ? "text-[clamp(2rem,5vw,3.25rem)]" : "text-[1.6rem]")}>{tile.title}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/80">{tile.body}</p>
        </div>
        <ArrowRight className="mb-1 size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
