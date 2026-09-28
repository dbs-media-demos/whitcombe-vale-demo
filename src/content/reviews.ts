/** Fictional Google-style reviews for the concept site. */
export type Review = { name: string; area: string; matter: string; rating: number; date: string; text: string };

export const reviews: Review[] = [
  {
    name: "Rachel M.",
    area: "Lakewood",
    matter: "Divorce",
    rating: 5,
    date: "2026-08-14",
    text: "Catherine walked me through every option in the first meeting and wrote down what each one would cost. No surprises for eight months. We settled in mediation, and I kept the house my kids grew up in.",
  },
  {
    name: "David & Priya K.",
    area: "Preston Hollow",
    matter: "Living trust",
    rating: 5,
    date: "2026-07-02",
    text: "Julian didn't just hand us a binder. His paralegal recorded the deed for our house and sent us a checklist for every account. It's the first time estate planning has felt finished.",
  },
  {
    name: "Marisol G.",
    area: "Oak Cliff",
    matter: "LLC formation",
    rating: 5,
    date: "2026-06-19",
    text: "Sofía set up the LLC for my catering business and explained the partner agreement in Spanish for my mother, who is my co-owner. Flat fee, done in a week, and she still answers my contract questions.",
  },
  {
    name: "Tom H.",
    area: "Richardson",
    matter: "Child custody",
    rating: 5,
    date: "2026-05-27",
    text: "My ex wanted to move to Houston with our son. The firm was calm when I wasn't. We ended up with an agreed schedule that actually works, including summers and every other Thanksgiving.",
  },
  {
    name: "Anne-Marie L.",
    area: "University Park",
    matter: "Probate",
    rating: 5,
    date: "2026-04-11",
    text: "After my father died I had no idea where to start. They used a muniment of title instead of a full probate, which saved months. Every email was answered the same day.",
  },
  {
    name: "Chris O.",
    area: "Frisco",
    matter: "Contract review",
    rating: 5,
    date: "2026-03-30",
    text: "I sent a 40-page commercial lease on Monday and had a one-page memo on Wednesday, with three clauses to push back on. The landlord accepted two of them. Worth every dollar.",
  },
  {
    name: "Jenna & Luis R.",
    area: "Uptown",
    matter: "Prenuptial agreement",
    rating: 5,
    date: "2026-02-08",
    text: "We dreaded the prenup conversation. They made it respectful and even a little funny, and we finished two months before the wedding. Both of us felt protected.",
  },
  {
    name: "Harold W.",
    area: "Highland Park",
    matter: "Wills",
    rating: 4,
    date: "2025-12-15",
    text: "Very thorough, with clear flat pricing. Scheduling the signing took a couple of weeks around the holidays, but the documents are excellent and they store the originals for free.",
  },
];

export const ratingBreakdown = [
  { stars: 5, share: 0.92 },
  { stars: 4, share: 0.06 },
  { stars: 3, share: 0.01 },
  { stars: 2, share: 0 },
  { stars: 1, share: 0.01 },
];
