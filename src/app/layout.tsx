import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Libre_Caslon_Display, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Cursor } from "@/components/layout/Cursor";
import { agencyName, noindex, site, siteUrl } from "@/content/site";
import { ogImageUrl } from "@/lib/seo";

// Headlines use "block": a late swap would re-wrap large display lines and shift the page.
// None of these is preloaded: phones use two small subsets instead (public/fonts, see the phone block in globals.css) and never fetch them.
const display = Libre_Caslon_Display({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-caslon-display", display: "block", preload: false });
const serif = Libre_Caslon_Text({ weight: "400", style: ["normal", "italic"], subsets: ["latin", "latin-ext"], variable: "--font-caslon-text", display: "swap", preload: false });
const sans = Hanken_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-hanken", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.legalName} | Family, Estate & Business Law in Dallas`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.legalName,
  authors: [{ name: site.legalName }],
  creator: agencyName,
  formatDetection: { telephone: false },
  robots: noindex ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: site.legalName,
    locale: "en_US",
    images: [{ url: ogImageUrl("Quiet counsel for life's defining chapters.", "Family · Estate · Business Law"), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0f2a22",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${display.variable} ${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="theme-paper min-h-dvh">
        <link rel="preload" href="/fonts/caslon-display-phone.woff2" as="font" type="font/woff2" crossOrigin="anonymous" media="(max-width: 767px), (pointer: coarse)" />
        <link rel="preload" href="/fonts/caslon-italic-phone.woff2" as="font" type="font/woff2" crossOrigin="anonymous" media="(max-width: 767px), (pointer: coarse)" />
        <a
          href="#main"
          className="t-caps-sm fixed left-3 top-3 z-[300] -translate-y-24 rounded-full bg-brass px-5 py-3 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {/* Header, footer and the rest come from (site)/layout or for/[token]/layout (SiteChrome) */}
        {children}
        <Cursor />
        <SmoothScroll />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
