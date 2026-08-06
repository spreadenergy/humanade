"use client";

/**
 * Minimal share row: native share sheet where available (most phones),
 * WhatsApp share as fallback, plus the downloadable image card.
 */
export function ShareButtons({
  url,
  title,
  cardUrl,
  labels,
}: {
  url: string;
  title: string;
  cardUrl: string;
  labels: { share: string; image: string };
}) {
  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      return; // user closed the share sheet
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      "_blank",
      "noopener",
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={share}
        className="btn btn-outline !py-1.5 text-sm"
      >
        {labels.share}
      </button>
      <a
        href={cardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline !py-1.5 text-sm"
      >
        {labels.image}
      </a>
    </div>
  );
}
