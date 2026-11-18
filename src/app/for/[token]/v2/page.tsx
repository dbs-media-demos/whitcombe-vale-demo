import { notFound } from "next/navigation";
import { HomeContent } from "@/components/home/HomeContent";
import { preloadPhoneHero } from "@/components/home/preloadPhoneHero";
import { previewBiz } from "@/lib/preview";

export { generateMetadata } from "@/app/for/[token]/page";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

/** The lead's preview without any 3D (/for/<token>/v2): the same page as /for/<token>, only the hero differs. */
export default async function PreviewPageV2({ params }: { params: Promise<{ token: string }> }) {
  preloadPhoneHero();
  const biz = await previewBiz((await params).token);
  if (!biz) notFound();
  return <HomeContent biz={biz} hero="2d" />;
}
