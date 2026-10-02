import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { attorneyBySlug, attorneys } from "@/content/attorneys";
import { photos } from "@/content/photos";
import { practiceBySlug } from "@/content/practice";
import { site } from "@/content/site";
import { attorneySchema, attorneyServiceSchema, graph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return attorneys.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/attorneys/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = attorneyBySlug(slug);
  if (!a) return {};
  return pageMetadata({
    title: `${a.name}, ${a.focus} Attorney in Dallas`,
    description: `${a.name} is a ${a.role.toLowerCase()} at Whitcombe & Vale, practising ${a.focus.toLowerCase()} in Dallas since ${a.since}. ${a.bio[0].slice(0, 90)}…`,
    path: `/attorneys/${a.slug}`,
    eyebrow: `${a.role} · ${a.focus}`,
    type: "profile",
  });
}

export default async function AttorneyPage({ params }: PageProps<"/attorneys/[slug]">) {
  const { slug } = await params;
  const a = attorneyBySlug(slug);
  if (!a) notFound();
  const others = attorneys.filter((x) => x.slug !== a.slug);

  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: "Attorneys", path: "/attorneys" },
          { name: a.name, path: `/attorneys/${a.slug}` },
        ]}
        eyebrow={`${a.role} · ${a.focus}`}
        title={a.name}
        lead={<p className="t-italic">&ldquo;{a.quote}&rdquo;</p>}
        media={
          <div className="arch-sm anim-fade relative mx-auto aspect-[4/5] max-w-md overflow-hidden bg-ink-2" style={{ "--d": "0.3s" } as React.CSSProperties}>
            <Image
              src={photos[a.photo]}
              alt={`Portrait of ${a.name}`}
              fill
              fetchPriority="high"
              loading="eager"
              sizes="(min-width: 1024px) 30vw, 90vw"
              className="object-cover"
              style={{ objectPosition: a.focal }}
            />
          </div>
        }
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ButtonLink href="/consultation">Book with {a.name.split(" ")[0]}</ButtonLink>
          <a href={`mailto:${a.email}`} className="inline-flex min-h-11 items-center border-b border-line-strong text-sm hover:border-brass">
            {a.email}
          </a>
        </div>
      </PageHero>

      <article className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="t-caps-sm text-accent">Biography</p>
            <div className="t-lead mt-6 space-y-6">
              {a.bio.map((p, i) => (
                <p key={i} className={i === 0 ? "dropcap" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <Reveal as="aside" stagger={0.1} className="space-y-10 lg:col-span-4 lg:col-start-9">
            {[
              { h: "Education", items: a.education },
              { h: "Admissions", items: a.admissions },
              { h: "Memberships & certification", items: a.memberships },
              { h: "Languages", items: a.languages },
            ].map((g) => (
              <div key={g.h}>
                <h2 className="t-caps-sm border-b border-line-strong pb-3 text-accent">{g.h}</h2>
                <ul className="mt-3 space-y-2">
                  {g.items.map((it) => (
                    <li key={it} className="font-serif leading-snug">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="t-caps-sm border-b border-line-strong pb-3 text-accent">Practice areas</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {a.practices.map((s) => {
                  const p = practiceBySlug(s)!;
                  return (
                    <li key={s}>
                      <Link href={`/practice-areas/${s}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm transition-colors hover:border-accent hover:text-accent">
                        {p.numeral}. {p.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </article>

      <section aria-labelledby="others-title" className="theme-vellum px-[var(--gutter)] py-20 md:py-28">
        <h2 id="others-title" className="t-caps-sm text-accent">
          Also at the firm
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/attorneys/${o.slug}`} className="group flex items-center gap-6 border-t border-line-strong pt-6" data-cursor="Profile">
                <span className="arch-sm relative block h-32 w-24 shrink-0 overflow-hidden bg-ink">
                  <Image src={photos[o.photo]} alt={`Portrait of ${o.name}`} fill sizes="96px" className="object-cover transition-transform duration-1000 group-hover:scale-105" style={{ objectPosition: o.focal }} />
                </span>
                <span>
                  <span className="t-caps-sm block text-muted">
                    {o.role} · {o.focus}
                  </span>
                  <span className="t-display mt-2 block text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none">{o.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title={`Book your first call with ${a.name.split(" ")[0]}.`} lead={`Fifteen minutes, free and confidential. Call ${site.phone} or book online and we'll confirm within one business day.`} />
      <JsonLd data={graph(attorneySchema(a), attorneyServiceSchema(a))} />
    </PageShell>
  );
}
