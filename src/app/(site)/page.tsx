import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${site.legalName} | Family, Estate & Business Lawyers in Dallas, TX`,
  absoluteTitle: true,
  description: site.description,
  path: "/",
  eyebrow: "Family · Estate · Business Law",
});

export default function Home() {
  return <HomeContent />;
}
