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

// The home hero photo.
const PRELOAD = ["/photos/v60-pour.webp"];

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

// One period of the liquid surface is 120 units wide; the path spans two periods so it can loop.
const WAVE = "M0 8 Q15 0 30 8 T60 8 T90 8 T120 8 T150 8 T180 8 T210 8 T240 8 V200 H0 Z";
const CUP = "M24 46 L96 46 L88 152 Q60 158 32 152 Z";

/**
 * Intro: a Caprea takeaway cup is drawn line by line, matcha fills it with a moving surface as the page
 * loads, steam rises, then a wave of espresso floods the screen with the wordmark and pulls away.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const level = useRef({ v: 0 });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Respect reduced motion: skip the intro entirely.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(false);
      markReady();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    let done = 0;
    const assets = PRELOAD.map((src) =>
      preload(src).then(() => {
        done += 1;
        // Rise smoothly toward the real progress, never faster than a slow pour (cached assets load instantly).
        gsap.to(level.current, { v: (done / PRELOAD.length) * 0.92, duration: 1.4, ease: "power1.inOut", overwrite: true });
      }),
    );
    const minTime = new Promise((r) => setTimeout(r, 1500));
    const maxTime = new Promise((r) => setTimeout(r, 3200));
    Promise.race([Promise.all([...assets, document.fonts.ready, minTime]), maxTime]).then(() => setLoaded(true));
  }, []);

  // Drawing, the endless liquid surface, and the fill level following real loading progress.
  useGSAP(
    () => {
      if (!visible) return;
      gsap.set(".ld-stroke, .ld-straw", { drawSVG: "0%" });
      gsap.set(".ld-cup", { opacity: 1 });
      gsap.to(".ld-sleeve", { opacity: 1, duration: 0.6, delay: 0.5 });
      gsap
        .timeline({ defaults: { ease: "power2.inOut" } })
        .to(".ld-stroke", { drawSVG: "100%", duration: 0.8, stagger: 0.1 })
        .to(".ld-straw", { drawSVG: "100%", duration: 0.5 }, "-=0.3")
        .to(".ld-meta", { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.3);

      gsap.to(".ld-wave-a", { x: -120, duration: 2.2, ease: "none", repeat: -1 });
      gsap.to(".ld-wave-b", { x: -120, duration: 3.4, ease: "none", repeat: -1 });

      const tick = () => {
        // The ticker can outlive the loader (it unmounts mid-frame); stop once its markup is gone.
        if (!root.current?.isConnected) return gsap.ticker.remove(tick);
        const v = level.current.v;
        // Liquid surface travels from the cup bottom (y≈150) to just under the lid (y≈52).
        gsap.set(".ld-liquid", { y: 150 - v * 98 });
        setPct(Math.round(v * 100));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [visible] },
  );

  // Exit: top up, steam, espresso flood with the wordmark, then reveal the page.
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
        .to(level.current, { v: 1, duration: 0.35, ease: "power2.out", overwrite: true })
        .fromTo(".ld-steam", { drawSVG: "0% 0%", opacity: 1 }, { drawSVG: "0% 100%", duration: 0.5, stagger: 0.08, ease: "power2.out" }, 0.1)
        .to(".ld-steam", { y: -12, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.5)
        .to(".ld-cup", { scale: 0.88, y: 8, duration: 0.3, ease: "power2.in" }, 0.55)
        .fromTo(".ld-flood", { y: 0, yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: "power3.inOut" }, 0.6)
        .to(".ld-flood-wave", { x: -120, duration: 0.8, ease: "none" }, 0.6)
        .to(".ld-word path", { y: 0, opacity: 1, duration: 0.7, stagger: 0.04, ease: "expo.out" }, 1.15)
        .set(".ld-stage", { autoAlpha: 0 }, 1.45)
        .add(markReady, 1.75)
        .to(".ld-flood-inner", { yPercent: -110, duration: 0.95, ease: "expo.inOut" }, 1.7)
        .to(".ld-word", { yPercent: -40, opacity: 0, duration: 0.5, ease: "power2.in" }, 1.7);
    },
    { scope: root, dependencies: [loaded] },
  );

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {/* Start states, so server-rendered parts don't flash before the animation runs. */}
      <style>{`.ld-word path{opacity:0;transform:translateY(110%)}.ld-meta{opacity:0;transform:translateY(12px)}.ld-cup{opacity:0}.ld-sleeve{opacity:0}`}</style>

      {/* Stage: the cup */}
      <div className="ld-stage absolute inset-0 grid place-items-center bg-linen">
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 120 170" className="ld-cup w-28 overflow-visible sm:w-32">
            <defs>
              <clipPath id="ld-cup-clip">
                <path d={CUP} />
              </clipPath>
            </defs>

            {/* steam */}
            {[44, 60, 76].map((x, i) => (
              <path
                key={x}
                className="ld-steam"
                d={`M${x} ${2 + i * 2} q-6 -8 0 -16 q6 -8 0 -16`}
                fill="none"
                stroke="#d2b89e"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0"
              />
            ))}

            {/* liquid, clipped to the cup */}
            <g clipPath="url(#ld-cup-clip)">
              <g className="ld-liquid" transform="translate(0 150)">
                <path className="ld-wave-b" d={WAVE} fill="#b9c98f" transform="translate(0 -3)" />
                <path className="ld-wave-a" d={WAVE} fill="#8fa36a" />
              </g>
              {/* sleeve */}
              <rect className="ld-sleeve" x="20" y="86" width="80" height="34" fill="#361f18" />
            </g>

            {/* outlines */}
            <path className="ld-stroke" d={CUP} fill="none" stroke="#361f18" strokeWidth="2.5" strokeLinejoin="round" />
            <path
              className="ld-stroke"
              d="M18 46 H102 M22 46 L24 36 H96 L98 46"
              fill="none"
              stroke="#361f18"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path className="ld-straw" d="M68 36 L80 4" fill="none" stroke="#361f18" strokeWidth="4" strokeLinecap="round" />
          </svg>

          <div className="ld-meta mt-6 flex flex-col items-center gap-1">
            <p className="font-display text-4xl text-espresso tabular-nums">{String(pct).padStart(3, "0")}</p>
            <p className="eyebrow text-[0.62rem] text-espresso/55">Brewing your experience</p>
          </div>
        </div>
      </div>

      {/* Espresso flood with a wavy crest */}
      <div className="ld-flood absolute inset-0 translate-y-[105%]">
        <div className="ld-flood-inner absolute inset-0">
          <svg viewBox="0 0 240 16" preserveAspectRatio="none" className="absolute -top-[5vh] left-0 h-[5vh] w-[200%]">
            <path className="ld-flood-wave" d="M0 8 Q15 0 30 8 T60 8 T90 8 T120 8 T150 8 T180 8 T210 8 T240 8 V16 H0 Z" fill="#361f18" />
          </svg>
          <div className="absolute inset-0 grid place-items-center bg-espresso">
            <div className="overflow-hidden px-2 pb-1">
              <Logo className="ld-word w-[min(64vw,360px)] text-sand" title="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
