import { Marquee } from "@/components/ui/Marquee";
import { Stars } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { reviews, type Review } from "@/content/reviews";
import { defaultBiz } from "@/lib/biz";
import { L, type Biz } from "@/lib/biz-core";

export function ReviewCard({ r, className, area }: { r: Review; className?: string; area?: string }) {
  return (
    <figure className={`flex h-full flex-col border border-line bg-surface/60 p-7 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-4">
        <Stars value={r.rating} className="text-brass" />
        <span className="t-caps-sm text-faint">{r.matter}</span>
      </div>
      <blockquote className="mt-5 flex-1 font-serif text-[1.02rem] leading-relaxed">&ldquo;{r.text}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="font-medium">{r.name}</span>
        <span className="text-muted">{area ?? r.area}</span>
      </figcaption>
    </figure>
  );
}

/** Google-style rating summary and a slow ticker of client reviews. */
// Serbian previews keep the reviews whose matters exist there (no living trusts, Texas probate or Thanksgiving)
const SR_REVIEWS = ["Rachel M.", "Chris O.", "Jenna & Luis R.", "Harold W."];

export function ReviewsBand({ biz = defaultBiz }: { biz?: Biz }) {
  const list = biz.lang === "sr" ? reviews.filter((r) => SR_REVIEWS.includes(r.name)) : reviews;
  const area = biz.preview ? biz.area : undefined;
  return (
    <section aria-labelledby="reviews-title" className="theme-ink relative overflow-hidden py-28 md:py-36">
      <div className="grid gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="t-caps-sm text-brass">{biz.preview ? L(biz, "§ 08 · Correspondence · samples", "§ 08 · Utisci · primeri") : "§ 08 · Correspondence"}</p>
          <h2 id="reviews-title" className="t-display t-lg mt-5">
            What clients write <em className="t-italic text-brass-light">afterwards.</em>
          </h2>
        </div>
        {biz.rating && (
          <Reveal className="flex items-end gap-6 lg:col-span-5 lg:justify-end">
            <p className="t-display text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.8]">{biz.lang === "sr" ? String(biz.rating.value).replace(".", ",") : biz.rating.value}</p>
            <div className="pb-1">
              <Stars value={5} className="text-brass" />
              <p className="mt-2 text-sm text-muted">
                {L(biz, `${biz.rating.count} Google reviews`, `${biz.rating.count} Google recenzija`)}
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

      <Marquee speed={90} className="mt-16">
        {list.map((r) => (
          <div key={r.name} className="w-[82vw] shrink-0 pr-5 sm:w-[26rem]">
            <ReviewCard r={r} area={area} />
          </div>
        ))}
      </Marquee>

      <div className="mt-12 px-[var(--gutter)]">
        <ButtonLink href="/reviews" variant="outline">
          Read all reviews
        </ButtonLink>
      </div>
    </section>
  );
}
