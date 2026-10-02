import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { ReviewCard } from "@/components/sections/ReviewsBand";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Icons";
import { ratingBreakdown, reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Client Reviews: 4.9 Stars from 212 Google Reviews",
  description: "What clients say about Whitcombe & Vale: divorce, custody, wills, trusts, probate and business law in Dallas. 4.9 stars from 212 Google reviews.",
  path: "/reviews",
  eyebrow: "Correspondence",
});

export default function ReviewsPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Reviews", path: "/reviews" }]}
        eyebrow="Correspondence"
        title={
          <>
            In our clients&rsquo; <em className="t-italic text-brass-light">own words.</em>
          </>
        }
        compact
      >
        <div className="flex flex-col gap-10 md:flex-row md:items-end">
          <div className="flex items-end gap-5">
            <p className="t-display text-[clamp(5rem,9vw,8rem)] leading-[0.8]">{site.rating.value}</p>
            <div className="pb-1">
              <Stars value={5} className="text-brass" />
              <p className="mt-2 text-sm text-muted">{site.rating.count} Google reviews</p>
            </div>
          </div>
          <dl className="w-full max-w-xs space-y-1.5" aria-label="Rating breakdown">
            {ratingBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-3 text-sm">
                <dt className="w-12 text-muted">{r.stars} star</dt>
                <dd className="relative h-[3px] flex-1 bg-line">
                  <span className="absolute inset-y-0 left-0 bg-brass" style={{ width: `${r.share * 100}%` }} />
                  <span className="sr-only">{Math.round(r.share * 100)}%</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </PageHero>

      <section aria-label="Reviews" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <Reveal stagger={0.08} className="columns-1 gap-6 md:columns-2 xl:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {reviews.map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </Reveal>
        <p className="t-italic mt-10 max-w-2xl text-sm text-muted">
          Reviews are shown as written, with names shortened for privacy. Reviews reflect individual experiences and are not a guarantee of any outcome.
        </p>
      </section>
      <CtaBand title="Add your chapter to these." />
    </PageShell>
  );
}
