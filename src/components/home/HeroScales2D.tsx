"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import clsx from "clsx";
import { PHONE_QUERY } from "@/lib/gsap";
import layout from "@/components/home/scales-layers.json";

const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const [FW, FH] = layout.frame;
type Name = keyof typeof layout.layers;
const SIZES = "(min-width: 768px) min(36vw, 52vh), 1px";

/** A point of the frame (in %) as transform-origin inside a layer's own box. */
const origin = (n: Name, p: number[]) => {
  const l = layout.layers[n];
  return `${(((p[0] - l.left) / l.width) * 100).toFixed(3)}% ${(((p[1] - l.top) / l.height) * 100).toFixed(3)}%`;
};

/**
 * /v2's brass scales: no three.js, no WebGL. The scene behind the desktop's live 3D is rendered once
 * into cut-out layers (scripts/render-scales-layers.mjs: the light on the wall, the beam's shadow, the
 * stand, the beam, each pan), and this stacks them on the very same camera, so at rest it is the still
 * pixel for pixel. A few dozen lines of physics then swing them with CSS transforms: about a second in,
 * a weight seems to land in one pan and the balance swings back to level, the pans hanging true from
 * the beam's ends as real pendulums and the beam's shadow tilting with it on the wall. It leans towards
 * the pointer, the brass drifts a little over its own shadow for depth, and the scroll sets it rocking.
 * Frames run only while something moves; reduced motion keeps it still.
 *
 * `calm` (Serbian pages: sober, no showpiece) keeps only the opening settle, smaller, and no lean.
 */
export function HeroScales2D({ calm = false, className }: { calm?: boolean; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia(PHONE_QUERY).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const part = (n: string) => el.querySelector<HTMLElement>(`[data-l="${n}"]`)!;
    const beam = part("beam");
    const shadow = part("shadow");
    const pans = [part("pan0"), part("pan1")];
    const brass = el.querySelector<HTMLElement>("[data-brass]")!;
    const wall = el.querySelector<HTMLElement>("[data-wall]")!;

    // Frame units are px of the 1160 x 870 render: rotations happen in true proportions
    const pv = [(layout.pivot[0] / 100) * FW, (layout.pivot[1] / 100) * FH];
    const arm = layout.hang.map((h) => [(h[0] / 100) * FW - pv[0], (h[1] / 100) * FH - pv[1]]);
    const box = pans.map((_, i) => layout.layers[i ? "pan1" : "pan0"]);
    const ARM = 1.13;

    const s = { th: 0, om: 0, ph: [0, 0], phv: [0, 0], lean: 0, leanY: 0, dx: 0, dy: 0, progress: 0, kick: 0 };
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const paint = () => {
      const a = -s.th * layout.gain; // CSS turns clockwise; + in the scene lifts the right pan
      const deg = (r: number) => `${((r * 180) / Math.PI).toFixed(3)}deg`;
      beam.style.transform = `rotate(${deg(a)})`;
      shadow.style.transform = `rotate(${deg(a * 0.9)})`;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      pans.forEach((p, i) => {
        const [x, y] = arm[i];
        const tx = ((x * c - y * sn - x) / ((box[i].width / 100) * FW)) * 100;
        const ty = ((x * sn + y * c - y) / ((box[i].height / 100) * FH)) * 100;
        p.style.transform = `translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%) rotate(${deg(-s.ph[i] * layout.gain)})`;
      });
      // The brass sits in front of its wall: they part a little as the pointer moves
      brass.style.transform = `translate(${(s.dx * 0.9).toFixed(2)}%, ${(s.dy * 0.5).toFixed(2)}%)`;
      wall.style.transform = `translate(${(-s.dx * 0.5).toFixed(2)}%, ${(-s.dy * 0.3).toFixed(2)}%)`;
    };

    // The same balance as the live scene: a damped spring for the beam, real pendulums for the pans
    const step = (dt: number) => {
      const p = s.progress;
      const settle = 1 - p * p * (3 - 2 * p);
      const target = (-s.lean * 0.075 - Math.sin(Math.PI * Math.min(1, p / 0.55)) * 0.07) * settle;
      const acc = -9 * (s.th - target) - 1.25 * s.om + s.kick;
      s.kick = 0;
      const om0 = s.om;
      s.om += acc * dt;
      s.th += s.om * dt;
      const alpha = (s.om - om0) / dt;
      for (let i = 0; i < 2; i++) {
        const side = i ? 1 : -1;
        const ax = -side * ARM * (Math.sin(s.th) * alpha + Math.cos(s.th) * s.om * s.om);
        const acc2 = -9.3 * Math.sin(s.ph[i]) - ax * Math.cos(s.ph[i]) * 0.95 - 0.9 * s.phv[i];
        s.phv[i] += acc2 * dt;
        s.ph[i] += s.phv[i] * dt;
      }
      const k = Math.min(1, dt * 3.2);
      const ddx = s.lean * 1.2 - s.dx;
      const ddy = s.leanY * 0.8 - s.dy;
      s.dx += ddx * k;
      s.dy += ddy * k;
      return (
        Math.abs(s.om) + Math.abs(s.th - target) + Math.abs(s.phv[0]) + Math.abs(s.phv[1]) + Math.abs(s.ph[0]) + Math.abs(s.ph[1]) > 0.0006 ||
        Math.abs(ddx) + Math.abs(ddy) > 0.004
      );
    };

    const frame = (now: number) => {
      const dt = Math.min(1 / 30, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const moving = step(dt);
      paint();
      raf = moving && onScreen && !document.hidden ? requestAnimationFrame(frame) : 0;
      if (!raf) last = 0;
    };
    const wake = () => {
      if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const progress = () => Math.min(1, window.scrollY / (window.innerHeight * 1.1));
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      s.progress = progress();
      s.kick += Math.max(-1, Math.min(1, (y - lastY) / 60)) * (calm ? 1 : 2.2);
      lastY = y;
      wake();
    };
    const onMove = (e: PointerEvent) => {
      s.lean = (e.clientX / window.innerWidth) * 2 - 1;
      s.leanY = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };
    const onVis = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0), (last = 0)) : wake());
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) wake();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!calm) window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    s.progress = progress();

    // About a second in, as the scales finish rising: a weight seems to settle in the right pan
    const t = window.setTimeout(
      () => {
        s.om = calm ? -0.24 : -0.42;
        s.phv[1] = calm ? -0.06 : -0.12;
        wake();
      },
      Math.max(0, 1150 - performance.now()),
    );

    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [calm]);

  const layer = (n: Name, extra?: CSSProperties) => {
    const l = layout.layers[n];
    return (
      <picture key={n}>
        <source media={PHONE_QUERY} srcSet={BLANK} />
        <source type="image/avif" srcSet={`/images/scales/layers/${n}.avif ${l.w}w`} sizes={SIZES} />
        <img
          data-l={n}
          src={`/images/scales/layers/${n}.webp`}
          width={l.w}
          height={l.h}
          alt=""
          decoding="async"
          className="absolute max-w-none will-change-transform"
          style={{ left: `${l.left}%`, top: `${l.top}%`, width: `${l.width}%`, height: `${l.height}%`, ...extra }}
        />
      </picture>
    );
  };

  return (
    <div ref={root} aria-hidden className={clsx("relative aspect-[4/3]", className)}>
      <div data-wall className="absolute inset-0 will-change-transform">
        {layer("wall")}
        {layer("shadow", { transformOrigin: origin("shadow", layout.shadowPivot) })}
      </div>
      <div data-brass className="absolute inset-0 will-change-transform">
        {layer("stand")}
        {layer("beam", { transformOrigin: origin("beam", layout.pivot) })}
        {layer("pan0", { transformOrigin: origin("pan0", layout.hang[0]) })}
        {layer("pan1", { transformOrigin: origin("pan1", layout.hang[1]) })}
      </div>
    </div>
  );
}
