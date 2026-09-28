import type { PhotoKey } from "./photos";

export type PartId = "family" | "legacy" | "enterprise";

export const parts: Record<PartId, { numeral: string; name: string; line: string }> = {
  family: { numeral: "Part One", name: "Family", line: "Divorce, children and the agreements that protect a marriage." },
  legacy: { numeral: "Part Two", name: "Legacy", line: "Wills, trusts and the careful work of passing things on." },
  enterprise: { numeral: "Part Three", name: "Enterprise", line: "Forming, protecting and contracting for the business you're building." },
};

export type Practice = {
  slug: string;
  numeral: string;
  page: number;
  part: PartId;
  title: string;
  /** One line for the table of contents hover and cards. */
  short: string;
  photo: PhotoKey;
  /** Big italic line under the page title. */
  dek: string;
  intro: string[];
  handles: string[];
  approach: { title: string; body: string }[];
  fee: { label: string; value: string; note: string };
  attorney: string;
  faqs: { q: string; a: string }[];
  /** Short sidenote shown in the page margin. */
  footnote: string;
  related: string[];
};

export const practices: Practice[] = [
  {
    slug: "divorce",
    numeral: "I",
    page: 7,
    part: "family",
    title: "Divorce",
    short: "Contested and uncontested divorce, handled with discretion and a plan.",
    photo: "window-dark",
    dek: "Ending a marriage well is still possible. It starts with a plan you understand.",
    intro: [
      "Texas is a community-property state, which means almost everything acquired during the marriage is on the table: the house, the retirement accounts, the business, the debt. How it's divided depends on what you can document, what you can negotiate and, occasionally, what you're prepared to try.",
      "We represent spouses in uncontested and contested divorces across Dallas, Collin and Denton counties. Most of our cases settle through negotiation or mediation, because that's usually what's best for our clients and their children. When a case needs to go to trial, we're ready for that too.",
    ],
    handles: [
      "Uncontested divorce, with a flat fee",
      "Contested divorce and trial",
      "Collaborative divorce",
      "Mediation preparation and representation",
      "Division of retirement accounts (QDROs)",
      "Business valuation and separate-property tracing",
      "Spousal maintenance and contractual alimony",
      "Post-divorce enforcement and modification",
    ],
    approach: [
      { title: "Inventory", body: "We build a complete inventory of what the two of you own and owe, and trace anything that may be separate property." },
      { title: "Strategy", body: "We agree the outcome you want, the one you could live with, and what each route will realistically cost." },
      { title: "Resolution", body: "Negotiation or mediation first. Litigation only when it's the better path, and never as a surprise." },
    ],
    fee: { label: "Uncontested divorce", value: "from $3,500 flat", note: "Contested matters are billed hourly against a retainer. We give you a written estimate at the strategy meeting." },
    attorney: "catherine-whitcombe",
    faqs: [
      { q: "How long does a divorce take in Texas?", a: "Texas requires a 60-day waiting period from the date the petition is filed. An uncontested divorce often finishes within three to four months; a contested case typically takes nine to eighteen months, depending on the county and on how much is disputed." },
      { q: "Do I have to live in Texas to file here?", a: "One spouse must have lived in Texas for at least six months and in the county of filing for at least 90 days before the petition is filed." },
      { q: "Will my divorce be public?", a: "The petition and final decree are court records. We keep financial details in sealed inventories and use agreements that limit what is filed publicly wherever the court allows." },
    ],
    footnote: "Texas Family Code § 6.702 sets the 60-day waiting period. Narrow exceptions exist for family-violence cases.",
    related: ["child-custody", "prenuptial-agreements"],
  },
  {
    slug: "child-custody",
    numeral: "II",
    page: 15,
    part: "family",
    title: "Child Custody",
    short: "Conservatorship, possession schedules and support, focused on the child.",
    photo: "hands-child",
    dek: "Children need a plan that still works when they're twelve, not only next weekend.",
    intro: [
      "In Texas, “custody” is called conservatorship. The court decides who makes decisions for the child, who the child lives with, and the schedule of time with each parent. It will always ask one question first: what is in the child's best interest?",
      "We help parents build parenting plans that are specific enough to prevent the next argument, from holidays and summer to travel, school choice and the right to relocate. When the other side won't agree, we present your case to the court clearly and calmly.",
    ],
    handles: [
      "Joint and sole managing conservatorship",
      "Standard and custom possession orders",
      "Child support calculation and review",
      "Relocation and geographic restrictions",
      "Modification of existing orders",
      "Enforcement of visitation and support",
      "Grandparent access (where the law allows)",
      "Unmarried parents and paternity",
    ],
    approach: [
      { title: "Listen", body: "We learn your child's routine, needs and relationships before we talk about schedules." },
      { title: "Design", body: "We draft a parenting plan that covers holidays, travel, school, activities and communication." },
      { title: "Protect", body: "We negotiate or litigate for an order you can enforce, and change it when life changes." },
    ],
    fee: { label: "Custody matters", value: "retainer from $5,000", note: "Agreed modifications are often available at a flat fee. Ask us at your strategy meeting." },
    attorney: "catherine-whitcombe",
    faqs: [
      { q: "At what age can a child choose which parent to live with?", a: "A child aged 12 or older may tell the judge, in a private interview, which parent they would prefer to live with. The judge considers that preference but isn't bound by it." },
      { q: "What is a Standard Possession Order?", a: "It's the default Texas schedule: alternating weekends, Thursday evenings, split holidays and 30 days in summer. Parents can agree to something different, and often should." },
      { q: "Can I move out of Dallas with my child?", a: "Most Texas orders include a geographic restriction, often to Dallas County and the counties next to it. Moving outside that area requires agreement or a modification from the court." },
    ],
    footnote: "Texas Family Code § 153.009 governs the judge's interview with a child aged 12 or older.",
    related: ["divorce", "prenuptial-agreements"],
  },
  {
    slug: "prenuptial-agreements",
    numeral: "III",
    page: 23,
    part: "family",
    title: "Prenuptial Agreements",
    short: "Premarital and postmarital agreements, drafted to hold up and to keep the peace.",
    photo: "rings-bw",
    dek: "An honest conversation now is the most romantic thing a lawyer can arrange.",
    intro: [
      "A prenuptial agreement lets a couple decide, in advance, how property will be treated during the marriage and in the event of divorce or death. It can protect a family business, an inheritance, or a spouse who is stepping away from a career.",
      "We draft and review agreements for both sides and insist on full financial disclosure and enough time to reflect. Texas courts enforce these agreements when they are signed voluntarily and with proper disclosure, and ours are drafted to meet that standard.",
    ],
    handles: [
      "Prenuptial (premarital) agreements",
      "Postnuptial and partition agreements",
      "Protection of family businesses and inheritances",
      "Separate-property characterization",
      "Independent review for the other spouse",
      "Agreements for second marriages and blended families",
    ],
    approach: [
      { title: "Disclose", body: "Both sides exchange complete financial statements. Disclosure is the foundation of an agreement that holds up." },
      { title: "Draft", body: "We write clear terms in plain English, with no surprises hidden in the boilerplate." },
      { title: "Sign early", body: "We aim to finish at least 30 days before the wedding, so nobody signs under pressure." },
    ],
    fee: { label: "Prenuptial agreement", value: "$2,800 flat", note: "Includes drafting, two rounds of revisions and signing. Independent review of the other spouse's draft costs $1,200 flat." },
    attorney: "catherine-whitcombe",
    faqs: [
      { q: "When should we start the prenup?", a: "Ideally three months before the wedding. Agreements signed days before the ceremony invite a claim of duress." },
      { q: "Can a prenup decide child custody or child support?", a: "No. Texas won't let parents sign away a child's right to support, and custody is always decided on the child's best interest at the time." },
      { q: "We're already married. Is it too late?", a: "Not at all. A postnuptial or partition agreement can achieve much of the same protection." },
    ],
    footnote: "Premarital agreements are governed by Texas Family Code Chapter 4, which follows the Uniform Premarital Agreement Act.",
    related: ["divorce", "trusts"],
  },
  {
    slug: "wills",
    numeral: "IV",
    page: 31,
    part: "legacy",
    title: "Wills",
    short: "Clear, current wills and the documents that go with them.",
    photo: "pen-writing",
    dek: "A good will is short to read and long to last.",
    intro: [
      "A will names who inherits, who manages your estate and, most importantly for young families, who would raise your children. Without one, Texas intestacy law decides for you, and the result is rarely what people expect.",
      "Our will packages include the documents that matter while you're alive too: powers of attorney, a medical power of attorney and a directive to physicians. We sign in our office with witnesses and a notary, and we store the originals for you.",
    ],
    handles: [
      "Simple and tax-aware wills",
      "Guardian designations for minor children",
      "Statutory durable powers of attorney",
      "Medical powers of attorney and directives",
      "Pour-over wills that work with a trust",
      "Codicils and will reviews after life changes",
    ],
    approach: [
      { title: "Map", body: "One meeting to map your family, your assets and your wishes. Most clients need about an hour." },
      { title: "Draft", body: "You receive plain-English drafts with a one-page summary of what each document does." },
      { title: "Sign & store", body: "We supervise the signing in our office and keep the originals in our vault at no charge." },
    ],
    fee: { label: "Will package", value: "$1,450 · couples $2,200", note: "Flat fee. Includes the will, durable and medical powers of attorney, a directive to physicians, a HIPAA release and a designation of guardian." },
    attorney: "julian-vale",
    faqs: [
      { q: "Is a handwritten will valid in Texas?", a: "Yes, if it's entirely in your handwriting and signed. These wills often create ambiguity and delay, though, and they don't include the self-proving affidavit that simplifies probate." },
      { q: "How often should I update my will?", a: "Review it every three to five years, and always after a marriage, divorce, birth, death, move to another state or significant change in assets." },
      { q: "Do I need a trust instead?", a: "Not always. Use our will-versus-trust comparison, or ask us at the free call. Many Dallas families are well served by a will alone." },
    ],
    footnote: "Texas Estates Code § 251.052 recognizes wills written wholly in the testator's handwriting.",
    related: ["trusts", "probate"],
  },
  {
    slug: "trusts",
    numeral: "V",
    page: 39,
    part: "legacy",
    title: "Trusts",
    short: "Revocable living trusts, special-needs trusts and planning for what comes next.",
    photo: "old-keys",
    dek: "A trust is a set of instructions that keeps working when you can't.",
    intro: [
      "A revocable living trust can keep your estate out of probate, keep the details private and provide for you if you become unable to manage your own affairs. It's especially useful if you own property in more than one state, have a blended family or want to leave assets to children in stages.",
      "We design, draft and fund trusts. Funding means retitling your home and accounts into the trust, and it's the step most online trusts quietly skip. A trust that owns nothing can't protect anything.",
    ],
    handles: [
      "Revocable living trusts",
      "Trust funding and deed preparation",
      "Supplemental (special) needs trusts",
      "Trusts for minor and young-adult beneficiaries",
      "Irrevocable and life-insurance trusts",
      "Trustee guidance and administration",
    ],
    approach: [
      { title: "Design", body: "We decide who benefits, when and how, and who serves as trustee if you can't." },
      { title: "Draft", body: "You get the trust, a pour-over will, powers of attorney and a funding memo." },
      { title: "Fund", body: "We prepare the deed for your Texas home and tell you exactly how to retitle each account." },
    ],
    fee: { label: "Living trust package", value: "$3,400 · couples $4,200", note: "Flat fee, including funding of your Texas homestead. Additional properties cost $350 each." },
    attorney: "julian-vale",
    faqs: [
      { q: "Does a trust avoid estate tax?", a: "A revocable trust alone doesn't reduce federal estate tax. Most families today fall below the federal exemption. For those who don't, we design additional irrevocable planning." },
      { q: "Will I lose control of my assets?", a: "No. With a revocable trust you're usually your own trustee, and you can amend or revoke the trust at any time." },
      { q: "What happens if I forget to put something in the trust?", a: "Your pour-over will sends it to the trust, but that asset may need probate first. That's why we take funding seriously." },
    ],
    footnote: "Texas has no state estate or inheritance tax; only the federal estate tax applies.",
    related: ["wills", "probate"],
  },
  {
    slug: "probate",
    numeral: "VI",
    page: 47,
    part: "legacy",
    title: "Probate",
    short: "Guiding executors and families through the Texas probate courts.",
    photo: "keys-wood",
    dek: "When someone has died, the paperwork should be the smallest part of your week.",
    intro: [
      "Texas probate is simpler than its reputation, especially with a well-drafted will that allows independent administration. It still has deadlines, notices and court hearings, and executors carry personal responsibility for getting them right.",
      "We handle probate in the Dallas and Collin County probate courts: applying to probate the will, securing letters testamentary, notifying creditors, preparing the inventory, and distributing the estate. Where there's no will, we use the simplest route the law allows.",
    ],
    handles: [
      "Independent administration",
      "Muniment of title",
      "Small-estate affidavits",
      "Heirship determinations",
      "Executor and administrator guidance",
      "Will contests and fiduciary disputes (by referral)",
    ],
    approach: [
      { title: "Triage", body: "In the first call we identify the fastest legal route: full administration, muniment of title or an affidavit." },
      { title: "File", body: "We prepare the application, attend the hearing with you and obtain your letters." },
      { title: "Close", body: "Inventory, creditor notices, distribution and a clean closing, with a checklist you can follow." },
    ],
    fee: { label: "Independent administration", value: "from $3,900 flat", note: "Muniment of title from $2,400 flat. Court costs and publication fees are extra and disclosed upfront." },
    attorney: "julian-vale",
    faqs: [
      { q: "How long does probate take in Dallas County?", a: "A hearing is usually set three to five weeks after filing. Most independent administrations close within six to twelve months." },
      { q: "Is there a deadline to probate a will?", a: "Generally, a will must be offered for probate within four years of death. After that, options narrow considerably." },
      { q: "Do I need a lawyer to be an executor?", a: "In Texas, an executor who isn't a lawyer needs one to represent them in the probate court." },
    ],
    footnote: "Texas Estates Code § 256.003 generally requires a will to be probated within four years of the testator's death.",
    related: ["wills", "trusts"],
  },
  {
    slug: "business-formation",
    numeral: "VII",
    page: 55,
    part: "enterprise",
    title: "Business Formation",
    short: "LLCs, corporations and partner agreements, set up right the first time.",
    photo: "shop-owner",
    dek: "The cheapest time to prevent a partner dispute is before you have a partner dispute.",
    intro: [
      "Filing a certificate of formation with the Texas Secretary of State takes an afternoon. Deciding who owns what, who decides what, and what happens when a founder leaves takes more thought, and that's where most small businesses get hurt later.",
      "We form LLCs and corporations for Dallas founders, restaurateurs, contractors, medical practices and family businesses, and we write the company agreements that govern them. For companies with more than one owner, we always include buy-sell terms.",
    ],
    handles: [
      "LLC and corporation formation",
      "Company agreements and bylaws",
      "Buy-sell and founder vesting terms",
      "S-corporation election coordination",
      "Assumed names (DBAs) and registered agents",
      "Conversions, mergers and dissolutions",
    ],
    approach: [
      { title: "Structure", body: "We choose the right entity with your CPA, weighing liability, taxes and how you'll raise money." },
      { title: "Form", body: "We file with the Secretary of State, obtain your EIN and prepare your company records." },
      { title: "Govern", body: "We write the agreement that decides who owns, who decides and how an owner leaves." },
    ],
    fee: { label: "LLC Essentials", value: "$1,250 flat", note: "Multi-member LLC with buy-sell terms: $2,450. The $300 state filing fee is included in both." },
    attorney: "sofia-delgado",
    faqs: [
      { q: "LLC or corporation?", a: "Most small Texas businesses start as an LLC, for its flexibility and simple administration. If you plan to raise venture capital, a Delaware C-corporation is usually expected." },
      { q: "Do I need a company agreement if I'm the only owner?", a: "Texas doesn't require one, but banks, investors and courts expect one, and it helps protect your personal assets from business creditors." },
      { q: "What about the Texas franchise tax?", a: "Most small businesses fall under the no-tax-due threshold but must still file an annual report. We add the deadlines to your formation binder." },
    ],
    footnote: "Certificates of formation for Texas LLCs are filed on Secretary of State Form 205; the filing fee is $300.",
    related: ["contracts", "prenuptial-agreements"],
  },
  {
    slug: "contracts",
    numeral: "VIII",
    page: 63,
    part: "enterprise",
    title: "Contracts",
    short: "Drafting, reviewing and negotiating the agreements your business runs on.",
    photo: "contract-bw",
    dek: "Read before signing. We'll do the reading.",
    intro: [
      "Most business disputes start with a contract that was signed in a hurry, copied from somewhere else or never written down. We draft and review the agreements small businesses actually use: customer terms, vendor contracts, commercial leases, employment and contractor agreements.",
      "Reviews come back within three business days, with a one-page memo that lists what to accept, what to push back on and the language to propose. For ongoing needs, our General Counsel plan gives you a fixed monthly fee and a direct line.",
    ],
    handles: [
      "Customer terms and master service agreements",
      "Vendor and supply agreements",
      "Commercial lease review",
      "Employment, contractor and non-solicitation agreements",
      "NDAs and confidentiality agreements",
      "Purchase and sale of a small business",
    ],
    approach: [
      { title: "Read", body: "We read every clause, including the ones everyone skips: indemnity, limitation of liability and termination." },
      { title: "Advise", body: "A one-page memo ranks the risks in plain English, with our recommended edits." },
      { title: "Negotiate", body: "If you'd like, we take the redline to the other side and get it signed." },
    ],
    fee: { label: "Contract review", value: "from $650 flat", note: "Drafting from $1,200. General Counsel plan from $1,500/month, with 72-hour turnaround." },
    attorney: "sofia-delgado",
    faqs: [
      { q: "How fast can you review a contract?", a: "Within three business days as standard, or within 24 hours for a rush fee of $250." },
      { q: "Do you litigate contract disputes?", a: "We resolve most disputes through demand letters and negotiation. For litigation, we refer to trusted trial counsel and stay involved as your business counsel." },
      { q: "Can you review a contract in Spanish?", a: "Yes. Sofía Delgado reviews and negotiates agreements in English and Spanish." },
    ],
    footnote: "Texas generally enforces non-competes only when they are reasonable in time, geography and scope (Bus. & Com. Code § 15.50).",
    related: ["business-formation", "trusts"],
  },
];

export const practiceBySlug = (slug: string) => practices.find((p) => p.slug === slug);
export const practicesByPart = (part: PartId) => practices.filter((p) => p.part === part);
