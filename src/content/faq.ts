export type Faq = { q: string; a: string };

export const faqGroups: { title: string; items: Faq[] }[] = [
  {
    title: "Getting started",
    items: [
      { q: "Is the first call really free?", a: "Yes. The first 15-minute call is free and confidential. We run a quick conflict check, listen to your situation and tell you honestly whether we're the right firm. If we're not, we'll suggest someone who is." },
      { q: "What happens at the strategy meeting?", a: "It's a 60-minute meeting in our office or by video with the attorney who would handle your matter. You leave with a written summary of your options, a recommended path and a fee estimate. It costs $350, which is credited toward your fee if you hire us." },
      { q: "Does contacting you make you my lawyer?", a: "No. An attorney-client relationship begins only when we both sign an engagement agreement. Until then, please don't send confidential documents or details through our website forms." },
      { q: "How quickly will someone call me back?", a: "Within one business day, and usually the same day. Urgent family-violence matters are returned the same day, including Saturdays." },
    ],
  },
  {
    title: "Fees & billing",
    items: [
      { q: "Which services have flat fees?", a: "Wills, living trusts, prenuptial agreements, uncontested divorces, business formation, contract reviews and most probate matters. See our fees page for the full list." },
      { q: "How does hourly billing work for contested cases?", a: "Contested family matters are billed against a retainer, in six-minute increments, with monthly itemised statements. Partner rates range from $395 to $475 an hour; paralegal time is $165 an hour." },
      { q: "Do you offer payment plans?", a: "For flat-fee estate-planning and business packages, you can pay in two or three instalments at no extra cost." },
    ],
  },
  {
    title: "Working with us",
    items: [
      { q: "Do you meet clients outside Dallas?", a: "Yes. We meet by video across Texas and in person in our Arts District office. We appear regularly in Dallas, Collin and Denton county courts." },
      { q: "Can I work with you in Spanish?", a: "Sí. Sofía Delgado and two of our paralegals work with clients in Spanish, and our engagement agreements and key documents are available in Spanish." },
      { q: "How do you keep my matter confidential?", a: "Client files live in an encrypted document system with two-factor access. We never discuss matters by unencrypted text message, and we offer a secure client portal for documents." },
      { q: "Where do I park?", a: "Validated parking is available in the building garage off Ashland Row. The DART Pearl/Arts District station is a four-minute walk." },
    ],
  },
];

export const allFaqs = faqGroups.flatMap((g) => g.items);
