import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { JsonLd } from "@/components/ui/JsonLd";
import { allFaqs, faqGroups } from "@/content/faq";
import { faqSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description: "Free first call, strategy meetings, flat fees, confidentiality, Spanish-speaking attorneys and parking: answers to what clients ask Whitcombe & Vale before they start.",
  path: "/faq",
  eyebrow: "Questions",
});

export default function FaqPage() {
  const starts = faqGroups.map((_, i) => 1 + faqGroups.slice(0, i).reduce((sum, g) => sum + g.items.length, 0));
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        eyebrow="Questions, answered"
        title={
          <>
            Before you <em className="t-italic text-brass-light">call.</em>
          </>
        }
        lead="The practical questions: what the first call costs (nothing), how fees work, and what happens to what you tell us."
        compact
      />
      <section aria-label="Frequently asked questions" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <div className="space-y-24">
          {faqGroups.map((g, gi) => {
            const start = starts[gi];
            return (
              <div key={g.title} className="grid gap-10 lg:grid-cols-12">
                <h2 className="t-display t-md lg:col-span-4">{g.title}</h2>
                <div className="lg:col-span-8">
                  <FaqList items={g.items} start={start} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <CtaBand title="Still have a question? Ask a lawyer, free." />
      <JsonLd data={graph(faqSchema(allFaqs))} />
    </PageShell>
  );
}
