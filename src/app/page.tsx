import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Threshold } from "@/components/home/Threshold";
import { Overture } from "@/components/home/Overture";
import { Folio } from "@/components/home/Folio";
import { PracticeIndex } from "@/components/sections/PracticeIndex";
import { ConsultationGuide } from "@/components/sections/ConsultationGuide";
import { AttorneysGallery } from "@/components/sections/AttorneysGallery";
import { WillVsTrust } from "@/components/sections/WillVsTrust";
import { Casebook } from "@/components/sections/Casebook";
import { ReviewsBand } from "@/components/sections/ReviewsBand";
import { VisitSection } from "@/components/sections/VisitSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { Marquee } from "@/components/ui/Marquee";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SplitReveal } from "@/components/ui/Reveal";
import { credentials, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${site.legalName} | Family, Estate & Business Lawyers in Dallas, TX`,
  absoluteTitle: true,
  description: site.description,
  path: "/",
  eyebrow: "Family · Estate · Business Law",
});

export default function Home() {
  return (
    <PageShell>
      <Threshold />

      <div className="theme-ink border-y border-line py-5">
        <Marquee speed={70}>
          {credentials.map((c) => (
            <span key={c} className="t-caps-sm flex items-center gap-8 pr-8 text-muted">
              {c}
              <span aria-hidden className="text-brass">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <Overture />
      <Folio />

      <section aria-labelledby="contents-title" className="theme-vellum px-[var(--gutter)] py-28 md:py-40">
        <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-caps-sm text-accent">§ 03 · Contents</p>
            <SplitReveal as="h2" id="contents-title" className="t-display t-xxl mt-6">
              Contents
            </SplitReveal>
          </div>
          <div className="lg:col-span-4">
            <p className="t-lead text-muted">Three parts, eight chapters. Choose the one you&rsquo;re living through; we&rsquo;ll take it from there.</p>
          </div>
        </div>
        <PracticeIndex />
        <div className="mt-12 flex justify-end">
          <ButtonLink href="/practice-areas" variant="text">
            All practice areas
          </ButtonLink>
        </div>
      </section>

      <ConsultationGuide />

      <section aria-labelledby="team-title" className="theme-paper px-[var(--gutter)] py-28 md:py-40">
        <div className="mb-20 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-caps-sm text-accent">§ 05 · The partners</p>
            <SplitReveal as="h2" id="team-title" className="t-display t-lg mt-6">
              Three attorneys. You&rsquo;ll know <em className="t-italic text-accent">each of them</em> by name.
            </SplitReveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-muted">
              No hand-offs to a junior you&rsquo;ve never met. The partner you meet at the strategy meeting is the partner who handles your matter.
            </p>
            <ButtonLink href="/attorneys" variant="text" className="mt-6">
              Meet the attorneys
            </ButtonLink>
          </div>
        </div>
        <AttorneysGallery />
      </section>

      <section aria-labelledby="wvt-title" className="theme-vellum px-[var(--gutter)] py-28 md:py-36">
        <div className="mb-14 max-w-4xl">
          <p className="t-caps-sm text-accent">§ 06 · A question we hear every week</p>
          <SplitReveal as="h2" id="wvt-title" className="t-display t-lg mt-6">
            Will, or <em className="t-italic text-accent">living trust?</em>
          </SplitReveal>
        </div>
        <WillVsTrust />
      </section>

      <section aria-labelledby="casebook-title" className="theme-paper px-[var(--gutter)] py-28 md:py-36">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-caps-sm text-accent">§ 07 · From the casebook</p>
            <SplitReveal as="h2" id="casebook-title" className="t-display t-lg mt-6">
              Outcomes, <em className="t-italic text-accent">quietly</em> reached.
            </SplitReveal>
          </div>
          <ButtonLink href="/results" variant="text">
            All client stories
          </ButtonLink>
        </div>
        <Casebook />
      </section>

      <ReviewsBand />
      <VisitSection />
      <CtaBand />
    </PageShell>
  );
}
