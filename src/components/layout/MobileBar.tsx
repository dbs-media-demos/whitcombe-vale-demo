import Link from "next/link";
import { Phone } from "@/components/ui/Icons";
import { site } from "@/content/site";

/** Sticky bottom bar on phones: call, or book the consultation. */
export function MobileBar() {
  return (
    <div className="theme-ink fixed inset-x-0 bottom-0 z-[65] grid grid-cols-2 gap-2 border-t border-line !bg-ink/95 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur md:hidden">
      <a href={site.phoneHref} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-strong text-[0.95rem]">
        <Phone className="text-brass" /> Call
      </a>
      <Link href="/consultation" className="flex min-h-12 items-center justify-center rounded-full bg-brass text-[0.95rem] font-medium text-ink">
        Book a consultation
      </Link>
    </div>
  );
}
