import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Arrow } from "./Icons";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  className?: string;
  arrow?: boolean;
  cursor?: string;
};

/** The site's one button style: a brass pill (solid), a hairline pill (outline) or an underlined text link. */
export function ButtonLink({ href, children, variant = "solid", className, arrow = true, cursor }: Props) {
  const external = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
  const cls = clsx(
    "group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden whitespace-nowrap text-[0.95rem] font-medium transition-colors duration-500",
    variant === "solid" && "rounded-full bg-accent px-7 text-accent-fg",
    variant === "outline" && "rounded-full border border-line-strong px-7 hover:border-fg",
    variant === "text" && "min-h-11 border-b border-current pb-0.5",
    className,
  );
  const inner = (
    <>
      {variant === "solid" && (
        <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-fg transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
      )}
      <span className={clsx("relative transition-colors duration-500", variant === "solid" && "group-hover:text-bg")}>{children}</span>
      {arrow && (
        <Arrow
          className={clsx(
            "relative transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-1",
            variant === "solid" && "transition-colors group-hover:text-bg",
          )}
        />
      )}
    </>
  );
  return external ? (
    <a href={href} className={cls} data-cursor={cursor}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} data-cursor={cursor}>
      {inner}
    </Link>
  );
}
