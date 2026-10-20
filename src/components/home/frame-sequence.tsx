"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  /** folder in /public/frames */
  name: string;
  count: number;
  className?: string;
  /** crop focus for object-fit: cover, 0..1 */
  focusX?: number;
  focusY?: number;
  /** scroll mode: scrub through the frames over this element's scroll range */
  trigger?: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  /** timed mode: play the frames once, like a short film, when this turns true */
  play?: boolean;
  duration?: number;
};

const frameUrl = (name: string, i: number) => `/frames/${name}/${String(i + 1).padStart(3, "0")}.webp`;

/** Draws a photo burst on a canvas, driven either by scroll (Apple-style) or by time. */
export function FrameSequence({
  name,
  count,
  className,
  focusX = 0.5,
  focusY = 0.5,
  trigger,
  start = "top top",
  end = "bottom bottom",
  play,
  duration = 3,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useRef<{ state: { frame: number }; draw: () => void; ready: Promise<void> } | null>(null);

  // Load frames and keep the canvas sized; drawing reads state.frame.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d")!;
    const images: HTMLImageElement[] = [];
    const state = { frame: 0 };
    let drawn = -1;

    const draw = () => {
      const i = Math.round(state.frame);
      if (i === drawn) return;
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

    const loads = Array.from({ length: count }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(name, i);
      images.push(img);
      return new Promise<void>((resolve) => {
        img.onload = () => {
          if (i === 0) resize();
          else if (Math.round(state.frame) === i) {
            drawn = -1;
            draw();
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    });

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    player.current = { state, draw, ready: Promise.all(loads).then(() => undefined) };

    return () => {
      ro.disconnect();
      player.current = null;
    };
  }, [name, count, focusX, focusY]);

  // Scroll-scrubbed mode.
  useEffect(() => {
    const p = player.current;
    const triggerEl = trigger?.current;
    if (!p || !triggerEl) return;
    if (prefersReducedMotion()) {
      p.state.frame = count - 1;
      p.draw();
      return;
    }
    const tween = gsap.to(p.state, {
      frame: count - 1,
      ease: "none",
      scrollTrigger: { trigger: triggerEl, start, end, scrub: 0.4 },
      onUpdate: p.draw,
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.refresh();
    };
  }, [trigger, start, end, count]);

  // Timed mode: wait for every frame so playback never stutters, then play once.
  useEffect(() => {
    const p = player.current;
    if (!p || !play) return;
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;
    p.ready.then(() => {
      if (cancelled) return;
      if (prefersReducedMotion()) {
        p.state.frame = count - 1;
        p.draw();
        return;
      }
      tween = gsap.to(p.state, { frame: count - 1, duration, ease: "power1.inOut", onUpdate: p.draw });
    });
    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [play, duration, count]);

  return <canvas ref={canvas} className={className} aria-hidden />;
}
