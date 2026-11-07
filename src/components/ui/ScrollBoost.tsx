"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { isPhone, prefersReducedMotion } from "@/lib/gsap";

/**
 * Hands a CSS marquee to the reader's scroll: scrolling down sends the letters
 * past faster, scrolling up runs them backwards, and they ease back to their
 * own unhurried pace when the page is still.
 */
export function ScrollBoost({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isPhone() || prefersReducedMotion()) return;
    const anims = () => Array.from(el.querySelectorAll<HTMLElement>(".marquee")).flatMap((m) => m.getAnimations());
    let rate = 1;
    let goal = 1;
    let lastY = window.scrollY;
    let raf = 0;
    let visible = false;

    const frame = () => {
      goal += (1 - goal) * 0.06;
      rate += (goal - rate) * 0.12;
      const busy = Math.abs(rate - 1) > 0.005 || Math.abs(goal - 1) > 0.005;
      if (!busy) rate = goal = 1;
      for (const a of anims()) a.playbackRate = rate;
      raf = busy ? requestAnimationFrame(frame) : 0;
    };
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (!visible) return;
      goal = Math.max(-4, Math.min(6, goal + dy * 0.05));
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      lastY = window.scrollY;
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
