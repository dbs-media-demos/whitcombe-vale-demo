import type { Faq } from "@/content/faq";

/** Accessible accordion on <details>: every answer is in the HTML and works without JS. */
export function FaqList({ items, start = 1 }: { items: Faq[]; start?: number }) {
  return (
    <div className="border-t border-line-strong">
      {items.map((f, i) => (
        <details key={f.q} className="faq group border-b border-line">
          <summary className="flex min-h-14 cursor-pointer list-none items-start gap-5 py-6 [&::-webkit-details-marker]:hidden sm:gap-8">
            <span className="t-caps-sm mt-2.5 w-8 shrink-0 text-faint">§ {start + i}</span>
            <span className="t-display flex-1 text-[clamp(1.3rem,2.2vw,1.85rem)] leading-tight">{f.q}</span>
            <span className="relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors duration-500 group-open:border-accent group-open:bg-accent group-open:text-accent-fg">
              <span className="absolute h-px w-3 bg-current" />
              <span className="absolute h-3 w-px bg-current transition-transform duration-500 group-open:rotate-90 group-open:scale-0" />
            </span>
          </summary>
          <p className="max-w-3xl pb-8 pl-[3.25rem] text-muted sm:pl-16">{f.a}</p>
        </details>
      ))}
      <style>{`
        @supports (interpolate-size: allow-keywords) {
          .faq { interpolate-size: allow-keywords; }
          .faq::details-content { block-size: 0; overflow: clip; transition: block-size .8s var(--ease-out-expo), content-visibility .8s allow-discrete; }
          .faq[open]::details-content { block-size: auto; }
        }
      `}</style>
    </div>
  );
}
