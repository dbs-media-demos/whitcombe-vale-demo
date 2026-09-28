# Whitcombe & Vale, PLLC (DBS Media concept site)

A demo website for a fictional boutique Dallas law firm (family law, estate planning, small-business law), built by DBS Media to show law firms and other professional-services businesses what their site could be. See `DEMO.md` for the handoff summary.

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 (`ViewTransition`) · Tailwind CSS v4 · GSAP 3 (ScrollTrigger, SplitText) · Lenis · `next/og`

## Develop

```bash
npm install
npm run dev -- -p 4170
```

## Build

```bash
npm run build && npm start
```

The site is **noindex by default** (robots meta + `robots.txt` disallow). Set `NEXT_PUBLIC_NOINDEX=false` to build an indexable version. `NEXT_PUBLIC_SITE_URL` sets the canonical origin (default `https://whitcombe-vale-demo.vercel.app`).

## Where things live

- `src/content/`: all copy and data (practice areas, attorneys, reviews, client stories, fees, FAQ, articles, photo registry).
- `src/components/home/`: the home-only sections (Threshold hero, Overture, Folio).
- `src/components/sections/`: shared sections, including the signature interactions:
  - `PracticeIndex` (table of contents, hover preview, shared-element morph);
  - `ConsultationGuide` (pinned four-step pen line);
  - `WillVsTrust` (animated comparison).
- `src/components/intake/`: the consultation wizard, contact form and wax seal.
- `src/lib/useIdleGSAP.ts`: idle-queued scroll effects and a shared IntersectionObserver for reveals (keeps the main thread free during load).
- `scripts/`: photo pipeline.
  - `photos.txt` lists Unsplash IDs.
  - `grade.mjs` applies one colour grade to every photo and writes `public/images/SOURCES.md`.
  - `icons.mjs` builds the favicon and app icons.

Forms validate and show a confirmation but send nothing.
