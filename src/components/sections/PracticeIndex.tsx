import { parts, practices } from "@/content/practice";
import { photos } from "@/content/photos";
import { PracticeIndexClient, type PracticeRow } from "./PracticeIndexClient";

// Only what the contents page shows goes to the browser, not the eight chapters' full text and every photo
const rows: PracticeRow[] = practices.map((p) => {
  const { src, width, height } = photos[p.photo];
  return { slug: p.slug, numeral: p.numeral, page: p.page, part: p.part, title: p.title, short: p.short, photo: { src, width, height } };
});

export function PracticeIndex({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  return <PracticeIndexClient headingLevel={headingLevel} practices={rows} parts={parts} />;
}
