"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Phone } from "@/components/ui/Icons";
import { useBiz } from "@/components/preview/BizContext";
import { L, telOf } from "@/lib/biz-core";

/**
 * Sticky bottom bar on phones: call, or the short form on the homepage (the wizard from inner pages).
 * Serbian previews: Pozovite + Kontakt.
 */
export function MobileBar() {
  const biz = useBiz();
  const pathname = usePathname();
  const tel = telOf(biz);
  // "/v2" is the same homepage without the 3D hero
  const home = biz.preview || pathname === "/" || pathname === "/v2";
  const cls = "mobile-bar-go flex min-h-12 items-center justify-center rounded-full bg-brass text-[0.95rem] font-medium text-ink";
  return (
    <div className={clsx("mobile-bar theme-ink fixed inset-x-0 bottom-0 z-[65] grid gap-2 border-t border-line !bg-ink px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 md:hidden", tel ? "grid-cols-2" : "grid-cols-1")}>
      {tel && (
        <a href={tel} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong text-[0.95rem]">
          <Phone className="text-brass" /> {L(biz, "Call", "Pozovite")}
        </a>
      )}
      {biz.lang === "sr" ? (
        <a href="#kontakt" className={cls}>
          Kontakt
        </a>
      ) : home ? (
        <a href="#contact-form" className={cls}>
          Book a free call
        </a>
      ) : (
        <Link href="/consultation" className={cls}>
          Book a consultation
        </Link>
      )}
    </div>
  );
}
