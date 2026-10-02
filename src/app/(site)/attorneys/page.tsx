import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { AttorneysGallery } from "@/components/sections/AttorneysGallery";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, ScrubWords } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Attorneys: Family, Estate & Business Lawyers in Dallas",
  description:
    "Meet Catherine Whitcombe (Board Certified in Family Law), Julian Vale (estate planning & probate, LL.M. Taxation) and Sofía Delgado (business law, bilingual).",
  path: "/attorneys",
  eyebrow: "The attorneys",
});

const principles = [
  { t: "One partner, start to finish", b: "The attorney you meet at the strategy meeting handles your matter. Paralegals help; they don't replace." },
  { t: "Replies within a business day", b: "Every call and email is answered by the next business day, usually the same day." },
  { t: "Plain English, in writing", b: "After every meaningful step you get a short written summary: what happened, what's next, what it costs." },
];

export default function AttorneysPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Attorneys", path: "/attorneys" }]}
        eyebrow="Three partners · Est. 2009"
        title={
          <>
            People you&rsquo;ll know <em className="t-italic text-brass-light">by name.</em>
          </>
        }
        lead="Between us, more than sixty years of practice in the Dallas courts. Small enough to know every file; experienced enough to see around corners."
        compact
      />
      <section aria-label="Partners" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <AttorneysGallery headingLevel="h2" />
      </section>
      <section aria-labelledby="principles-title" className="theme-vellum px-[var(--gutter)] py-24 md:py-32">
        <h2 id="principles-title" className="sr-only">
          How we work with clients
        </h2>
        <ScrubWords
          className="t-display max-w-5xl text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.12]"
          accent={["listen"]}
          text="We are not the biggest firm in Dallas and we don't want to be. We want to be the one that picks up the phone, tells you the truth, and still remembers your children's names five years later. That starts with a promise to listen."
        />
        <Reveal as="ul" stagger={0.12} className="mt-20 grid gap-10 border-t border-line-strong pt-10 md:grid-cols-3">
          {principles.map((p, i) => (
            <li key={p.t}>
              <p className="t-caps-sm text-accent">Principle {["I", "II", "III"][i]}</p>
              <h3 className="t-display mt-3 text-[1.8rem] leading-tight">{p.t}</h3>
              <p className="mt-3 text-muted">{p.b}</p>
            </li>
          ))}
        </Reveal>
      </section>
      <CtaBand />
    </PageShell>
  );
}
