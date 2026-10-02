"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, ViewTransition } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";
import { parts, practices, type PartId } from "@/content/practice";
import { photos } from "@/content/photos";
import { useBiz } from "@/components/preview/BizContext";

const PART_ORDER: PartId[] = ["family", "legacy", "enterprise"];

/**
 * The practice areas set as a book's table of contents: chapter numerals,
 * dotted leaders and page numbers. On desktop, hovering a chapter floats an
 * arch-framed photograph and summary beside the cursor; clicking morphs that
 * photograph into the chapter page's hero (shared-element view transition).
 * On touch screens every chapter carries its own small arch thumbnail.
 */
export function PracticeIndex({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const biz = useBiz();
  const shown = biz.lang === "sr" ? practices.filter((p) => p.slug !== "trusts") : practices;
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  const Title = headingLevel;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Preview follows the pointer with a soft lag.
  useEffect(() => {
    if (!fine || !preview.current || !root.current) return;
    const el = preview.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotate", { duration: 1.2, ease: "power3" });
    let lastX = 0;
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX + 120);
      yTo(e.clientY - 180);
      rTo(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
      lastX = e.clientX;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [fine]);

  // Rows rise and their rules draw in as they enter.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const stops = Array.from(el.querySelectorAll<HTMLElement>("[data-row]")).map((row) => {
      const rule = row.querySelector("[data-rule]");
      const content = row.querySelectorAll("[data-rise]");
      return revealOnScroll(
        row,
        () => {
          gsap.set(content, { opacity: 0, y: 26 });
          gsap.set(rule, { scaleX: 0 });
        },
        () => {
          gsap
            .timeline()
            .to(rule, { scaleX: 1, duration: 1.6, ease: "expo.inOut" })
            .to(content, { opacity: 1, y: 0, duration: 1.3, stagger: 0.06, ease: "expo.out", clearProps: "transform" }, 0.25);
        },
      );
    });
    return () => stops.forEach((s) => s());
  }, [fine]);

  const activePractice = practices.find((p) => p.slug === active);

  return (
    <div ref={root} className="relative" onPointerLeave={() => setActive(null)}>
      {PART_ORDER.map((partId) => {
        const part = parts[partId];
        const items = shown.filter((p) => p.part === partId);
        return (
          <Fragment key={partId}>
            <div data-row className="relative pt-14 first:pt-0">
              <div data-rule className="rule origin-left" />
              <div data-rise className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pt-4">
                <p className="t-caps text-accent">
                  {part.numeral} · {part.name}
                </p>
                <p className="t-italic text-sm text-muted">{part.line}</p>
              </div>
            </div>
            <ol className="mt-2">
              {items.map((p) => {
                const isActive = active === p.slug;
                const dim = active !== null && !isActive;
                return (
                  <li key={p.slug} data-row className="relative">
                    <div data-rule className="rule origin-left opacity-60" />
                    <Link
                      href={`/practice-areas/${p.slug}`}
                      data-cursor={fine ? "Read" : undefined}
                      onPointerEnter={() => fine && setActive(p.slug)}
                      onFocus={() => fine && setActive(p.slug)}
                      className="group flex min-h-20 items-center gap-4 py-4 sm:gap-8 sm:py-5"
                    >
                      <span data-rise className="t-caps-sm w-10 shrink-0 text-accent sm:w-16">
                        {p.numeral}.
                      </span>
                      <span data-rise className={clsx("flex min-w-0 flex-1 items-baseline gap-5 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]", dim && "opacity-30", isActive && "translate-x-3")}>
                        <Title className="t-display shrink-0 text-[clamp(1.9rem,5vw,4.6rem)] leading-[1]">
                          {p.title}
                        </Title>
                        <span aria-hidden className="leader hidden text-fg sm:block" />
                        <span className="t-caps-sm hidden shrink-0 text-muted sm:inline">p. {String(p.page).padStart(2, "0")}</span>
                      </span>
                      <span className="sr-only">: {p.short}</span>
                      {!fine && (
                        <ViewTransition name={`practice-${p.slug}`} share="morph" default="none">
                          <span data-rise className="arch-sm relative block h-16 w-12 shrink-0 overflow-hidden sm:h-20 sm:w-16">
                            <Image src={photos[p.photo]} alt="" fill sizes="64px" className="object-cover" />
                          </span>
                        </ViewTransition>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </Fragment>
        );
      })}
      <div className="rule" />

      {/* Floating preview (desktop) */}
      {fine && (
        <div ref={preview} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 w-[17rem]" style={{ transform: "translate(-999px,-999px)" }}>
          <div
            className="transition-[clip-path,opacity] duration-700 ease-[var(--ease-out-expo)]"
            style={{ clipPath: activePractice ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", opacity: activePractice ? 1 : 0 }}
          >
            <div className="arch-sm relative aspect-[3/4] w-full overflow-hidden bg-ink">
              {practices.map((p) => (
                <ViewTransition key={p.slug} name={active === p.slug ? `practice-${p.slug}` : undefined} share="morph" default="none">
                  <div className={clsx("absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]", active === p.slug ? "scale-100 opacity-100" : "scale-110 opacity-0")}>
                    <Image src={photos[p.photo]} alt="" fill sizes="272px" className="object-cover" />
                  </div>
                </ViewTransition>
              ))}
            </div>
            <div className="mt-3 bg-parchment/95 px-4 py-3 text-charcoal shadow-[0_20px_40px_-24px_rgba(0,0,0,.5)] backdrop-blur">
              <p className="t-caps-sm text-brass-deep">
                Chapter {activePractice?.numeral} · {activePractice && parts[activePractice.part].name}
              </p>
              <p className="mt-1.5 font-serif text-[0.95rem] italic leading-snug">{activePractice?.short}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
