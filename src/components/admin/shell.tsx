"use client";

import clsx from "clsx";
import {
  CalendarDays,
  Coffee,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu as MenuIcon,
  Package as PackageIcon,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { Suspense, useEffect, useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "./client";

const NAV = [
  { segment: null, href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { segment: "bookings", href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { segment: "requests", href: "/admin/requests", label: "Requests", icon: Inbox },
  { segment: "packages", href: "/admin/packages", label: "Packages", icon: PackageIcon },
  { segment: "menu", href: "/admin/menu", label: "Menu", icon: Coffee },
  { segment: "pricing", href: "/admin/pricing", label: "Pricing & Areas", icon: MapPin },
  { segment: "settings", href: "/admin/settings", label: "Settings", icon: SettingsIcon },
] as const;

function NavLinks({ active, onNavigate }: { active?: string | null | undefined; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {NAV.map(({ segment, href, label, icon: Icon }) => {
        const isActive = active !== undefined && active === segment;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-300",
                isActive ? "bg-sand text-espresso" : "text-cream/70 hover:bg-sand/10 hover:text-cream",
              )}
            >
              <Icon className={clsx("h-4.5 w-4.5 shrink-0", isActive ? "text-espresso" : "text-sand/70 group-hover:text-sand")} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const segment = useSelectedLayoutSegment();
  // Route groups such as "(panel)" never show here; the dashboard has no child segment.
  const active = segment && !segment.startsWith("__") ? segment : null;
  return <NavLinks active={active} onNavigate={onNavigate} />;
}

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const { error } = await createClient().auth.signOut();
          if (error) {
            toast.error(error.message);
            return;
          }
          router.replace("/admin/login");
          router.refresh();
        })
      }
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-sand/80 transition-colors hover:bg-sand/10 hover:text-cream disabled:opacity-50",
        className,
      )}
    >
      {pending ? <Spinner className="h-3.5 w-3.5" /> : <LogOut className="h-3.5 w-3.5" />}
      Sign out
    </button>
  );
}

export function AdminShell({ user, children }: { user: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="min-h-dvh bg-espresso-900 bg-[radial-gradient(ellipse_at_top_right,rgba(210,184,158,0.08),transparent_55%)]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sand/10 bg-espresso-900/85 px-4 py-3 backdrop-blur-lg lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 text-sand" aria-label="Caprea admin home">
          <Logo className="w-24" />
          <span className="eyebrow text-[0.6rem] text-cream/50">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="rounded-full p-2 text-sand hover:bg-sand/10"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        aria-hidden
      />
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-sand/10 bg-espresso-900 p-5 transition-transform duration-500 ease-(--ease-luxe) lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Admin navigation"
        inert={!open}
      >
        <div className="mb-8 flex items-center justify-between">
          <Logo className="w-28 text-sand" />
          <button type="button" onClick={close} aria-label="Close menu" className="rounded-full p-2 text-sand hover:bg-sand/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <Suspense fallback={<NavLinks onNavigate={close} />}>
            <ActiveNavLinks onNavigate={close} />
          </Suspense>
        </nav>
        <div className="mt-6 border-t border-sand/10 pt-4">{user}</div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sand/10 bg-espresso-900/60 p-6 backdrop-blur-xl lg:flex">
        <Link href="/admin" className="mb-10 block text-sand" aria-label="Caprea admin home">
          <Logo className="w-32" />
          <span className="eyebrow mt-2 block text-[0.6rem] text-cream/45">Admin panel</span>
        </Link>
        <nav className="flex-1 overflow-y-auto" aria-label="Admin navigation">
          <Suspense fallback={<NavLinks />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>
        <div className="mt-6 border-t border-sand/10 pt-4">{user}</div>
      </aside>

      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-10 lg:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
