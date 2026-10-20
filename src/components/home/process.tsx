"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { FrameSequence } from "@/components/home/frame-sequence";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const steps = [
  { title: "Choose your package", body: "Pick the guest count that fits your celebration, from 30 to 300 guests, or ask us for a custom setup." },
  { title: "Curate the menu", body: "Select your signature drinks, add 24K strawberries, cookies or coconuts, and personalise cups and corner." },
  { title: "We pour, you host", body: "Our cart, barista and waiter arrive, set up and serve for four hours, then pack down. You enjoy the party." },
];

export function Process() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[300vh] bg-cream text-espresso">
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-5 px-6 sm:gap-10 sm:px-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto h-[30dvh] w-full max-w-md overflow-hidden rounded-[2rem] sm:h-[42dvh] sm:rounded-[2.5rem] shadow-[0_50px_100px_-40px_rgba(54,31,24,.55)] lg:h-[74dvh]">
            <FrameSequence name="strawberry" count={29} trigger={root} focusY={0.4} className="absolute inset-0 size-full" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-espresso/60 to-transparent p-6 text-cream">
              <span className="eyebrow">Strawberry matcha</span>
              <span className="eyebrow tabular-nums">0{active + 1} / 0{steps.length}</span>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3 text-mocha sm:mb-6">How it works</p>
            <ol className="space-y-1 sm:space-y-3">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className={clsx(
                    "rounded-3xl border px-5 py-4 transition-all duration-700 ease-(--ease-luxe) sm:p-8",
                    i === active ? "border-espresso/15 bg-white/60 shadow-[0_30px_60px_-35px_rgba(54,31,24,.5)]" : "border-transparent opacity-35",
                  )}
                >
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-2xl text-mocha">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-2xl uppercase sm:text-4xl">{s.title}</h3>
                      <div className={clsx("grid transition-[grid-template-rows] duration-700 ease-(--ease-luxe)", i === active ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                        <p className="overflow-hidden pt-2 text-sm leading-relaxed text-mocha sm:pt-3 sm:text-base">{s.body}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
