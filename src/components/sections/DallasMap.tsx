"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/useIdleGSAP";

const roads = [
  { d: "M120 0 L300 250 L372 318 L360 600", label: "I-35E", lx: 214, ly: 118 },
  { d: "M398 322 L432 150 L452 0", label: "US-75", lx: 446, ly: 60 },
  { d: "M384 312 C380 200 374 100 368 0", label: "Tollway", lx: 330, ly: 40 },
  { d: "M0 372 L380 342 L800 300", label: "I-30", lx: 690, ly: 300 },
  { d: "M70 150 C240 92 560 84 700 152 S770 300 724 430", label: "I-635", lx: 600, ly: 104 },
  { d: "M0 566 L800 540", label: "I-20", lx: 60, ly: 556 },
];

const places = [
  { name: "Uptown", x: 372, y: 288 },
  { name: "Highland Park", x: 350, y: 236 },
  { name: "University Park", x: 364, y: 196 },
  { name: "Preston Hollow", x: 318, y: 130 },
  { name: "Lakewood", x: 522, y: 268 },
  { name: "Oak Cliff", x: 318, y: 440 },
  { name: "Bishop Arts", x: 296, y: 402 },
  { name: "Irving", x: 128, y: 300 },
  { name: "Addison", x: 342, y: 64 },
];

/**
 * An engraved-style map of central Dallas (not to scale): highways, the
 * Trinity River, White Rock Lake and the neighbourhoods we serve. Lines draw
 * in as the map scrolls into view. Deliberately abstract, not a real-address pin.
 */
export function DallasMap() {
  const root = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const lines = el.querySelectorAll("[data-draw]");
    const labels = el.querySelectorAll("[data-label]");
    const office = el.querySelector("[data-office]");
    return revealOnScroll(
      el,
      () => {
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(labels, { opacity: 0 });
      },
      () => {
        gsap
          .timeline()
          .to(lines, { strokeDashoffset: 0, duration: 2.6, stagger: 0.12, ease: "expo.inOut" })
          .to(labels, { opacity: 1, duration: 0.8, stagger: 0.04 }, 1.2)
          .fromTo(office, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 1.2, ease: "elastic.out(1,0.5)" }, 1.6);
      },
    );
  }, []);

  return (
    <svg ref={root} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="map-title map-desc" className="map-svg aspect-square h-auto w-full sm:aspect-[4/3]">
      <title id="map-title">Map of central Dallas and the neighbourhoods Whitcombe &amp; Vale serves</title>
      <desc id="map-desc">
        Stylised map showing the firm in the Arts District, with Uptown, Highland Park, University Park, Preston Hollow, Lakewood, Oak Cliff, Bishop Arts, Irving
        and Addison nearby, and Plano, Frisco and McKinney to the north.
      </desc>
      {/* distance rings */}
      {[90, 180, 270].map((r) => (
        <circle key={r} cx="396" cy="320" r={r} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="2 6" data-draw pathLength={1} />
      ))}
      {[
        { r: 90, t: "5 mi" },
        { r: 180, t: "10 mi" },
        { r: 270, t: "15 mi" },
      ].map((c) => (
        <text key={c.t} data-label x={396 + c.r * 0.72} y={320 - c.r * 0.7} className="fill-current text-[10px] tracking-[0.2em] opacity-50" style={{ fontFamily: "var(--font-sans)" }}>
          {c.t}
        </text>
      ))}
      {/* Trinity River */}
      <path data-draw pathLength={1} d="M30 238 C140 270 210 330 300 372 S420 452 520 510 S700 578 800 596" fill="none" stroke="#7a8f86" strokeWidth="5" strokeOpacity="0.45" strokeLinecap="round" />
      <text data-label x="150" y="258" className="fill-current text-[11px] italic opacity-60" style={{ fontFamily: "var(--font-serif)" }} transform="rotate(14 150 258)">
        Trinity River
      </text>
      {/* Lakes */}
      <ellipse data-draw pathLength={1} cx="566" cy="226" rx="22" ry="40" transform="rotate(-20 566 226)" fill="none" stroke="#7a8f86" strokeOpacity="0.7" strokeWidth="1.2" />
      <text data-label x="596" y="232" className="fill-current text-[10px] italic opacity-60" style={{ fontFamily: "var(--font-serif)" }}>
        White Rock Lake
      </text>
      <ellipse data-draw pathLength={1} cx="292" cy="170" rx="18" ry="9" fill="none" stroke="#7a8f86" strokeOpacity="0.7" strokeWidth="1.2" />
      {/* Highways */}
      {roads.map((r) => (
        <g key={r.label}>
          <path data-draw pathLength={1} d={r.d} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.3" />
          <text data-label x={r.lx} y={r.ly} className="fill-current text-[9px] font-semibold tracking-[0.18em] opacity-55" style={{ fontFamily: "var(--font-sans)" }}>
            {r.label}
          </text>
        </g>
      ))}
      {/* Neighbourhoods */}
      {places.map((p) => (
        <g key={p.name} data-label>
          <circle cx={p.x} cy={p.y} r="2.4" className="fill-current" opacity="0.7" />
          <text x={p.x + 7} y={p.y + 4} className="fill-current text-[13px]" style={{ fontFamily: "var(--font-serif)" }}>
            {p.name}
          </text>
        </g>
      ))}
      {/* Edge notes */}
      <text data-label x="470" y="22" data-edge className="fill-current text-[10px] tracking-[0.18em] opacity-60" style={{ fontFamily: "var(--font-sans)" }}>
        ↑ RICHARDSON · PLANO · FRISCO · MCKINNEY
      </text>
      <text data-label x="12" y="330" data-edge className="fill-current text-[10px] tracking-[0.18em] opacity-60" style={{ fontFamily: "var(--font-sans)" }}>
        ← LAS COLINAS
      </text>
      {/* The office */}
      <g data-office>
        <circle cx="396" cy="320" r="16" fill="var(--brass)" opacity="0.22" />
        <circle cx="396" cy="320" r="6" fill="var(--brass)" />
      </g>
      <g data-label>
        <line x1="402" y1="326" x2="470" y2="372" stroke="var(--brass)" strokeWidth="1" />
        <text x="476" y="378" className="text-[15px]" fill="var(--accent)" style={{ fontFamily: "var(--font-display)" }}>
          Whitcombe &amp; Vale
        </text>
        <text x="476" y="394" className="fill-current text-[9px] tracking-[0.2em] opacity-70" style={{ fontFamily: "var(--font-sans)" }}>
          ARTS DISTRICT · SUITE 1400
        </text>
      </g>
      <style>{`
        @media (max-width: 639px) {
          .map-svg text { font-size: 19px; }
          .map-svg [data-edge] { display: none; }
        }
      `}</style>
    </svg>
  );
}
