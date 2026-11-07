import type { Biz } from "@/lib/biz-core";
import { enPreview } from "./en-preview";
import { sr } from "./sr";

/** A preview's wording, for server components and the provider; the concept site has none. */
export const dictFor = (biz: Pick<Biz, "lang" | "preview">) => (!biz.preview ? null : biz.lang === "sr" ? sr : enPreview);

export const trFor = (biz: Pick<Biz, "lang" | "preview">) => {
  const dict = dictFor(biz);
  return (s: string) => dict?.[s] ?? s;
};
