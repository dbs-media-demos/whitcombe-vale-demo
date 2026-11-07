"use client";

import { useEffect, type RefObject } from "react";
import { gsap, isPhone, loadGsap } from "@/lib/gsap";

/*
 * Below-the-fold scroll effects don't need to exist during the first second.
 * Their setups go into one queue that starts when the browser is idle and
 * runs a few milliseconds at a time, yielding between chunks, so dozens of
 * small setups never add up to one long main-thread task.
 */
const queue: (() => void)[] = [];
let scheduled = false;

function pump() {
  const start = performance.now();
  while (queue.length && performance.now() - start < 10) queue.shift()!();
  if (queue.length) window.setTimeout(pump, 0);
  else scheduled = false;
}

function enqueue(job: () => void) {
  queue.push(job);
  if (scheduled) return;
  scheduled = true;
  const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
  ric(() => pump(), { timeout: 1600 });
}

/** Desktop animation wiring that runs as soon as GSAP has loaded. Phones skip it: they get the stacked page. */
export function useDeskGSAP(setup: () => void | (() => void), scope: RefObject<Element | null>) {
  useEffect(() => {
    if (isPhone()) return;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    loadGsap().then(() => {
      if (!cancelled) ctx = gsap.context(setup, scope.current ?? undefined);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // Setup is captured once, like useGSAP without dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Like useDeskGSAP, but the setup runs from the idle queue instead of during
 * hydration. Everything created inside is recorded in a GSAP context and
 * reverted on unmount.
 */
export function useIdleGSAP(setup: () => void | (() => void), scope: RefObject<Element | null>) {
  useEffect(() => {
    if (isPhone()) return;
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    loadGsap().then(() => {
      if (cancelled) return;
      enqueue(() => {
        if (!cancelled) ctx = gsap.context(setup, scope.current ?? undefined);
      });
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // Setup is captured once, like useGSAP without dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/*
 * One shared IntersectionObserver for "reveal once" effects. It needs no
 * layout reads: the first observation says whether the element starts below
 * the fold (then it is hidden), later ones say when it arrives (then shown).
 * Elements that start on screen are never touched.
 */
type Job = { hide: () => void; show: () => void; hidden: boolean };
const jobs = new WeakMap<Element, Job>();
let io: IntersectionObserver | null = null;

function watch(el: Element, hide: () => void, show: () => void) {
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const job = jobs.get(e.target);
        if (!job) continue;
        if (!job.hidden) {
          if (e.boundingClientRect.top > window.innerHeight * 0.92) {
            job.hide();
            job.hidden = true;
          } else {
            io!.unobserve(e.target);
            jobs.delete(e.target);
          }
        } else if (e.isIntersecting) {
          io!.unobserve(e.target);
          jobs.delete(e.target);
          job.show();
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  jobs.set(el, { hide, show, hidden: false });
  io.observe(el);
  return () => {
    io?.unobserve(el);
    jobs.delete(el);
  };
}

/** Desktop only: on phones nothing is hidden and GSAP is never fetched (PhoneRise fades the sections in instead). */
export function revealOnScroll(el: Element, hide: () => void, show: () => void) {
  if (isPhone()) return () => {};
  let live = true;
  let stop: (() => void) | undefined;
  loadGsap().then(() => {
    if (live) stop = watch(el, hide, show);
  });
  return () => {
    live = false;
    stop?.();
  };
}
