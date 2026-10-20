"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/ui/logo";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// "Page ready" signal shared with intro animations (hero waits for the loader to lift).
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

const PRELOAD = Array.from({ length: 12 }, (_, i) => `/frames/matcha/${String(i + 1).padStart(3, "0")}.webp`).concat([
  "/menu/salted-vanilla-matcha.webp",
  "/menu/velvet-sunset.webp",
  "/menu/golden-hour.webp",
]);

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

/** Intro curtain: logo draws in, a counter tracks real asset loading, then the curtain lifts. */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("caprea:intro") || prefersReducedMotion()) {
      // sessionStorage is browser-only, so returning visitors skip the intro after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      markReady();
      return;
    }
    let done = 0;
    const assets = PRELOAD.map((src) => preload(src).then(() => setProgress(Math.round((++done / PRELOAD.length) * 100))));
    const minTime = new Promise((r) => setTimeout(r, 1400));
    Promise.all([...assets, document.fonts.ready, minTime]).then(() => setLoaded(true));
  }, []);

  useGSAP(
    () => {
      if (!visible) return;
      gsap.from(".loader-logo path", { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out", delay: 0.15 });
      gsap.from(".loader-line", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut" });
    },
    { scope: root, dependencies: [visible] },
  );

  useGSAP(
    () => {
      if (!loaded || !visible) return;
      sessionStorage.setItem("caprea:intro", "1");
      gsap
        .timeline({ onComplete: () => setVisible(false) })
        .to(".loader-content", { yPercent: -30, opacity: 0, duration: 0.7, ease: "power3.in" })
        .add(markReady, "-=0.1")
        .to(".loader-panel", { yPercent: -100, duration: 1.1, ease: "expo.inOut", stagger: { each: 0.12, from: "end" } }, "-=0.2");
    },
    { scope: root, dependencies: [loaded] },
  );

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-hidden>
      <div className="loader-panel absolute inset-0 bg-sand" />
      <div className="loader-panel absolute inset-0 grid place-items-center bg-espresso-900 grain">
        <div className="loader-content flex w-[min(78vw,520px)] flex-col items-center gap-8">
          <div className="overflow-hidden">
            <Logo className="loader-logo w-full text-sand" />
          </div>
          <div className="relative h-px w-full bg-sand/15">
            <div className="loader-line absolute inset-0 bg-sand/40" />
            <div className="absolute inset-y-0 left-0 bg-sand transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex w-full justify-between text-sand/70">
            <span className="eyebrow">Specialty coffee · Matcha</span>
            <span className="eyebrow tabular-nums">{String(progress).padStart(3, "0")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
