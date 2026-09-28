"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";

type Doc = "will" | "trust";
type Row = { label: string; will: string; trust: string; meter?: { will: number; trust: number; low: string; high: string } };

const rows: Row[] = [
  { label: "Takes effect", will: "At death", trust: "As soon as it's signed and funded" },
  {
    label: "Probate",
    will: "Required, usually a short independent administration",
    trust: "Avoided for everything titled to the trust",
    meter: { will: 0.15, trust: 0.92, low: "Court-supervised", high: "Court-free" },
  },
  {
    label: "Privacy",
    will: "Filed with the court: a public record",
    trust: "Stays a private document",
    meter: { will: 0.12, trust: 0.95, low: "Public", high: "Private" },
  },
  {
    label: "If you can't manage your affairs",
    will: "Does nothing; your powers of attorney do the work",
    trust: "Your successor trustee steps in, no court needed",
    meter: { will: 0.2, trust: 0.9, low: "Limited", high: "Seamless" },
  },
  {
    label: "Our flat fee",
    will: "$1,450 · couples $2,200",
    trust: "$3,400 · couples $4,200",
    meter: { will: 0.34, trust: 0.8, low: "Lower", high: "Higher" },
  },
  {
    label: "Time for your family to settle things",
    will: "Typically 6–12 months",
    trust: "Often a few weeks",
    meter: { will: 0.82, trust: 0.22, low: "Faster", high: "Slower" },
  },
  { label: "Property in other states", will: "Separate probate in each state", trust: "Handled together, in one place" },
  { label: "Often best for", will: "Young families, simpler estates, naming a guardian", trust: "Homeowners, blended families, privacy, property in two states" },
];

const verdict: Record<Doc, { line: string; href: string; cta: string }> = {
  will: { line: "A will is often all a young family needs, especially to name a guardian for the children.", href: "/practice-areas/wills", cta: "Read chapter IV: Wills" },
  trust: { line: "A trust earns its cost when privacy, speed or property in more than one state matters.", href: "/practice-areas/trusts", cta: "Read chapter V: Trusts" },
};

/**
 * "Will or trust?" An interactive comparison: a brass toggle swaps every row,
 * the answers roll over like a split-flap board and the meters re-measure.
 */
export function WillVsTrust({ headingId = "wvt-title" }: { headingId?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Doc>("will");
  const [shown, setShown] = useState<Doc>("will");
  const busy = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => () => void tl.current?.kill(), []);

  const choose = (next: Doc) => {
    if (next === doc || busy.current) return;
    setDoc(next);
    const values = root.current!.querySelectorAll("[data-val]");
    if (prefersReducedMotion()) {
      setShown(next);
      return;
    }
    busy.current = true;
    tl.current = gsap
      .timeline({ onComplete: () => void (busy.current = false) })
      .to(values, { yPercent: -110, opacity: 0, duration: 0.45, stagger: 0.04, ease: "power3.in" })
      .add(() => setShown(next))
      .fromTo(values, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: "expo.out" }, "+=0.02");
  };

  // Entrance: rows draw in one after another.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.querySelectorAll("[data-row]");
    return revealOnScroll(
      el,
      () => gsap.set(r, { opacity: 0, y: 24 }),
      () => gsap.to(r, { opacity: 1, y: 0, duration: 1.2, stagger: 0.07, ease: "expo.out", clearProps: "transform" }),
    );
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const next = doc === "will" ? "trust" : "will";
      choose(next);
      (root.current?.querySelector(`[data-doc="${next}"]`) as HTMLElement | null)?.focus();
    }
  };

  return (
    <div ref={root}>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div role="radiogroup" aria-labelledby={headingId} onKeyDown={onKey} className="relative inline-grid w-full max-w-md grid-cols-2 rounded-full border border-line-strong p-1.5 sm:w-auto">
          <span
            aria-hidden
            className="absolute bottom-1.5 left-1.5 top-1.5 w-[calc(50%-0.375rem)] rounded-full bg-accent transition-transform duration-700 ease-[var(--ease-out-expo)]"
            style={{ transform: doc === "trust" ? "translateX(100%)" : "none" }}
          />
          {(["will", "trust"] as const).map((d) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={doc === d}
              tabIndex={doc === d ? 0 : -1}
              data-doc={d}
              onClick={() => choose(d)}
              className={clsx(
                "relative z-10 min-h-12 rounded-full px-6 text-[0.95rem] font-medium transition-colors duration-500 sm:px-9",
                doc === d ? "text-accent-fg" : "text-fg",
              )}
            >
              {d === "will" ? "A will" : "A living trust"}
            </button>
          ))}
        </div>
        <p className="t-italic max-w-sm text-muted">Tap to compare. Every Texas family is different; this is the general picture, not advice for yours.</p>
      </div>

      <dl className="mt-12 border-t border-line-strong" aria-live="polite">
        {rows.map((r) => {
          const level = r.meter ? r.meter[shown] : 0;
          return (
            <div key={r.label} data-row className="grid gap-3 border-b border-line py-6 md:grid-cols-12 md:items-center md:gap-8">
              <dt className="t-caps-sm text-muted md:col-span-3">{r.label}</dt>
              <dd className="overflow-hidden md:col-span-5">
                <span data-val className="t-display block text-[clamp(1.35rem,2vw,1.9rem)] leading-tight">
                  {r[shown]}
                </span>
              </dd>
              <dd className="md:col-span-4" aria-hidden={!r.meter}>
                {r.meter && (
                  <div>
                    <div className="relative h-[3px] overflow-hidden bg-line">
                      <div
                        className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-[1.4s] ease-[var(--ease-out-expo)]"
                        style={{ width: `${Math.round(level * 100)}%`, transitionDelay: "0.35s" }}
                      />
                    </div>
                    <div className="t-caps-sm mt-2 flex justify-between text-[0.6rem] text-faint">
                      <span>{r.meter.low}</span>
                      <span>{r.meter.high}</span>
                    </div>
                  </div>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="t-lead max-w-2xl overflow-hidden">
          <span data-val className="block">
            {verdict[shown].line}
          </span>
        </p>
        <Link href={verdict[shown].href} className="inline-flex min-h-11 shrink-0 items-center gap-2 border-b border-current text-accent">
          {verdict[shown].cta} <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
