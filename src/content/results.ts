import type { PhotoKey } from "./photos";

/** Fictional, anonymised client stories. Past results do not guarantee future outcomes. */
export type Story = {
  id: string;
  matter: string;
  practice: string;
  title: string;
  photo: PhotoKey;
  situation: string;
  approach: string;
  outcome: string;
  figure: { value: string; label: string };
};

export const stories: Story[] = [
  {
    id: "relocation",
    matter: "Child custody · Collin County",
    practice: "child-custody",
    title: "A nurse's job offer, and a schedule that survived 250 miles",
    photo: "father-child",
    situation: "A pediatric nurse was offered a position in Austin. Her existing order restricted her son's residence to Collin County and its neighbours, and the father opposed the move.",
    approach: "We built a long-distance possession schedule around the school calendar: extended summers, alternate spring breaks and the father's weekends paired with flights she paid for. We presented it in mediation with a child-development expert's report.",
    outcome: "An agreed modification was signed in mediation, with no hearing. Both parents kept meaningful time, and the order was signed 11 weeks after filing.",
    figure: { value: "11", label: "weeks from filing to order" },
  },
  {
    id: "business-divorce",
    matter: "Divorce · Dallas County",
    practice: "divorce",
    title: "Tracing a founder's separate property through fourteen years of marriage",
    photo: "office-dark",
    situation: "Our client founded a software consultancy two years before marriage. His spouse claimed the entire company as community property.",
    approach: "Working with a forensic accountant, we traced the original capital and the pre-marriage client contracts, and presented a valuation that separated his pre-marital goodwill from growth during the marriage.",
    outcome: "The court confirmed 38% of the business value as separate property. The remainder was divided through a structured buy-out rather than a forced sale.",
    figure: { value: "38%", label: "confirmed as separate property" },
  },
  {
    id: "muniment",
    matter: "Probate · Dallas County",
    practice: "probate",
    title: "A family home transferred in five weeks, without full probate",
    photo: "keys-wood",
    situation: "Three siblings inherited their mother's East Dallas home under a will that was nine years old. There was no estate debt apart from the mortgage.",
    approach: "Instead of a full administration, we applied for a muniment of title, a Texas shortcut available when an estate has no unpaid debts other than real-estate liens.",
    outcome: "The will was admitted as a muniment of title at the first hearing. The siblings sold the house two months later and saved an estimated $6,000 in administration costs.",
    figure: { value: "5", label: "weeks to transfer title" },
  },
  {
    id: "founders",
    matter: "Business formation · Dallas",
    practice: "business-formation",
    title: "Two restaurant partners, one company agreement, zero surprises",
    photo: "coffee-roaster",
    situation: "Two chefs were opening a Bishop Arts restaurant with unequal cash contributions and equal sweat equity, backed by a family investor.",
    approach: "We formed a manager-managed LLC with separate capital and profits interests, founder vesting over four years, and a buy-sell clause triggered by death, disability or departure.",
    outcome: "When one partner left for a job in Chicago in year three, the buy-out followed the formula in the agreement. It closed in 30 days with no litigation.",
    figure: { value: "30", label: "days to a clean founder buy-out" },
  },
  {
    id: "special-needs",
    matter: "Trusts · Richardson",
    practice: "trusts",
    title: "Protecting a son's benefits while planning for a lifetime",
    photo: "generations-hands",
    situation: "Parents of a 19-year-old with autism wanted to leave him a meaningful inheritance without disqualifying him from SSI and Medicaid.",
    approach: "We drafted a third-party supplemental-needs trust inside their revocable trust, named a professional co-trustee alongside his sister, and wrote a letter of intent describing his routines and care.",
    outcome: "The plan was signed and funded in six weeks. Their son's benefits are protected and his sister knows exactly what her parents intended.",
    figure: { value: "6", label: "weeks to a funded plan" },
  },
];
