import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { WillVsTrust } from "@/components/sections/WillVsTrust";
import { CtaBand } from "@/components/sections/CtaBand";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { businessPackages, estatePackages, otherFees, type FeePackage } from "@/content/fees";
import { graph, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fees: Flat-Fee Wills, Trusts & Business Formation in Dallas",
  description:
    "Clear flat fees: will package $1,450, living trust package $3,400, LLC formation from $1,250, contract review from $650. Free 15-minute call; $350 strategy meeting credited to your fee.",
  path: "/fees",
  eyebrow: "Fees",
});

function PackageCard({ p }: { p: FeePackage }) {
  return (
    <article className={clsx("relative flex h-full flex-col border p-8 md:p-10", p.featured ? "theme-ink border-transparent" : "border-line-strong")}>
      {p.featured && <p className="t-caps-sm absolute right-6 top-6 rounded-full border border-brass/60 px-3 py-1 text-brass">Most chosen</p>}
      <h3 className="t-display text-[clamp(1.8rem,2.4vw,2.3rem)] leading-tight">{p.name}</h3>
      <p className="mt-3 text-muted">{p.lead}</p>
      <p className="mt-8 flex items-baseline gap-3">
        <span className="t-display text-[clamp(3rem,4.6vw,4.2rem)] leading-none">{p.price}</span>
        <span className="t-caps-sm text-muted">flat</span>
      </p>
      {p.couple && <p className="t-italic mt-2 text-accent">{p.couple}</p>}
      <ul className="mt-8 flex-1 space-y-2.5 border-t border-line pt-6 text-[0.95rem]">
        {p.includes.map((i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className="font-serif text-accent">
              §
            </span>
            {i}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <ButtonLink href={`/consultation?matter=${p.practice}`} variant={p.featured ? "solid" : "outline"}>
          Start with a free call
        </ButtonLink>
      </div>
    </article>
  );
}

export default function FeesPage() {
  return (
    <PageShell>
      <PageHero
        crumbs={[{ name: "Fees", path: "/fees" }]}
        eyebrow="Fees, in writing"
        title={
          <>
            No surprises, <em className="t-italic text-brass-light">by design.</em>
          </>
        }
        lead="Most planning and business work is billed at a flat fee, agreed before we start. Contested matters get a written estimate and itemised monthly statements."
        photo="pen-nib"
        photoAlt="Close-up of a fountain pen nib"
      />

      <section aria-labelledby="estate-fees" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <p className="t-caps-sm text-accent">Part Two · Legacy</p>
        <SplitReveal as="h2" id="estate-fees" className="t-display t-lg mt-4">
          Estate planning packages
        </SplitReveal>
        <Reveal stagger={0.12} className="mt-12 grid gap-6 md:grid-cols-2">
          {estatePackages.map((p) => (
            <PackageCard key={p.name} p={p} />
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="wvt-title" className="theme-vellum px-[var(--gutter)] py-24 md:py-32">
        <p className="t-caps-sm text-accent">Not sure which?</p>
        <h2 id="wvt-title" className="t-display t-lg mb-12 mt-4">
          Will, or <em className="t-italic text-accent">living trust?</em>
        </h2>
        <WillVsTrust />
      </section>

      <section aria-labelledby="business-fees" className="theme-paper px-[var(--gutter)] py-24 md:py-32">
        <p className="t-caps-sm text-accent">Part Three · Enterprise</p>
        <SplitReveal as="h2" id="business-fees" className="t-display t-lg mt-4">
          Business packages
        </SplitReveal>
        <Reveal stagger={0.12} className="mt-12 grid gap-6 lg:grid-cols-3">
          {businessPackages.map((p) => (
            <PackageCard key={p.name} p={p} />
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="schedule-title" className="theme-vellum px-[var(--gutter)] py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-caps-sm text-accent">Schedule of fees</p>
            <h2 id="schedule-title" className="t-display t-md mt-4">
              Everything else
            </h2>
            <p className="mt-6 text-muted">
              Court costs, filing and publication fees are passed through at cost and listed on your estimate. Payment plans are available for flat-fee packages.
            </p>
            <Link href="/faq" className="mt-6 inline-flex min-h-11 items-center border-b border-current text-accent">
              Billing questions →
            </Link>
          </div>
          <Reveal as="dl" stagger={0.05} className="border-t border-line-strong lg:col-span-8">
            {otherFees.map((f) => (
              <div key={f.name} className="flex items-baseline gap-4 border-b border-line py-4">
                <dt className="font-serif text-lg">{f.name}</dt>
                <span aria-hidden className="leader text-fg" />
                <dd className="shrink-0 text-right text-muted">{f.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand title="Get your fee in writing before you commit to anything." />
      <JsonLd
        data={graph(
          serviceSchema({
            name: "Flat-fee estate planning and business legal services",
            description: "Flat-fee wills, living trusts, LLC formation and contract review in Dallas, TX.",
            path: "/fees",
            offers: [...estatePackages, ...businessPackages].map((p) => ({ name: p.name, price: p.price })),
          }),
        )}
      />
    </PageShell>
  );
}
