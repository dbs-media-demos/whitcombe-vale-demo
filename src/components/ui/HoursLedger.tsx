"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";
import { DAY_NAMES, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const never = () => () => {};

/**
 * The week's hours as ledger lines that rule themselves in, with today's line
 * marked by a brass ribbon, as in a diary kept open on the desk.
 */
export function HoursLedger({ biz, className }: { biz: Biz; className?: string }) {
  const ref = useRef<HTMLDListElement>(null);
  // Today in the office's time zone; unknown on the server, so no row is marked until hydration
  const today = useSyncExternalStore(
    never,
    () => WEEKDAYS.indexOf(new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: biz.timezone }).format(new Date())),
    () => null,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const rules = el.querySelectorAll("[data-ledger-rule]");
    const cells = el.querySelectorAll("[data-ledger-row] > dt, [data-ledger-row] > dd");
    return revealOnScroll(
      el,
      () => {
        gsap.set(rules, { scaleX: 0 });
        gsap.set(cells, { opacity: 0, y: 8 });
      },
      () => {
        gsap.to(rules, { scaleX: 1, duration: 1.3, stagger: 0.07, ease: "expo.inOut" });
        gsap.to(cells, { opacity: 1, y: 0, duration: 1, stagger: 0.035, delay: 0.25, ease: "expo.out" });
      },
    );
  }, []);

  if (!biz.hours) return null;
  return (
    <dl ref={ref} className={clsx("space-y-1.5 text-sm", className)}>
      {weekFromMonday(biz.hours).map((h) => {
        const isToday = h.day === today;
        return (
          <div key={h.day} data-ledger-row className="relative flex justify-between gap-4 pb-1.5">
            <span
              aria-hidden
              className={clsx(
                "absolute -left-4 bottom-1.5 top-0 w-[3px] origin-top bg-brass transition-transform duration-1000 ease-[var(--ease-out-expo)]",
                isToday ? "scale-y-100" : "scale-y-0",
              )}
            />
            <span data-ledger-rule aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" />
            <dt className={clsx("transition-colors duration-700", isToday ? "text-fg" : "text-muted")}>{DAY_NAMES[biz.lang][h.day]}</dt>
            <dd className={clsx("text-right transition-colors duration-700", isToday && "text-accent")}>{dayRange(h, biz.lang)}</dd>
          </div>
        );
      })}
    </dl>
  );
}
