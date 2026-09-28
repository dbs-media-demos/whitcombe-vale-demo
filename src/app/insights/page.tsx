import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { articles, formatDate } from "@/content/insights";
import { photos } from "@/content/photos";
import { graph, itemListSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights: Plain-English Notes on Texas Family, Estate & Business Law",
  description: "Short, practical articles from Whitcombe & Vale's attorneys: wills vs. living trusts in Texas, preparing for a divorce consultation, and LLC vs. S-corp for small businesses.",
  path: "/insights",
  eyebrow: "Insights",
});

export default function InsightsPage() {
  const [lead, ...rest] = articles;
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Insights", path: "/insights" }]}
        eyebrow="Notes from the library"
        title={
          <>
            Plain English, <em className="t-italic text-brass-light">on the law.</em>
          </>
        }
        lead="Short notes our attorneys write when the same question comes up for the third time in a month. General information, not legal advice."
        compact
      />
      <section aria-label="Articles" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <Link href={`/insights/${lead.slug}`} className="group grid gap-10 border-b border-line-strong pb-16 lg:grid-cols-12 lg:items-end" data-cursor="Read">
          <Parallax className="aspect-[16/10] lg:col-span-7" amount={8}>
            <div className="absolute inset-0">
              <Image src={photos[lead.photo]} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition-transform duration-[1.6s] group-hover:scale-[1.03]" />
            </div>
          </Parallax>
          <div className="lg:col-span-5">
            <p className="t-caps-sm text-accent">
              Latest · {formatDate(lead.date)} · {lead.readMins} min read
            </p>
            <h2 className="t-display t-md mt-5 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">{lead.title}</h2>
            <p className="t-lead mt-5 text-muted">{lead.dek}</p>
            <p className="t-caps-sm mt-6 text-muted">By {lead.author}</p>
          </div>
        </Link>
        <Reveal stagger={0.12} className="grid md:grid-cols-2">
          {rest.map((a, i) => (
            <Link
              key={a.slug}
              href={`/insights/${a.slug}`}
              data-cursor="Read"
              className={clsx("group block border-b border-line py-12 md:border-b-0", i === 1 && "md:border-l md:border-line md:pl-10", i === 0 && "md:pr-10")}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={photos[a.photo]} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-[1.6s] group-hover:scale-[1.03]" />
              </div>
              <p className="t-caps-sm mt-6 text-accent">
                {formatDate(a.date)} · {a.readMins} min read
              </p>
              <h2 className="t-display mt-4 text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.08] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">{a.title}</h2>
              <p className="mt-4 text-muted">{a.dek}</p>
              <p className="t-caps-sm mt-5 text-muted">By {a.author}</p>
            </Link>
          ))}
        </Reveal>
      </section>
      <CtaBand />
      <JsonLd data={graph(itemListSchema(articles.map((a) => ({ name: a.title, path: `/insights/${a.slug}` }))))} />
    </PageShell>
  );
}
