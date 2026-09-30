/**
 * The firm. Whitcombe & Vale, PLLC is a fictional business created by Scale by Noon
 * as a concept site. Phone numbers use the reserved 555-01xx range; the street
 * address is invented.
 */

/** The agency that built this concept site. Change the URL here once its custom domain is live. */
export const agencyName = "Scale by Noon";
export const agencyUrl = "https://scale-by-noon.vercel.app";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://whitcombe-vale-demo.vercel.app").replace(/\/$/, "");
export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

/** Demos stay out of search engines unless NEXT_PUBLIC_NOINDEX is explicitly "false". */
export const noindex = process.env.NEXT_PUBLIC_NOINDEX !== "false";

export const site = {
  name: "Whitcombe & Vale",
  legalName: "Whitcombe & Vale, PLLC",
  tagline: "Quiet counsel for life's defining chapters.",
  description:
    "Whitcombe & Vale is a boutique Dallas law firm for family law, estate planning and small-business law. Divorce, custody, prenups, wills, trusts, probate, LLC formation and contracts, with clear flat fees and a free 15-minute confidential call.",
  founded: 2009,
  phone: "(214) 555-0182",
  phoneHref: "tel:+12145550182",
  phoneE164: "+1-214-555-0182",
  email: "hello@whitcombevale.com",
  address: {
    street: "1847 Ashland Row, Suite 1400",
    city: "Dallas",
    region: "TX",
    postal: "75201",
    country: "US",
    neighborhood: "Arts District",
  },
  geo: { lat: 32.7893, lng: -96.7988 },
  rating: { value: 4.9, count: 212 },
  languages: ["English", "Spanish"],
  priceRange: "$$$",
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postal}`;

/** Office hours in Dallas time (America/Chicago). Days: 0 = Sunday. */
export const hours: { day: number; open: string; close: string }[] = [
  { day: 1, open: "08:30", close: "18:00" },
  { day: 2, open: "08:30", close: "18:00" },
  { day: 3, open: "08:30", close: "18:00" },
  { day: 4, open: "08:30", close: "18:00" },
  { day: 5, open: "08:30", close: "17:00" },
  { day: 6, open: "10:00", close: "13:00" },
];

export const hoursSummary = [
  { label: "Monday – Thursday", value: "8:30 am – 6:00 pm" },
  { label: "Friday", value: "8:30 am – 5:00 pm" },
  { label: "Saturday", value: "10:00 am – 1:00 pm, by appointment" },
  { label: "Sunday", value: "Closed · urgent protective-order calls returned" },
];

export const serviceAreas = [
  { name: "Uptown & Downtown", note: "Our office, in the Arts District" },
  { name: "Highland Park & University Park", note: "15 minutes up the Tollway" },
  { name: "Preston Hollow", note: "Estate and trust work" },
  { name: "Lakewood & East Dallas", note: "Family law clients" },
  { name: "Richardson & Plano", note: "Collin County courts" },
  { name: "Frisco & McKinney", note: "Collin County courts" },
  { name: "Irving & Las Colinas", note: "Business clients" },
  { name: "Addison & Carrollton", note: "Denton & Dallas counties" },
];

export const counties = ["Dallas County", "Collin County", "Denton County", "Tarrant County (by referral)"];

export const nav = [
  { href: "/practice-areas", label: "Practice" },
  { href: "/attorneys", label: "Attorneys" },
  { href: "/results", label: "Results" },
  { href: "/fees", label: "Fees" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "The firm" },
];

export const credentials = [
  "Board Certified · Family Law · Texas Board of Legal Specialization",
  "Collaborative Law Institute of Texas",
  "Dallas Bar Association",
  "State Bar of Texas · Real Estate, Probate & Trust Law Section",
  "Dallas Estate Planning Council",
  "Se habla español",
];
