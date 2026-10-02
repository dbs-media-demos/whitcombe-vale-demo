"use client";

import Link from "next/link";
import { Phone } from "@/components/ui/Icons";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

/** Sticky bottom bar on phones: call, or book the consultation. */
export function MobileBar() {
  const biz = useBiz();
  return (
    <div className="theme-ink fixed inset-x-0 bottom-0 z-[65] grid grid-cols-2 gap-2 border-t border-line !bg-ink/95 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur md:hidden">
      <a href={telOf(biz)} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong text-[0.95rem]">
        <Phone className="text-brass" /> Call
      </a>
      <Link href="/consultation" className="flex min-h-12 items-center justify-center rounded-full bg-brass text-[0.95rem] font-medium text-ink">
        Book a consultation
      </Link>
    </div>
  );
}
