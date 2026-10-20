"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  /** folder in /public/frames */
  name: string;
  count: number;
  /** element whose scroll range drives the sequence */
  trigger: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  className?: string;
  /** crop focus for object-fit: cover, 0..1 */
  focusX?: number;
  focusY?: number;
};

const frameUrl = (name: string, i: number) => `/frames/${name}/${String(i + 1).padStart(3, "0")}.webp`;

/** Draws a photo burst on a canvas and scrubs through it with scroll (Apple-style). */
export function FrameSequence({ name, count, trigger, start = "top top", end = "bottom bottom", className, focusX = 0.5, focusY = 0.5 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const triggerEl = trigger.current;
    if (!el || !triggerEl) return;
    const ctx = el.getContext("2d")!;
    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };
    let drawn = -1;

    const draw = () => {
      const i = Math.round(state.frame);
      const img = images[i]?.complete && images[i].naturalWidth ? images[i] : images.slice(0, i).reverse().find((m) => m.complete && m.naturalWidth);
      if (!img) return;
      const { width: w, height: h } = el;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) * focusX, (h - dh) * focusY, dw, dh);
      drawn = i;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(el.clientWidth * dpr);
      el.height = Math.round(el.clientHeight * dpr);
      drawn = -1;
      draw();
    };

    // First frame immediately, the rest in order so early frames are ready first.
    for (let i = 0; i < count; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(name, i);
      if (i === 0) img.onload = resize;
      else img.onload = () => Math.round(state.frame) === i && draw();
      images.push(img);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    if (prefersReducedMotion()) {
      state.frame = count - 1;
      return () => ro.disconnect();
    }

    const tween = gsap.to(state, {
      frame: count - 1,
      ease: "none",
      scrollTrigger: { trigger: triggerEl, start, end, scrub: 0.4 },
      onUpdate: () => Math.round(state.frame) !== drawn && draw(),
    });

    return () => {
      ro.disconnect();
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.refresh();
    };
  }, [name, count, trigger, start, end, focusX, focusY]);

  return <canvas ref={canvas} className={className} aria-hidden />;
}
