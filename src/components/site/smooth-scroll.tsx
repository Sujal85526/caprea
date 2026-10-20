"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, Suspense, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/** Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, anchors: { offset: -90 } });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Lenis only exists in the browser, so it is created here and then shared through context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <Suspense fallback={null}>
        <RouteReset lenis={lenis} />
      </Suspense>
      {children}
    </LenisContext.Provider>
  );
}

/** New page: start at the top and let triggers measure the new layout. */
function RouteReset({ lenis }: { lenis: Lenis | null }) {
  const pathname = usePathname();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, lenis]);
  return null;
}
