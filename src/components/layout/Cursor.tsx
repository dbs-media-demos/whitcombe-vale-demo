"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A brass ring that trails the pointer. Elements with data-cursor="Read"
 * turn it into a small labelled parchment disc. Desktop only.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- media queries are only known on the client
    if (fine && !reduce) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.6, ease: "power3" });

    let current: Element | null = null;
    const onMove = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button'], input, textarea, select, summary, label") ?? null;
      if (target === current) return;
      current = target;
      const text = target?.getAttribute("data-cursor") ?? null;
      setLabel(text);
      ring.current!.dataset.state = text ? "label" : target ? (target.matches("input, textarea, select") ? "text" : "link") : "idle";
    };
    const onDown = () => gsap.to(ring.current, { scale: 0.85, duration: 0.2 });
    const onUp = () => gsap.to(ring.current, { scale: 1, duration: 0.4 });
    const onLeave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={ring}
        data-state="idle"
        className="cursor-ring absolute left-0 top-0 -ml-[18px] -mt-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-brass/70 transition-[width,height,margin,background-color,border-color] duration-700 ease-[var(--ease-out-expo)]"
      >
        <span className="t-caps-sm whitespace-nowrap text-[0.6rem] text-ink opacity-0 transition-opacity duration-300">{label}</span>
      </div>
      <div ref={dot} className="absolute left-0 top-0 -ml-[2.5px] -mt-[2.5px] h-[5px] w-[5px] rounded-full bg-brass" />
      <style>{`
        html.has-cursor, html.has-cursor * { cursor: none !important; }
        .cursor-ring[data-state="link"] { width: 58px; height: 58px; margin: -29px 0 0 -29px; border-color: var(--brass); }
        .cursor-ring[data-state="text"] { width: 2px; height: 30px; margin: -15px 0 0 -1px; border-radius: 1px; background: var(--brass); }
        .cursor-ring[data-state="label"] { width: 88px; height: 88px; margin: -44px 0 0 -44px; background: var(--parchment); border-color: transparent; }
        .cursor-ring[data-state="label"] span { opacity: 1; }
      `}</style>
    </div>
  );
}
