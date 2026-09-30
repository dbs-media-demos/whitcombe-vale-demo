"use client";

import { useEffect, useState } from "react";
import { agencyName, agencyUrl } from "@/content/site";

const KEY = "wv-demo-pill-dismissed";

/** Small fixed pill that marks the site as a Scale by Noon concept. Dismissible for the session. */
export function DemoPill() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is client-only
    if (!dismissed) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="anim-fade fixed bottom-[5.2rem] left-3 z-[66] flex items-center rounded-full border border-parchment/20 bg-charcoal/90 pl-3.5 text-[0.7rem] md:pl-4 md:text-[0.78rem] text-parchment shadow-lg backdrop-blur md:bottom-4 md:left-4" style={{ "--d": "2.5s" } as React.CSSProperties}>
      <a href={agencyUrl} className="inline-flex min-h-10 items-center gap-1.5 pr-1 hover:text-brass-light">
        <span>
          Concept <span className="hidden sm:inline">site </span>by
        </span>
        <strong className="font-semibold">{agencyName}</strong> <span aria-hidden>↗</span>
      </a>
      <button
        type="button"
        onClick={() => {
          setShow(false);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }}
        aria-label="Dismiss concept site notice"
        className="flex h-10 w-10 items-center justify-center rounded-full text-parchment/70 hover:text-parchment"
      >
        <span aria-hidden className="text-base leading-none">×</span>
      </button>
    </div>
  );
}
