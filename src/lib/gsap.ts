"use client";

/** Same test as the phone block in globals.css: below 768 px or a touch screen. */
export const PHONE_QUERY = "(max-width: 767px), (pointer: coarse)";

export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

/**
 * GSAP is desktop-only and arrives in its own chunk, so phones never download it. These live
 * bindings are filled in by loadGsap(): touch them only inside useIdleGSAP, useDeskGSAP,
 * revealOnScroll's callbacks or after loadGsap() has resolved.
 */
export let gsap: typeof import("gsap").gsap;
export let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;

let loading: Promise<void> | undefined;
export const loadGsap = () =>
  (loading ??= import("./gsap-core").then((m) => {
    gsap = m.gsap;
    ScrollTrigger = m.ScrollTrigger;
  }));

if (typeof window !== "undefined" && !isPhone()) void loadGsap();

/** SplitText is only needed once a headline scrolls into view, so it loads on demand. */
let splitText: Promise<typeof import("gsap/SplitText").SplitText> | null = null;
export function loadSplitText() {
  splitText ??= import("gsap/SplitText").then(({ SplitText }) => {
    gsap.registerPlugin(SplitText);
    return SplitText;
  });
  return splitText;
}
