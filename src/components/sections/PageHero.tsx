import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { photos, type PhotoKey } from "@/content/photos";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Opening of every inner page: dark ink, breadcrumbs, a large display title
 * that lifts in with CSS (no JS on the critical path) and an optional arch
 * photograph. `media` replaces the photo, e.g. with a shared-element image.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  photo,
  photoAlt = "",
  media,
  children,
  compact,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  photo?: PhotoKey;
  photoAlt?: string;
  media?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  const hasMedia = Boolean(photo || media);
  return (
    <section className={clsx("theme-ink relative overflow-hidden px-[var(--gutter)] pt-[calc(var(--header-h)+2.5rem)]", compact ? "pb-16 md:pb-20" : "pb-20 md:pb-28")}>
      <div aria-hidden className="absolute inset-x-[var(--gutter)] top-[calc(var(--header-h)+0.5rem)] h-px bg-line">
        <div className="anim-rule h-full bg-brass/60" style={d(0.2)} />
      </div>
      <div className="anim-fade" style={d(0.1)}>
        <Breadcrumbs items={crumbs} />
      </div>
      <div className={clsx("mt-12 grid gap-12 md:mt-16", hasMedia && "lg:grid-cols-12 lg:items-end")}>
        <div className={clsx(hasMedia && "lg:col-span-7")}>
          <p className="t-caps-sm anim-fade text-brass" style={d(0.2)}>
            {eyebrow}
          </p>
          <h1 className="t-display t-xl mt-6">
            <span className="anim-line">
              <span style={d(0.25)}>{title}</span>
            </span>
          </h1>
          {lead && (
            <div className="t-lead anim-fade mt-8 max-w-2xl text-fg/85" style={d(0.5)}>
              {lead}
            </div>
          )}
          {children && (
            <div className="anim-fade mt-10" style={d(0.65)}>
              {children}
            </div>
          )}
        </div>
        {hasMedia && (
          <div className="lg:col-span-4 lg:col-start-9">
            {media ?? (
              <div className="arch-sm anim-fade relative mx-auto aspect-[4/5] max-w-md overflow-hidden" style={d(0.35)}>
                <Image src={photos[photo!]} alt={photoAlt} fill fetchPriority="high" loading="eager" sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
