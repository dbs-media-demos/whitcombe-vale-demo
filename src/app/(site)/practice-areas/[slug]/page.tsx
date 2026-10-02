import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { WillVsTrust } from "@/components/sections/WillVsTrust";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DrawRule, Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/ui/FaqList";
import { Footnote } from "@/components/ui/Footnote";
import { JsonLd } from "@/components/ui/JsonLd";
import { attorneyBySlug } from "@/content/attorneys";
import { photos, type PhotoKey } from "@/content/photos";
import { parts, practiceBySlug, practices } from "@/content/practice";
import { site } from "@/content/site";
import { faqSchema, graph, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const band: Record<string, { photo: PhotoKey; caption: string }> = {
  divorce: { photo: "window-shadow", caption: "Most of our divorces end at a mediation table, not in a courtroom." },
  "child-custody": { photo: "father-child", caption: "A parenting plan should still work when they're twelve." },
  "prenuptial-agreements": { photo: "rings-suit", caption: "Signed early, disclosed fully, written plainly." },
  wills: { photo: "elderly-hands", caption: "Originals kept in our vault, free of charge." },
  trusts: { photo: "generations-hands", caption: "Designed, drafted and, crucially, funded." },
  probate: { photo: "arch-twin", caption: "The simplest route the Texas Estates Code allows." },
  "business-formation": { photo: "tailor", caption: "For founders, family businesses and the people who make things." },
  contracts: { photo: "pen-sign", caption: "A one-page memo within three business days." },
};

export function generateStaticParams() {
  return practices.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/practice-areas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = practiceBySlug(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} Lawyer in Dallas, TX`,
    description: `${p.short} ${p.fee.label}: ${p.fee.value}. Free 15-minute confidential call with a Whitcombe & Vale attorney.`,
    path: `/practice-areas/${p.slug}`,
    eyebrow: `Chapter ${p.numeral} · ${parts[p.part].name}`,
  });
}

export default async function PracticePage({ params }: PageProps<"/practice-areas/[slug]">) {
  const { slug } = await params;
  const p = practiceBySlug(slug);
  if (!p) notFound();
  const idx = practices.findIndex((x) => x.slug === p.slug);
  const prev = practices[idx - 1];
  const next = practices[idx + 1];
  const lawyer = attorneyBySlug(p.attorney)!;
  const path = `/practice-areas/${p.slug}`;
  const b = band[p.slug];

  return (
    <PageShell>
      <PageHero
        crumbs={[
          { name: "Practice areas", path: "/practice-areas" },
          { name: p.title, path },
        ]}
        eyebrow={`Chapter ${p.numeral} · ${parts[p.part].numeral}: ${parts[p.part].name}`}
        title={p.title}
        lead={<p className="t-italic">{p.dek}</p>}
        media={
          <ViewTransition name={`practice-${p.slug}`} share="morph" default="none">
            <div className="arch-sm anim-fade relative mx-auto aspect-[4/5] max-w-md overflow-hidden" style={{ "--d": "0.3s" } as React.CSSProperties}>
              <Image src={photos[p.photo]} alt="" fill fetchPriority="high" loading="eager" sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
            </div>
          </ViewTransition>
        }
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ButtonLink href={`/consultation?matter=${p.slug}`}>Book a consultation</ButtonLink>
          <p className="text-sm text-muted">
            {p.fee.label}: <span className="text-fg">{p.fee.value}</span>
          </p>
        </div>
      </PageHero>

      <article className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="t-caps-sm text-accent">In this chapter</p>
              <ol className="mt-4 border-t border-line text-sm">
                {[
                  ["overview", "Overview"],
                  ["handle", "What we handle"],
                  ["approach", "How we work"],
                  ["fees", "Fees"],
                  ["questions", "Questions"],
                ].map(([id, label], i) => (
                  <li key={id} className="border-b border-line">
                    <a href={`#${id}`} className="flex min-h-11 items-center gap-3 text-muted transition-colors hover:text-fg">
                      <span className="t-caps-sm w-6 text-accent">§{i + 1}</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
              <Link href={`/attorneys/${lawyer.slug}`} className="group mt-10 flex items-center gap-4" data-cursor="Profile">
                <span className="arch-sm relative block h-20 w-16 shrink-0 overflow-hidden bg-ink">
                  <Image src={photos[lawyer.photo]} alt={`Portrait of ${lawyer.name}`} fill sizes="64px" className="object-cover" style={{ objectPosition: lawyer.focal }} />
                </span>
                <span>
                  <span className="t-caps-sm block text-faint">Your attorney</span>
                  <span className="mt-1 block font-serif text-lg leading-tight group-hover:underline">{lawyer.name}</span>
                  <span className="block text-sm text-muted">{lawyer.role}</span>
                </span>
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-8 lg:col-start-5">
            <section id="overview" aria-labelledby="overview-h" className="scroll-mt-28">
              <h2 id="overview-h" className="t-caps-sm text-accent">
                § 1 · Overview
              </h2>
              <div className="t-lead mt-6 space-y-6">
                <p className="dropcap">
                  {p.intro[0]}
                  <Footnote n={1}>{p.footnote}</Footnote>
                </p>
                {p.intro.slice(1).map((para) => (
                  <p key={para.slice(0, 20)}>{para}</p>
                ))}
              </div>
            </section>

            <section id="handle" aria-labelledby="handle-h" className="mt-24 scroll-mt-28">
              <p className="t-caps-sm text-accent">§ 2 · What we handle</p>
              <SplitReveal as="h2" id="handle-h" className="t-display t-md mt-4">
                Matters we take on
              </SplitReveal>
              <Reveal as="ul" stagger={0.05} className="mt-8 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
                {p.handles.map((h) => (
                  <li key={h} className="flex items-baseline gap-3 border-b border-line py-4">
                    <span aria-hidden className="font-serif text-accent">
                      §
                    </span>
                    {h}
                  </li>
                ))}
              </Reveal>
            </section>
          </div>
        </div>
      </article>

      <figure className="theme-ink relative">
        <Parallax className="h-[70vh] min-h-[420px]" amount={14} from="inset(8% 6% 8% 6%)">
          <div className="absolute inset-0">
            <Image src={photos[b.photo]} alt="" fill sizes="100vw" className="object-cover opacity-80" />
          </div>
        </Parallax>
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-[var(--gutter)] pb-10 pt-24">
          <p className="t-display max-w-3xl text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.08]">{b.caption}</p>
        </figcaption>
      </figure>

      <section id="approach" aria-labelledby="approach-h" className="theme-paper scroll-mt-28 px-[var(--gutter)] py-24 md:py-32">
        <p className="t-caps-sm text-accent">§ 3 · How we work</p>
        <SplitReveal as="h2" id="approach-h" className="t-display t-lg mt-4 max-w-3xl">
          Three movements, <em className="t-italic text-accent">in order.</em>
        </SplitReveal>
        <Reveal as="ol" stagger={0.12} className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {p.approach.map((s, i) => (
            <li key={s.title}>
              <DrawRule />
              <p className="t-caps-sm mt-5 text-accent">{["I", "II", "III"][i]}.</p>
              <h3 className="t-display mt-3 text-[2rem] leading-none">{s.title}</h3>
              <p className="mt-4 text-muted">{s.body}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section id="fees" aria-labelledby="fees-h" className="theme-ink scroll-mt-28 px-[var(--gutter)] py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="t-caps-sm text-brass">§ 4 · Fees</p>
            <h2 id="fees-h" className="t-display t-md mt-4">
              {p.fee.label}: <span className="t-italic text-brass-light">{p.fee.value}</span>
            </h2>
            <p className="mt-5 max-w-xl text-muted">{p.fee.note}</p>
          </div>
          <div className="flex flex-wrap gap-4 md:col-span-5 md:justify-end">
            <ButtonLink href="/fees" variant="outline">
              All fees
            </ButtonLink>
            <ButtonLink href={`/consultation?matter=${p.slug}`}>Free 15-minute call</ButtonLink>
          </div>
        </div>
      </section>

      {(p.slug === "wills" || p.slug === "trusts") && (
        <section aria-labelledby="wvt-title" className="theme-vellum px-[var(--gutter)] py-24 md:py-32">
          <p className="t-caps-sm text-accent">Interlude</p>
          <h2 id="wvt-title" className="t-display t-lg mt-4 mb-12">
            Will, or <em className="t-italic text-accent">living trust?</em>
          </h2>
          <WillVsTrust />
        </section>
      )}

      <section id="questions" aria-labelledby="questions-h" className="theme-paper scroll-mt-28 px-[var(--gutter)] py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-caps-sm text-accent">§ 5 · Questions</p>
            <h2 id="questions-h" className="t-display t-md mt-4">
              What clients ask about {p.title.toLowerCase()}
            </h2>
            <p className="mt-6 text-sm text-muted">
              General information about Texas law, not advice for your situation. Call {site.phone} to talk it through.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqList items={p.faqs} />
            <div className="mt-12 border-t border-line pt-5">
              <p className="t-caps-sm text-faint">Notes</p>
              <p className="mt-2 font-serif text-sm italic text-muted">
                <sup className="mr-1 font-sans not-italic text-oxblood">1</sup>
                {p.footnote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Chapters" className="theme-vellum grid border-t border-line md:grid-cols-2">
        {[prev, next].map((c, i) =>
          c ? (
            <Link
              key={c.slug}
              href={`/practice-areas/${c.slug}`}
              className={`group flex min-h-40 flex-col justify-center gap-3 px-[var(--gutter)] py-12 transition-colors hover:bg-surface-2 ${i === 1 ? "md:items-end md:border-l md:border-line md:text-right" : ""}`}
            >
              <span className="t-caps-sm text-accent">{i === 0 ? `← Previous · Chapter ${c.numeral}` : `Next · Chapter ${c.numeral} →`}</span>
              <span className="t-display text-[clamp(2rem,3.4vw,3.2rem)] leading-none">{c.title}</span>
            </Link>
          ) : (
            <Link
              key={i}
              href="/practice-areas"
              className={`group flex min-h-40 flex-col justify-center gap-3 px-[var(--gutter)] py-12 transition-colors hover:bg-surface-2 ${i === 1 ? "md:items-end md:border-l md:border-line md:text-right" : ""}`}
            >
              <span className="t-caps-sm text-accent">{i === 0 ? "← Contents" : "Back to contents →"}</span>
              <span className="t-display text-[clamp(2rem,3.4vw,3.2rem)] leading-none">All practice areas</span>
            </Link>
          ),
        )}
      </nav>

      <CtaBand title={`Talk to ${lawyer.name.split(" ")[0]} about your ${p.title.toLowerCase()} matter.`} photo={b.photo === "arch-twin" ? "arch-lamp" : "arch-twin"} />

      <JsonLd
        data={graph(
          serviceSchema({
            name: p.title,
            description: `${p.short} ${p.intro[0]}`,
            path,
            offers: [{ name: p.fee.label, price: p.fee.value.match(/\$[\d,]+/)?.[0] }, ...p.handles.map((h) => ({ name: h }))],
          }),
          faqSchema(p.faqs),
        )}
      />
    </PageShell>
  );
}
