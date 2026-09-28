import type { PhotoKey } from "./photos";

/** Fictional attorneys. Portraits are Unsplash-licensed photos of models, not real lawyers. */
export type Attorney = {
  slug: string;
  name: string;
  role: string;
  focus: string;
  photo: PhotoKey;
  /** Object position for portrait crops. */
  focal: string;
  quote: string;
  bio: string[];
  education: string[];
  admissions: string[];
  memberships: string[];
  languages: string[];
  practices: string[];
  since: number;
  email: string;
};

export const attorneys: Attorney[] = [
  {
    slug: "catherine-whitcombe",
    name: "Catherine Whitcombe",
    role: "Founding Partner",
    focus: "Family law",
    photo: "portrait-catherine",
    focal: "50% 22%",
    quote: "Most people meet a family lawyer on the worst day of their year. My job is to make the next day a little better, and the next year much better.",
    bio: [
      "Catherine has practised family law in Dallas for more than twenty-five years and is Board Certified in Family Law by the Texas Board of Legal Specialization. She founded the firm with Julian Vale in 2009, after a decade at a large downtown litigation firm.",
      "Her practice focuses on high-conflict custody matters, complex property divisions involving closely held businesses, and collaborative divorce. Opposing counsel describe her as calm and precise, and very hard to bluff.",
      "Outside the office she chairs a mentoring program for new family-law attorneys and volunteers with a Dallas legal-aid clinic for survivors of family violence.",
    ],
    education: ["J.D., cum laude, SMU Dedman School of Law", "B.A., History, The University of Texas at Austin"],
    admissions: ["State Bar of Texas, 1998", "U.S. District Court, Northern District of Texas"],
    memberships: ["Board Certified, Family Law, Texas Board of Legal Specialization", "Collaborative Law Institute of Texas", "Dallas Bar Association, Family Law Section"],
    languages: ["English"],
    practices: ["divorce", "child-custody", "prenuptial-agreements"],
    since: 1998,
    email: "catherine@whitcombevale.com",
  },
  {
    slug: "julian-vale",
    name: "Julian Vale",
    role: "Founding Partner",
    focus: "Estate planning & probate",
    photo: "portrait-julian",
    focal: "50% 30%",
    quote: "An estate plan is a letter to the people you love. It should be clear enough that nobody has to guess what you meant.",
    bio: [
      "Julian leads the firm's estate-planning and probate practice. He drafts wills and trusts for young families, business owners and retirees, and guides executors through the Dallas and Collin County probate courts.",
      "Before co-founding the firm, he spent six years in the trust department of a regional bank, and it shows: his plans are built to be administered, not only signed. He holds an LL.M. in Taxation and advises families on planning above the federal estate-tax exemption.",
      "Julian is a frequent speaker on estate planning for blended families and on special-needs trusts. He lives in Lakewood with his wife and two daughters.",
    ],
    education: ["LL.M., Taxation, Georgetown University Law Center", "J.D., The University of Texas School of Law", "B.B.A., Finance, Texas A&M University"],
    admissions: ["State Bar of Texas, 2003"],
    memberships: ["State Bar of Texas, Real Estate, Probate & Trust Law Section", "Dallas Estate Planning Council", "Dallas Bar Association, Probate, Trusts & Estates Section"],
    languages: ["English"],
    practices: ["wills", "trusts", "probate"],
    since: 2003,
    email: "julian@whitcombevale.com",
  },
  {
    slug: "sofia-delgado",
    name: "Sofía Delgado",
    role: "Partner",
    focus: "Business law & contracts",
    photo: "portrait-sofia",
    focal: "50% 35%",
    quote: "Small businesses don't need more legal jargon. They need someone who picks up the phone and says: sign this, not that.",
    bio: [
      "Sofía advises founders, family businesses and franchise owners on entity formation, company agreements, commercial leases and the everyday contracts that keep a business running. She joined the firm in 2016 and became a partner in 2021.",
      "Raised in Oak Cliff, where her parents ran a bakery for thirty years, she has worked with restaurateurs, contractors, clinics and creative studios across North Texas. She counsels clients in English and Spanish.",
      "She leads the firm's General Counsel plan, which gives growing companies a fixed monthly fee and a lawyer who already knows the business.",
    ],
    education: ["J.D., Baylor Law School", "B.A., Economics, Southern Methodist University"],
    admissions: ["State Bar of Texas, 2013"],
    memberships: ["Dallas Hispanic Bar Association", "Dallas Bar Association, Business Law Section", "State Bar of Texas, Business Law Section"],
    languages: ["English", "Español"],
    practices: ["business-formation", "contracts"],
    since: 2013,
    email: "sofia@whitcombevale.com",
  },
];

export const attorneyBySlug = (slug: string) => attorneys.find((a) => a.slug === slug);
