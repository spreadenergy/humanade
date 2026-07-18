import { ImageResponse } from "next/og";

/**
 * Open Graph image for link previews (WhatsApp, Facebook, Telegram, X).
 * Generated at request time — no static asset to maintain.
 */
export const alt =
  "Humanade — Conectando Necesidades Humanas con Soluciones Humanas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf8f3",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="190" height="190" viewBox="0 0 100 100">
          <rect x="8" y="18" width="17" height="68" rx="5" fill="#1b3a6b" />
          <rect x="75" y="18" width="17" height="68" rx="5" fill="#1b3a6b" />
          <circle cx="50" cy="20" r="10" fill="#f6a800" />
          <path
            d="M14 62 C 32 42, 44 42, 51 53"
            stroke="#2996d9"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M86 62 C 68 42, 56 42, 49 53"
            stroke="#5fae33"
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -2,
            marginTop: 18,
          }}
        >
          <span style={{ color: "#1b3a6b" }}>HUMAN</span>
          <span style={{ color: "#5fae33" }}>ADE</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#22303f",
            marginTop: 14,
            textAlign: "center",
          }}
        >
          Conectando Necesidades Humanas con Soluciones Humanas
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            backgroundColor: "#1b3a6b",
            color: "#ffffff",
            fontSize: 30,
            fontWeight: 700,
            padding: "14px 38px",
            borderRadius: 999,
          }}
        >
          humanade.org — Pide ayuda u ofrece ayuda
        </div>
      </div>
    ),
    size,
  );
}
