import { MARK } from "@/components/brand/Logo";

// Irregular, slightly lumpy outline so it reads as poured wax, not a vector circle.
const points = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const r = 50 + Math.sin(i * 2.7) * 1.8 + Math.sin(i * 5.3 + 1) * 1.2 + (i % 7 === 0 ? 2.4 : 0);
  return `${(60 + Math.cos(a) * r).toFixed(2)},${(60 + Math.sin(a) * r).toFixed(2)}`;
});
const OUTLINE = `M${points.join("L")}Z`;

/** An oxblood wax seal embossed with the W/V mark. */
export function WaxSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#8e2a30" />
          <stop offset="0.55" stopColor="#6b1e23" />
          <stop offset="1" stopColor="#3f0f13" />
        </radialGradient>
      </defs>
      <path d={OUTLINE} fill="url(#wax)" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#3f0f13" strokeWidth="2.2" opacity="0.8" />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#b5545a" strokeWidth="0.8" opacity="0.5" transform="translate(-0.8 -0.8)" />
      <g transform="translate(36 35) scale(1)">
        <path d={MARK.v1} fill="#3f0f13" transform="translate(0.8 0.8)" />
        <path d={MARK.v2} fill="#3f0f13" transform="translate(0.8 0.8)" />
        <path d={MARK.v1} fill="#a8454b" />
        <path d={MARK.v2} fill="#c9a36a" opacity="0.85" />
      </g>
      <ellipse cx="44" cy="36" rx="14" ry="7" fill="#fff" opacity="0.08" transform="rotate(-30 44 36)" />
    </svg>
  );
}
