import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { PracticeIndex } from "@/components/sections/PracticeIndex";
import { ConsultationGuide } from "@/components/sections/ConsultationGuide";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { practices } from "@/content/practice";
import { graph, itemListSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Practice Areas: Family, Estate Planning & Business Law in Dallas",
  description:
    "Divorce, child custody, prenuptial agreements, wills, trusts, probate, business formation and contracts. Eight practice areas, three partners, clear flat fees in Dallas, TX.",
  path: "/practice-areas",
  eyebrow: "Practice areas",
});

export default function PracticeAreasPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Practice areas", path: "/practice-areas" }]}
        eyebrow="Three parts · Eight chapters"
        title={
          <>
            The practice, <em className="t-italic text-brass-light">in chapters.</em>
          </>
        }
        lead="We keep our practice deliberately narrow: family, legacy and small-business law. It means the partner you meet has handled your kind of matter hundreds of times."
        photo="books-row"
        photoAlt="A row of leather-bound law reports on a library shelf"
      />
      <section aria-label="Practice areas" className="theme-vellum px-[var(--gutter)] py-24 md:py-32">
        <PracticeIndex headingLevel="h2" />
      </section>
      <ConsultationGuide />
      <CtaBand />
      <JsonLd data={graph(itemListSchema(practices.map((p) => ({ name: p.title, path: `/practice-areas/${p.slug}` }))))} />
    </PageShell>
  );
}
