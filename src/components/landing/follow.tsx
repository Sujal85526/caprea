import Image from "next/image";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/site/reveal";

const shots = ["/photos/strawberry-matcha.webp", "/photos/barista-cups.webp", "/photos/cookie-stack.webp", "/photos/matcha-spoon.webp", "/photos/layered.webp"];

/** Instagram call-out: heading and button on the left, a sliding row of framed photos on the right. */
export function Follow({ instagram }: { instagram: string }) {
  const href = `https://instagram.com/${instagram}`;
  return (
    <section className="relative w-full overflow-hidden px-6 py-24 sm:px-12 sm:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal stagger className="flex flex-col items-center text-center">
          <h2 className="display text-[clamp(2.75rem,7vw,5rem)] text-espresso">
            Follow
            <br />
            the pour
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-espresso/70">
            New drinks, events we&apos;ve poured at and behind-the-scenes moments from the café.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="label-caps mt-9 inline-flex min-h-14 items-center gap-3 border-2 border-espresso px-9 text-sm text-espresso transition-colors hover:bg-espresso hover:text-cream"
          >
            <InstagramLogo className="size-5" /> @{instagram}
          </a>
        </Reveal>

        <Reveal className="-mx-6 sm:-mx-12 lg:mx-0">
          <ul className="flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] sm:scroll-px-12 sm:px-12 lg:px-0 [&::-webkit-scrollbar]:hidden">
            {shots.map((src) => (
              <li key={src} className="w-[68vw] max-w-[18rem] shrink-0 snap-start">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md bg-linen p-3 shadow-[0_18px_40px_-24px_rgba(54,31,24,.35)] transition-transform duration-500 hover:-translate-y-1"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-sm bg-cream-200">
                    <Image src={src} alt="" fill sizes="288px" className="object-cover" />
                  </span>
                  <span className="label-caps flex items-center justify-center gap-2 pt-4 pb-1 text-[0.7rem] text-espresso">
                    <InstagramLogo className="size-4" /> @{instagram}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
