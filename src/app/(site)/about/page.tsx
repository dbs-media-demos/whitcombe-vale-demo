import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { VisitSection } from "@/components/sections/VisitSection";
import { DrawRule, Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { Footnote } from "@/components/ui/Footnote";
import { Marquee } from "@/components/ui/Marquee";
import { photos } from "@/content/photos";
import { credentials } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About the Firm",
  description:
    "Founded in 2009 by Catherine Whitcombe and Julian Vale, Whitcombe & Vale is a boutique Dallas firm for family law, estate planning and small-business law, with offices in the Arts District.",
  path: "/about",
  eyebrow: "About the firm",
});

const timeline = [
  { year: "2009", title: "Two lawyers, one room", body: "Catherine Whitcombe and Julian Vale leave larger firms and open a two-room office on Ross Avenue with one promise: flat fees wherever the work allows." },
  { year: "2013", title: "Board certification", body: "Catherine is Board Certified in Family Law by the Texas Board of Legal Specialization." },
  { year: "2016", title: "Sofía joins", body: "Sofía Delgado joins to lead the business practice and brings the firm's Spanish-language service." },
  { year: "2019", title: "The Arts District", body: "We move to the fourteenth floor on Ashland Row, with a library, a mediation room and a view of the courts." },
  { year: "2021", title: "Three partners", body: "Sofía becomes a partner and the General Counsel plan launches for growing North Texas companies." },
  { year: "2026", title: "1,900 matters", body: "Seventeen years, three practice areas, one rule: tell clients the truth about their case and what it will cost." },
];

const values = [
  { n: "I", t: "Discretion", b: "Your matter is nobody's business. Encrypted files, no text messages about your case, and a conflict check before you tell us a single detail." },
  { n: "II", t: "Directness", b: "We tell you what the law says, what a judge is likely to do and what we'd do in your position, even when it isn't what you hoped to hear." },
  { n: "III", t: "Clarity", b: "Flat fees where we can, written estimates where we can't, and a short summary after every meaningful step." },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "About the firm", path: "/about" }]}
        eyebrow="The firm · Est. 2009"
        title={
          <>
            A small firm, <em className="t-italic text-brass-light">on purpose.</em>
          </>
        }
        lead="We could have grown into a hundred-lawyer firm. Instead we stayed small enough that a partner reads every document that leaves the building."
        photo="arch-corridor"
        photoAlt="A stone archway opening onto a sunlit courtyard"
      />

      <section aria-labelledby="story-title" className="theme-paper px-[var(--gutter)] py-24 md:py-36">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-caps-sm text-accent">§ 01 · Our story</p>
            <h2 id="story-title" className="sr-only">
              Our story
            </h2>
          </div>
          <div className="lg:col-span-8">
            <ScrubWords
              className="t-display text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.14]"
              accent={["listened"]}
              text="The firm began with a divorce that went badly, not ours, but a client's, at a large firm where nobody had listened to her. Catherine left to build a practice where people are listened to first and billed second. Julian, who had watched families wait a year for an estate to settle, came with her."
            />
            <div className="t-lead mt-12 grid gap-8 text-muted md:grid-cols-2">
              <p>
                Seventeen years later we are three partners, two paralegals and an office manager who knows every client by name. We turn away more work than we take, because a
                narrow practice is a better one
                <Footnote n={1}>We refer criminal, immigration and personal-injury matters to firms we trust. Ask, and we&rsquo;ll make the introduction.</Footnote>.
              </p>
              <p>
                We&rsquo;re a Dallas firm through and through: we live in Lakewood, Oak Cliff and Richardson, our children go to school here, and we appear in the same
                courthouses every week.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="The office" className="theme-ink grid gap-4 p-4 md:grid-cols-12 md:gap-6 md:p-6">
        <Parallax className="aspect-[4/3] md:col-span-7 md:aspect-auto md:h-[80vh]" amount={10}>
          <div className="absolute inset-0">
            <Image src={photos["skyline-dusk"]} alt="The Dallas skyline reflected in water at dusk" fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
          </div>
        </Parallax>
        <div className="grid gap-4 md:col-span-5 md:gap-6">
          <Parallax className="arch-sm aspect-[4/3] md:aspect-auto md:h-[calc(40vh-0.75rem)]" amount={10}>
            <div className="absolute inset-0">
              <Image src={photos["office-desk"]} alt="A quiet corner office with a wooden desk" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          </Parallax>
          <Parallax className="aspect-[4/3] md:aspect-auto md:h-[calc(40vh-0.75rem)]" amount={10}>
            <div className="absolute inset-0">
              <Image src={photos.spiral} alt="A white spiral staircase seen from below" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          </Parallax>
        </div>
      </section>

      <section aria-labelledby="values-title" className="theme-vellum px-[var(--gutter)] py-24 md:py-32">
        <p className="t-caps-sm text-accent">§ 02 · What we believe</p>
        <SplitReveal as="h2" id="values-title" className="t-display t-lg mt-4 max-w-3xl">
          Three words on the <em className="t-italic text-accent">office wall.</em>
        </SplitReveal>
        <Reveal as="ul" stagger={0.12} className="mt-16 grid gap-12 md:grid-cols-3">
          {values.map((v) => (
            <li key={v.t}>
              <DrawRule />
              <p className="t-display mt-6 text-7xl leading-none text-accent">{v.n}</p>
              <h3 className="t-display mt-4 text-[2.2rem] leading-none">{v.t}</h3>
              <p className="mt-4 text-muted">{v.b}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="timeline-title" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <p className="t-caps-sm text-accent">§ 03 · A short history</p>
        <SplitReveal as="h2" id="timeline-title" className="t-display t-lg mt-4">
          Seventeen years, <em className="t-italic text-accent">in brief.</em>
        </SplitReveal>
        <Reveal as="ol" stagger={0.1} className="mt-14 border-t border-line-strong">
          {timeline.map((t) => (
            <li key={t.year} className="grid gap-3 border-b border-line py-8 md:grid-cols-12 md:gap-8">
              <p className="t-display text-5xl leading-none text-accent md:col-span-2">{t.year}</p>
              <h3 className="t-display text-[1.9rem] leading-tight md:col-span-4">{t.title}</h3>
              <p className="text-muted md:col-span-6">{t.body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <div className="theme-ink border-y border-line py-6">
        <Marquee speed={60}>
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

      <VisitSection label="§ 04 · Where we practise" />
      <CtaBand />
    </PageShell>
  );
}
