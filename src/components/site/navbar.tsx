"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { ArrowUpRight, ChatCircle, Coffee, House, List, Package, Plus, X } from "@phosphor-icons/react";
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
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  // Mobile menu: links fade up one after another once the panel is mounted.
  const playMenuIn = () => {
    const el = panel.current;
    if (!el || prefersReducedMotion()) return;
    gsap.from(gsap.utils.selector(el)(".mm-item"), { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-espresso/10 bg-cream/95 backdrop-blur-md">
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:h-[4.5rem] sm:px-10">
          <Link href="/" aria-label="Caprea home" className="flex h-11 items-center text-espresso">
            <Logo className="w-24 sm:w-28" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full px-4 text-sm transition-colors",
                    pathname === l.href ? "text-espresso" : "text-espresso/60 hover:text-espresso",
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
                <Button variant="ghost" size="icon" className="-mr-2 lg:hidden" aria-label="Open menu">
                  <List className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                  requestAnimationFrame(playMenuIn);
                }}
                className="border-none bg-cream p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-sm [&>button]:hidden"
              >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div ref={panel} className="flex h-full flex-col px-6 pt-3 pb-8">
                  <div className="flex h-11 items-center justify-between">
                    <Logo className="w-24 text-espresso" />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="-mr-2" aria-label="Close menu">
                        <X className="size-6" />
                      </Button>
                    </SheetClose>
                  </div>
                  <ul className="mt-10">
                    {links.map((l) => (
                      <li key={l.href} className="mm-item border-b border-espresso/10">
                        <SheetClose asChild>
                          <Link href={l.href} className="flex min-h-14 items-center text-2xl font-light text-espresso">
                            {l.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                  <div className="mm-item mt-auto">
                    <SheetClose asChild>
                      <Button asChild size="lg" className="w-full">
                        <Link href="/book">
                          Book your event <ArrowUpRight weight="bold" />
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
      <TabBar pathname={pathname} />
    </>
  );
}

const tabs = [
  { href: "/", label: "Home", Icon: House },
  { href: "/menu", label: "Menu", Icon: Coffee },
  { href: "/book", label: "Book", Icon: Plus },
  { href: "/packages", label: "Packages", Icon: Package },
  { href: "/#contact", label: "Contact", Icon: ChatCircle },
];

/**
 * Floating bottom tab bar on phones and tablets, with Book as the raised centre button. Pages with their own
 * bottom bar (the booking flow) opt out with a `data-no-tabbar` element.
 */
function TabBar({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label="Quick links"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md lg:hidden [body:has([data-no-tabbar])_&]:hidden"
    >
      <ul className="grid grid-cols-5 items-end rounded-[1.75rem] bg-espresso px-1.5 pt-1.5 pb-1.5 text-cream shadow-[0_18px_40px_-18px_rgba(54,31,24,.6)]">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          if (href === "/book")
            return (
              <li key={href} className="flex justify-center">
                <Link href={href} className="-mt-6 flex min-w-14 flex-col items-center gap-1 text-[0.65rem] font-medium">
                  <span className="grid size-14 place-items-center rounded-full border-4 border-espresso bg-cream text-espresso">
                    <Icon className="size-5" weight="bold" />
                  </span>
                  {label}
                </Link>
              </li>
            );
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 text-[0.65rem] font-medium transition-colors",
                  active ? "text-cream" : "text-cream/60",
                )}
              >
                <span className={cn("grid h-7 w-11 place-items-center rounded-full", active && "bg-cream text-espresso")}>
                  <Icon className="size-[1.15rem]" weight={active ? "fill" : "regular"} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
