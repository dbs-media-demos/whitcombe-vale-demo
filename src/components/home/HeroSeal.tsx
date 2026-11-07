"use client";

import { useEffect, useId, useRef } from "react";
import { isPhone, prefersReducedMotion } from "@/lib/gsap";
import { useBiz } from "@/components/preview/BizContext";
import { site } from "@/content/site";

const C = 100; // centre of the 200 × 200 seal
const RING_R = 73; // the lettering's baseline circle
const PIVOT = { x: C, y: 86 }; // where the beam rests on the post
const ARM = 30; // half the beam

// The serrated rim of a notary's embosser, as one path of alternating radii
const RIM = (() => {
  const teeth = 84;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 ? 93.5 : 97;
    pts.push(`${(C + Math.cos(a) * r).toFixed(2)} ${(C + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

/**
 * The firm's seal, stamped beside the headline as the page opens: an engraved
 * ring of lettering around a pair of scales. The scales never quite sit still.
 * They sway, lean towards the pointer and swing when the page is scrolled, and
 * come to rest perfectly level by the time the arch has opened ("Come in.").
 * A foil sheen follows the pointer across the brass. The lettering carries the
 * real firm's name on a personalised preview.
 * `still` is the phone hero's copy: no script at all, its scales settle once with CSS.
 */
export function HeroSeal({ className, still = false }: { className?: string; still?: boolean }) {
  const biz = useBiz();
  const sr = biz.lang === "sr";
  const id = useId().replace(/[^a-z0-9]/gi, "");
  const root = useRef<HTMLDivElement>(null);
  const beam = useRef<SVGGElement>(null);
  const panL = useRef<SVGGElement>(null);
  const panR = useRef<SVGGElement>(null);
  const sheen = useRef<SVGLinearGradientElement>(null);

  const words = biz.preview
    ? [biz.shortName, sr ? "Advokatska kancelarija" : "Attorneys at law", biz.area].filter(Boolean)
    : [site.legalName.replace(/,?\s*PLLC$/i, ""), "Attorneys at law", "Dallas, Texas", "Est. MMIX"];
  const legend = `${words.join("  ·  ").toUpperCase()}  ·  `;
  const circ = 2 * Math.PI * RING_R;
  const fontSize = Math.min(10.5, Math.max(6.5, circ / (legend.length * 0.86)));

  useEffect(() => {
    const el = root.current;
    if (still || !el || isPhone() || prefersReducedMotion()) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let angle = 0;
    let vel = 0;
    let lean = 0; // -1…1, where the pointer is across the page
    let sheenX = -60;
    let lastY = window.scrollY;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    // The hero pins for 110% (desktop) / 70% (phones) of the viewport; by then the scales are level
    const progress = () => Math.min(1, window.scrollY / (window.innerHeight * (window.innerWidth >= 768 ? 1.1 : 0.7)));

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      const p = progress();
      const settle = 1 - p * p * (3 - 2 * p); // smoothstep: lively at the top, level by the end
      // Wait for the stamp to land (CSS, ~1.15 s), then let it come alive
      const wake = Math.min(1, Math.max(0, (t - 1.15) / 1.2));
      const target = (Math.sin(t * 0.55) * 2.4 + Math.sin(t * 0.21 + 1) * 1.4 + lean * 7) * settle * wake;
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      vel += Math.max(-0.6, Math.min(0.6, dy * 0.012)) * settle;
      vel += (target - angle) * 0.03;
      vel *= 0.9;
      angle += vel;
      // Pans hang straight down, trailing a little behind the beam like real pendulums
      const hang = -angle - vel * 6;
      beam.current?.setAttribute("transform", `rotate(${angle.toFixed(3)} ${PIVOT.x} ${PIVOT.y})`);
      panL.current?.setAttribute("transform", `translate(${-ARM} 0) rotate(${hang.toFixed(3)})`);
      panR.current?.setAttribute("transform", `translate(${ARM} 0) rotate(${hang.toFixed(3)})`);
      // Sheen: follows the pointer on desktop; drifts and rides the scroll on phones
      const goal = fine ? lean * 110 : Math.sin(t * 0.4) * 90 + p * 160;
      sheenX += (goal - sheenX) * 0.06;
      sheen.current?.setAttribute("gradientTransform", `rotate(28 ${C} ${C}) translate(${sheenX.toFixed(2)} 0)`);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const onMove = (e: PointerEvent) => {
      lean = (e.clientX / window.innerWidth) * 2 - 1;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(el);
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [still]);

  const brass = `url(#seal-foil-${id})`;
  return (
    <div ref={root} aria-hidden className={className}>
      <div className="seal-stamp relative aspect-square w-full">
        <span className="seal-press absolute inset-0 rounded-full border border-brass/60" />
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient ref={sheen} id={`seal-foil-${id}`} gradientUnits="userSpaceOnUse" x1="-100" y1="0" x2="300" y2="0" gradientTransform={`rotate(28 ${C} ${C}) translate(-60 0)`}>
              <stop offset="0" stopColor="#a07e4a" />
              <stop offset="0.38" stopColor="#b08d57" />
              <stop offset="0.48" stopColor="#ecd9b0" />
              <stop offset="0.52" stopColor="#f6ead0" />
              <stop offset="0.62" stopColor="#b08d57" />
              <stop offset="1" stopColor="#a07e4a" />
            </linearGradient>
            <path id={`seal-ring-${id}`} d={`M ${C} ${C - RING_R} A ${RING_R} ${RING_R} 0 1 1 ${C - 0.01} ${C - RING_R}`} />
          </defs>

          <g fill="none" stroke={brass} strokeWidth="0.9" vectorEffect="non-scaling-stroke">
            <path d={RIM} strokeWidth="0.8" />
            <circle cx={C} cy={C} r="87" />
            <circle cx={C} cy={C} r="85" strokeOpacity="0.55" strokeDasharray="0.6 2.4" />
            <circle cx={C} cy={C} r="63" />
            <circle cx={C} cy={C} r="60.5" strokeOpacity="0.5" />
          </g>

          <g className="seal-ring">
            <text fill={brass} fontSize={fontSize} letterSpacing="0" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
              <textPath href={`#seal-ring-${id}`} textLength={circ - 2} lengthAdjust="spacing">
                {legend}
              </textPath>
            </text>
          </g>

          {/* The scales of justice */}
          <g fill="none" stroke={brass} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
            <path d={`M${C} ${PIVOT.y - 4} V131`} />
            <path d="M88 136 Q100 129 112 136 M84 136.5 H116" />
            <circle cx={C} cy={PIVOT.y - 7.5} r="3" />
            <g ref={beam} className="seal-beam">
              <path d={`M${PIVOT.x - ARM - 2} ${PIVOT.y} Q${C} ${PIVOT.y - 3.5} ${PIVOT.x + ARM + 2} ${PIVOT.y}`} />
              <circle cx={PIVOT.x - ARM} cy={PIVOT.y} r="1.3" fill={brass} />
              <circle cx={PIVOT.x + ARM} cy={PIVOT.y} r="1.3" fill={brass} />
              <g transform={`translate(${PIVOT.x} ${PIVOT.y})`}>
                <g ref={panL} className="seal-pan-l" transform={`translate(${-ARM} 0)`}>
                  <path d="M0 0 L-9 22 M0 0 L9 22 M-12 22 Q0 31 12 22 Z" />
                </g>
                <g ref={panR} className="seal-pan-r" transform={`translate(${ARM} 0)`}>
                  <path d="M0 0 L-9 22 M0 0 L9 22 M-12 22 Q0 31 12 22 Z" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
