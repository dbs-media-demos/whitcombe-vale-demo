"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { openState, type OpenState } from "@/lib/hours";

/** Live "Open now · until 6 pm" badge in Dallas time. Renders a neutral label until mounted. */
export function OpenBadge({ className }: { className?: string }) {
  const [state, setState] = useState<OpenState | null>(null);
  useEffect(() => {
    const tick = () => setState(openState());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={clsx("pulse-dot h-2 w-2 shrink-0 rounded-full", state?.open ? "bg-[#6fbf8e] text-[#6fbf8e]" : "bg-brass text-brass", !state && "opacity-0")}
      />
      <span>{state ? state.label : "Office hours · Mon–Sat"}</span>
    </span>
  );
}
