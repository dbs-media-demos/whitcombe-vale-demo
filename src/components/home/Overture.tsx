import Image from "next/image";
import { Parallax, Reveal, ScrubWords, DrawRule } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Footnote } from "@/components/ui/Footnote";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { photos } from "@/content/photos";
import { defaultBiz } from "@/lib/biz";
import { L, openDays, type Biz } from "@/lib/biz-core";

const stats = [
  { value: 2009, label: "Founded in Dallas", format: { decimals: 0 }, plain: true },
  { value: 1900, label: "Matters closed", format: { suffix: "+" } },
  { value: 4.9, label: "Google rating, 212 reviews", format: { decimals: 1 } },
  { value: 15, label: "Minute first call, always free", format: { suffix: " min" } },
];

/** Opening statement: a paragraph that inks in as you read it, with the firm in four numbers. */
export function Overture({ biz = defaultBiz }: { biz?: Biz }) {
  const days = openDays(biz);
  // A preview states only what's true of the real firm: its rating and opening days
  const statList = biz.preview
    ? [
        ...(biz.rating ? [{ value: biz.rating.value, label: L(biz, `Google rating, ${biz.rating.count} reviews`, `Ocena na Google-u, ${biz.rating.count} recenzija`), format: { decimals: 1 }, plain: false }] : []),
        ...(days ? [{ value: days, label: L(biz, "Days a week the office is open", "Dana nedeljno radimo"), format: { decimals: 0 }, plain: true }] : []),
        { value: 15, label: L(biz, "Minute first call, always free", "Minuta prvog razgovora, besplatno"), format: { suffix: " min" }, plain: false },
        { value: 1, label: L(biz, "Business day to reply, at most", "Radni dan do odgovora, najviše"), format: { decimals: 0 }, plain: true },
      ]
    : stats;
  // ScrubWords splits words as it renders, so the preview's copy is written here
  const text = biz.preview
    ? L(
        biz,
        "We sit across the table from families and founders at the moments that matter most: a marriage ending, a child's future, a parent's estate, a business being born. We don't do everything. We do three things very well, and we tell you the truth about them.",
        "Sedimo za stolom sa porodicama i osnivačima u trenucima koji su najvažniji: kada se brak završava, kada se odlučuje o budućnosti deteta, o nasleđu roditelja, o firmi koja nastaje. Ne radimo sve. Tri stvari radimo veoma dobro i o njima vam govorimo istinu.",
      )
    : "For seventeen years we have sat across the table from Dallas families and founders at the moments that matter most: a marriage ending, a child's future, a parent's estate, a business being born. We don't do everything. We do three things very well, and we tell you the truth about them.";
  return (
    <section aria-labelledby="overture-title" className="theme-paper relative px-[var(--gutter)] py-28 md:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel n="01">Overture</SectionLabel>
          <h2 id="overture-title" className="sr-only">
            {biz.preview ? biz.name : "About Whitcombe & Vale"}
          </h2>
          <Parallax className="arch-sm mt-12 hidden aspect-[3/4] max-w-[20rem] lg:block" amount={12}>
            <Image src={photos["window-light"]} alt="Soft morning light through a tall window" fill sizes="20rem" className="object-cover" />
          </Parallax>
          {!biz.preview && <p className="mt-5 hidden font-serif text-sm italic text-muted lg:block">Fig. 1: The east window, fourteenth floor.</p>}
        </div>
        <div className="lg:col-span-8">
          <ScrubWords
            as="p"
            className="t-display text-[clamp(1.9rem,3.7vw,3.6rem)] leading-[1.12]"
            accent={biz.lang === "sr" ? ["istinu."] : ["truth"]}
            text={text}
          />
          {biz.preview ? (
            <p className="mt-10 max-w-xl text-muted">
              {L(
                biz,
                "One rule: every client knows what we’re doing, why, and what it will cost, before we do it.",
                "Jedno pravilo: svaki klijent zna šta radimo, zašto i koliko će koštati, pre nego što počnemo.",
              )}
            </p>
          ) : (
            <p className="mt-10 max-w-xl text-muted">
              Three partners, two paralegals and one rule: every client knows what we&rsquo;re doing, why, and what it will cost
              <Footnote n={1}>Flat fees for most planning and business work; written estimates for everything else. See the fees page.</Footnote>, before we
              do it.
            </p>
          )}
        </div>
      </div>

      <DrawRule className="mt-24" />
      <Reveal as="dl" stagger={0.12} className="grid grid-cols-2 gap-y-12 pt-12 md:grid-cols-4">
        {statList.map((s, i) => (
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
