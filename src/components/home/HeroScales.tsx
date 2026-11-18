"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PHONE_QUERY } from "@/lib/gsap";
import { frameWatch, gpuContext, keepStillForVisit, stillForVisit } from "@/lib/live-3d";
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
 * something moves, the hero is on screen and the tab is visible.
 *
 * It never stutters on a weak machine: no real GPU keeps the still (and never fetches three.js); the
 * still stays up until the shaders are compiled and frames have been drawn behind it; and if the first
 * 2 s of frames run under ~45 fps the canvas fades back to the still for the rest of the visit.
 *
 * `live={false}` (Serbian pages: calm, no showpiece 3D) keeps the still everywhere.
 */
export function HeroScales({ live = true, className }: { live?: boolean; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(false);
  // Frames are only timed once the canvas is the one on screen
  const on = useRef(false);

  useEffect(() => {
    const el = canvas.current;
    if (!live || !el || stillForVisit()) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!window.matchMedia(DESK_3D).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData) return;

    let cancelled = false;
    let sc: ScalesScene | undefined;
    const timers: number[] = [];
    const off: (() => void)[] = [];
    const teardown = () => {
      off.forEach((f) => f());
      off.length = 0;
      sc?.dispose();
      sc = undefined;
    };

    // Too slow here: back to the still (the canvas fades out on its last frame), the renderer is freed
    // and every scene keeps its still for this page load (two slow loads: the rest of the visit)
    const fallBack = () => {
      if (cancelled || !sc) return;
      on.current = false;
      sc.freeze();
      keepStillForVisit("slow");
      setShown(false);
      timers.push(window.setTimeout(teardown, 900));
    };

    const start = async () => {
      const t0 = performance.now();
      // A real graphics chip or the still: checked before three.js is even fetched
      const gl = gpuContext(el);
      if (!gl) return keepStillForVisit("gpu");
      const watch = frameWatch((v) => {
        performance.mark("scales:verdict", { detail: v });
        if (!v.pass) fallBack();
      });
      let createScales: typeof import("@/components/fx/scales/scene").createScales;
      try {
        ({ createScales } = await import("@/components/fx/scales/scene"));
        if (cancelled) return;
        // Resolves once the shaders are compiled and frames have been drawn behind the still
        sc = await createScales(el, { context: gl, onFrame: (dt, work) => on.current && watch(dt, work) });
        if (cancelled) return teardown();
      } catch {
        return; // the still stays
      }
      const scene = sc;
      performance.measure("scales:ready", { start: t0, detail: { at: performance.now() } });
      // The still and the first frame match, so the fade is invisible; then the balance moves
      on.current = true;
      setShown(true);
      timers.push(window.setTimeout(() => scene.intro(), 650));

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
    // paint never waits for the 3D, and its one-off setup (the WebGL context, the brass's reflections,
    // the shaders) runs behind the still, never in the middle of the opening
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
      on.current = false;
      timers.forEach(clearTimeout);
      teardown();
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
          className={clsx("absolute inset-0 h-full w-full transition-opacity duration-700", shown && "opacity-0 delay-300")}
        />
      </picture>
      <canvas ref={canvas} className={clsx("absolute inset-0 h-full w-full transition-opacity duration-500", shown ? "opacity-100" : "opacity-0")} />
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
