"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIdleGSAP } from "@/lib/useIdleGSAP";
import { photos, type PhotoKey } from "@/content/photos";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

const steps: { n: string; title: string; body: string; meta: string; photo: PhotoKey; alt: string }[] = [
  {
    n: "I",
    title: "Reach out",
    body: `Call ${site.phone}, book online or write to us. We run a conflict check first, so we only ask for names, not details.`,
    meta: "Reply within one business day",
    photo: "blinds",
    alt: "Afternoon light falling through blinds onto a wall",
  },
  {
    n: "II",
    title: "A confidential 15-minute call",
    body: "An attorney, not a call centre, listens to what's happening and tells you honestly whether we're the right firm.",
    meta: "Free · by phone or video",
    photo: "consult-mugs",
    alt: "Two people talking across a table with coffee cups",
  },
  {
    n: "III",
    title: "The strategy meeting",
    body: "Sixty minutes with the attorney who would handle your matter. You leave with your options in writing and a recommended path.",
    meta: "$350, credited to your fee",
    photo: "conference-city",
    alt: "A conference room with windows overlooking the city",
  },
  {
    n: "IV",
    title: "A clear fee agreement",
    body: "A flat fee or a written estimate, a named team and how we'll keep in touch. Nothing starts until you've read it and signed.",
    meta: "No surprises, in writing",
    photo: "contract-sign",
    alt: "A hand signing a printed agreement with a pen",
  },
];

// Node positions (percent of the stage) the pen line passes through.
const NODES = [
  { x: 12.5, y: 70 },
  { x: 37.5, y: 30 },
  { x: 62.5, y: 70 },
  { x: 87.5, y: 30 },
];
const PATH = "M0 50 C 60 50 80 70 125 70 S 300 30 375 30 S 550 70 625 70 S 800 30 875 30 S 960 50 1000 50";

/**
 * "Your first consultation". On desktop the section pins; a single brass line
 * draws itself like a pen stroke through four steps, each step inking in as
 * the line reaches it while the background photograph changes. On phones the
 * same line runs vertically down the list.
 */
export function ConsultationGuide() {
  const root = useRef<HTMLElement>(null);

  useIdleGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const path = el.querySelector<SVGPathElement>("[data-pen]")!;
        gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
        const stepsEls = gsap.utils.toArray<HTMLElement>("[data-step]", el);
        const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", el);
        const bgs = gsap.utils.toArray<HTMLElement>("[data-bg]", el);
        gsap.set(stepsEls, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(bgs.slice(1), { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=260%", scrub: 1, pin: true, anticipatePin: 1 },
        });
        tl.to(path, { strokeDashoffset: 0, duration: 4 }, 0);
        NODES.forEach((_, i) => {
          const at = 0.35 + i * 1.0;
          tl.to(nodes[i], { backgroundColor: "#b08d57", color: "#0f2a22", scale: 1, duration: 0.25 }, at)
            .to(stepsEls[i], { clipPath: "inset(-10% -10% -10% -10%)", duration: 0.45 }, at)
            .fromTo(stepsEls[i].querySelectorAll("[data-rise]"), { y: 20 }, { y: 0, duration: 0.4, stagger: 0.05 }, at);
          if (i > 0) {
            tl.to(bgs[i - 1], { opacity: 0, duration: 0.4 }, at - 0.1).to(bgs[i], { opacity: 1, duration: 0.4 }, at - 0.1);
          }
        });
        tl.to({}, { duration: 0.4 });
      });

      mm.add("(max-width: 1023px)", () => {
        const line = el.querySelector("[data-vline]");
        gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.querySelector("[data-list]"), start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
        gsap.utils.toArray<HTMLElement>("[data-step]", el).forEach((s) => {
          gsap.fromTo(s, { x: 28 }, { x: 0, ease: "none", scrollTrigger: { trigger: s, start: "top 90%", end: "top 55%", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="guide-title" className="theme-ink relative overflow-hidden lg:h-screen">
      {/* Background photographs, one per step (desktop) */}
      <div aria-hidden className="absolute inset-0 hidden lg:block">
        {steps.map((s, i) => (
          <div key={s.photo} data-bg className="absolute inset-0" style={{ opacity: i === 0 ? 1 : undefined }}>
            <Image src={photos[s.photo]} alt="" fill sizes="100vw" className="object-cover opacity-[0.22]" />
          </div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_50%,transparent,rgba(15,42,34,.9))]" />
      </div>

      <div className="relative flex h-full flex-col px-[var(--gutter)] py-24 lg:py-[calc(var(--header-h)+2rem)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-caps-sm text-brass">§ 04 · The first consultation</p>
            <h2 id="guide-title" className="t-display t-lg mt-5 max-w-3xl">
              Four steps from a hard week to <em className="t-italic text-brass-light">a clear plan.</em>
            </h2>
          </div>
          <ButtonLink href="/consultation" className="self-start lg:self-auto">
            Start with step one
          </ButtonLink>
        </div>

        {/* Desktop stage: the pen line and four steps */}
        <div className="relative mt-auto hidden h-[58vh] min-h-[420px] lg:block">
          <svg aria-hidden viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[34%] w-full overflow-visible">
            <path d={PATH} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path data-pen d={PATH} pathLength={1} fill="none" stroke="#b08d57" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1" strokeDashoffset="1" />
          </svg>
          {NODES.map((n, i) => (
            <span
              key={i}
              data-node
              aria-hidden
              className="t-caps-sm absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brass bg-ink text-brass"
              style={{ left: `${n.x}%`, top: `${n.y * 0.34}%`, transform: "translate(-50%,-50%) scale(0.8)" }}
            >
              {steps[i].n}
            </span>
          ))}
          <ol className="absolute inset-x-0 bottom-0 grid grid-cols-4 gap-8">
            {steps.map((s) => (
              <li key={s.n} data-step className="pr-4">
                <p data-rise className="t-caps-sm text-brass">
                  Step {s.n}
                </p>
                <h3 data-rise className="t-display mt-3 text-[clamp(1.6rem,2.1vw,2.2rem)] leading-[1.05]">
                  {s.title}
                </h3>
                <p data-rise className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                  {s.body}
                </p>
                <p data-rise className="t-italic mt-4 text-sm text-brass-light">
                  {s.meta}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Phones & tablets: a vertical pen line */}
        <div data-list className="relative mt-16 lg:hidden">
          <div aria-hidden className="absolute bottom-2 left-[1.35rem] top-2 w-px bg-line" />
          <div aria-hidden data-vline className="absolute bottom-2 left-[1.35rem] top-2 w-px origin-top bg-brass" />
          <ol className="space-y-14">
            {steps.map((s) => (
              <li key={s.n} data-step className="relative grid grid-cols-[2.75rem_1fr] gap-5">
                <span aria-hidden className="t-caps-sm relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-brass bg-ink text-brass">
                  {s.n}
                </span>
                <div>
                  <h3 className="t-display text-[1.8rem] leading-[1.05]">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                  <p className="t-italic mt-3 text-sm text-brass-light">{s.meta}</p>
                  <div className="arch-sm relative mt-6 aspect-[4/3] w-full max-w-sm overflow-hidden">
                    <Image src={photos[s.photo]} alt={s.alt} fill sizes="(max-width: 640px) 80vw, 384px" className="object-cover" />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
