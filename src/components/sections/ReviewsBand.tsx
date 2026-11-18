import { Marquee } from "@/components/ui/Marquee";
import { Stars } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { PenMark } from "@/components/ui/PenMark";
import { ScrollBoost } from "@/components/ui/ScrollBoost";
import { reviews, type Review } from "@/content/reviews";
import { defaultBiz } from "@/lib/biz";
import type { Biz } from "@/lib/biz-core";
import { trFor } from "@/i18n/tr";

export function ReviewCard({ r, className, area, text }: { r: Review; className?: string; area?: string; text?: string }) {
  return (
    <figure className={`flex h-full flex-col border border-line bg-surface/60 p-7 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-4">
        <Stars value={r.rating} className="text-brass" />
        <span className="t-caps-sm text-faint">{r.matter}</span>
      </div>
      <blockquote className="mt-5 flex-1 font-serif text-[1.02rem] leading-relaxed">&ldquo;{text ?? r.text}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="font-medium">{r.name}</span>
        <span className="text-muted">{area ?? r.area}</span>
      </figcaption>
    </figure>
  );
}

/** Google-style rating summary and a slow ticker of client reviews. Phones stack the first three, full and unticking. English only. */
export function ReviewsBand({ biz = defaultBiz }: { biz?: Biz }) {
  const t = trFor(biz);
  const list = reviews;
  const area = biz.preview ? biz.area : undefined;
  // A preview that knows their towns signs the letters from them in turn
  const areaAt = (i: number) => (biz.areas.length > 1 ? biz.areas[i % biz.areas.length] : area);
  return (
    <section aria-labelledby="reviews-title" className="reviews-band ph-o3 theme-ink relative overflow-hidden py-28 md:py-36">
      <div className="grid gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="t-caps-sm text-brass">
            <span className="ph-hide">§ 08 · </span>Correspondence{biz.preview && " · samples"}
          </p>
          <h2 id="reviews-title" className="t-display t-lg mt-5">
            What clients write{" "}
            <span className="relative inline-block">
              <em className="t-italic text-brass-light">afterwards.</em>
              <PenMark
                viewBox="0 0 320 18"
                paths={["M4 11 C 60 4 150 3 230 8 S 300 15 316 7"]}
                className="pointer-events-none absolute -bottom-[0.12em] left-[2%] h-[0.2em] w-[92%] text-brass"
              />
            </span>
          </h2>
        </div>
        {biz.rating && (
          <Reveal className="flex items-end gap-6 lg:col-span-5 lg:justify-end">
            <p className="reviews-score t-display relative text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.8]">
              {biz.rating.value}
              {/* Circled in brass ink, like the figure that matters on a page */}
              <PenMark
                viewBox="0 0 240 130"
                delay={0.6}
                duration={1.5}
                paths={["M196 20 C 150 2 56 6 24 42 C 0 70 38 116 122 118 C 204 120 240 88 228 54 C 218 24 168 8 112 12 C 84 14 64 20 50 28"]}
                className="pointer-events-none absolute -left-[21%] -top-[30%] h-[150%] w-[140%] text-brass"
              />
            </p>
            <div className="pb-1">
              <Stars value={5} className="text-brass" />
              <p className="mt-2 text-sm text-muted">
                {biz.rating.count} Google reviews
                {!biz.preview && (
                  <>
                    <br />
                    92% five-star
                  </>
                )}
              </p>
            </div>
          </Reveal>
        )}
      </div>

      {/* Letters laid on the desk slightly askew; scrolling sends them past faster (or back) */}
      <ScrollBoost className="mt-16">
        <Marquee speed={90} className="py-4">
          {list.map((r, i) => (
            <div key={r.name} className="w-[82vw] shrink-0 pr-5 sm:w-[26rem]">
              <ReviewCard
                r={r}
                text={t(r.text)}
                area={areaAt(i)}
                className={`letter ${["-rotate-[0.9deg]", "rotate-[0.6deg] translate-y-2", "rotate-[-0.3deg] -translate-y-1", "rotate-[1deg]"][i % 4]}`}
              />
            </div>
          ))}
        </Marquee>
      </ScrollBoost>

      <div className="mt-12 px-[var(--gutter)]">
        <ButtonLink href="/reviews" variant="outline">
          Read all reviews
        </ButtonLink>
      </div>
    </section>
  );
}
