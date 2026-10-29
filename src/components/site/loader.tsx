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

const SEEN_KEY = "caprea-intro-seen";

// Read once per page load, before the intro marks itself as seen (and stable across Strict Mode re-runs).
let seenBefore: boolean | null = null;
function introSeenBefore() {
  if (seenBefore === null) {
    try {
      seenBefore = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seenBefore = false;
    }
  }
  return seenBefore;
}

function pageLoaded() {
  return new Promise<void>((resolve) => {
    if (document.readyState === "complete") return resolve();
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

/**
 * Intro: the wordmark fades in letter by letter on espresso while a hairline fills underneath, then the
 * whole screen fades away. Shown in full once per visit; later page loads get a quick fade.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const quick = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Respect reduced motion: skip the intro entirely.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      markReady();
      return;
    }
    quick.current = introSeenBefore();
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    document.documentElement.style.overflow = "hidden";
    const minTime = new Promise((r) => setTimeout(r, quick.current ? 250 : 1400));
    const maxTime = new Promise((r) => setTimeout(r, 3000));
    Promise.race([Promise.all([pageLoaded(), document.fonts.ready, minTime]), maxTime]).then(() => setLoaded(true));
  }, []);

  // Entrance: letters rise out of a soft blur, the tagline follows and the hairline starts to fill.
  useGSAP(
    () => {
      if (!visible) return;
      quick.current = introSeenBefore();
      if (quick.current) {
        gsap.set(".ld-word path, .ld-tag", { autoAlpha: 1 });
        gsap.set(".ld-bar", { scaleX: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          ".ld-word path",
          { autoAlpha: 0, yPercent: 30, filter: "blur(6px)" },
          { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.07 },
        )
        .fromTo(".ld-tag", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.45)
        .fromTo(".ld-bar", { scaleX: 0 }, { scaleX: 0.85, duration: 1.4, ease: "power2.inOut" }, 0.2);
    },
    { scope: root, dependencies: [visible] },
  );

  // Exit: finish the line, lift the mark slightly and fade the whole screen away over the page.
  useGSAP(
    () => {
      if (!loaded || !visible) return;
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            setVisible(false);
          },
        })
        .to(".ld-bar", { scaleX: 1, duration: quick.current ? 0.01 : 0.35, ease: "power2.out" })
        .to(".ld-inner", { y: -12, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, quick.current ? 0 : 0.25)
        .add(markReady, quick.current ? 0.1 : 0.45)
        .to(root.current, { autoAlpha: 0, duration: quick.current ? 0.4 : 0.7, ease: "power2.inOut" }, quick.current ? 0.05 : 0.5);
    },
    { scope: root, dependencies: [loaded] },
  );

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] grid place-items-center bg-espresso" aria-hidden>
      {/* Start states, so the server-rendered markup doesn't flash before the animation runs. */}
      <style>{`.ld-word path,.ld-tag{opacity:0}.ld-bar{transform:scaleX(0)}`}</style>
      <div className="ld-inner flex flex-col items-center px-6">
        <Logo className="ld-word w-[min(62vw,320px)] text-cream" title="" />
        <p className="ld-tag label-caps mt-5 text-[0.62rem] text-sand">Coffee &amp; matcha · Abu Dhabi</p>
        <span className="mt-8 block h-px w-36 overflow-hidden bg-cream/15">
          <span className="ld-bar block h-full w-full origin-left bg-sand" />
        </span>
      </div>
    </div>
  );
}
