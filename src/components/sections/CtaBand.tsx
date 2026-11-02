import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Parallax, SplitReveal } from "@/components/ui/Reveal";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { PenMark } from "@/components/ui/PenMark";
import { photos, type PhotoKey } from "@/content/photos";
import { defaultBiz } from "@/lib/biz";
import { telOf, type Biz } from "@/lib/biz-core";

/** The closing call to action on every page: a big line, an arch photograph and two ways in. */
export function CtaBand({
  title = "Begin with a fifteen-minute conversation.",
  lead = "Free and confidential, with an attorney. We'll tell you honestly whether we're the right firm, and what happens next.",
  photo = "arch-lamp",
  biz = defaultBiz,
}: {
  title?: string;
  lead?: string;
  photo?: PhotoKey;
  biz?: Biz;
}) {
  return (
    <section aria-labelledby="cta-title" className="theme-vellum relative overflow-hidden px-[var(--gutter)] py-24 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="t-caps-sm text-accent">Next step</p>
          <SplitReveal as="h2" id="cta-title" className="t-display t-xl mt-6">
            {title}
          </SplitReveal>
          {/* A fountain-pen flourish that writes itself as the reader scrolls towards the close */}
          <PenMark
            scrub
            viewBox="0 0 600 60"
            strokeWidth={1.3}
            paths={["M4 42 C 90 36 170 22 258 27 C 336 31 372 47 424 37 C 470 28 482 8 458 9 C 434 10 442 41 484 43 C 532 45 570 31 596 21"]}
            className="mt-7 aspect-[10/1] w-[min(30rem,88%)] text-accent"
          />
          <p className="t-lead mt-6 max-w-xl text-muted">{lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/consultation">Book a consultation</ButtonLink>
            {biz.phone && (
              <ButtonLink href={telOf(biz)!} variant="outline" arrow={false}>
                {biz.lang === "sr" ? `Pozovite ${biz.phoneDisplay}` : `Call ${biz.phoneDisplay}`}
              </ButtonLink>
            )}
          </div>
          <OpenBadge className="mt-8 text-sm text-muted" />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <Parallax className="arch-sm mx-auto aspect-[3/4] max-w-sm bg-ink" amount={10} from="inset(100% 0% 0% 0%)">
            <div className="absolute inset-0">
              <Image src={photos[photo]} alt="" fill sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover" />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
