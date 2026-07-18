import type { Listing } from "@prisma/client";
import type { Dict } from "@/lib/dictionaries/en";

function waLink(number: string) {
  return `https://wa.me/${number.replace(/[^\d]/g, "")}`;
}

/**
 * Direct contact channels (phone / WhatsApp / email) instead of in-app
 * messaging — they keep working even when connectivity to the platform
 * is intermittent.
 */
export function ContactButtons({ listing, d }: { listing: Listing; d: Dict }) {
  return (
    <div className="flex flex-wrap gap-2">
      {listing.phone && (
        <a href={`tel:${listing.phone}`} className="btn btn-navy">
          📞 {d.listing.call} {listing.phone}
        </a>
      )}
      {listing.whatsapp && (
        <a
          href={waLink(listing.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-green"
        >
          💬 {d.listing.whatsapp}
        </a>
      )}
      {listing.email && (
        <a
          href={`mailto:${listing.email}?subject=${encodeURIComponent(
            `Humanade: ${listing.title}`,
          )}`}
          className="btn btn-blue"
        >
          ✉️ {d.listing.email}
        </a>
      )}
    </div>
  );
}
