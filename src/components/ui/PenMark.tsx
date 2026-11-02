"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll, useIdleGSAP } from "@/lib/useIdleGSAP";

/**
 * A stroke of brass ink, the way an attorney marks up a document: a circle round
 * the figure that matters, a line under the word. It writes itself once when it
 * scrolls into view, or follows the scroll (`scrub`) like a pen being drawn
 * across the page. Each path is one stroke, written in order.
 */
export function PenMark({
  paths,
  viewBox,
  className,
  strokeWidth = 1.5,
  duration = 1.4,
  delay = 0.35,
  scrub = false,
}: {
  paths: string[];
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
  scrub?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || scrub || prefersReducedMotion()) return;
    const strokes = el.querySelectorAll("path");
    return revealOnScroll(
      el,
      () => gsap.set(strokes, { strokeDashoffset: 1 }),
      () => gsap.to(strokes, { strokeDashoffset: 0, duration, delay, stagger: duration * 0.8, ease: "power2.inOut" }),
    );
  }, [scrub, duration, delay]);

  useIdleGSAP(() => {
    const el = ref.current;
    if (!el || !scrub || prefersReducedMotion()) return;
    gsap.fromTo(
      el.querySelectorAll("path"),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, ease: "none", stagger: 0.5, scrollTrigger: { trigger: el, start: "top 88%", end: "top 38%", scrub: 0.8 } },
    );
  }, ref);

  return (
    <svg ref={ref} aria-hidden viewBox={viewBox} preserveAspectRatio="none" className={className} fill="none">
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          strokeDasharray="1 1"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
