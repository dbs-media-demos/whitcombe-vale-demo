import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps every page. Route changes animate like a page turn: the old page
 * settles back, the new sheet wipes up (see ::view-transition-*(.page)).
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative">
        {children}
      </main>
    </ViewTransition>
  );
}
