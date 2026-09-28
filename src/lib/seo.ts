import type { Metadata } from "next";
import { site } from "@/content/site";

type Input = {
  title: string;
  description: string;
  path: string;
  /** Small label above the title on the generated share image. */
  eyebrow?: string;
  absoluteTitle?: boolean;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
};

export const ogImageUrl = (title: string, eyebrow?: string) => {
  const p = new URLSearchParams({ title });
  if (eyebrow) p.set("eyebrow", eyebrow);
  return `/api/og?${p.toString()}`;
};

export function pageMetadata({ title, description, path, eyebrow, absoluteTitle, type = "website", publishedTime }: Input): Metadata {
  const og = ogImageUrl(title, eyebrow);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      url: path,
      siteName: site.legalName,
      locale: "en_US",
      title: fullTitle,
      description,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime ? { publishedTime, authors: [site.legalName] } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [og] },
  };
}
