"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Biz } from "@/lib/biz-core";
import { defaultBiz } from "@/lib/biz";

const BizContext = createContext<{ biz: Biz; dict: Record<string, string> | null }>({ biz: defaultBiz, dict: null });

/**
 * Client components read the business from here; without a provider it's the concept business.
 * `dict` is a preview's wording (i18n/sr, i18n/en-preview): it only reaches the browser on previews.
 */
export function BizProvider({ biz, dict = null, children }: { biz: Biz; dict?: Record<string, string> | null; children: ReactNode }) {
  return <BizContext.Provider value={{ biz, dict }}>{children}</BizContext.Provider>;
}

export const useBiz = () => useContext(BizContext).biz;

/** The concept site's English line in this preview's wording, rendered on the server too, so no text swaps after load. */
export const useT = () => {
  const { dict } = useContext(BizContext);
  return (s: string) => dict?.[s] ?? s;
};
