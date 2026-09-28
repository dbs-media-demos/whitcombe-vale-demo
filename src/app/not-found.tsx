import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { photos } from "@/content/photos";
import { practices } from "@/content/practice";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <PageShell>
      <section className="theme-ink relative min-h-[100svh] overflow-hidden px-[var(--gutter)] pb-24 pt-[calc(var(--header-h)+4rem)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="t-caps-sm anim-fade text-brass">Error 404 · Page not found</p>
            <h1 className="t-display t-xl mt-6">
              <span className="anim-line">
                <span>
                  This page is <em className="t-italic text-brass-light">missing</em> from the record.
                </span>
              </span>
            </h1>
            <p className="t-lead anim-fade mt-8 max-w-xl text-fg/85" style={{ "--d": "0.3s" } as React.CSSProperties}>
              The link may be old, or the page may have moved. The contents below will get you back on course.
            </p>
            <div className="anim-fade mt-10 flex flex-wrap gap-4" style={{ "--d": "0.45s" } as React.CSSProperties}>
              <ButtonLink href="/">Return home</ButtonLink>
              <ButtonLink href="/consultation" variant="outline">
                Book a consultation
              </ButtonLink>
            </div>
            <ul className="mt-14 grid gap-x-8 border-t border-line sm:grid-cols-2">
              {practices.map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <Link href={`/practice-areas/${p.slug}`} className="flex min-h-12 items-baseline gap-3 py-2 text-fg/85 hover:text-fg">
                    <span className="t-caps-sm w-8 text-brass">{p.numeral}</span>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div className="arch-sm anim-fade relative aspect-[3/4] overflow-hidden">
              <Image src={photos["arch-twin"]} alt="" fill sizes="30vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
