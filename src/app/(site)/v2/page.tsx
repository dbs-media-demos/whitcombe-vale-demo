import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";
import { metadata as home } from "@/app/(site)/page";

// The same homepage as /, so search engines are pointed at / (pageMetadata's canonical)
export const metadata: Metadata = { ...home, robots: { index: false, follow: true } };

/** The homepage without any 3D: for a slow laptop, or a lead who'd rather not. Only the hero differs. */
export default function HomeV2() {
  return <HomeContent hero="2d" />;
}
