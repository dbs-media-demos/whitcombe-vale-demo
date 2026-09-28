import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { stories } from "@/content/results";
import { photos } from "@/content/photos";

/** Three anonymised client stories set in newspaper columns with vertical rules. */
export function Casebook({ ids = ["relocation", "muniment", "founders"] }: { ids?: string[] }) {
  const items = ids.map((id) => stories.find((s) => s.id === id)!).filter(Boolean);
  return (
    <div>
      <Reveal stagger={0.12} className="grid border-t border-line-strong md:grid-cols-3">
        {items.map((s, i) => (
          <article key={s.id} className={`flex flex-col py-10 md:px-8 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : "md:pl-0"} ${i === items.length - 1 ? "md:pr-0" : ""}`}>
            <p className="t-caps-sm text-accent">{s.matter}</p>
            <div className="relative mt-6 aspect-[16/10] overflow-hidden">
              <Image src={photos[s.photo]} alt="" fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
            </div>
            <h3 className="t-display mt-6 text-[clamp(1.5rem,2vw,1.95rem)] leading-[1.1]">{s.title}</h3>
            <p className="mt-4 text-[0.95rem] text-muted">{s.outcome}</p>
            <div className="mt-auto flex items-end justify-between gap-4 pt-8">
              <p>
                <span className="t-display block text-5xl leading-none">{s.figure.value}</span>
                <span className="t-caps-sm mt-2 block text-faint">{s.figure.label}</span>
              </p>
              <Link href={`/results#${s.id}`} className="inline-flex min-h-11 items-center gap-2 border-b border-current text-sm text-accent" aria-label={`Read the story: ${s.title}`}>
                Read <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </Reveal>
      <p className="t-italic mt-4 border-t border-line pt-4 text-sm text-muted">
        Client stories are anonymised and shared with permission. Past results do not guarantee future outcomes; every matter turns on its own facts.
      </p>
    </div>
  );
}
