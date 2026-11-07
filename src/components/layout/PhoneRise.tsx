"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isPhone, prefersReducedMotion } from "@/lib/gsap";

/**
 * Phones: one small fade-and-rise per section, once, as it arrives (CSS in globals.css, transform
 * and opacity only). Sections already on the first screen are left alone, and with no JavaScript
 * or reduced motion nothing is ever hidden.
 */
export function PhoneRise() {
  const pathname = usePathname();
  useEffect(() => {
    if (!isPhone() || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          e.target.setAttribute("data-rise", "in");
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("main section, footer").forEach((s) => {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      s.setAttribute("data-rise", "wait");
      io.observe(s);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
