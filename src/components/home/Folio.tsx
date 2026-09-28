"use client";

import Image from "next/image";
import { useRef } from "react";
import clsx from "clsx";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIdleGSAP } from "@/lib/useIdleGSAP";
import { photos, type PhotoKey } from "@/content/photos";

type Plate = { photo: PhotoKey; caption: string; alt: string; size: "tall" | "wide" | "square"; offset?: string };

const plates: Plate[] = [
  { photo: "skyline-haze", caption: "Downtown Dallas from the fourteenth floor", alt: "Dallas skyline in soft haze", size: "wide" },
  { photo: "books-ladder", caption: "The library, where the Texas codes live", alt: "Tall shelves of leather-bound law books with a wooden ladder", size: "tall", offset: "lg:mt-[12vh]" },
  { photo: "conference-green", caption: "The Green Room: mediations and signings", alt: "A quiet conference room with a long table and green walls", size: "square" },
  { photo: "pen-nib", caption: "Every will is signed with ink, in person", alt: "Close-up of a fountain pen nib", size: "tall", offset: "lg:-mt-[6vh]" },
  { photo: "columns-angle", caption: "The courts we appear in, from Dallas to McKinney", alt: "Stone columns of a courthouse seen from below", size: "wide", offset: "lg:mt-[16vh]" },
  { photo: "library-reader", caption: "Reading everything, including the fine print", alt: "A person reading at a desk beside bookshelves", size: "square" },
];

const sizeCls = {
  tall: "w-[62vw] sm:w-[40vw] lg:w-[24vw] aspect-[3/4]",
  wide: "w-[80vw] sm:w-[60vw] lg:w-[40vw] aspect-[4/3]",
  square: "w-[70vw] sm:w-[46vw] lg:w-[30vw] aspect-square",
};

/**
 * "In figures": a pinned horizontal folio of photographs with plate
 * captions. Vertical scroll drives the horizontal track on desktop; each
 * plate's photo drifts against the track for depth. Phones swipe natively.
 */
export function Folio() {
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
      });
      return () => mm.revert();
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="folio-title" className="theme-ink relative overflow-hidden lg:h-screen">
      <div
        ref={track}
        className="no-scrollbar flex h-full snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[var(--gutter)] py-24 lg:w-max lg:snap-none lg:gap-[5vw] lg:overflow-visible lg:py-0"
      >
        <div className="w-[82vw] shrink-0 snap-start sm:w-[56vw] lg:w-[34vw]">
          <p className="t-caps-sm text-brass">§ 02 · In figures</p>
          <h2 id="folio-title" className="t-display t-xl mt-6">
            The firm,
            <br />
            <em className="t-italic text-brass-light">in plates.</em>
          </h2>
          <p className="mt-8 max-w-sm text-muted">
            A corner office in the Arts District, a library we still use, and a conference room where more cases end than begin.
          </p>
          <p className="t-caps-sm mt-10 hidden items-center gap-3 text-muted lg:flex">
            <span aria-hidden className="h-px w-10 bg-brass" /> Keep scrolling
          </p>
        </div>
        {plates.map((p, i) => (
          <figure key={p.photo} className={clsx("shrink-0 snap-center", p.offset)}>
            <div data-plate className={clsx("relative overflow-hidden", sizeCls[p.size], p.size === "tall" && "arch-sm")}>
              <div data-plate-img className="absolute -inset-x-[10%] inset-y-0">
                <Image src={photos[p.photo]} alt={p.alt} fill sizes="(min-width:1024px) 40vw, 80vw" className="object-cover" />
              </div>
            </div>
            <figcaption className="mt-4 flex items-baseline gap-3 text-sm text-muted">
              <span className="t-caps-sm text-brass">Plate {["I", "II", "III", "IV", "V", "VI"][i]}</span>
              <span className="font-serif italic">{p.caption}</span>
            </figcaption>
          </figure>
        ))}
        <div aria-hidden className="w-[4vw] shrink-0" />
      </div>
    </section>
  );
}
