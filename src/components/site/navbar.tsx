"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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
          scrolled ? "glass-light shadow-[0_12px_40px_-20px_rgba(54,31,24,.35)]" : "border border-transparent",
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

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <List className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-none bg-linen p-0 sm:max-w-sm [&>button]:hidden">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-full flex-col px-6 pt-5 pb-8">
                <div className="flex items-center justify-between">
                  <Logo className="w-24 text-espresso" />
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X className="size-6" />
                    </Button>
                  </SheetClose>
                </div>
                <ul className="mt-12 space-y-1">
                  {links.map((l) => (
                    <li key={l.href}>
                      <SheetClose asChild>
                        <Link href={l.href} className="block py-3 font-display text-4xl text-espresso uppercase">
                          {l.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto space-y-4">
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
