import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { addressLine, site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Legal Disclaimer & Attorney Advertising Notice",
  description: "Attorney advertising notice, no attorney-client relationship, no guarantee of results, and other important information about this website.",
  path: "/legal-disclaimer",
  eyebrow: "Legal disclaimer",
});

export default function DisclaimerPage() {
  return (
    <PageShell>
      <PageHero crumbs={[{ name: "Legal disclaimer", path: "/legal-disclaimer" }]} eyebrow="Please read" title="Legal disclaimer" compact />
      <section className="theme-paper px-[var(--gutter)] py-20 md:py-28">
        <div className="prose-legal mx-auto max-w-3xl text-[1.05rem] leading-[1.75]">
          <h2>Attorney advertising</h2>
          <p>
            This website is attorney advertising under the Texas Disciplinary Rules of Professional Conduct. The attorney responsible for its content is Catherine
            Whitcombe. Principal office: {addressLine}.
          </p>
          <h2>No legal advice</h2>
          <p>
            The information on this website, including articles, frequently asked questions and comparisons, is general information about Texas law. It is not legal
            advice, may not reflect the most recent developments and may not apply to your situation. Please don&rsquo;t act on it without speaking to a lawyer.
          </p>
          <h2>No attorney-client relationship</h2>
          <p>
            Visiting this website, calling our office, or submitting a form does not create an attorney-client relationship. A relationship begins only when both you
            and the firm have signed an engagement agreement. Until then, please don&rsquo;t send confidential information.
          </p>
          <h2>No guarantee of results</h2>
          <p>
            Client stories and reviews describe individual matters. Past results do not guarantee a similar outcome; every case depends on its own facts and the law in
            effect at the time. Client stories are anonymised and some details have been changed.
          </p>
          <h2>Board certification</h2>
          <p>
            Catherine Whitcombe is Board Certified in Family Law by the Texas Board of Legal Specialization. Other attorneys at the firm are not board certified. Unless
            stated otherwise, attorneys are licensed only in Texas.
          </p>
          <h2>Spanish-language services</h2>
          <p>Se habla español. Spanish-language consultations are available with Sofía Delgado and our bilingual staff.</p>
          <h2>Concept website</h2>
          <p>
            This website was created by Scale by Noon as a design concept. {site.legalName}, its attorneys, clients, reviews and results are fictional. Portraits are
            licensed stock photographs of models. The telephone number uses a reserved fictional range.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
