import Image from "next/image";
import { Parallax, Reveal, ScrubWords, DrawRule } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Footnote } from "@/components/ui/Footnote";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { photos } from "@/content/photos";

const stats = [
  { value: 2009, label: "Founded in Dallas", format: { decimals: 0 }, plain: true },
  { value: 1900, label: "Matters closed", format: { suffix: "+" } },
  { value: 4.9, label: "Google rating, 212 reviews", format: { decimals: 1 } },
  { value: 15, label: "Minute first call, always free", format: { suffix: " min" } },
];

/** Opening statement: a paragraph that inks in as you read it, with the firm in four numbers. */
export function Overture() {
  return (
    <section aria-labelledby="overture-title" className="theme-paper relative px-[var(--gutter)] py-28 md:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel n="01">Overture</SectionLabel>
          <h2 id="overture-title" className="sr-only">
            About Whitcombe &amp; Vale
          </h2>
          <Parallax className="arch-sm mt-12 hidden aspect-[3/4] max-w-[20rem] lg:block" amount={12}>
            <Image src={photos["window-light"]} alt="Soft morning light through a tall window" fill sizes="20rem" className="object-cover" />
          </Parallax>
          <p className="mt-5 hidden font-serif text-sm italic text-muted lg:block">Fig. 1: The east window, fourteenth floor.</p>
        </div>
        <div className="lg:col-span-8">
          <ScrubWords
            as="p"
            className="t-display text-[clamp(1.9rem,3.7vw,3.6rem)] leading-[1.12]"
            accent={["truth"]}
            text="For seventeen years we have sat across the table from Dallas families and founders at the moments that matter most: a marriage ending, a child's future, a parent's estate, a business being born. We don't do everything. We do three things very well, and we tell you the truth about them."
          />
          <p className="mt-10 max-w-xl text-muted">
            Three partners, two paralegals and one rule: every client knows what we&rsquo;re doing, why, and what it will cost
            <Footnote n={1}>Flat fees for most planning and business work; written estimates for everything else. See the fees page.</Footnote>, before we
            do it.
          </p>
        </div>
      </div>

      <DrawRule className="mt-24" />
      <Reveal as="dl" stagger={0.12} className="grid grid-cols-2 gap-y-12 pt-12 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={i > 0 ? "flex flex-col md:border-l md:border-line md:pl-8" : "flex flex-col"}>
            <dt className="t-caps-sm order-2 mt-3 block text-muted">{s.label}</dt>
            <dd className="t-display order-1 text-[clamp(2.8rem,5vw,4.8rem)] leading-none">
              {s.plain ? s.value : <Counter value={s.value} {...s.format} />}
            </dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
