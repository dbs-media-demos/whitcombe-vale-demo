"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PHONE_QUERY } from "@/lib/gsap";
import type { ScalesScene } from "@/components/fx/scales/scene";

/** Live 3D only on a big screen with a mouse. Everything else keeps the still. */
const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * The brass scales beside the headline. The server HTML carries a still rendered from the 3D scene
 * (scripts/render-scales.mjs), so the scales are there on the first frame on every device. On a desktop
 * with a mouse, once the page has loaded, the scene's code is fetched with `await import()` (three.js
 * never reaches a phone) and the live canvas fades in over the still from the very same camera. Then a
 * weight seems to settle in one pan and the balance swings back to level; it leans towards the pointer,
 * swings with the scroll and comes to rest level as the arch opens. Frames are drawn only while
 * something moves and the hero is on screen.
 *
 * `live={false}` (Serbian pages: calm, no showpiece 3D) keeps the still everywhere.
 */
export function HeroScales({ live = true, className }: { live?: boolean; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!live || !el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!window.matchMedia(DESK_3D).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    let cancelled = false;
    let sc: ScalesScene | undefined;
    const timers: number[] = [];
    const off: (() => void)[] = [];

    const start = async () => {
      let createScales: typeof import("@/components/fx/scales/scene").createScales;
      try {
        ({ createScales } = await import("@/components/fx/scales/scene"));
        if (cancelled) return;
        sc = await createScales(el);
        if (cancelled) return sc.dispose();
      } catch {
        return; // no WebGL: the still stays
      }
      const scene = sc;
      scene.onReady(() => {
        if (cancelled) return;
        setOn(true);
        // The still and the first frame match, so the fade is invisible; then the balance moves
        timers.push(window.setTimeout(() => scene.intro(), 650));
      });

      let lastY = window.scrollY;
      let onScreen = true;
      const progress = () => Math.min(1, window.scrollY / (window.innerHeight * 1.1));
      const onScroll = () => {
        const y = window.scrollY;
        const p = progress();
        scene.scroll(p, y - lastY);
        lastY = y;
        scene.setVisible(onScreen && p < 0.9);
      };
      const onMove = (e: PointerEvent) => scene.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      const io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        scene.setVisible(onScreen && progress() < 0.9);
      });
      io.observe(el);
      const ro = new ResizeObserver(() => scene.resize());
      ro.observe(el);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onMove, { passive: true });
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onMove);
      });
      scene.scroll(progress(), 0);
    };

    // After the page has loaded, the opening has played (~1.2 s) and the browser is idle: the first
    // paint never waits for the 3D, and its one-off setup (the WebGL context, the brass's reflections)
    // never lands in the middle of the opening
    const idle = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
      timers.push(window.setTimeout(() => ric(() => void start(), { timeout: 1200 }), Math.max(0, 1200 - performance.now())));
    };
    if (document.readyState === "complete") idle();
    else {
      window.addEventListener("load", idle, { once: true });
      off.push(() => window.removeEventListener("load", idle));
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      off.forEach((f) => f());
      sc?.dispose();
    };
  }, [live]);

  return (
    <div aria-hidden className={clsx("relative aspect-[4/3]", className)}>
      <picture>
        <source media={PHONE_QUERY} srcSet={BLANK} />
        <source type="image/avif" srcSet="/images/scales/scales-680.avif 680w, /images/scales/scales-1160.avif 1160w" sizes="(min-width: 768px) min(36vw, 52vh), 1px" />
        {/* A still pre-rendered with alpha at two fixed sizes, so no image optimiser touches it */}
        <img
          src="/images/scales/scales-1160.webp"
          srcSet="/images/scales/scales-680.webp 680w, /images/scales/scales-1160.webp 1160w"
          sizes="(min-width: 768px) min(36vw, 52vh), 1px"
          width={1160}
          height={870}
          alt=""
          decoding="async"
          className={clsx("absolute inset-0 h-full w-full transition-opacity duration-700", on && "opacity-0 delay-300")}
        />
      </picture>
      <canvas ref={canvas} className={clsx("absolute inset-0 h-full w-full transition-opacity duration-500", on ? "opacity-100" : "opacity-0")} />
    </div>
  );
}

/** Phones: the same scales, a tighter still from the desktop scene. No script. */
export function HeroScalesStill({ className }: { className?: string }) {
  return (
    <picture className={className}>
      <source media="(min-width: 768px) and (pointer: fine), (min-width: 768px) and (pointer: none)" srcSet={BLANK} />
      <source type="image/avif" srcSet="/images/scales/scales-phone.avif" />
      <img src="/images/scales/scales-phone.webp" width={400} height={400} alt="" decoding="async" fetchPriority="low" className="block h-auto w-full" />
    </picture>
  );
}
