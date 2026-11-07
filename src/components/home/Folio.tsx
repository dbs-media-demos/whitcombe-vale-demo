"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll, useIdleGSAP } from "@/lib/useIdleGSAP";
import { useBiz, useT } from "@/components/preview/BizContext";
import skylineHaze from "@/assets/photos/skyline-haze.jpg";
import booksLadder from "@/assets/photos/books-ladder.jpg";
import conferenceGreen from "@/assets/photos/conference-green.jpg";
import penNib from "@/assets/photos/pen-nib.jpg";
import columnsAngle from "@/assets/photos/columns-angle.jpg";
import libraryReader from "@/assets/photos/library-reader.jpg";

type Plate = { photo: StaticImageData; caption: string; alt: string; size: "tall" | "wide" | "square"; offset?: string };

const plates: Plate[] = [
  { photo: skylineHaze, caption: "Downtown Dallas from the fourteenth floor", alt: "Dallas skyline in soft haze", size: "wide" },
  { photo: booksLadder, caption: "The library, where the Texas codes live", alt: "Tall shelves of leather-bound law books with a wooden ladder", size: "tall", offset: "lg:mt-[12vh]" },
  { photo: conferenceGreen, caption: "The Green Room: mediations and signings", alt: "A quiet conference room with a long table and green walls", size: "square" },
  { photo: penNib, caption: "Every will is signed with ink, in person", alt: "Close-up of a fountain pen nib", size: "tall", offset: "lg:-mt-[6vh]" },
  { photo: columnsAngle, caption: "The courts we appear in, from Dallas to McKinney", alt: "Stone columns of a courthouse seen from below", size: "wide", offset: "lg:mt-[16vh]" },
  { photo: libraryReader, caption: "Reading everything, including the fine print", alt: "A person reading at a desk beside bookshelves", size: "square" },
];

// GSAP folds the tag's CSS `rotate` into its own transform, so it animates to that tilt itself
const tilt = (tag: HTMLElement) => Number(tag.dataset.tilt);

const sizeCls = {
  tall: "w-[62vw] sm:w-[40vw] lg:w-[24vw] aspect-[3/4]",
  wide: "w-[80vw] sm:w-[60vw] lg:w-[40vw] aspect-[4/3]",
  square: "w-[70vw] sm:w-[46vw] lg:w-[30vw] aspect-square",
};

/**
 * "In figures": a pinned horizontal folio of photographs with plate
 * captions. Vertical scroll drives the horizontal track on desktop; each
 * plate's photo drifts against the track for depth. Phones swipe natively.
 * Each plate is entered into the record as it arrives: a paper exhibit tag
 * (Exhibit A, B, C…) is pressed onto its corner, as on evidence in a file.
 */
export function Folio() {
  const biz = useBiz();
  const t = useT();
  const sober = biz.lang === "sr";
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIdleGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        t.querySelectorAll<HTMLElement>("[data-plate-img]").forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        t.querySelectorAll<HTMLElement>("[data-plate]").forEach((plate) => {
          gsap.fromTo(
            plate,
            { clipPath: "inset(10% 10% 10% 10%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "expo.out", duration: 1.6, scrollTrigger: { trigger: plate, containerAnimation: tween, start: "left 95%", toggleActions: "play none none none" } },
          );
        });
        // Serbian previews stay calm: the tags simply sit on the plates
        if (!sober) t.querySelectorAll<HTMLElement>("[data-exhibit]").forEach((tag) => {
          gsap.fromTo(
            tag,
            { opacity: 0, scale: 1.5, rotation: tilt(tag) - 9 },
            { opacity: 1, scale: 1, rotation: tilt(tag), duration: 0.55, ease: "back.out(2.2)", scrollTrigger: { trigger: tag, containerAnimation: tween, start: "left 72%", toggleActions: "play none none none" } },
          );
        });
      });
      mm.add("(max-width: 1023px)", () => {
        if (sober) return;
        const stops = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-exhibit]")).map((tag) =>
          revealOnScroll(
            tag,
            () => gsap.set(tag, { opacity: 0, scale: 1.5, rotation: tilt(tag) - 9 }),
            () => gsap.to(tag, { opacity: 1, scale: 1, rotation: tilt(tag), duration: 0.55, delay: 0.25, ease: "back.out(2.2)" }),
          ),
        );
        return () => stops.forEach((s) => s());
      });
      return () => mm.revert();
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="folio-title" className="folio ph-o10 theme-ink relative overflow-hidden lg:h-screen">
      <div
        ref={track}
        className="folio-track no-scrollbar flex h-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-24 lg:w-max lg:snap-none lg:gap-[5vw] lg:overflow-visible lg:py-0"
      >
        <div className="folio-intro w-[82vw] shrink-0 snap-start sm:w-[56vw] lg:w-[34vw]">
          <p className="t-caps-sm text-brass">
            <span className="ph-hide">§ 02 · </span>
            {t("In figures")}
          </p>
          <h2 id="folio-title" className="t-display t-xl mt-6">
            {t("The firm,")}
            <br />
            <em className="t-italic text-brass-light">{t("in plates.")}</em>
          </h2>
          <p className="mt-8 max-w-sm text-muted">{t("A corner office in the Arts District, a library we still use, and a conference room where more cases end than begin.")}</p>
          <p className="folio-keep t-caps-sm mt-10 hidden items-center gap-3 text-muted lg:flex">
            <span aria-hidden className="h-px w-10 bg-brass" /> {t("Keep scrolling")}
          </p>
        </div>
        {plates.map((p, i) => (
          <figure key={p.caption} className={clsx("folio-plate shrink-0 snap-center", p.offset)}>
            <div className="relative">
              <div data-plate className={clsx("relative overflow-hidden", sizeCls[p.size], p.size === "tall" && "arch-sm")}>
                <div data-plate-img className="absolute -inset-x-[10%] inset-y-0">
                  <Image src={p.photo} alt={t(p.alt)} fill sizes="(min-width:1024px) 40vw, (min-width:768px) 60vw, 62vw" className="object-cover" />
                </div>
              </div>
              <span data-exhibit data-tilt={i % 2 ? 3 : -4} aria-hidden className="exhibit-tag t-caps-sm" style={{ rotate: `${i % 2 ? 3 : -4}deg` }}>
                <span>{t("Exhibit")}</span> <span className="text-brass-deep">{"ABCDEF"[i]}</span>
              </span>
            </div>
            <figcaption className="mt-7 flex items-baseline gap-3 text-sm text-muted">
              <span className="t-caps-sm text-brass">
                {t("Plate")} {["I", "II", "III", "IV", "V", "VI"][i]}
              </span>
              <span className="font-serif italic">{t(p.caption)}</span>
            </figcaption>
          </figure>
        ))}
        <div aria-hidden className="w-[4vw] shrink-0" />
      </div>
    </section>
  );
}
