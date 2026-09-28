import { DallasMap } from "./DallasMap";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Reveal } from "@/components/ui/Reveal";
import { counties, hoursSummary, serviceAreas, site } from "@/content/site";

/** Service area: the engraved map, neighbourhoods served, hours with a live badge. */
export function VisitSection({ label = "§ 09 · Where we practise" }: { label?: string }) {
  return (
    <section aria-labelledby="visit-title" className="theme-paper px-[var(--gutter)] py-28 md:py-36">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="t-caps-sm text-accent">{label}</p>
          <h2 id="visit-title" className="t-display t-lg mt-5">
            Dallas, and the <em className="t-italic text-accent">neighbourhoods</em> around it.
          </h2>
          <p className="mt-6 max-w-md text-muted">
            We meet clients in our Arts District office, by video anywhere in Texas, and appear regularly in {counties.slice(0, 3).join(", ")} courts.
          </p>
          <Reveal as="ul" stagger={0.05} className="mt-10 border-t border-line">
            {serviceAreas.map((a) => (
              <li key={a.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
                <span className="font-serif text-[1.05rem]">{a.name}</span>
                <span className="text-right text-sm text-muted">{a.note}</span>
              </li>
            ))}
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <div className="border border-line bg-surface/50 p-4 sm:p-8">
            <DallasMap />
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="t-caps-sm text-muted">The office</p>
              <address className="mt-3 font-serif text-lg not-italic leading-snug">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postal}
              </address>
              <p className="mt-3 text-sm text-muted">Validated garage parking · DART Pearl/Arts District station, 4 min walk</p>
            </div>
            <div>
              <OpenBadge className="t-caps-sm text-accent" />
              <dl className="mt-3 space-y-1.5 text-sm">
                {hoursSummary.map((h) => (
                  <div key={h.label} className="flex justify-between gap-4 border-b border-line pb-1.5">
                    <dt className="text-muted">{h.label}</dt>
                    <dd className="text-right">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
