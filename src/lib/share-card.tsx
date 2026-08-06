import type { Listing } from "@prisma/client";

/**
 * JSX for listing share images, rendered by next/og's ImageResponse in
 * two sizes: the 1200×630 link-preview card (WhatsApp/Facebook show it
 * automatically when a listing URL is shared) and the 1080×1350
 * downloadable card with a QR code for reposting as an image.
 *
 * Text-first by design: the listing's own words are the picture.
 * Labels are Spanish — the audience this exists for.
 */

const NAVY = "#1b3a6b";
const BLUE = "#2996d9";
const GREEN = "#5fae33";
const SUN = "#f6a800";
const CREAM = "#faf8f3";
const INK = "#22303f";

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="8" y="18" width="17" height="68" rx="5" fill={NAVY} />
      <rect x="75" y="18" width="17" height="68" rx="5" fill={NAVY} />
      <circle cx="50" cy="20" r="10" fill={SUN} />
      <path
        d="M14 62 C 32 42, 44 42, 51 53"
        stroke={BLUE}
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M86 62 C 68 42, 56 42, 49 53"
        stroke={GREEN}
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function clampText(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function listingCard(
  listing: Listing,
  opts: { width: number; height: number; qrDataUrl?: string },
) {
  const isNeed = listing.type === "NEED";
  const accent = isNeed ? BLUE : GREEN;
  const pill = isNeed ? "NECESITO AYUDA" : "PUEDO AYUDAR";
  const urgent = listing.urgency === "CRITICAL";
  const resolved =
    listing.status === "FULFILLED" || listing.status === "CLOSED";
  const portrait = opts.height > opts.width;
  const title = clampText(listing.title, portrait ? 120 : 100);
  const titleSize = portrait
    ? title.length > 60
      ? 58
      : 70
    : title.length > 60
      ? 46
      : 56;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: CREAM,
        fontFamily: "sans-serif",
        borderTop: `${portrait ? 18 : 14}px solid ${accent}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: portrait ? "44px 64px 0" : "34px 56px 0",
        }}
      >
        <Mark size={portrait ? 84 : 64} />
        <div
          style={{
            display: "flex",
            fontSize: portrait ? 52 : 40,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          <span style={{ color: NAVY }}>HUMAN</span>
          <span style={{ color: GREEN }}>ADE</span>
        </div>
        <div style={{ display: "flex", flex: 1 }} />
        {urgent && !resolved && (
          <div
            style={{
              display: "flex",
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontSize: portrait ? 34 : 28,
              fontWeight: 800,
              padding: "10px 26px",
              borderRadius: 999,
            }}
          >
            URGENTE
          </div>
        )}
        {resolved && (
          <div
            style={{
              display: "flex",
              backgroundColor: NAVY,
              color: "#ffffff",
              fontSize: portrait ? 34 : 28,
              fontWeight: 800,
              padding: "10px 26px",
              borderRadius: 999,
            }}
          >
            RESUELTO
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: portrait ? "40px 64px 0" : "30px 56px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: accent,
            color: "#ffffff",
            fontSize: portrait ? 34 : 28,
            fontWeight: 800,
            padding: "10px 28px",
            borderRadius: 999,
            alignSelf: "flex-start",
          }}
        >
          {pill}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 800,
            color: NAVY,
            lineHeight: 1.15,
            marginTop: portrait ? 34 : 24,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: portrait ? 38 : 32,
            color: INK,
            marginTop: portrait ? 28 : 18,
          }}
        >
          📍 {clampText(listing.locationName, 60)}
        </div>
      </div>

      {/* Footer */}
      {opts.qrDataUrl ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            backgroundColor: "#ffffff",
            borderTop: `4px solid ${accent}`,
            padding: "36px 64px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={opts.qrDataUrl}
            alt=""
            width={220}
            height={220}
            style={{ borderRadius: 12 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 800,
                color: NAVY,
              }}
            >
              Escanea para ver y contactar
            </div>
            <div style={{ display: "flex", fontSize: 30, color: INK }}>
              o visita humanade.org
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            backgroundColor: NAVY,
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 700,
            padding: "22px 56px",
          }}
        >
          humanade.org — Conectando Necesidades Humanas con Soluciones Humanas
        </div>
      )}
    </div>
  );
}
