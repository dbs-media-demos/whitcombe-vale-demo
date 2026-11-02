import { OpenBadge } from "@/components/ui/OpenBadge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HoursLedger } from "@/components/ui/HoursLedger";
import { UnfoldFrame } from "@/components/ui/UnfoldFrame";
import { L, type Biz } from "@/lib/biz-core";

/** A preview's "where we practise": the firm's real address on a Google map, hours and directions. */
export function PreviewMap({ biz }: { biz: Biz }) {
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section aria-labelledby="visit-title" className="theme-paper px-[var(--gutter)] py-28 md:py-36">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="t-caps-sm text-accent">{L(biz, "§ 09 · Where we practise", "§ 09 · Gde smo")}</p>
          <h2 id="visit-title" className="t-display t-lg mt-5">
            {biz.lang === "sr" ? (
              <>
                Dođite <em className="t-italic text-accent">u kancelariju.</em>
              </>
            ) : (
              <>
                {biz.area}, <em className="t-italic text-accent">in person.</em>
              </>
            )}
          </h2>
          {biz.address.full && <address className="mt-6 max-w-md font-serif text-lg not-italic leading-snug">{biz.address.full}</address>}
          <p className="mt-3 max-w-md text-muted">{L(biz, "Meetings at the office, by phone or by video.", "Sastanci u kancelariji, telefonom ili video-pozivom.")}</p>
          <div className="mt-10">
            <OpenBadge className="t-caps-sm text-accent" />
            <HoursLedger biz={biz} className="mt-3 max-w-sm" />
          </div>
          <ButtonLink href={directions} variant="outline" className="mt-10">
            {L(biz, "Get directions", "Kako do nas")}
          </ButtonLink>
        </div>
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] border border-line bg-surface/50 p-4 sm:p-8">
            <UnfoldFrame className="h-full w-full">
              <iframe src={embed} title={L(biz, `Map: ${query}`, `Mapa: ${query}`)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
            </UnfoldFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
