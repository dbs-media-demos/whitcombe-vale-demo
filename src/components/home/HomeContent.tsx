import type { ReactNode } from "react";
import { preloadPhoneHero } from "@/components/home/preloadPhoneHero";
import { PageShell } from "@/components/layout/PageShell";
import { Threshold } from "@/components/home/Threshold";
import { Overture } from "@/components/home/Overture";
import { Folio } from "@/components/home/Folio";
import { PracticeIndex } from "@/components/sections/PracticeIndex";
import { ConsultationGuide } from "@/components/sections/ConsultationGuide";
import { CostBlock } from "@/components/sections/CostBlock";
import { AttorneysGallery } from "@/components/sections/AttorneysGallery";
import { WillVsTrust } from "@/components/sections/WillVsTrust";
import { Casebook } from "@/components/sections/Casebook";
import { ReviewsBand } from "@/components/sections/ReviewsBand";
import { VisitSection } from "@/components/sections/VisitSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { Kontakt } from "@/components/sections/Kontakt";
import { Marquee } from "@/components/ui/Marquee";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SplitReveal } from "@/components/ui/Reveal";
import { PreviewMap } from "@/components/preview/PreviewMap";
import { credentials } from "@/content/site";
import { defaultBiz } from "@/lib/biz";
import type { Biz } from "@/lib/biz-core";
import { trFor } from "@/i18n/tr";

/**
 * The homepage sections. The concept site renders them as they are; a personalised preview
 * (/for/<token>) passes a real firm: its name, phone, hours, rating and a map of its address replace
 * Whitcombe & Vale's. The fictional partners, credentials and case stories step aside.
 *
 * Serbian previews follow our reading of the Bar code (rule 17) and the Advocacy Act (art. 24): name,
 * contacts, normal hours, education, languages and branches of law, in measured words. No reviews or
 * stars, wins, counters, free offers or sales copy, and a plain contact section instead of "book a
 * consultation". English previews and the concept site keep their reviews.
 *
 * Phones (below 768 px or touch) read in another order, set with the .ph-o* classes in globals.css:
 * what we handle, reviews, what happens next and what it costs, lawyers and credentials, contact.
 */
export function HomeContent({ biz = defaultBiz, children }: { biz?: Biz; children?: ReactNode }) {
  const sr = biz.lang === "sr";
  const t = trFor(biz);
  preloadPhoneHero();
  return (
    <PageShell>
      {children}
      <div className="home-flow">
        <Threshold />

        {!biz.preview && (
          <div className="creds ph-o7 theme-ink border-y border-line py-5">
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
        )}

        <Overture biz={biz} />
        <Folio />

        <section id="oblasti" aria-labelledby="contents-title" className="contents-sec ph-o2 theme-vellum px-[var(--gutter)] py-28 md:py-40">
          <div className="sec-head mb-16 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="t-caps-sm text-accent">
                <span className="ph-hide">§ 03 · </span>
                {t("Contents")}
              </p>
              <SplitReveal as="h2" id="contents-title" className="t-display t-xxl mt-6">
                {sr ? "Oblasti prava" : "Contents"}
              </SplitReveal>
            </div>
            <div className="lg:col-span-4">
              <p className="t-lead text-muted">{t("Three parts, eight chapters. Choose the one you’re living through; we’ll take it from there.")}</p>
            </div>
          </div>
          <PracticeIndex />
          {!sr && (
            <div className="mt-12 flex justify-end">
              <ButtonLink href="/practice-areas" variant="text">
                All practice areas
              </ButtonLink>
            </div>
          )}
        </section>

        <ConsultationGuide>{!sr && <CostBlock biz={biz} />}</ConsultationGuide>

        {!biz.preview && (
          <section aria-labelledby="team-title" className="team-sec ph-o6 theme-paper px-[var(--gutter)] py-28 md:py-40">
            <div className="sec-head mb-20 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="t-caps-sm text-accent">
                  <span className="ph-hide">§ 05 · </span>The partners
                </p>
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
        )}

        {sr && (
          <section id="obrazovanje" aria-labelledby="edu-title" className="team-sec ph-o6 theme-paper px-[var(--gutter)] py-28 md:py-36">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="t-caps-sm text-accent">
                  <span className="ph-hide">§ 05 · </span>Advokati
                </p>
                <h2 id="edu-title" className="t-display t-lg mt-6">
                  Obrazovanje <em className="t-italic text-accent">i jezici.</em>
                </h2>
              </div>
              <dl className="edu-list border-t border-line-strong lg:col-span-6 lg:col-start-7">
                {[
                  ["Obrazovanje", "Završen pravni fakultet; položen pravosudni i advokatski ispit."],
                  ["Upis", "Imenik advokata advokatske komore."],
                  ["Jezici", "Srpski. Za rad na drugim jezicima pitajte pri pozivu."],
                  ["Oblasti prava", "Porodično, nasledno i privredno pravo."],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <dt className="t-caps-sm pt-1 text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {!sr && (
          <section aria-labelledby="wvt-title" className="wvt-sec ph-o5 theme-vellum px-[var(--gutter)] py-28 md:py-36">
            <div className="sec-head mb-14 max-w-4xl">
              <p className="t-caps-sm text-accent">
                <span className="ph-hide">§ 06 · </span>A question we hear every week
              </p>
              <SplitReveal as="h2" id="wvt-title" className="t-display t-lg mt-6">
                Will, or <em className="t-italic text-accent">living trust?</em>
              </SplitReveal>
            </div>
            <WillVsTrust />
          </section>
        )}

        {!biz.preview && (
          <section aria-labelledby="casebook-title" className="casebook-sec ph-o9 theme-paper px-[var(--gutter)] py-28 md:py-36">
            <div className="sec-head mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="t-caps-sm text-accent">
                  <span className="ph-hide">§ 07 · </span>From the casebook
                </p>
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
        )}

        {!sr && <ReviewsBand biz={biz} />}
        {biz.preview ? <PreviewMap biz={biz} /> : <VisitSection />}
        {sr ? <Kontakt biz={biz} /> : <CtaBand biz={biz} form />}
      </div>
    </PageShell>
  );
}
