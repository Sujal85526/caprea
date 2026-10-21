"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const links = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/menu", label: "Menu" },
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
      .from(el, { rotate: 10, xPercent: 30, opacity: 0, transformOrigin: "100% 0%", duration: 0.9 })
      .from(q(".mm-close"), { rotate: -270, scale: 0.3, opacity: 0, duration: 0.9 }, 0.1)
      .from(q(".mm-link"), { yPercent: 120, rotate: 10, transformOrigin: "0% 100%", duration: 0.9, stagger: 0.07 }, 0.15)
      .from(q(".mm-foot"), { y: 24, opacity: 0, duration: 0.7 }, 0.5);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pr-2 pl-5 transition-[background-color,box-shadow,border-color] duration-500",
          scrolled ? "bg-linen/95 shadow-[0_12px_40px_-20px_rgba(54,31,24,.45)] backdrop-blur-md" : "bg-linen/95 shadow-[0_8px_30px_-22px_rgba(54,31,24,.4)] backdrop-blur-md",
        )}
      >
        <Link href="/" aria-label="Caprea home" className="text-espresso">
          <Logo className="w-24 sm:w-28" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  pathname === l.href ? "bg-secondary text-espresso" : "text-espresso/70 hover:text-espresso",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/book">
              Book your event <ArrowUpRight weight="bold" />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="group/burger lg:hidden" aria-label="Open menu">
                <List className="size-6 transition-transform duration-500 ease-(--ease-luxe) group-hover/burger:rotate-90" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                requestAnimationFrame(playMenuIn);
              }}
              className="overflow-hidden border-none bg-linen p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-sm [&>button]:hidden"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div ref={panel} className="flex h-full flex-col px-6 pt-5 pb-8">
                <div className="flex items-center justify-between">
                  <Logo className="w-24 text-espresso" />
                  <span className="mm-close inline-flex">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X className="size-6" />
                      </Button>
                    </SheetClose>
                  </span>
                </div>
                <ul className="mt-12 space-y-1">
                  {links.map((l) => (
                    <li key={l.href} className="overflow-hidden">
                      <SheetClose asChild>
                        <Link href={l.href} className="mm-link block py-3 font-display text-4xl text-espresso uppercase">
                          {l.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <div className="mm-foot mt-auto space-y-4 [&_a]:transition-none">
                  <SheetClose asChild>
                    <Button asChild size="lg" className="w-full">
                      <Link href="/book">
                        Book your event <ArrowUpRight weight="bold" />
                      </Link>
                    </Button>
                  </SheetClose>
                  <p className="text-center text-sm text-muted-foreground">+971 52 225 0022 · @caprea.ae</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
