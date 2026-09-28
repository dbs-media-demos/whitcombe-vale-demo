import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";
import { practices } from "@/content/practice";
import { attorneys } from "@/content/attorneys";
import { articles } from "@/content/insights";

// Bump when page content changes meaningfully.
const UPDATED = new Date("2026-09-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly", lastModified = UPDATED) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/practice-areas", 0.9),
    ...practices.map((p) => page(`/practice-areas/${p.slug}`, 0.9)),
    page("/consultation", 0.9),
    page("/attorneys", 0.8),
    ...attorneys.map((a) => page(`/attorneys/${a.slug}`, 0.7)),
    page("/fees", 0.8),
    page("/results", 0.7),
    page("/reviews", 0.7),
    page("/about", 0.7),
    page("/faq", 0.6),
    page("/contact", 0.8),
    page("/insights", 0.6, "weekly"),
    ...articles.map((a) => page(`/insights/${a.slug}`, 0.5, "yearly", new Date(a.date))),
    page("/privacy", 0.2, "yearly"),
    page("/legal-disclaimer", 0.2, "yearly"),
  ];
}
