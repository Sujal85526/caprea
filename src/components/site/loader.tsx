"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/ui/logo";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// "Page ready" signal: intro animations wait for the loader to lift.
let ready = false;
const listeners = new Set<() => void>();
function markReady() {
  ready = true;
  listeners.forEach((l) => l());
}
export function useSiteReady() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => ready,
    () => false,
  );
}

const PRELOAD = ["/photos/strawberry-matcha.webp", "/photos/iced-latte-pour.webp", "/menu/matcha-latte.webp", "/menu/velvet-sunset.webp"];

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

/** Light intro: the wordmark rises letter by letter, a hairline fills as hero images load, then the curtain lifts. */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("caprea:intro") || prefersReducedMotion()) {
      // sessionStorage is browser-only, so returning visitors skip the intro after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      markReady();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    let done = 0;
    const assets = PRELOAD.map((src) => preload(src).then(() => setProgress(++done / PRELOAD.length)));
    const minTime = new Promise((r) => setTimeout(r, 1300));
    const maxTime = new Promise((r) => setTimeout(r, 2500));
    Promise.race([Promise.all([...assets, document.fonts.ready, minTime]), maxTime]).then(() => setLoaded(true));
  }, []);

  useGSAP(
    () => {
      if (!visible) return;
      gsap.to(".ld-logo path", { y: 0, opacity: 1, duration: 1, stagger: 0.06, ease: "expo.out", delay: 0.1 });
      gsap.to(".ld-tag", { opacity: 1, y: 0, duration: 0.8, delay: 0.6 });
    },
    { scope: root, dependencies: [visible] },
  );

  useGSAP(
    () => {
      if (!loaded || !visible) return;
      sessionStorage.setItem("caprea:intro", "1");
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setVisible(false);
          },
        })
        .to(".ld-bar", { scaleX: 1, duration: 0.35, ease: "power2.out" })
        .to(".ld-content", { y: -30, opacity: 0, duration: 0.55, ease: "power3.in" }, "+=0.1")
        .add(markReady, "-=0.15")
        .to(".ld-panel", { yPercent: -100, duration: 1, ease: "expo.inOut", stagger: 0.08 }, "-=0.25");
    },
    { scope: root, dependencies: [loaded] },
  );

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-hidden>
      {/* Start hidden so server-rendered letters don't flash before the animation runs. */}
      <style>{`.ld-logo path{opacity:0;transform:translateY(120%)}.ld-tag{opacity:0;transform:translateY(8px)}`}</style>
      <div className="ld-panel absolute inset-0 bg-sand" />
      <div className="ld-panel absolute inset-0 grid place-items-center bg-linen">
        <div className="ld-content flex w-[min(70vw,380px)] flex-col items-center gap-6">
          <div className="overflow-hidden pb-1">
            <Logo className="ld-logo w-full text-espresso" title="" />
          </div>
          <div className="h-px w-full bg-espresso/10">
            <div className="ld-bar h-full origin-left bg-espresso transition-transform duration-500" style={{ transform: `scaleX(${progress * 0.85})` }} />
          </div>
          <p className="ld-tag eyebrow text-mocha">Specialty coffee · Matcha</p>
        </div>
      </div>
    </div>
  );
}
