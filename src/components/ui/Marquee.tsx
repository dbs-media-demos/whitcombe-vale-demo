import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

/** Endless horizontal ticker (CSS only). Content is duplicated once; the copy is hidden from assistive tech. */
export function Marquee({ children, speed = 60, className }: { children: ReactNode; speed?: number; className?: string }) {
  return (
    <div className={clsx("marquee-wrap overflow-hidden", className)}>
      <div className="marquee" style={{ "--marquee-speed": `${speed}s` } as CSSProperties}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
