import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BizProvider } from "@/components/preview/BizContext";
import { PreviewGuard } from "@/components/preview/PreviewGuard";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { previewBiz } from "@/lib/preview";
import { dictFor } from "@/i18n/tr";

/**
 * A personalised preview made in the Scale by Noon CRM: this demo's homepage with a real
 * business's name, phone, address, hours and rating, in its language. The token is the key;
 * removing the demo in the CRM makes the page 404.
 * Serbian businesses get the page in Serbian (i18n/sr, plain and sober: see HomeContent); English
 * ones get the concept site's local lines made general (i18n/en-preview), e.g. its home city.
 * The wording is rendered on the server, so nothing is hidden or swapped as the page loads.
 */
export default async function PreviewLayout({ children, params }: { children: ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  const biz = await previewBiz(token);
  if (!biz) notFound();
  return (
    <BizProvider biz={biz} dict={dictFor(biz)}>
      <div className={biz.lang === "sr" ? "sober contents" : "contents"}>
        <SiteChrome biz={biz}>{children}</SiteChrome>
      </div>
      <PreviewGuard />
    </BizProvider>
  );
}
