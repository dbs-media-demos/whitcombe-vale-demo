import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import { PenMark } from "@/components/ui/PenMark";
import { attorneys } from "@/content/attorneys";
import { photos } from "@/content/photos";

// Three hands, one per partner, each written in order: the initial, the name, the flourish
const signatures = [
  [
    "M38 22 C30 8 8 14 10 36 C12 56 40 56 50 40",
    "M54 30 C58 44 62 46 66 34 C70 46 74 46 78 32 C80 22 82 14 86 12 C88 30 86 44 92 44 C98 44 100 34 106 34 C110 34 108 44 114 42 C120 40 122 30 128 32 C134 34 128 44 136 44 C142 44 146 20 150 14 C152 30 150 44 158 42 C166 40 168 34 176 34 C186 34 196 30 206 24",
    "M20 58 C80 50 150 52 212 46",
  ],
  [
    "M30 12 C44 8 52 12 44 22 C36 34 36 52 30 60 C24 68 10 62 16 54 C22 46 40 44 52 42",
    "M60 18 C62 32 66 42 70 44 C76 36 80 24 86 18",
    "M92 38 C86 32 80 40 86 44 C92 46 96 38 98 34 C98 42 100 46 106 44 C112 42 114 26 118 12 C118 28 116 44 124 44 C130 44 132 36 138 36 C144 36 140 44 148 44 C158 44 170 36 196 32",
    "M70 56 C110 60 160 56 214 50",
  ],
  [
    "M34 14 C22 6 8 16 18 26 C28 36 36 40 26 52 C18 60 6 54 8 48",
    "M44 12 C44 28 42 44 40 54 M40 16 C64 6 76 28 66 44 C60 52 48 54 40 52",
    "M78 40 C74 32 68 40 74 44 C80 46 84 36 86 30 C86 22 88 14 90 10 C90 26 88 42 96 42 C102 42 104 34 110 34 C116 34 112 46 120 42 C124 40 124 52 120 58 C116 62 112 56 118 50 C126 42 136 38 146 38 C154 38 150 46 158 44 C168 40 180 34 204 30",
  ],
];

/** Three partners in arch-framed portraits, staggered like a printed spread; each signs beneath their own words. */
export function AttorneysGallery({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Title = headingLevel;
  return (
    <ul className="att-row no-scrollbar grid gap-16 md:grid-cols-3 md:gap-8 lg:gap-14">
      {attorneys.map((a, i) => (
        <li key={a.slug} className={clsx(i === 1 && "md:mt-28", i === 2 && "md:mt-12")}>
          <Link href={`/attorneys/${a.slug}`} className="group block" data-cursor="Profile">
            <Parallax className="att-photo arch-sm aspect-[4/5] bg-ink" amount={8} from="inset(100% 0% 0% 0%)">
              <div className="absolute inset-0">
                <Image
                  src={photos[a.photo]}
                  alt={`Portrait of ${a.name}`}
                  fill
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  style={{ objectPosition: a.focal }}
                />
              </div>
            </Parallax>
            <Reveal className="mt-6">
              <p className="t-caps-sm text-accent">
                {a.role} · {a.focus}
              </p>
              <Title className="t-display mt-3 text-[clamp(2rem,3vw,2.8rem)] leading-none">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
                  {a.name}
                </span>
              </Title>
              <p className="t-italic mt-4 max-w-sm text-[0.98rem] leading-snug text-muted">&ldquo;{a.quote}&rdquo;</p>
              <PenMark paths={signatures[i % signatures.length]} viewBox="0 0 220 70" strokeWidth={1.3} duration={0.9} delay={0.7} className="att-sign mt-3 aspect-[22/7] w-44 text-accent" />
              {a.languages.length > 1 && <p className="t-caps-sm mt-4 text-muted">English · Español</p>}
            </Reveal>
          </Link>
        </li>
      ))}
    </ul>
  );
}
