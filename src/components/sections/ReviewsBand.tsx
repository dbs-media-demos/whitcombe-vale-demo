import { Marquee } from "@/components/ui/Marquee";
import { Stars } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { reviews, type Review } from "@/content/reviews";
import { site } from "@/content/site";

export function ReviewCard({ r, className }: { r: Review; className?: string }) {
  return (
    <figure className={`flex h-full flex-col border border-line bg-surface/60 p-7 ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-4">
        <Stars value={r.rating} className="text-brass" />
        <span className="t-caps-sm text-faint">{r.matter}</span>
      </div>
      <blockquote className="mt-5 flex-1 font-serif text-[1.02rem] leading-relaxed">&ldquo;{r.text}&rdquo;</blockquote>
      <figcaption className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="font-medium">{r.name}</span>
        <span className="text-muted">{r.area}</span>
      </figcaption>
    </figure>
  );
}

/** Google-style rating summary and a slow ticker of client reviews. */
export function ReviewsBand() {
  return (
    <section aria-labelledby="reviews-title" className="theme-ink relative overflow-hidden py-28 md:py-36">
      <div className="grid gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="t-caps-sm text-brass">§ 08 · Correspondence</p>
          <h2 id="reviews-title" className="t-display t-lg mt-5">
            What clients write <em className="t-italic text-brass-light">afterwards.</em>
          </h2>
        </div>
        <Reveal className="flex items-end gap-6 lg:col-span-5 lg:justify-end">
          <p className="t-display text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.8]">{site.rating.value}</p>
          <div className="pb-1">
            <Stars value={5} className="text-brass" />
            <p className="mt-2 text-sm text-muted">
              {site.rating.count} Google reviews
              <br />
              92% five-star
            </p>
          </div>
        </Reveal>
      </div>

      <Marquee speed={90} className="mt-16">
        {reviews.map((r) => (
          <div key={r.name} className="w-[82vw] shrink-0 pr-5 sm:w-[26rem]">
            <ReviewCard r={r} />
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
