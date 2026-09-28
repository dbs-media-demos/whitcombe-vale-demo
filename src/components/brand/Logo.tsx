import clsx from "clsx";

/**
 * The W/V ligature: a W is literally two V's. The first V is drawn in the
 * text colour, the second in brass, overlapping at the centre the way a
 * Caslon W crosses its middle strokes.
 */
export const MARK = {
  v1: "M2 8h7.5L17 33.5 25 8h1.5l-9.3 32h-2z",
  v2: "M22 8h7.5L37 33.5 45 8h1.5l-9.3 32h-2z",
  rule: "M2 44.2h44.5v.9H2z",
};

export function Mark({ className, accent = "var(--brass)", title }: { className?: string; accent?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={MARK.v1} fill="currentColor" />
      <path d={MARK.v2} fill={accent} />
      <path d={MARK.rule} fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <Mark className="h-9 w-9 shrink-0" />
      <span className={clsx("flex flex-col leading-none", compact && "max-sm:hidden")}>
        <span className="whitespace-nowrap text-[0.8rem] font-semibold tracking-[0.26em]">
          WHITCOMBE <span className="t-italic px-0.5 text-[1.05rem] font-normal tracking-normal text-brass">&amp;</span> VALE
        </span>
        <span className="t-caps-sm mt-1.5 text-[0.55rem] opacity-70">Attorneys · Est. MMIX · Dallas</span>
      </span>
    </span>
  );
}
