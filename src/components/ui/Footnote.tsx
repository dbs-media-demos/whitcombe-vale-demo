"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Superscript footnote marker. Hover or focus shows the note as a small
 * margin card; tap toggles it on touch screens. The note is always in the
 * DOM (aria-describedby) for screen readers and crawlers.
 */
export function Footnote({ n, children }: { n: number | string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-describedby={id}
        aria-expanded={open}
        aria-label={`Footnote ${n}`}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="fn-mark relative -top-[0.6em] ml-px inline-flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full px-1 font-sans text-[0.6rem] font-semibold leading-none transition-colors before:absolute before:-inset-3 before:content-['']"
      >
        {n}
      </button>
      <span
        id={id}
        role="note"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 block w-[min(18rem,78vw)] border-t-2 border-oxblood bg-parchment px-4 py-3 text-left font-serif text-[0.88rem] italic leading-snug text-charcoal shadow-[0_18px_40px_-20px_rgba(0,0,0,.5)] transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]"
        style={{ opacity: open ? 1 : 0, transform: `translate(-50%, ${open ? 0 : 6}px)` }}
      >
        <span className="font-sans text-[0.6rem] font-semibold not-italic tracking-[0.2em] text-oxblood">NOTE {n} · </span>
        {children}
      </span>
      <style>{`
        .fn-mark { color: var(--oxblood); }
        .fn-mark:hover, .fn-mark[aria-expanded="true"] { background: var(--oxblood); color: var(--parchment); }
        .theme-ink .fn-mark { color: var(--brass-light); }
        .theme-ink .fn-mark:hover, .theme-ink .fn-mark[aria-expanded="true"] { background: var(--brass); color: var(--ink); }
      `}</style>
    </span>
  );
}
