import clsx from "clsx";
import type { ReactNode } from "react";

/** "§ 03 — Contents" style label with a short brass rule. */
export function SectionLabel({ n, children, className }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p className={clsx("t-caps flex items-center gap-4 text-muted", className)}>
      {n && <span className="text-accent">§ {n}</span>}
      <span aria-hidden className="h-px w-8 bg-accent" />
      <span>{children}</span>
    </p>
  );
}
