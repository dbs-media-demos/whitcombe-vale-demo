"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, ViewTransition } from "react";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { Phone } from "@/components/ui/Icons";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { nav, site } from "@/content/site";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

/**
 * Fixed header. Transparent over each page's dark opening, then a blurred
 * ink bar once you scroll; it slips away while reading down and returns on
 * scroll up. On small screens the menu opens a full-screen table of contents.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 320 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <ViewTransition name="site-header">
      <header
        className={clsx(
          "theme-ink fixed inset-x-0 top-0 z-[70] !bg-transparent transition-transform duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open && "-translate-y-full",
        )}
      >
        <div
          aria-hidden
          className={clsx(
            "absolute inset-0 border-b bg-ink/85 backdrop-blur-md transition-opacity duration-700",
            scrolled && !open ? "border-line opacity-100" : "border-transparent opacity-0",
          )}
        />
        <div className="relative flex h-[var(--header-h)] items-center justify-between gap-6 px-[var(--gutter)]">
          <Link href="/" className="relative z-10 -my-2 inline-flex min-h-11 items-center py-2">
            <Logo />
            <span className="sr-only">, home</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative inline-flex min-h-11 items-center px-3.5 text-[0.9rem] text-fg/85 transition-colors hover:text-fg"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={clsx(
                        "absolute inset-x-3.5 bottom-2 h-px origin-left bg-brass transition-transform duration-700 ease-[var(--ease-out-expo)]",
                        isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-4">
            <a href={site.phoneHref} className="hidden min-h-11 items-center gap-2 text-[0.9rem] text-fg/85 transition-colors hover:text-fg md:inline-flex">
              <Phone className="text-brass" />
              {site.phone}
            </a>
            <Link
              href="/consultation"
              className="group relative hidden min-h-11 items-center overflow-hidden rounded-full bg-brass px-5 text-[0.88rem] font-medium text-ink sm:inline-flex"
            >
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-parchment transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <span className="relative">Book a consultation</span>
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
            >
              <span className={clsx("absolute h-px w-4 bg-current transition-transform duration-500", open ? "rotate-45" : "-translate-y-[3px]")} />
              <span className={clsx("absolute h-px w-4 bg-current transition-transform duration-500", open ? "-rotate-45" : "translate-y-[3px]")} />
            </button>
          </div>
        </div>

        {/* Mobile / tablet: full-screen table of contents */}
        <div
          id="site-menu"
          ref={menuRef}
          inert={!open}
          className={clsx(
            "fixed inset-0 -z-0 flex flex-col bg-ink px-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+2rem)] transition-[clip-path] duration-1000 ease-[var(--ease-in-out-quart)] lg:hidden",
            open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
          )}
        >
          <p className="t-caps-sm text-brass">Contents</p>
          <ol className="mt-5 border-t border-line">
            {[{ href: "/", label: "Home" }, ...nav, { href: "/contact", label: "Contact" }].map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-14 items-baseline gap-4 py-3"
                  style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
                >
                  <span className="t-caps-sm w-8 text-brass">{ROMAN[i] ?? i + 1}.</span>
                  <span className="t-display text-[2rem] leading-none">{item.label}</span>
                  <span aria-hidden className="leader text-fg" />
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-col gap-4 pt-8">
            <OpenBadge className="text-sm text-muted" />
            <div className="flex flex-wrap gap-3">
              <a href={site.phoneHref} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5">
                <Phone className="text-brass" /> {site.phone}
              </a>
              <Link href="/consultation" className="inline-flex min-h-12 items-center rounded-full bg-brass px-5 font-medium text-ink">
                Book a consultation
              </Link>
            </div>
          </div>
        </div>
      </header>
    </ViewTransition>
  );
}
