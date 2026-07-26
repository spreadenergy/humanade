import { OG_IMAGE } from "@/lib/page-metadata";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

/**
 * What Humanade is, in the form search engines read. The site said nothing
 * about itself: no organisation, no parent, no way to tell a listing from
 * an article.
 *
 * Contact channels are deliberately absent from every block here. They are
 * public on the listing page for a person to read, and a machine-readable
 * copy of the same phone numbers is exactly what the open API stopped
 * handing out.
 */

export interface JsonLd {
  "@context": "https://schema.org";
  [key: string]: unknown;
}

export function organizationJsonLd(description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${OG_IMAGE}`,
    description,
    parentOrganization: {
      "@type": "NGO",
      name: "Institute for Human Evolution",
      url: "https://ihe.institute",
    },
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

interface ListingLike {
  id: string;
  type: string;
  title: string;
  description: string;
  locationName: string;
  status: string;
  createdAt: Date;
  orgName: string | null;
}

/**
 * A request for help is a Demand and an offer of help is an Offer — the
 * two schema.org types that actually mean this, rather than dressing a
 * listing up as an article.
 */
export function listingJsonLd(listing: ListingLike): JsonLd {
  const isNeed = listing.type === "NEED";
  const stillOpen = listing.status === "OPEN" || listing.status === "ASSIGNED";
  return {
    "@context": "https://schema.org",
    "@type": isNeed ? "Demand" : "Offer",
    name: listing.title,
    description: listing.description.slice(0, 500),
    url: `${SITE_URL}/listing/${listing.id}`,
    availability: stillOpen
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    availableAtOrFrom: {
      "@type": "Place",
      name: listing.locationName,
    },
    areaServed: listing.locationName,
    validFrom: listing.createdAt.toISOString(),
    price: 0,
    priceCurrency: "USD",
    ...(listing.orgName
      ? { seller: { "@type": "Organization", name: listing.orgName } }
      : {}),
  };
}

/** Renders a block. JSON.stringify escapes nothing dangerous here because
 *  every value comes from our own database as plain text, but `<` is
 *  escaped anyway so a title can never close the script tag. */
export function jsonLdScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
