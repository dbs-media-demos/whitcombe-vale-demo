import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { stories } from "@/content/results";
import { photos } from "@/content/photos";
import { practiceBySlug } from "@/content/practice";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Client Stories & Results",
  description:
    "Anonymised client stories from Whitcombe & Vale: a custody relocation, a founder's separate property, a five-week probate, a clean founder buy-out and a special-needs trust. Past results do not guarantee future outcomes.",
  path: "/results",
  eyebrow: "From the casebook",
});

export default function ResultsPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Client stories", path: "/results" }]}
        eyebrow="From the casebook"
        title={
          <>
            Outcomes, <em className="t-italic text-brass-light">quietly</em> reached.
          </>
        }
        lead="Five matters from recent years, told with our clients' permission and without their names. We share them to show how we think, not to promise a result."
        compact
      />
      <div className="theme-vellum border-b border-line px-[var(--gutter)] py-5">
        <p className="t-italic text-sm text-muted">
          <strong className="t-caps-sm mr-2 not-italic text-accent">Please note</strong>
          Past results do not guarantee future outcomes. Every matter turns on its own facts and the law in effect at the time. Details have been changed to protect client
          confidentiality.
        </p>
      </div>

      {stories.map((s, i) => {
        const practice = practiceBySlug(s.practice)!;
        return (
          <article key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className={clsx("scroll-mt-24 px-[var(--gutter)] py-24 md:py-32", i % 2 ? "theme-vellum" : "theme-paper")}>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className={clsx("lg:col-span-5", i % 2 && "lg:order-2 lg:col-start-8")}>
                <Parallax className={clsx("aspect-[4/5]", i % 2 ? "arch-sm" : "")} amount={10}>
                  <div className="absolute inset-0">
                    <Image src={photos[s.photo]} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
                  </div>
                </Parallax>
                <p className="mt-4 flex items-baseline gap-4">
                  <span className="t-display text-6xl leading-none">{s.figure.value}</span>
                  <span className="t-caps-sm text-muted">{s.figure.label}</span>
                </p>
              </div>
              <div className={clsx("lg:col-span-6", i % 2 ? "lg:order-1" : "lg:col-start-7")}>
                <p className="t-caps-sm text-accent">
                  Case {String(i + 1).padStart(2, "0")} · {s.matter}
                </p>
                <SplitReveal as="h2" id={`${s.id}-t`} className="t-display t-md mt-5">
                  {s.title}
                </SplitReveal>
                <Reveal as="dl" stagger={0.12} className="mt-10 space-y-8">
                  {[
                    ["The situation", s.situation],
                    ["Our approach", s.approach],
                    ["The outcome", s.outcome],
                  ].map(([h, t]) => (
                    <div key={h} className="grid gap-2 border-t border-line pt-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                      <dt className="t-caps-sm text-muted">{h}</dt>
                      <dd className={h === "The outcome" ? "font-serif text-lg leading-relaxed" : "leading-relaxed text-muted"}>{t}</dd>
                    </div>
                  ))}
                </Reveal>
                <Link href={`/practice-areas/${practice.slug}`} className="mt-10 inline-flex min-h-11 items-center gap-2 border-b border-current text-accent">
                  Chapter {practice.numeral}: {practice.title} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
      <CtaBand title="Every story here started with a phone call." />
    </PageShell>
  );
}
