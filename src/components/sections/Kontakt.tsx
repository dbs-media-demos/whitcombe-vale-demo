import Image from "next/image";
import { ShortForm } from "@/components/intake/ShortForm";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Parallax } from "@/components/ui/Reveal";
import { photos } from "@/content/photos";
import { telOf, type Biz } from "@/lib/biz-core";

/** Serbian previews: a plain contact section in place of "book a consultation": telephone, address, hours and a short form. */
export function Kontakt({ biz }: { biz: Biz }) {
  const tel = telOf(biz);
  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="cta-band ph-o11 theme-vellum relative overflow-hidden px-[var(--gutter)] py-24 md:py-32">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="t-caps-sm text-accent">
            <span className="ph-hide">§ 08 · </span>Kontakt
          </p>
          <h2 id="kontakt-title" className="t-display t-lg mt-6">
            Pozovite <em className="t-italic text-accent">ili pišite.</em>
          </h2>
          <dl className="kontakt-facts mt-8 max-w-xl border-t border-line-strong">
            {tel && (
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="t-caps-sm text-muted">Telefon</dt>
                <dd className="text-right">
                  <a href={tel} className="inline-flex min-h-11 items-center font-medium underline decoration-line-strong underline-offset-4">
                    {biz.phoneDisplay}
                  </a>
                </dd>
              </div>
            )}
            {biz.address.full && (
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="t-caps-sm text-muted">Adresa</dt>
                <dd className="text-right">{biz.address.full}</dd>
              </div>
            )}
            {biz.hoursSummary && (
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="t-caps-sm text-muted">Radno vreme</dt>
                <dd className="text-right">{biz.hoursSummary}</dd>
              </div>
            )}
          </dl>
          <OpenBadge className="mt-4 text-sm text-muted" />
          <ShortForm className="mt-8 max-w-xl" />
        </div>
        <div className="ph-hide lg:col-span-4 lg:col-start-9">
          <Parallax className="arch-sm mx-auto aspect-[3/4] max-w-sm bg-ink" amount={10} from="inset(100% 0% 0% 0%)">
            <div className="absolute inset-0">
              <Image src={photos["arch-lamp"]} alt="" fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
