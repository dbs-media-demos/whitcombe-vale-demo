"use client";

import { useEffect, useRef } from "react";

/** Hairline brass rule across the top that fills as you read the page. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current!.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / Math.max(1, max)))})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[85] h-[2px] origin-left scale-x-0 bg-brass" />;
}
