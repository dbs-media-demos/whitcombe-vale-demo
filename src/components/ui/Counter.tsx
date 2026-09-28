"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";

const format = (n: number, decimals: number, prefix: string, suffix: string) =>
  `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

/** Number that counts up once when scrolled into view. The final value is server-rendered. */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { n: 0 };
    return revealOnScroll(
      el,
      () => (el.textContent = format(0, decimals, prefix, suffix)),
      () =>
        gsap.to(obj, {
          n: value,
          duration: 2.4,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = format(obj.n, decimals, prefix, suffix);
          },
        }),
    );
  }, [value, decimals, prefix, suffix]);
  return (
    <span ref={ref} className={className}>
      {format(value, decimals, prefix, suffix)}
    </span>
  );
}
