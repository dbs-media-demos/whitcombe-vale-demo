export type FeePackage = {
  name: string;
  price: string;
  couple?: string;
  lead: string;
  includes: string[];
  practice: string;
  featured?: boolean;
};

export const estatePackages: FeePackage[] = [
  {
    name: "The Will Package",
    price: "$1,450",
    couple: "$2,200 for couples",
    lead: "Everything a young family or first-time planner needs.",
    includes: ["Last will and testament", "Statutory durable power of attorney", "Medical power of attorney", "Directive to physicians", "HIPAA authorization", "Designation of guardian for minor children", "Originals stored in our vault"],
    practice: "wills",
  },
  {
    name: "The Living Trust Package",
    price: "$3,400",
    couple: "$4,200 for couples",
    lead: "For privacy, probate avoidance and planning for incapacity.",
    includes: ["Revocable living trust", "Pour-over will", "All documents in the Will Package", "Deed transferring your Texas homestead", "Account-by-account funding memo", "Trustee instruction letter", "One free review within 3 years"],
    practice: "trusts",
    featured: true,
  },
];

export const businessPackages: FeePackage[] = [
  {
    name: "LLC Essentials",
    price: "$1,250",
    lead: "A single-member LLC, formed and documented properly.",
    includes: ["Name check and certificate of formation (state fee included)", "EIN application", "Single-member company agreement", "Organizational consent and records binder", "Franchise-tax and annual-report calendar"],
    practice: "business-formation",
  },
  {
    name: "Partners' LLC",
    price: "$2,450",
    lead: "For two or more owners who plan to stay friends.",
    includes: ["Everything in LLC Essentials", "Multi-member company agreement", "Buy-sell terms: death, disability, departure", "Founder vesting schedule", "Capital-contribution and distribution rules"],
    practice: "business-formation",
    featured: true,
  },
  {
    name: "Launch Suite",
    price: "$3,900",
    lead: "Formation plus the contracts you'll sign in year one.",
    includes: ["Everything in Partners' LLC", "Customer terms or master service agreement", "Independent contractor agreement", "Mutual NDA template", "60 days of email counsel"],
    practice: "contracts",
  },
];

export const otherFees = [
  { name: "15-minute confidential call", value: "Free" },
  { name: "Strategy meeting (60 min)", value: "$350, credited to your fee" },
  { name: "Uncontested divorce", value: "from $3,500 flat" },
  { name: "Prenuptial agreement", value: "$2,800 flat" },
  { name: "Independent administration (probate)", value: "from $3,900 flat" },
  { name: "Muniment of title", value: "from $2,400 flat" },
  { name: "Contract review", value: "from $650 flat" },
  { name: "General Counsel plan", value: "from $1,500 / month" },
  { name: "Contested family matters", value: "Hourly, retainer from $5,000" },
];
