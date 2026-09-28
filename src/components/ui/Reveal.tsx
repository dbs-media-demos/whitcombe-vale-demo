"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, loadSplitText, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll, useIdleGSAP } from "@/lib/useIdleGSAP";

/*
 * Scroll-driven reveals. Slow and precise, never showy.
 *
 * Content is always in the HTML and visible by default. JavaScript only hides
 * elements that start below the fold (with opacity or clip), then animates them
 * in as they arrive. Reveal-once effects use one shared IntersectionObserver;
 * scrubbed effects are set up from the idle queue.
 * Above-the-fold intros use the CSS classes in globals.css instead.
 */


type SplitProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  id?: string;
};

/** Headline whose lines rise out of a mask as it scrolls into view. */
export function SplitReveal({ children, as: Tag = "h2", className, delay = 0, stagger = 0.11, id }: SplitProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let split: { revert: () => void } | null = null;
    let alive = true;
    const stop = revealOnScroll(
      el,
      () => gsap.set(el, { opacity: 0 }),
      async () => {
        const SplitText = await loadSplitText();
        if (!alive) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { opacity: 1 });
            return gsap.from(self.lines, { yPercent: 110, duration: 1.6, stagger, delay, ease: "expo.out" });
          },
        });
      },
    );
    return () => {
      alive = false;
      stop();
      split?.revert();
    };
  }, [delay, stagger]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  /** Stagger direct children instead of the wrapper. */
  stagger?: number;
  style?: CSSProperties;
  id?: string;
};

/** Fade and rise when scrolled into view. */
export function Reveal({ children, as: Tag = "div", className, delay = 0, y = 28, stagger, style, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = stagger ? Array.from(el.children) : [el];
    return revealOnScroll(
      el,
      () => gsap.set(targets, { opacity: 0, y }),
      () => gsap.to(targets, { opacity: 1, y: 0, duration: 1.5, delay, stagger: stagger ?? 0, ease: "expo.out", clearProps: "transform" }),
    );
  }, [delay, stagger, y]);

  return (
    <Tag ref={ref} className={className} style={style} id={id}>
      {children}
    </Tag>
  );
}

/** A hairline rule that draws itself from the left when it enters. */
export function DrawRule({ className, delay = 0, origin = "left" }: { className?: string; delay?: number; origin?: "left" | "center" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return revealOnScroll(
      el,
      () => gsap.set(el, { scaleX: 0 }),
      () => gsap.to(el, { scaleX: 1, duration: 1.8, delay, ease: "expo.inOut" }),
    );
  }, [delay]);
  return <div ref={ref} aria-hidden className={clsx("rule", className)} style={{ transformOrigin: `${origin} center` }} />;
}

/** Paragraph whose words ink in one by one as you scroll through it. */
export function ScrubWords({ text, className, as: Tag = "p", accent = [] }: { text: string; className?: string; as?: ElementType; accent?: string[] }) {
  const ref = useRef<HTMLElement>(null);

  useIdleGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = el.querySelectorAll<HTMLElement>("[data-w]:not([data-accent])");
      // Starts above 3:1 contrast (WCAG large text), so it's readable before scrolling.
      gsap.fromTo(
        words,
        { opacity: 0.55 },
        { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.8 } },
      );
    },
    ref,
  );

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w data-accent={accent.includes(w.replace(/[.,;:]/g, "")) || undefined} className={clsx("inline", accent.includes(w.replace(/[.,;:]/g, "")) && "t-italic text-accent")}>
          {w}{" "}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Image frame that unmasks on enter (clip-path, no layout shift) and
 * drifts slowly with scroll.
 */
export function Parallax({
  children,
  className,
  amount = 10,
  reveal = true,
  from = "inset(14% 10% 14% 10%)",
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  reveal?: boolean;
  from?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIdleGSAP(
    () => {
      const el = ref.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!el || !inner || prefersReducedMotion()) return;
      gsap.set(inner, { scale: 1 + amount / 100 });
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    ref,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !reveal || prefersReducedMotion()) return;
    return revealOnScroll(
      el,
      () => gsap.set(el, { clipPath: from }),
      () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 2, ease: "expo.out" }),
    );
  }, [reveal, from]);

  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}

export { ScrollTrigger };
