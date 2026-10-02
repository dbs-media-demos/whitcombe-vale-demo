import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { JsonLd } from "@/components/ui/JsonLd";
import { attorneyBySlug } from "@/content/attorneys";
import { articleBySlug, articles, formatDate } from "@/content/insights";
import { photos } from "@/content/photos";
import { practiceBySlug } from "@/content/practice";
import { articleSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.dek, path: `/insights/${a.slug}`, eyebrow: `Insights · ${a.author}`, type: "article", publishedTime: a.date });
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const author = attorneyBySlug(a.authorSlug)!;
  const practice = practiceBySlug(a.practice)!;
  const others = articles.filter((x) => x.slug !== a.slug);
  const path = `/insights/${a.slug}`;
  const words = a.body.reduce((n, b) => n + (Array.isArray(b.c) ? b.c.join(" ") : b.c).split(/\s+/).length, 0);

  return (
    <PageShell>
      <ReadingProgress />
      <PageHero
        crumbs={[
          { name: "Insights", path: "/insights" },
          { name: a.title, path },
        ]}
        eyebrow={`${formatDate(a.date)} · ${a.readMins} min read`}
        title={a.title}
        lead={<p className="t-italic">{a.dek}</p>}
        compact
      />
      <article className="theme-paper px-[var(--gutter)] pb-24 md:pb-32">
        <div className="relative -mx-[var(--gutter)] aspect-[21/9] overflow-hidden">
          <Image src={photos[a.photo]} alt="" fill fetchPriority="high" loading="eager" sizes="100vw" className="object-cover" />
        </div>
        <div className="mx-auto mt-16 grid max-w-6xl gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="flex items-center gap-4 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:block">
              <span className="arch-sm relative block h-20 w-16 shrink-0 overflow-hidden bg-ink">
                <Image src={photos[author.photo]} alt={`Portrait of ${author.name}`} fill sizes="64px" className="object-cover" style={{ objectPosition: author.focal }} />
              </span>
              <div className="lg:mt-4">
                <p className="t-caps-sm text-faint">Written by</p>
                <Link href={`/attorneys/${author.slug}`} className="mt-1 block font-serif text-lg hover:underline">
                  {author.name}
                </Link>
                <p className="text-sm text-muted">{author.role}</p>
                <time dateTime={a.date} className="t-caps-sm mt-3 block text-faint">
                  {formatDate(a.date)}
                </time>
              </div>
            </div>
          </aside>
          <div className="prose-legal text-[1.08rem] leading-[1.75] lg:col-span-8">
            {a.body.map((b, i) => {
              if (b.t === "h2") return <h2 key={i}>{b.c}</h2>;
              if (b.t === "ul")
                return (
                  <ul key={i}>
                    {b.c.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                );
              if (b.t === "quote") return <blockquote key={i}>{b.c}</blockquote>;
              return (
                <p key={i} className={i === 0 ? "dropcap t-lead" : undefined}>
                  {b.c}
                </p>
              );
            })}
            <div className="mt-14 border-t border-line pt-6 text-sm text-muted">
              <p>
                This article is general information about Texas law as of {formatDate(a.date)}. It isn&rsquo;t legal advice for your situation and doesn&rsquo;t create an
                attorney-client relationship.
              </p>
              <p className="mt-4">
                Related: <Link href={`/practice-areas/${practice.slug}`} className="text-accent underline underline-offset-4">Chapter {practice.numeral}, {practice.title}</Link>
              </p>
            </div>
          </div>
        </div>
      </article>
      <nav aria-label="More insights" className="theme-vellum grid border-t border-line md:grid-cols-2">
        {others.map((o, i) => (
          <Link key={o.slug} href={`/insights/${o.slug}`} className={`flex min-h-40 flex-col justify-center gap-3 px-[var(--gutter)] py-12 transition-colors hover:bg-surface-2 ${i === 1 ? "md:border-l md:border-line" : ""}`}>
            <span className="t-caps-sm text-accent">Read next · {o.author}</span>
            <span className="t-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight">{o.title}</span>
          </Link>
        ))}
      </nav>
      <CtaBand />
      <JsonLd data={graph(articleSchema({ path, headline: a.title, description: a.dek, image: `/api/og?title=${encodeURIComponent(a.title)}`, datePublished: a.date, author: a.author, wordCount: words }))} />
    </PageShell>
  );
}
