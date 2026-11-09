# Whitcombe & Vale, PLLC (Scale by Noon demo)

- Niche: Law firm / professional services         (matches www.scalebynoon.com industry id: professional-services)
- Market / city: US – Dallas, TX
- Languages: en
- Live URL: https://whitcombe-vale-demo.vercel.app
- Repo: https://github.com/dbs-media-demos/whitcombe-vale-demo (public, branch main)
- Folder: DBS Media Portfolio/Demo Websites/law-firm
- Stack: Next.js 16.3.6, React 19.2.8, Tailwind v4, GSAP 3.15 (ScrollTrigger, SplitText), Lenis, three.js 0.187 (desktop only)
- Palette: #0F2A22 ink green · #1F3D32 chancery green · #F3EEE3 parchment · #E6DDCB vellum · #1C1C1A charcoal · #B08D57 brass · #7A5C2E deep brass · #6B1E23 oxblood
  Fonts: Libre Caslon Display, Libre Caslon Text, Hanken Grotesk
- Pages: 28 routes, all static except the OG image:
  - Home, Practice areas index + 8 practice pages, Attorneys index + 3 profiles;
  - Client stories, Insights index + 3 articles;
  - About, Reviews, FAQ, Fees, Schedule a consultation (intake wizard), Contact;
  - Privacy, Legal disclaimer, 404.
- Signature features:
  - "The Threshold" hero: a tall arched window with a WebGL layer of drifting window light and dust. It opens to full-bleed as you scroll ("Come in.").
  - Brass scales in real-time 3D (three.js) stand beside the headline: turned from lathe profiles in code (no downloaded model), lacquered brass reflecting a dark studio with a warm "window" softbox, and one warm key light from the arch that throws the balance's soft shadow onto the wall behind it. About a second after the page settles a weight seems to land in one pan and the balance swings back to level; it leans towards the pointer (the camera drifts a few degrees with it), the pans swing in depth as you scroll, and it comes to rest level and fades as the arch opens. Frames are drawn only while something moves and the hero is on screen.
  - Desktop only: the server HTML carries a still rendered from the same scene and camera (`scripts/render-scales.mjs`, AVIF + WebP with alpha), so the canvas fades in over it without a jump. three.js is fetched with `await import()` only after load, on a screen ≥ 1024 px with a mouse, without reduced motion or Save-Data; phones, tablets, small windows and Serbian previews keep the still and download zero bytes of three.js. Serbian pages show the still on desktop too (the Bar code asks for a sober look: no showpiece 3D).
  - Phones get a tighter still of the same scales beside the Call button (it shrinks to the room a long number leaves and never covers the button).
  - Practice areas as a book's table of contents: chapter numerals, dotted leaders and page numbers, with leather thumb-index tabs sliding out at the page edge, one per part. Hovering floats an arch-framed photo that follows the cursor; clicking morphs it into the chapter hero (React `ViewTransition`).
  - "Your first consultation": a pinned section where a brass pen stroke draws through four steps as background photos change, and a "Signed" stamp lands on the fee agreement. Vertical version on phones.
  - Case intake wizard: matter, then 3–4 questions, then a day/time picker with booked slots, then contact details. The attorney-client notice is always shown. It ends with an oxblood wax-seal stamp and a matter number.
  - Will vs living trust explainer: a brass toggle; answers roll over split-flap style, meters re-measure and the backed document beside it turns over from "Last Will and Testament" to "Living Trust Agreement".
  - Also:
    - the firm's one rule highlighted line by line, like the key clause of a contract;
    - partners' signatures that write themselves under their words;
    - brass pen annotations (the rating circled, a word underlined, a flourish that writes itself in the closing band);
    - client stories that arrive redacted and are cleared line by line;
    - review "letters" laid askew that speed up or run backwards with the scroll;
    - on previews, the map unfolds from its creases and today's opening hours get a brass ribbon;
    - margin footnotes and a horizontal "plates" gallery, each plate tagged as an exhibit (A–F) as it arrives;
    - an engraved Dallas map that draws itself, then walks footsteps from the office to the county courts;
    - a live "Open now" badge (Dallas time);
    - page-turn route transitions, a brass cursor ring and a credentials marquee.
- Lighthouse (mobile, home): P 86 / A 100 / BP 100 / SEO 69 (noindex by design; the same build scores SEO 100 with `NEXT_PUBLIC_NOINDEX=false`)
  - Mobile inner pages: P 91–93 / A 100 / BP 100.
  - Desktop: P 99–100 / A 100 / BP 100.
  - CLS 0 everywhere.
- Phone pass (375 x 812, production build): 11.9 screens (was 25), reviews start on screen 2 (was 18), JS 187 KB gzip, zero bytes of three.js, everything on first load about 446 KB (scales still 22 KB AVIF), fonts 27 KB in 2 files, LCP 1.55–1.8 s on slow 4G with a 4x slower CPU (Chromium, home and both preview languages; CSS is inlined and the hero photo preloaded from the head), Total Blocking Time 100–260 ms, CLS 0. Opening settled in about 1.5 s on any screen. First screen shows practice areas + town, Google rating and a Call button with the number; three full reviews inside the first four screens; order: what we handle, reviews, next steps + costs, lawyers + credentials, contact. No GSAP, Lenis, WebGL or pinned scenes on phones.
- Serbian previews (`lang: "sr"`) follow our reading of the Bar code rule 17 and Advocacy Act art. 24 on every screen: name, contacts, normal hours, education, languages and branches of law only, with a plain contact section and calm motion. Education and languages use statements true of any registered Serbian advocate, because the CRM doesn't send them; replace them with the firm's own if it ever does. Reviews and stars stay English-only.

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
- **3D stills:** after changing `src/components/fx/scales/scene.ts`, run `node scripts/render-scales.mjs` (needs Playwright with a Chromium) so the stills match the live scene again.
- **Dev server:** port 4170, entry `law-firm-demo` in the workspace `.claude/launch.json`.
