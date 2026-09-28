"use client";

import { useEffect, type RefObject } from "react";
import { useGSAP } from "@/lib/gsap";

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

/**
 * Like useGSAP, but the setup runs from the idle queue instead of during
 * hydration. Everything created inside is recorded in the component's GSAP
 * context and reverted on unmount.
 */
export function useIdleGSAP(setup: () => void | (() => void), scope: RefObject<Element | null>) {
  const { context } = useGSAP({ scope });
  useEffect(() => {
    let cancelled = false;
    enqueue(() => {
      if (!cancelled) context.add(setup);
    });
    return () => {
      cancelled = true;
    };
    // Setup is captured once, like useGSAP without dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);
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

export function revealOnScroll(el: Element, hide: () => void, show: () => void) {
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
