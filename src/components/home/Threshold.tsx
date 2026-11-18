"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, isPhone, prefersReducedMotion, PHONE_QUERY } from "@/lib/gsap";
import { useDeskGSAP } from "@/lib/useIdleGSAP";
import dynamic from "next/dynamic";
import marbleHall from "@/assets/photos/marble-hall.jpg";
import heroPhone from "@/assets/photos/hero-phone.jpg";
import { site } from "@/content/site";
import { useBiz, useT } from "@/components/preview/BizContext";
import { L, num, telOf } from "@/lib/biz-core";
import { HeroScales, HeroScalesStill } from "@/components/home/HeroScales";
import { HeroScales2D } from "@/components/home/HeroScales2D";
import { LightShafts } from "@/components/fx/LightShafts";
import { Phone, Stars } from "@/components/ui/Icons";

// The shader only starts when the browser is idle anyway, so its code loads after hydration. Desktop only.
const WindowLight = dynamic(() => import("@/components/fx/WindowLight").then((m) => m.WindowLight), { ssr: false });

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// Keep in step with the preload in HomeContent
const PHONE_SIZES = "(min-width: 768px) 28rem, 90vw";

/**
 * "The Threshold". The opening is a tall arched window cut out of the dark
 * page, with light drifting through it. Scrolling pins the scene and the
 * arch opens to full-bleed: you walk through the door into the firm.
 *
 * Intro is CSS-only (the arch rises from a sliver, headline lines lift),
 * so first paint and LCP never wait for JavaScript. Everything has landed by about 1.5 s.
 *
 * On phones (below 768 px or touch) it is a plain first screen: practice areas and town in the
 * headline, the Google rating, a Call button with the number and a still of the window, drawn
 * at once, with the next section peeking in below it.
 */
export type HeroKind = "3d" | "2d";

/**
 * `hero="2d"` is /v2, the same homepage without any WebGL, for a slow laptop or a lead who'd rather not:
 * the window's light is CSS (LightShafts) and the brass scales are cut-out layers of the same render,
 * swung by a few lines of script (HeroScales2D). Everything else here, phones included, is shared.
 */
export function Threshold({ hero = "3d" }: { hero?: HeroKind }) {
  const biz = useBiz();
  const t = useT();
  const sr = biz.lang === "sr";
  const root = useRef<HTMLElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const tel = telOf(biz);
  const [desk, setDesk] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- media queries are only known on the client
  useEffect(() => setDesk(!isPhone()), []);

  useDeskGSAP(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const archTo = "inset(15vh 36vw 0vh 36vw round 14vw 14vw 0vw 0vw)";
      const full = "inset(0vh 0vw 0vh 0vw round 0vw 0vw 0vw 0vw)";
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        // Our own spacer: GSAP's would pull the section out of the page and back on every refresh, and
        // moving it restarts the CSS intro inside (which kept the opening near empty for seconds)
        scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: 0.9, pin: true, pinSpacer: spacer.current, anticipatePin: 1 },
      });
      tl.fromTo("[data-arch]", { clipPath: archTo }, { clipPath: full, duration: 1 }, 0)
        .fromTo("[data-arch-img]", { scale: 1.18 }, { scale: 1, duration: 1 }, 0)
        .fromTo("[data-shade]", { opacity: 0.1 }, { opacity: 0.55, duration: 1 }, 0)
        .to("[data-line='1']", { xPercent: -18, opacity: 0, duration: 0.7 }, 0)
        .to("[data-line='2']", { xPercent: 18, opacity: 0, duration: 0.7 }, 0)
        .to("[data-hero-meta]", { opacity: 0, y: -20, duration: 0.4 }, 0)
        .fromTo("[data-seal]", { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9, duration: 0.3 }, 0.5)
        .fromTo("[data-inside]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45 }, 0.55);
    });
    return () => mm.revert();
  }, root);

  const { props: deskImg } = getImageProps({
    src: marbleHall,
    alt: t("A long colonnade of stone columns receding towards a bright doorway"),
    fill: true,
    fetchPriority: "high",
    loading: "eager",
    quality: 60,
    sizes: "100vw",
    className: "object-cover object-[50%_60%]",
  });
  const {
    props: { srcSet: phoneSet },
  } = getImageProps({ src: heroPhone, alt: "", fill: true, quality: 75, sizes: PHONE_SIZES });

  return (
    <div ref={spacer} className="ph-o1">
    <section ref={root} data-hero aria-labelledby="hero-title" className="threshold theme-ink relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* The window: a full-bleed photo clipped to an arch */}
      <div data-arch className="threshold-arch absolute inset-0 overflow-hidden">
        <picture>
          <source media={PHONE_QUERY} srcSet={phoneSet} sizes={PHONE_SIZES} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- getImageProps supplies src and alt; <picture> gives phones their own crop */}
          <img data-arch-img {...deskImg} />
        </picture>
        <div data-shade className="absolute inset-0 bg-ink opacity-10" />
        {hero === "2d" ? <LightShafts className="ph-hide opacity-80" /> : desk && <WindowLight className="opacity-80" />}
        {/* Intro: an ink curtain retracts upward, so the window seems to rise from the floor.
            It only covers the photo (never clips it), so the LCP image paints on the first frame. */}
        <div aria-hidden className="threshold-curtain ph-hide absolute inset-0 origin-top bg-ink" />
        <div className="threshold-fade absolute inset-0 bg-[linear-gradient(to_top,rgba(15,42,34,.92),rgba(15,42,34,.2)_40%,transparent_60%)] sm:bg-[linear-gradient(to_top,rgba(15,42,34,.7),transparent_35%)]" />
      </div>

      {/* Hairline frame lines, like a page's margins */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[var(--gutter)] top-[calc(var(--header-h)+0.5rem)] h-px bg-line">
        <div className="anim-rule h-full bg-brass/60" style={d(0.15)} />
      </div>

      {/* Phones: the first screen */}
      <div className="hero-ph ph-only">
        <h1 className="hero-ph-title t-display">
          {sr ? (
            <>
              <span>Porodično, nasledno</span>
              <span>i privredno pravo</span>
              {biz.area && <em className="t-italic text-brass-light">{biz.area}</em>}
            </>
          ) : (
            <>
              <span>Family, estate</span>
              <span>&amp; business lawyers</span>
              {biz.area && <em className="t-italic text-brass-light">in {biz.area}.</em>}
            </>
          )}
        </h1>
        <p className="hero-ph-lead text-fg/85">
          {sr
            ? biz.name
            : biz.preview
              ? "A boutique firm for divorce and custody, wills and trusts, and the business you’re building."
              : "A boutique Dallas firm for divorce and custody, wills and trusts, and the business you’re building."}
        </p>
        {biz.rating && (
          <a href="#reviews-title" className="hero-ph-rating">
            <Stars value={biz.rating.value} className="text-brass" />
            <span>
              <strong className="font-semibold">{num(biz, biz.rating.value)}</strong> · {biz.rating.count} Google reviews
            </span>
          </a>
        )}
        {/* The Call button and the scales share a row: the still only takes the room the button leaves */}
        <div className="hero-ph-act">
          {tel ? (
            <a href={tel} className="hero-ph-call">
              <Phone className="h-[1.1rem] w-[1.1rem]" />
              {L(biz, "Call", "Pozovite")} {biz.phoneDisplay}
            </a>
          ) : (
            <a href={sr ? "#kontakt" : "#contact-form"} className="hero-ph-call">
              {L(biz, "Book a free call", "Kontakt")}
            </a>
          )}
          <span aria-hidden className="hero-ph-scales-slot">
            <HeroScalesStill className="hero-ph-scales" />
          </span>
        </div>
      </div>

      <div className="threshold-desk ph-hide relative flex h-full flex-col justify-between px-[var(--gutter)] pb-20 pt-[calc(var(--header-h)+1.75rem)] max-md:pb-28">
        <div data-hero-meta className="anim-fade flex items-start justify-between gap-6" style={d(0.3)}>
          <p className="t-caps-sm max-w-[20rem] text-muted">{t("Family · Estate · Business law")}</p>
          <p className="t-caps-sm hidden text-right text-muted sm:block">
            {biz.preview ? (
              biz.area
            ) : (
              <>
                Dallas, Texas
                <br />
                Est. {site.founded}
              </>
            )}
          </p>
        </div>

        <div className="relative z-10 text-[clamp(3.2rem,min(9vw,15vh),10rem)]">
          {/* The firm's brass scales, in the hollow below line one: live 3D on a desktop with a mouse, a still otherwise */}
          <div data-seal className="pointer-events-none absolute left-[-0.4em] top-[0.78em] -z-10 w-[min(3.95em,52svh)]">
            {hero === "2d" ? <HeroScales2D calm={sr} className="scales-in" /> : <HeroScales live={!sr} className="scales-in" />}
          </div>
          <h1 id="hero-title" className="t-display leading-[0.9]">
            <span data-line="1" className="block">
              <span>{sr ? "Porodično, nasledno" : "Quiet counsel"}</span>
            </span>
            <span data-line="2" className="block text-right">
              <span>
                {sr ? "i " : "for life’s "}
                <em className="t-italic text-brass-light">{sr ? "privredno" : "defining"}</em>
              </span>
            </span>
            <span data-line="2" className="block text-right">
              <span>
                <em className="t-italic text-brass-light">{sr ? "pravo." : "chapters."}</em>
              </span>
            </span>
          </h1>
        </div>

        <div data-hero-meta className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="t-lead max-w-md text-[1.2rem] text-fg/85 max-sm:hidden">
            {biz.preview
              ? L(
                  biz,
                  "A boutique firm for divorce and custody, wills and trusts, and the business you’re building. Discreet, direct and on your side.",
                  `${biz.name}. Porodično, nasledno i privredno pravo${biz.area ? `, ${biz.area}` : ""}.`,
                )
              : "A boutique Dallas firm for divorce and custody, wills and trusts, and the business you’re building. Discreet, direct and on your side."}
          </p>
          <div className="flex items-center gap-5">
            <Link
              href={sr ? "#kontakt" : "/consultation"}
              className="group relative inline-flex min-h-12 items-center overflow-hidden rounded-full bg-brass px-6 font-medium text-ink"
            >
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-parchment transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <span className="relative">{sr ? "Kontakt" : "Book a free 15-minute call"}</span>
            </Link>
            <span aria-hidden className="hidden items-center gap-3 md:flex">
              <span className="relative block h-12 w-px overflow-hidden bg-line">
                <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-brass" />
              </span>
              <span className="t-caps-sm text-muted">{t("Scroll")}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Revealed once the arch has opened */}
      <div data-inside aria-hidden className="ph-hide pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
        <p className="t-display px-6 text-center text-[clamp(2.4rem,6vw,6rem)] leading-none">
          {sr ? (
            <em className="t-italic text-brass-light">Izvolite.</em>
          ) : (
            <>
              Come <em className="t-italic text-brass-light">in.</em>
            </>
          )}
        </p>
      </div>

      <style>{`
        .threshold-arch {
          --arch-to: inset(15vh 36vw 0vh 36vw round 14vw 14vw 0vw 0vw);
          clip-path: var(--arch-to);
        }
        .threshold-curtain { transform: scaleY(0); animation: curtain 1.05s var(--ease-in-out-quart) 0.05s backwards; }
        @keyframes curtain { from { transform: scaleY(1); } to { transform: scaleY(0); } }
        .threshold .anim-fade { animation-duration: 0.75s; }
        .threshold .anim-rule { animation-duration: 1s; }
        .scales-in { animation: scales-in 1.1s var(--ease-out-expo) 0.35s backwards; }
        @keyframes scales-in { from { opacity: 0; transform: translateY(14px); } }
        .scroll-cue { animation: cue 2.4s var(--ease-in-out-quart) infinite; }
        @keyframes cue { from { transform: translateY(-100%); } to { transform: translateY(200%); } }
      `}</style>
    </section>
    </div>
  );
}
