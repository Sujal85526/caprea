"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/packages", label: "Packages" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#contact", label: "Contact" },
];

// usePathname needs a Suspense boundary under Cache Components; the fallback is the same bar without
// the active-link state so the static shell still has navigation.
export function Navbar() {
  return (
    <Suspense fallback={<NavbarView pathname={null} />}>
      <NavbarWithPath />
    </Suspense>
  );
}

function NavbarWithPath() {
  return <NavbarView pathname={usePathname()} />;
}

function NavbarView({ pathname }: { pathname: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  // Mobile menu entrance: the panel swings in from the top-right corner, the close button spins into place,
  // then each link rotates up into view one after another. Runs once the panel is mounted.
  const playMenuIn = () => {
    const el = panel.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from(el, { rotate: 8, xPercent: 30, opacity: 0, transformOrigin: "100% 0%", duration: 0.9 })
      .from(q(".mm-close"), { rotate: -270, scale: 0.3, opacity: 0, duration: 0.9 }, 0.1)
      .from(q(".mm-link"), { yPercent: 120, rotate: 8, transformOrigin: "0% 100%", duration: 0.9, stagger: 0.07 }, 0.15)
      .from(q(".mm-rule"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, stagger: 0.07 }, 0.2)
      .from(q(".mm-foot"), { y: 24, opacity: 0, duration: 0.7 }, 0.5);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-500",
        scrolled ? "border-espresso/10 bg-linen/95 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto grid h-16 max-w-[90rem] grid-cols-[1fr_auto] items-center px-5 sm:h-20 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
        <Link href="/" aria-label="Caprea home" className="-my-2 inline-flex w-fit items-center py-2 text-espresso">
          <Logo className="w-24 sm:w-28" />
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="label inline-flex h-10 items-center text-espresso"
              >
                <span className={cn("link-line py-1", isActive(l.href) && "bg-[length:100%_1px]")}>{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/book">
              Book your event <ArrowUpRight weight="bold" />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button type="button" className="group/burger -mr-2 grid size-11 place-items-center lg:hidden" aria-label="Open menu">
                <span aria-hidden className="flex w-7 flex-col items-end gap-[7px]">
                  <span className="h-px w-7 bg-espresso transition-[width] duration-500 ease-(--ease-luxe) group-hover/burger:w-5" />
                  <span className="h-px w-5 bg-espresso transition-[width] duration-500 ease-(--ease-luxe) group-hover/burger:w-7" />
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                requestAnimationFrame(playMenuIn);
              }}
              className="overflow-hidden border-none bg-linen p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div ref={panel} className="flex h-full flex-col overflow-y-auto px-5 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8">
                <div className="flex h-12 items-center justify-between sm:h-16">
                  <Logo className="w-24 text-espresso sm:w-28" />
                  <span className="mm-close -mr-2 inline-flex">
                    <SheetClose asChild>
                      <button type="button" className="grid size-11 place-items-center text-espresso" aria-label="Close menu">
                        <X className="size-6" weight="light" />
                      </button>
                    </SheetClose>
                  </span>
                </div>
                <ul className="mt-10">
                  {links.map((l, i) => (
                    <li key={l.href}>
                      <div className="overflow-hidden">
                        <SheetClose asChild>
                          <Link href={l.href} className="mm-link flex items-baseline gap-4 py-3.5 text-espresso">
                            <span className="label w-6 text-espresso/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                            <span className="font-display text-[clamp(1.85rem,9.4vw,2.75rem)] leading-none uppercase">{l.label}</span>
                          </Link>
                        </SheetClose>
                      </div>
                      <span aria-hidden className="mm-rule block h-px bg-espresso/12" />
                    </li>
                  ))}
                </ul>
                <div className="mm-foot mt-auto space-y-5 pt-10 [&_a]:transition-none">
                  <SheetClose asChild>
                    <Button asChild size="lg" className="w-full">
                      <Link href="/book">
                        Book your event <ArrowUpRight weight="bold" />
                      </Link>
                    </Button>
                  </SheetClose>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-espresso/60">
                    <a href="tel:+971522250022" className="py-2.5">+971 52 225 0022</a>
                    <a href="https://instagram.com/caprea.ae" target="_blank" rel="noreferrer" className="py-2.5">
                      @caprea.ae
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
