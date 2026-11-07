"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, isPhone, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";

/**
 * The clause that matters, marked the way an attorney marks a contract: a soft
 * brass highlighter runs along each line in reading order when the paragraph
 * scrolls into view. The strokes are measured from the text's real lines at
 * that moment, so they fit any language, and measured again if the width changes.
 * With reduced motion the marks are simply there; on phones a plain CSS highlight stands in.
 */
export function ClauseMark({ children, className, delay = 0.4 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isPhone()) return;
    let marks: HTMLSpanElement[] = [];
    let alive = true;
    let width = window.innerWidth;
    const measure = () => {
      marks.forEach((m) => m.remove());
      const range = document.createRange();
      range.selectNodeContents(el);
      const box = el.getBoundingClientRect();
      // One rect per line: inline children (a footnote marker) report their own rects, so merge by line;
      // anything laid out outside the paragraph (the footnote's popover) is not part of the clause
      const lines: DOMRect[] = [];
      for (const r of Array.from(range.getClientRects())) {
        if (r.width < 2 || r.top < box.top - 2 || r.bottom > box.bottom + 2) continue;
        const i = lines.findIndex((l) => Math.abs(l.top - r.top) < r.height * 0.5);
        if (i < 0) lines.push(r);
        else {
          const l = lines[i];
          const left = Math.min(l.left, r.left);
          lines[i] = new DOMRect(left, l.top, Math.max(l.right, r.right) - left, Math.max(l.height, r.height));
        }
      }
      marks = lines.map((r) => {
        const m = document.createElement("span");
        m.setAttribute("aria-hidden", "true");
        m.className = "clause-mark";
        Object.assign(m.style, {
          left: `${r.left - box.left - 3}px`,
          top: `${r.top - box.top + r.height * 0.52}px`,
          width: `${r.width + 6}px`,
          height: `${r.height * 0.4}px`,
        });
        el.appendChild(m);
        return m;
      });
    };
    // With reduced motion the clause is simply marked, once the fonts have set its lines
    const stop = prefersReducedMotion()
      ? (void document.fonts.ready.then(() => alive && measure()), () => {})
      : revealOnScroll(
          el,
          () => {},
          () => {
            measure();
            gsap.fromTo(marks, { scaleX: 0 }, { scaleX: 1, duration: 0.9, delay, stagger: 0.55, ease: "power2.inOut" });
          },
        );
    // The lines move when the width changes: measure again, already drawn
    const onResize = () => {
      if (!marks.length || window.innerWidth === width) return;
      width = window.innerWidth;
      measure();
    };
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      stop();
      marks.forEach((m) => m.remove());
      window.removeEventListener("resize", onResize);
    };
  }, [delay]);

  return (
    <p ref={ref} className={clsx("relative isolate", className)}>
      <span className="clause-ink">{children}</span>
    </p>
  );
}
