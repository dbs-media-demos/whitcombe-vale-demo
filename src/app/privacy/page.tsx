import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Whitcombe & Vale, PLLC collects, uses and protects information submitted through this website.",
  path: "/privacy",
  eyebrow: "Privacy",
});

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero crumbs={[{ name: "Privacy", path: "/privacy" }]} eyebrow="Last updated September 28, 2026" title="Privacy policy" compact />
      <section className="theme-paper px-[var(--gutter)] py-20 md:py-28">
        <div className="prose-legal mx-auto max-w-3xl text-[1.05rem] leading-[1.75]">
          <p className="t-lead">
            {site.legalName} (&ldquo;we&rdquo;) respects the confidentiality our profession demands. This policy explains what information this website collects and how
            we use it.
          </p>
          <h2>Information you give us</h2>
          <p>
            When you request a consultation or send a message, we receive the details you enter: your name, email address, phone number, preferred language, the type of
            matter and your preferred time. We use this information to run a conflict check and to contact you. Please do not send confidential details through the
            website before we confirm that we can represent you.
          </p>
          <h2>Information collected automatically</h2>
          <p>
            Like most websites, our hosting provider records basic technical data such as IP address, browser type and pages visited, for security and performance. We do
            not use advertising cookies and we do not sell or share personal information for advertising.
          </p>
          <h2>How we protect information</h2>
          <ul>
            <li>Client files are kept in an encrypted document system with two-factor authentication.</li>
            <li>Access is limited to the attorneys and staff working on your matter.</li>
            <li>We do not discuss client matters by unencrypted text message.</li>
          </ul>
          <h2>How long we keep it</h2>
          <p>
            Enquiries that do not become client matters are deleted within 12 months. Client files are retained as required by the Texas Disciplinary Rules of
            Professional Conduct and then securely destroyed.
          </p>
          <h2>Your choices</h2>
          <p>
            You may ask us to access, correct or delete the information you submitted through this website by writing to{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> or calling {site.phone}.
          </p>
          <h2>About this website</h2>
          <p>
            This is a concept website designed by DBS Media. {site.legalName} is a fictional firm, and forms on this site do not transmit or store any information.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
