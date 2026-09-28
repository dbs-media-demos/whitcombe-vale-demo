import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { VisitSection } from "@/components/sections/VisitSection";
import { ContactForm } from "@/components/intake/ContactForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Phone } from "@/components/ui/Icons";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: `Call ${site.phone}, email ${site.email} or visit us at 1847 Ashland Row, Suite 1400, in the Dallas Arts District. Mon–Thu 8:30–6, Fri 8:30–5, Sat by appointment.`,
  path: "/contact",
  eyebrow: "Contact",
});

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title={
          <>
            Write, call, <em className="t-italic text-brass-light">or visit.</em>
          </>
        }
        compact
      >
        <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
          <div>
            <p className="t-caps-sm text-muted">Telephone</p>
            <a href={site.phoneHref} className="t-display mt-2 flex min-h-11 items-center gap-3 text-[1.9rem]">
              <Phone className="h-5 w-5 text-brass" />
              {site.phone}
            </a>
            <OpenBadge className="mt-2 text-sm text-muted" />
          </div>
          <div>
            <p className="t-caps-sm text-muted">Email</p>
            <a href={`mailto:${site.email}`} className="mt-2 inline-flex min-h-11 items-center font-serif text-xl underline decoration-line-strong underline-offset-4 hover:decoration-brass">
              {site.email}
            </a>
          </div>
          <div>
            <p className="t-caps-sm text-muted">Consultations</p>
            <ButtonLink href="/consultation" className="mt-2">
              Book online
            </ButtonLink>
          </div>
        </div>
      </PageHero>
      <section aria-labelledby="message-title" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-caps-sm text-accent">General enquiries</p>
            <h2 id="message-title" className="t-display t-md mt-4">
              Send a short note
            </h2>
            <p className="mt-5 text-muted">
              For billing questions, press, referrals or anything that isn&rsquo;t a new legal matter. To discuss a new matter, the{" "}
              <Link href="/consultation" className="text-accent underline underline-offset-4">
                consultation form
              </Link>{" "}
              is faster.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
      <VisitSection label="Visit the office" />
    </PageShell>
  );
}
