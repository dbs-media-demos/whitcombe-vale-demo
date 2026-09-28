import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Parallax, Reveal } from "@/components/ui/Reveal";
import { attorneys } from "@/content/attorneys";
import { photos } from "@/content/photos";

/** Three partners in arch-framed portraits, staggered like a printed spread. */
export function AttorneysGallery({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Title = headingLevel;
  return (
    <ul className="grid gap-16 md:grid-cols-3 md:gap-8 lg:gap-14">
      {attorneys.map((a, i) => (
        <li key={a.slug} className={clsx(i === 1 && "md:mt-28", i === 2 && "md:mt-12")}>
          <Link href={`/attorneys/${a.slug}`} className="group block" data-cursor="Profile">
            <Parallax className="arch-sm aspect-[4/5] bg-ink" amount={8} from="inset(100% 0% 0% 0%)">
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
              {a.languages.length > 1 && <p className="t-caps-sm mt-4 text-muted">English · Español</p>}
            </Reveal>
          </Link>
        </li>
      ))}
    </ul>
  );
}
