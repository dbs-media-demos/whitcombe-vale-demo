import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema, graph } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus BreadcrumbList JSON-LD. The last item is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="t-caps-sm text-muted">
        {/* One line always (the current page truncates), so a font swap can never re-wrap it. */}
        <ol className="flex min-w-0 items-center gap-x-2.5 whitespace-nowrap">
          {all.map((c, i) => (
            <li key={c.path} className={i === all.length - 1 ? "flex min-w-0 items-center gap-2.5" : "flex shrink-0 items-center gap-2.5"}>
              {i > 0 && (
                <span aria-hidden className="opacity-50">
                  /
                </span>
              )}
              {i === all.length - 1 ? (
                <span aria-current="page" className="truncate text-fg">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="inline-flex min-h-6 items-center transition-colors hover:text-fg">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={graph(breadcrumbSchema(all))} />
    </>
  );
}
