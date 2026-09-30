# Whitcombe & Vale, PLLC (Scale by Noon demo)

- Niche: Law firm / professional services         (matches www.scalebynoon.com industry id: professional-services)
- Market / city: US – Dallas, TX
- Languages: en
- Live URL: https://whitcombe-vale-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/whitcombe-vale-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/law-firm
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis
- Palette: #0F2A22 ink green · #1F3D32 chancery green · #F3EEE3 parchment · #E6DDCB vellum · #1C1C1A charcoal · #B08D57 brass · #7A5C2E deep brass · #6B1E23 oxblood
  Fonts: Libre Caslon Display, Libre Caslon Text, Hanken Grotesk
- Pages: 28 routes, all static except the OG image:
  - Home, Practice areas index + 8 practice pages, Attorneys index + 3 profiles;
  - Client stories, Insights index + 3 articles;
  - About, Reviews, FAQ, Fees, Schedule a consultation (intake wizard), Contact;
  - Privacy, Legal disclaimer, 404.
- Signature features:
  - "The Threshold" hero: a tall arched window with a WebGL layer of drifting window light and dust. It opens to full-bleed as you scroll ("Come in.").
  - Practice areas as a book's table of contents: chapter numerals, dotted leaders and page numbers. Hovering floats an arch-framed photo that follows the cursor; clicking morphs it into the chapter hero (React `ViewTransition`).
  - "Your first consultation": a pinned section where a brass pen stroke draws through four steps as background photos change. Vertical version on phones.
  - Case intake wizard: matter, then 3–4 questions, then a day/time picker with booked slots, then contact details. The attorney-client notice is always shown. It ends with an oxblood wax-seal stamp and a matter number.
  - Will vs living trust explainer: a brass toggle; answers roll over split-flap style and meters re-measure.
  - Also:
    - margin footnotes and a horizontal "plates" gallery;
    - an engraved Dallas map that draws itself;
    - a live "Open now" badge (Dallas time);
    - page-turn route transitions, a brass cursor ring and a credentials marquee.
- Lighthouse (mobile, home): P 86 / A 100 / BP 100 / SEO 69 (noindex by design; the same build scores SEO 100 with `NEXT_PUBLIC_NOINDEX=false`)
  - Mobile inner pages: P 91–93 / A 100 / BP 100.
  - Desktop: P 99–100 / A 100 / BP 100.
  - CLS 0 everywhere.

## Portfolio copy
EN title: Whitcombe & Vale: Boutique Law Firm, Dallas
EN one-liner (≤ 120 chars): An editorial, book-like website for a Dallas law firm: chapters, footnotes, and a consultation wizard.
EN summary (2–3 sentences): A concept site for a boutique family, estate and business law firm, designed like a finely typeset book: practice areas read as a table of contents, fine print lives in margin footnotes, and the hero is an arched window that opens as you scroll. Anxious visitors get calm, clear answers and one obvious next step, a four-step intake wizard that books a free, confidential call. It's fully built for local SEO, with LegalService, Attorney and FAQ schema.
SR title: Whitcombe & Vale: advokatska kancelarija, Dalas
SR one-liner: Elegantan sajt advokatske kancelarije u formi knjige: poglavlja, fusnote i vodič za zakazivanje konsultacija.
SR summary: Koncept sajta za butik kancelariju za porodično, nasledno i privredno pravo, dizajniran kao lepo složena knjiga: oblasti prakse su sadržaj knjige, sitna slova su fusnote na margini, a naslovna scena je lučni prozor koji se otvara dok skrolujete. Uznemireni posetioci dobijaju mirne, jasne odgovore i jedan očigledan sledeći korak, vodič u četiri koraka za besplatne i poverljive konsultacije. Kompletno SEO podešavanje za lokalnu pretragu, sa LegalService, Attorney i FAQ šemama.

## Screenshots
handoff/desktop-home.png, handoff/desktop-feature.png, handoff/mobile-home.png, handoff/scroll.mp4

## Notes
- **The business is fictional.** Phone (214) 555-0182 is in the reserved range, and 1847 Ashland Row is an invented street. Attorney portraits are Unsplash photos of models.
- **Photos:** 48 Unsplash photos, all given one grade by `scripts/grade.mjs`. Sources are listed in `public/images/SOURCES.md`.
- **Forms** validate and show a success state but send nothing.
- **Dev server:** port 4170, entry `law-firm-demo` in the workspace `.claude/launch.json`.
