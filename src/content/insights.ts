import type { PhotoKey } from "./photos";

export type Block = { t: "p"; c: string } | { t: "h2"; c: string } | { t: "ul"; c: string[] } | { t: "quote"; c: string };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  author: string;
  authorSlug: string;
  date: string;
  readMins: number;
  practice: string;
  photo: PhotoKey;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "will-or-living-trust-texas",
    title: "Will or living trust? How Dallas families should actually decide",
    dek: "Texas probate is gentler than its reputation. Here's when a will is enough, and when a trust earns its cost.",
    author: "Julian Vale",
    authorSlug: "julian-vale",
    date: "2026-08-18",
    readMins: 6,
    practice: "trusts",
    photo: "pen-writing",
    body: [
      { t: "p", c: "Almost every estate-planning meeting in our office reaches the same question within ten minutes: do we need a will or a living trust? The internet tends to answer “a trust, always”, usually from someone selling trusts. The honest answer in Texas is more interesting." },
      { t: "h2", c: "Why Texas is different" },
      { t: "p", c: "In many states, probate is slow, expensive and court-supervised at every step. Texas is kinder. A well-drafted will can ask for independent administration, which lets your executor settle the estate with very little court involvement after the initial hearing. For a straightforward estate, that hearing is often the only time anyone sets foot in the courthouse." },
      { t: "p", c: "Texas also offers tools that avoid probate without a trust: transfer-on-death deeds for real estate, beneficiary designations on retirement accounts and life insurance, and payable-on-death designations on bank accounts. Used carefully, these can keep most of a modest estate out of probate altogether." },
      { t: "h2", c: "When a will is usually enough" },
      { t: "ul", c: ["You're a young family whose main goal is naming a guardian for your children.", "Your estate is mainly a home, retirement accounts and life insurance, all with beneficiaries named.", "You own property only in Texas.", "You're comfortable with the will becoming a public record after your death."] },
      { t: "h2", c: "When a trust earns its cost" },
      { t: "ul", c: ["You own real estate in another state, where your family would otherwise face a second probate.", "Privacy matters: a trust isn't filed with any court.", "You have a blended family and want to provide for a spouse while protecting children from a prior marriage.", "You want children or grandchildren to inherit in stages rather than all at once at 18.", "You want a seamless plan if you become unable to manage your own affairs."] },
      { t: "quote", c: "A trust that owns nothing protects nothing. Funding is the step most online trusts quietly skip." },
      { t: "p", c: "If you choose a trust, the drafting is only half the work. Your home must be deeded to the trust and your accounts retitled or re-designated. We prepare the deed for your Texas homestead as part of our package, and give you an account-by-account memo for everything else." },
      { t: "h2", c: "What we'd suggest" },
      { t: "p", c: "Start with the outcome you want for your family, not the document. Bring a rough list of what you own and how it's titled to your free 15-minute call, and we'll tell you which route fits. If a will package is enough, we'll say so. It costs less, and we'd rather you spend the difference on something you'll enjoy." },
    ],
  },
  {
    slug: "first-divorce-consultation-texas",
    title: "What to bring to your first divorce consultation in Texas",
    dek: "A calm checklist for a stressful week, and the questions worth asking any lawyer you meet.",
    author: "Catherine Whitcombe",
    authorSlug: "catherine-whitcombe",
    date: "2026-07-09",
    readMins: 5,
    practice: "divorce",
    photo: "consult-mugs",
    body: [
      { t: "p", c: "Most people arrive at their first divorce consultation having slept badly and read too much. You don't need to have everything organised. But a little preparation makes that first hour far more useful, and usually shortens everything that follows." },
      { t: "h2", c: "Documents worth gathering" },
      { t: "ul", c: ["Federal tax returns for the last three years", "Recent pay stubs for both spouses, if you can access them", "Bank, brokerage and retirement account statements", "Mortgage statements and any other loan or credit-card balances", "A prenuptial or postnuptial agreement, if you signed one", "Any existing court orders, including protective orders", "A short list of anything you owned before the marriage or inherited during it"] },
      { t: "p", c: "That last item matters more than people expect. Texas presumes that property owned at divorce is community property, divided in a way the court considers “just and right”. Property you owned before marriage, or received by gift or inheritance, can be your separate property, but you have to prove it, usually with records." },
      { t: "h2", c: "If you have children" },
      { t: "p", c: "Write down a typical week: who does school drop-off, who handles doctors' appointments, who's home in the evenings. Judges and mediators care about the actual rhythm of a child's life, and it helps us build a parenting plan around it." },
      { t: "h2", c: "Protect your privacy first" },
      { t: "ul", c: ["Use a personal email address your spouse can't access.", "Don't research lawyers on a shared laptop or family tablet.", "Turn off location sharing you no longer want.", "Don't post about your marriage on social media, even privately."] },
      { t: "h2", c: "Questions to ask any lawyer" },
      { t: "ul", c: ["Who, exactly, will handle my case day to day?", "What do you expect this to cost, in writing, and what could change that?", "Do you think this can settle, and how?", "How quickly do you return calls and emails?"] },
      { t: "quote", c: "The best first consultation ends with a plan, not a pep talk." },
      { t: "p", c: "In Texas there's a 60-day waiting period between filing and the earliest date a divorce can be finalised, and at least one spouse must have lived in Texas for six months and in the county for 90 days. Knowing those timelines early helps you plan housing, school and money for the months ahead." },
    ],
  },
  {
    slug: "llc-or-s-corp-texas-small-business",
    title: "LLC or S-corp? Setting up a Texas small business without regrets",
    dek: "One is a legal entity, the other a tax election. Mixing them up is the most common mistake we see.",
    author: "Sofía Delgado",
    authorSlug: "sofia-delgado",
    date: "2026-06-02",
    readMins: 5,
    practice: "business-formation",
    photo: "coffee-roaster",
    body: [
      { t: "p", c: "Founders often ask whether they should form an LLC or an S-corp. It's a fair question with a confusing premise: an LLC is a type of legal entity, while an S-corporation is a federal tax status. An LLC can elect to be taxed as an S-corp. So the real questions are which entity to form, and how it should be taxed." },
      { t: "h2", c: "Why most Texas small businesses start as an LLC" },
      { t: "ul", c: ["Liability protection that separates business debts from your personal assets, if you respect the separation.", "Flexible management and profit-sharing, defined in your company agreement.", "Simple upkeep: no required annual meetings or minutes.", "Formation with the Texas Secretary of State on Form 205; the filing fee is $300."] },
      { t: "h2", c: "When the S-corp election makes sense" },
      { t: "p", c: "By default, a single-member LLC's profit is subject to self-employment tax. Electing S-corporation status lets owners who work in the business take a reasonable salary and receive the rest as distributions, which can reduce payroll taxes. It also adds payroll, bookkeeping and a separate tax return. For many businesses it starts to pay off once profits are consistently well above what a reasonable salary would be. Your CPA should run the numbers; we coordinate with them." },
      { t: "quote", c: "The company agreement matters more than the entity type. It's where partner disputes are prevented, or created." },
      { t: "h2", c: "The company agreement" },
      { t: "p", c: "If you have a co-owner, the agreement is where your business actually lives. It should answer, in writing, before anyone is upset:" },
      { t: "ul", c: ["Who contributed what, and what happens if more money is needed", "Who makes which decisions, and what needs unanimous consent", "How profits are distributed, and when", "What happens if an owner dies, becomes disabled, divorces or simply wants out", "How a departing owner's share is valued and paid for"] },
      { t: "h2", c: "The small things that trip people up" },
      { t: "ul", c: ["Open a separate business bank account on day one.", "File an assumed-name certificate if you trade under a different name.", "Calendar the Texas franchise-tax annual report, even if you owe no tax.", "Sign contracts in the company's name, with your title, never personally."] },
      { t: "p", c: "Our LLC Essentials package covers formation, the EIN, a company agreement and a records binder for a flat $1,250, state fee included. For partners, the Partners' LLC package adds buy-sell and vesting terms. Either way, it starts with a free 15-minute call." },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
export const formatDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
