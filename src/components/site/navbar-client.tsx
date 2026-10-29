"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { CalendarPlus, InstagramLogo, List, WhatsappLogo, X } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const links = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/menu", label: "Menu" },
  { href: "/book", label: "Book" },
  { href: "/#contact", label: "Contact" },
];

type Props = { whatsapp: string; instagram: string };

// usePathname needs a Suspense boundary under Cache Components; the fallback is the same bar without
// the active-link state so the static shell still has navigation.
export function NavbarClient(props: Props) {
  return (
    <Suspense fallback={<NavbarView {...props} pathname={null} />}>
      <NavbarWithPath {...props} />
    </Suspense>
  );
}

function NavbarWithPath(props: Props) {
  return <NavbarView {...props} pathname={usePathname()} />;
}

/**
 * Floating pill bar. Over the home page's photo hero it starts transparent with cream type, then turns into a
 * frosted cream pill once the hero scrolls away. Phones get a full-screen menu with oversized links.
 */
function NavbarView({ pathname, whatsapp, instagram }: Props & { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const overHero = pathname === "/";

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight - 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Menu links rise one after another as the overlay opens.
  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return;
      gsap.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      gsap.from(".mm-item", { yPercent: 60, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: "expo.out", delay: 0.05 });
    },
    { dependencies: [open], scope: overlay },
  );

  const solid = open ? false : !overHero || pastHero;
  const light = !solid && !open;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] flex justify-center sm:top-6 sm:px-4">
        <header
          className={cn(
            "h-16 w-full max-w-[1400px] border-b transition-all duration-500 ease-(--ease-luxe) sm:w-[94%] sm:rounded-full sm:border",
            solid
              ? "border-espresso/[0.06] bg-cream/80 text-espresso shadow-[0_14px_40px_-18px_rgba(54,31,24,.35)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
            light ? "text-cream" : "text-espresso",
            !solid && !open && "border-b-cream/10 sm:border-transparent",
          )}
        >
          <nav aria-label="Main" className="grid h-full grid-cols-[3rem_1fr_3rem] items-center px-3 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center lg:hidden"
            >
              {open ? <X className="size-6" /> : <List className="size-6" />}
            </button>

            <Link href="/" aria-label="Caprea home" className="flex h-11 items-center justify-self-center lg:justify-self-start">
              <Logo className="w-24 sm:w-28" />
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className="label-caps relative inline-flex h-11 items-center px-4 text-[0.78rem] after:absolute after:inset-x-4 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-self-end gap-1 sm:gap-2">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid size-11 place-items-center transition-opacity hover:opacity-70"
              >
                <WhatsappLogo className="size-[1.35rem]" />
              </a>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hidden size-11 place-items-center transition-opacity hover:opacity-70 sm:grid"
              >
                <InstagramLogo className="size-[1.35rem]" />
              </a>
              <Link href="/book" aria-label="Book your event" className="hidden size-11 place-items-center transition-opacity hover:opacity-70 sm:grid lg:hidden">
                <CalendarPlus className="size-[1.35rem]" />
              </Link>
              <Link
                href="/book"
                className={cn(
                  "label-caps ml-1 hidden h-10 items-center rounded-full px-5 text-[0.72rem] transition-colors lg:inline-flex",
                  light ? "bg-cream text-espresso hover:bg-sand" : "bg-espresso text-cream hover:bg-espresso-700",
                )}
              >
                Book now
              </Link>
            </div>
          </nav>
        </header>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={overlay}
          className="fixed inset-0 z-[55] flex flex-col items-center overflow-y-auto bg-cream/95 px-6 pt-24 pb-10 backdrop-blur-xl lg:hidden"
        >
          <ul className="my-auto flex flex-col items-center gap-3 text-center">
            {links.map((l) => (
              <li key={l.href} className="overflow-hidden">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="mm-item display block py-1 text-[clamp(2.5rem,12vw,4rem)] text-espresso"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mm-item mt-10 flex flex-col items-center gap-2 text-center">
            <span aria-hidden className="mb-6 h-px w-16 bg-espresso/20" />
            <p className="label-caps text-[0.7rem] text-espresso">Coffee &amp; matcha catering</p>
            <p className="text-sm text-espresso/60">Abu Dhabi, UAE</p>
          </div>
        </div>
      )}
    </>
  );
}
