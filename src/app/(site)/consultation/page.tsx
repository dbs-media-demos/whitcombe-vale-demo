import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { IntakeWizard } from "@/components/intake/IntakeWizard";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Phone } from "@/components/ui/Icons";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Schedule a Consultation",
  description: "Book a free, confidential 15-minute call with a Whitcombe & Vale attorney. Choose your matter, answer a few questions and pick a time. Dallas family, estate and business law.",
  path: "/consultation",
  eyebrow: "Free · 15 minutes · Confidential",
});

const expect = [
  { t: "15 minutes, free", b: "With an attorney, by phone or video, or in person at our office." },
  { t: "A conflict check first", b: "We only need names until we've confirmed we can represent you." },
  { t: "An honest answer", b: "Whether we're the right firm, and if not, who is." },
];

export default function ConsultationPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Schedule a consultation", path: "/consultation" }]}
        eyebrow="Step one · Free · Confidential"
        title={
          <>
            Tell us a little. <em className="t-italic text-brass-light">We&rsquo;ll call.</em>
          </>
        }
        lead="Four short steps, about two minutes. An attorney will confirm your time within one business day."
        compact
      />
      <section aria-label="Consultation request" className="theme-paper px-[var(--gutter)] py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <IntakeWizard />
          </div>
          <aside className="space-y-10 lg:col-span-4">
            <div>
              <p className="t-caps-sm text-accent">What to expect</p>
              <ol className="mt-4 border-t border-line-strong">
                {expect.map((e, i) => (
                  <li key={e.t} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-5">
                    <span className="t-caps-sm pt-1 text-accent">{["I", "II", "III"][i]}</span>
                    <div>
                      <h2 className="font-serif text-lg">{e.t}</h2>
                      <p className="mt-1 text-sm text-muted">{e.b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="theme-ink p-7">
              <p className="t-caps-sm text-brass">Prefer to talk now?</p>
              <a href={site.phoneHref} className="t-display mt-3 flex min-h-11 items-center gap-3 text-3xl">
                <Phone className="h-5 w-5 text-brass" /> {site.phone}
              </a>
              <OpenBadge className="mt-4 text-sm text-muted" />
              <p className="t-italic mt-4 text-sm text-brass-light">Se habla español.</p>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              If you are in danger, call 911. The National Domestic Violence Hotline (1-800-799-7233) is free, confidential and open around the clock.
            </p>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
