"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import dynamic from "next/dynamic";
import { photos } from "@/content/photos";
import { site } from "@/content/site";

// The shader only starts when the browser is idle anyway, so its code loads after hydration.
const WindowLight = dynamic(() => import("@/components/fx/WindowLight").then((m) => m.WindowLight), { ssr: false });

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * "The Threshold". The opening is a tall arched window cut out of the dark
 * page, with light drifting through it. Scrolling pins the scene and the
 * arch opens to full-bleed: you walk through the door into the firm.
 *
 * Intro is CSS-only (the arch rises from a sliver, headline lines lift),
 * so first paint and LCP never wait for JavaScript.
 */
export function Threshold() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const archTo = desktop ? "inset(15vh 36vw 0vh 36vw round 14vw 14vw 0vw 0vw)" : "inset(24vh 12vw 0vh 12vw round 38vw 38vw 0vw 0vw)";
        const full = "inset(0vh 0vw 0vh 0vw round 0vw 0vw 0vw 0vw)";
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: desktop ? "+=110%" : "+=70%", scrub: 0.9, pin: true, anticipatePin: 1 },
        });
        tl.fromTo("[data-arch]", { clipPath: archTo }, { clipPath: full, duration: 1 }, 0)
          .fromTo("[data-arch-img]", { scale: 1.18 }, { scale: 1, duration: 1 }, 0)
          .fromTo("[data-shade]", { opacity: 0.1 }, { opacity: 0.55, duration: 1 }, 0)
          .to("[data-line='1']", { xPercent: desktop ? -18 : -8, opacity: 0, duration: 0.7 }, 0)
          .to("[data-line='2']", { xPercent: desktop ? 18 : 8, opacity: 0, duration: 0.7 }, 0)
          .to("[data-hero-meta]", { opacity: 0, y: -20, duration: 0.4 }, 0)
          .fromTo("[data-inside]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45 }, 0.55);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="theme-ink relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* The window: a full-bleed photo clipped to an arch */}
      <div data-arch className="threshold-arch absolute inset-0 overflow-hidden">
        <Image
          data-arch-img
          src={photos["marble-hall"]}
          alt="A long colonnade of stone columns receding towards a bright doorway"
          fill
          fetchPriority="high"
          loading="eager"
          quality={60}
          sizes="100vw"
          className="object-cover object-[50%_60%]"
        />
        <div data-shade className="absolute inset-0 bg-ink opacity-10" />
        <WindowLight className="opacity-80" />
        {/* Intro: an ink curtain retracts upward, so the window seems to rise from the floor.
            It only covers the photo (never clips it), so the LCP image paints on the first frame. */}
        <div aria-hidden className="threshold-curtain absolute inset-0 origin-top bg-ink" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,42,34,.92),rgba(15,42,34,.2)_40%,transparent_60%)] sm:bg-[linear-gradient(to_top,rgba(15,42,34,.7),transparent_35%)]" />
      </div>

      {/* Hairline frame lines, like a page's margins */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[var(--gutter)] top-[calc(var(--header-h)+0.5rem)] h-px bg-line">
        <div className="anim-rule h-full bg-brass/60" style={d(0.4)} />
      </div>

      <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-20 pt-[calc(var(--header-h)+1.75rem)] max-md:pb-28">
        <div data-hero-meta className="anim-fade flex items-start justify-between gap-6" style={d(0.6)}>
          <p className="t-caps-sm max-w-[20rem] text-muted">Family · Estate · Business law</p>
          <p className="t-caps-sm hidden text-right text-muted sm:block">
            Dallas, Texas
            <br />
            Est. {site.founded}
          </p>
        </div>

        <h1 id="hero-title" className="t-display relative z-10 text-[clamp(3.2rem,min(9vw,15vh),10rem)] leading-[0.9]">
          <span data-line="1" className="anim-line">
            <span style={d(0.25)}>Quiet counsel</span>
          </span>
          <span data-line="2" className="anim-line text-right">
            <span style={d(0.42)}>
              for life&rsquo;s <em className="t-italic text-brass-light">defining</em>
            </span>
          </span>
          <span data-line="2" className="anim-line text-right">
            <span style={d(0.58)}>
              <em className="t-italic text-brass-light">chapters.</em>
            </span>
          </span>
        </h1>

        <div data-hero-meta className="anim-fade flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" style={d(0.9)}>
          <p className="t-lead max-w-md text-[1.2rem] text-fg/85 max-sm:hidden">
            A boutique Dallas firm for divorce and custody, wills and trusts, and the business you&rsquo;re building. Discreet, direct and on your side.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/consultation"
              className="group relative inline-flex min-h-12 items-center overflow-hidden rounded-full bg-brass px-6 font-medium text-ink"
            >
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-parchment transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <span className="relative">Book a free 15-minute call</span>
            </Link>
            <span aria-hidden className="hidden items-center gap-3 md:flex">
              <span className="relative block h-12 w-px overflow-hidden bg-line">
                <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-brass" />
              </span>
              <span className="t-caps-sm text-muted">Scroll</span>
            </span>
          </div>
        </div>
      </div>

      {/* Revealed once the arch has opened */}
      <div data-inside aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
        <p className="t-display px-6 text-center text-[clamp(2.4rem,6vw,6rem)] leading-none">
          Come <em className="t-italic text-brass-light">in.</em>
        </p>
      </div>

      <style>{`
        .threshold-arch {
          --arch-to: inset(15vh 36vw 0vh 36vw round 14vw 14vw 0vw 0vw);
          clip-path: var(--arch-to);
        }
        @media (max-width: 767px) {
          .threshold-arch {
            --arch-to: inset(24vh 12vw 0vh 12vw round 38vw 38vw 0vw 0vw);
          }
        }
        .threshold-curtain { transform: scaleY(0); animation: curtain 2s var(--ease-in-out-quart) 0.15s backwards; }
        @keyframes curtain { from { transform: scaleY(1); } to { transform: scaleY(0); } }
        .scroll-cue { animation: cue 2.4s var(--ease-in-out-quart) infinite; }
        @keyframes cue { from { transform: translateY(-100%); } to { transform: translateY(200%); } }
      `}</style>
    </section>
  );
}
