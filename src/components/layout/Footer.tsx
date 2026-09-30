import Link from "next/link";
import { Mark } from "@/components/brand/Logo";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { DrawRule } from "@/components/ui/Reveal";
import { practices } from "@/content/practice";
import { addressLine, agencyName, agencyUrl, hoursSummary, site } from "@/content/site";

const firmLinks = [
  { href: "/about", label: "About the firm" },
  { href: "/attorneys", label: "Attorneys" },
  { href: "/results", label: "Client stories" },
  { href: "/reviews", label: "Reviews" },
  { href: "/fees", label: "Fees" },
  { href: "/insights", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="theme-ink relative overflow-hidden pb-28 pt-24 md:pb-10">
      <div className="px-[var(--gutter)]">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="t-caps-sm text-brass">Colophon</p>
            <p className="t-display mt-6 max-w-md text-[clamp(2.2rem,3.6vw,3.3rem)] leading-[1.02]">
              Every matter begins with a <span className="t-italic text-brass-light">conversation.</span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/consultation" className="inline-flex min-h-12 items-center rounded-full bg-brass px-6 font-medium text-ink transition-colors hover:bg-parchment">
                Book a consultation
              </Link>
              <a href={site.phoneHref} className="inline-flex min-h-12 items-center border-b border-line-strong text-lg transition-colors hover:border-brass">
                {site.phone}
              </a>
            </div>
          </div>

          <nav aria-label="Practice areas" className="lg:col-span-3">
            <p className="t-caps-sm text-muted">Practice areas</p>
            <ul className="mt-5 space-y-1">
              {practices.map((p) => (
                <li key={p.slug}>
                  <Link href={`/practice-areas/${p.slug}`} className="group flex min-h-9 items-baseline gap-3 text-fg/85 transition-colors hover:text-fg">
                    <span className="t-caps-sm w-8 text-brass">{p.numeral}</span>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="The firm" className="lg:col-span-2">
            <p className="t-caps-sm text-muted">The firm</p>
            <ul className="mt-5 space-y-1">
              {firmLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center text-fg/85 transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="t-caps-sm text-muted">Visit</p>
            <address className="mt-5 not-italic leading-relaxed text-fg/85">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postal}
            </address>
            <a href={`mailto:${site.email}`} className="mt-3 inline-flex min-h-9 items-center text-fg/85 underline decoration-line-strong underline-offset-4 hover:text-fg">
              {site.email}
            </a>
            <div className="mt-4">
              <OpenBadge className="text-sm text-muted" />
            </div>
            <dl className="mt-4 space-y-1 text-sm text-muted">
              {hoursSummary.slice(0, 3).map((h) => (
                <div key={h.label}>
                  <dt className="inline">{h.label}: </dt>
                  <dd className="inline">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <DrawRule className="mt-20" />

        {/* Oversized wordmark, set like a book spine */}
        <div aria-hidden className="mt-12 flex items-end justify-between gap-6">
          <p className="t-display select-none whitespace-nowrap text-[clamp(2.6rem,10.2vw,11rem)] leading-[0.85] text-fg/95">
            Whitcombe <span className="t-italic text-brass">&amp;</span> Vale
          </p>
          <Mark className="mb-2 hidden h-20 w-20 shrink-0 text-fg lg:block" />
        </div>

        <div className="mt-12 grid gap-6 border-t border-line pt-8 text-[0.8rem] leading-relaxed text-muted lg:grid-cols-12">
          <p className="lg:col-span-7">
            <strong className="t-caps-sm mr-2 text-fg">Attorney Advertising.</strong>
            This website is for general information only and is not legal advice. Contacting us does not create an attorney-client relationship.
            Past results do not guarantee a similar outcome. Board certification noted for the individual attorney only. Principal office: {addressLine}.
          </p>
          <div className="flex flex-col gap-2 lg:col-span-5 lg:items-end lg:text-right">
            <p className="t-italic text-base text-brass-light">Se habla español.</p>
            <p>
              © 2026 {site.legalName} ·{" "}
              <Link href="/privacy" className="underline-offset-4 hover:text-fg hover:underline">
                Privacy
              </Link>{" "}
              ·{" "}
              <Link href="/legal-disclaimer" className="underline-offset-4 hover:text-fg hover:underline">
                Legal disclaimer
              </Link>
            </p>
            <p>
              Design &amp; development:{" "}
              <a href={agencyUrl} className="text-fg underline decoration-brass underline-offset-4">
                {agencyName}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
