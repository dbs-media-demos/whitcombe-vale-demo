"use client";

import { useEffect, useRef, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";

/**
 * A folded plan opened out on the desk: the middle panel shows first, the two
 * side panels unfold from its creases, their shadow lifting as they flatten,
 * and brass registration marks are ruled in at the corners. The creases stay
 * as the faintest lines, the way a map that has been folded keeps them.
 */
export function UnfoldFrame({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const sheet = el.querySelector("[data-sheet]");
    const shades = el.querySelectorAll("[data-shade]");
    const creases = el.querySelectorAll("[data-crease]");
    const marks = el.querySelectorAll("[data-mark]");
    return revealOnScroll(
      el,
      () => {
        gsap.set(sheet, { clipPath: "inset(4% 33.4% 4% 33.4%)" });
        gsap.set(shades, { opacity: 1 });
        gsap.set(creases, { opacity: 0.9 });
        gsap.set(marks, { scale: 0 });
      },
      () => {
        gsap
          .timeline()
          .to(sheet, { clipPath: "inset(0% 33.4% 0% 33.4%)", duration: 0.5, ease: "power2.out" })
          .to(sheet, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" })
          .to(shades, { opacity: 0, duration: 1.4, ease: "power2.out" }, "<0.35")
          .to(creases, { opacity: 0.22, duration: 1.6, ease: "power2.out" }, "<0.3")
          .to(marks, { scale: 1, duration: 1.1, stagger: 0.08, ease: "expo.out" }, "<0.2");
      },
    );
  }, []);

  const mark = "pointer-events-none absolute h-5 w-5 border-brass";
  return (
    <div ref={ref} className={clsx("relative", className)}>
      <div data-sheet className="relative h-full w-full overflow-hidden">
        {children}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span data-shade className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(to_right,rgba(28,28,26,.45),rgba(28,28,26,.12))] opacity-0" />
          <span data-shade className="absolute inset-y-0 right-0 w-1/3 bg-[linear-gradient(to_left,rgba(28,28,26,.45),rgba(28,28,26,.12))] opacity-0" />
          <span data-crease className="absolute inset-y-0 left-1/3 w-px bg-[linear-gradient(to_bottom,transparent,rgba(28,28,26,.6)_15%,rgba(28,28,26,.6)_85%,transparent)] opacity-[0.22]" />
          <span data-crease className="absolute inset-y-0 left-2/3 w-px bg-[linear-gradient(to_bottom,transparent,rgba(28,28,26,.6)_15%,rgba(28,28,26,.6)_85%,transparent)] opacity-[0.22]" />
        </div>
      </div>
      <span data-mark aria-hidden className={clsx(mark, "-left-2 -top-2 origin-top-left border-l border-t")} />
      <span data-mark aria-hidden className={clsx(mark, "-right-2 -top-2 origin-top-right border-r border-t")} />
      <span data-mark aria-hidden className={clsx(mark, "-bottom-2 -left-2 origin-bottom-left border-b border-l")} />
      <span data-mark aria-hidden className={clsx(mark, "-bottom-2 -right-2 origin-bottom-right border-b border-r")} />
    </div>
  );
}
