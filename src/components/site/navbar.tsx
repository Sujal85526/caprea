"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/components/site/smooth-scroll";

const links = [
  { href: "/#experience", label: "Experience" },
  { href: "/packages", label: "Packages" },
  { href: "/menu", label: "Menu" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#contact", label: "Contact" },
];

// usePathname needs a Suspense boundary under Cache Components; the fallback renders the same bar without
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
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 240 && y > last.current + 4);
      if (y < last.current - 4) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the route changes (adjust state during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.from(".m-link", { yPercent: 120, opacity: 0, stagger: 0.06, duration: 0.9, ease: "expo.out", delay: 0.15 });
      gsap.from(".m-foot", { opacity: 0, y: 20, duration: 0.8, delay: 0.5 });
    },
    { scope: menuRef, dependencies: [open] },
  );

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-transform duration-700 ease-(--ease-luxe) sm:px-6 sm:pt-5",
          hidden && !open && "-translate-y-[130%]",
        )}
      >
        <nav
          className={clsx(
            "glass flex w-full max-w-6xl items-center justify-between rounded-full py-2.5 pr-2.5 pl-6 transition-[background-color,box-shadow] duration-500",
            scrolled && !hidden && "shadow-[0_20px_60px_-25px_rgba(0,0,0,.65)]",
          )}
          aria-label="Main"
        >
          <Link href="/" className="text-sand transition-colors hover:text-cream" aria-label="Caprea home">
            <Logo className="w-28 sm:w-32" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={clsx(
                    "relative rounded-full px-4 py-2 text-[0.78rem] tracking-[0.18em] uppercase transition-colors",
                    pathname === l.href ? "text-cream" : "text-cream/70 hover:text-cream",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className="group hidden items-center gap-2 rounded-full bg-sand px-5 py-2.5 text-[0.74rem] font-medium tracking-[0.2em] text-espresso uppercase transition-colors duration-500 hover:bg-cream sm:inline-flex"
            >
              Book your event
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative grid size-11 place-items-center rounded-full border border-sand/25 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={clsx("absolute h-px w-5 bg-cream transition-transform duration-500", open ? "rotate-45" : "-translate-y-1")} />
              <span className={clsx("absolute h-px w-5 bg-cream transition-transform duration-500", open ? "-rotate-45" : "translate-y-1")} />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={clsx(
          "fixed inset-0 z-40 flex flex-col justify-between bg-espresso-900/95 px-6 pt-32 pb-10 backdrop-blur-2xl transition-[clip-path] duration-700 ease-(--ease-luxe) lg:hidden",
          open ? "[clip-path:circle(150%_at_calc(100%-3rem)_3rem)]" : "pointer-events-none [clip-path:circle(0%_at_calc(100%-3rem)_3rem)]",
        )}
        aria-hidden={!open}
      >
        {open && (
          <>
            <ul className="space-y-2">
              {[...links, { href: "/book", label: "Book your event" }].map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <Link href={l.href} onClick={() => setOpen(false)} className="m-link flex items-baseline gap-4 py-1 font-display text-5xl text-cream uppercase">
                    <span className="font-sans text-xs text-sand">0{i + 1}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="m-foot flex items-end justify-between text-sm text-cream/60">
              <div>
                <p className="eyebrow mb-2 text-sand">Abu Dhabi, UAE</p>
                <a href="tel:+971522250022">+971 52 225 0022</a>
              </div>
              <a href="https://instagram.com/caprea.ae" target="_blank" rel="noreferrer">
                @caprea.ae
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
