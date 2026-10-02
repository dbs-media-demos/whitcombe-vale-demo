import { addressLine, hours, site } from "@/content/site";
import { type Biz, type DayHours } from "./biz-core";

export type { Biz } from "./biz-core";

/** The fictional firm as a Biz: what the concept site shows (previews swap in a real one). */
export const defaultBiz: Biz = {
  lang: "en",
  name: site.legalName,
  shortName: site.name,
  tagline: null,
  area: site.address.city,
  phone: site.phoneE164.replace(/-/g, ""),
  phoneDisplay: site.phone,
  address: { street: site.address.street, city: site.address.city, region: site.address.region, postal: site.address.postal, full: addressLine },
  timezone: "America/Chicago",
  hours: [0, 1, 2, 3, 4, 5, 6].map((day): DayHours => {
    const h = hours.find((x) => x.day === day);
    return { day, open: h?.open ?? null, close: h?.close ?? null };
  }),
  hoursSummary: "Office hours · Mon–Sat",
  rating: { ...site.rating },
  preview: false,
};
