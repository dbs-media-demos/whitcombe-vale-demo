"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";

/**
 * Text that arrives redacted, one black bar per line, and is released for
 * reading as it scrolls into view: the bars lift away line by line, the way an
 * anonymised file is cleared for sharing. The bars are measured from the text's
 * real lines at that moment, so they always fit.
 */
export function Redacted({ children, className, delay = 0.2 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return revealOnScroll(
      el,
      () => gsap.set(el, { opacity: 0 }),
      () => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const box = el.getBoundingClientRect();
        const lines = Array.from(range.getClientRects()).filter((r) => r.width > 2);
        const bars = lines.map((r) => {
          const bar = document.createElement("span");
          bar.setAttribute("aria-hidden", "true");
          bar.className = "redaction-bar";
          Object.assign(bar.style, {
            left: `${r.left - box.left - 2}px`,
            top: `${r.top - box.top + r.height * 0.12}px`,
            width: `${r.width + 4}px`,
            height: `${r.height * 0.8}px`,
          });
          el.appendChild(bar);
          return bar;
        });
        gsap.set(el, { opacity: 1 });
        gsap.to(bars, {
          scaleX: 0,
          duration: 1.1,
          delay,
          stagger: 0.14,
          ease: "expo.inOut",
          onComplete: () => bars.forEach((b) => b.remove()),
        });
      },
    );
  }, [delay]);

  return (
    <p ref={ref} className={clsx("relative", className)}>
      {children}
    </p>
  );
}
