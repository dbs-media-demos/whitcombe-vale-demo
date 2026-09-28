import { absoluteUrl, hours, serviceAreas, site, siteUrl } from "@/content/site";
import { reviews } from "@/content/reviews";
import type { Attorney } from "@/content/attorneys";

/** schema.org builders. Everything links back to one LegalService node via @id. */
type Json = Record<string, unknown>;

export const firmId = `${siteUrl}/#firm`;
export const websiteId = `${siteUrl}/#website`;

const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const address = {
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postal,
  addressCountry: site.address.country,
};

export function firmSchema(): Json {
  return {
    "@type": ["LegalService", "LocalBusiness"],
    "@id": firmId,
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: siteUrl,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/api/og?title=Whitcombe%20%26%20Vale"),
    telephone: site.phoneE164,
    email: site.email,
    priceRange: site.priceRange,
    foundingDate: String(site.founded),
    address,
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: [{ "@type": "City", name: "Dallas" }, ...serviceAreas.map((a) => ({ "@type": "Place", name: `${a.name}, TX` }))],
    knowsLanguage: ["en", "es"],
    openingHoursSpecification: hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAY[h.day]}`,
      opens: h.open,
      closes: h.close,
    })),
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5, worstRating: 1 },
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
    employee: ["catherine-whitcombe", "julian-vale", "sofia-delgado"].map((s) => ({ "@id": `${siteUrl}/attorneys/${s}#person` })),
  };
}

export function websiteSchema(): Json {
  return { "@type": "WebSite", "@id": websiteId, url: siteUrl, name: site.legalName, publisher: { "@id": firmId }, inLanguage: "en-US" };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function serviceSchema(o: { name: string; description: string; path: string; offers?: { name: string; price?: string }[] }): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(o.path)}#service`,
    name: o.name,
    serviceType: o.name,
    description: o.description,
    url: absoluteUrl(o.path),
    provider: { "@id": firmId },
    areaServed: { "@type": "City", name: "Dallas" },
    ...(o.offers?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: o.name,
            itemListElement: o.offers.map((f) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: f.name },
              ...(f.price ? { price: f.price.replace(/[^0-9.]/g, ""), priceCurrency: "USD" } : {}),
            })),
          },
        }
      : {}),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function attorneySchema(a: Attorney): Json {
  return {
    "@type": ["Person"],
    "@id": `${absoluteUrl(`/attorneys/${a.slug}`)}#person`,
    name: a.name,
    jobTitle: `${a.role}, ${a.focus}`,
    worksFor: { "@id": firmId },
    url: absoluteUrl(`/attorneys/${a.slug}`),
    email: a.email,
    knowsLanguage: a.languages,
    alumniOf: a.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.split(", ").slice(-1)[0] })),
    memberOf: a.memberships.map((m) => ({ "@type": "Organization", name: m })),
  };
}

export function attorneyServiceSchema(a: Attorney): Json {
  return {
    "@type": "Attorney",
    "@id": `${absoluteUrl(`/attorneys/${a.slug}`)}#attorney`,
    name: `${a.name}, ${site.legalName}`,
    url: absoluteUrl(`/attorneys/${a.slug}`),
    telephone: site.phoneE164,
    address,
    priceRange: site.priceRange,
    parentOrganization: { "@id": firmId },
    employee: { "@id": `${absoluteUrl(`/attorneys/${a.slug}`)}#person` },
  };
}

export function articleSchema(o: { path: string; headline: string; description: string; image: string; datePublished: string; author: string; wordCount?: number }): Json {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(o.path)}#article`,
    headline: o.headline,
    description: o.description,
    image: absoluteUrl(o.image),
    datePublished: o.datePublished,
    dateModified: o.datePublished,
    author: { "@type": "Person", name: o.author },
    publisher: { "@id": firmId },
    mainEntityOfPage: absoluteUrl(o.path),
    ...(o.wordCount ? { wordCount: o.wordCount } : {}),
  };
}

export function itemListSchema(items: { name: string; path: string }[]): Json {
  return {
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
  };
}

export const graph = (...nodes: Json[]) => ({ "@context": "https://schema.org", "@graph": nodes });
