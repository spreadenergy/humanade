import crypto from "node:crypto";
import type { Category, ListingType, Urgency } from "./constants";

/**
 * Parsing for the WhatsApp bot. People post by sending:
 *
 *   NECESITO agua potable para 30 familias
 *   Dónde: La Guaira, Vargas
 *   Nombre: María Rivera
 *
 * or starting with OFREZCO to offer help. English NEED/OFFER also work.
 * The sender's WhatsApp number automatically becomes the contact channel.
 */

const NEED_WORDS = ["NECESITO", "NECESITAMOS", "NEED"];
const OFFER_WORDS = ["OFREZCO", "OFRECEMOS", "OFREZCO:", "OFFER", "TENGO"];

const CATEGORY_KEYWORDS: [Category, RegExp][] = [
  [
    "HEALTH",
    /medicin|medicament|insulin|antibi[oó]tic|antial[eé]rgic|doctor|m[eé]dic|psic[oó]log|salud|enfermer|guantes|inyect|vacun|tension|jeringa|repelente|protector solar|crema/i,
  ],
  ["DENTAL", /dental|dentista|odont|diente|muela/i],
  [
    "NUTRITION",
    /agua|comida|aliment|leche|f[oó]rmula|pañal|panal|toallas h[uú]medas|arroz|harina|hielo|bebida|comer|gatarina|perrarina|mascota|nutri/i,
  ],
  [
    "SHELTER",
    /refugio|albergue|techo|colch[oó]n|vivienda|casa|carpa|lona|tarp|habitaci[oó]n|dormir/i,
  ],
  ["VOLUNTEERS", /voluntari|brigada|manos|rescate|ayudar a limpiar/i],
  [
    "LOGISTICS",
    /transport|cami[oó]n|veh[ií]culo|traslado|gasolina|entrega|dep[oó]sito|almac[eé]n|mudanza|carga|moto|lancha/i,
  ],
  ["EDUCATION", /escuela|escolar|[uú]tiles|libro|educa|clases|maestr/i],
];

export type ParsedWhatsAppListing = {
  type: ListingType;
  title: string;
  description: string;
  category: Category;
  urgency: Urgency;
  locationName: string | null;
  contactName: string | null;
};

export type WhatsAppParseResult =
  | { ok: true; listing: ParsedWhatsAppListing }
  | { ok: false; reason: "no_keyword" | "no_location" };

function extractLine(lines: string[], names: RegExp): string | null {
  for (const line of lines) {
    const m = line.match(names);
    if (m) {
      const value = line.slice(m[0].length).trim();
      if (value) return value;
    }
  }
  return null;
}

export function parseWhatsAppMessage(text: string): WhatsAppParseResult {
  const trimmed = text.trim();
  const firstWord = (trimmed.split(/\s+/)[0] ?? "")
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÑ]/g, "");

  let type: ListingType | null = null;
  if (NEED_WORDS.includes(firstWord)) type = "NEED";
  else if (OFFER_WORDS.includes(firstWord)) type = "OFFER";
  if (!type) return { ok: false, reason: "no_keyword" };

  const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
  const locationName = extractLine(
    lines,
    /^(d[oó]nde|donde|ubicaci[oó]n|lugar|zona|where|location)\s*[:\-]/i,
  );
  const contactName = extractLine(lines, /^(nombre|name|soy)\s*[:\-]/i);

  if (!locationName) return { ok: false, reason: "no_location" };

  // Title: first line without the keyword; description: the full message.
  const firstLine = lines[0] ?? "";
  const title = firstLine
    .replace(/^\S+\s*/, "")
    .trim()
    .slice(0, 120);
  if (title.length < 4) return { ok: false, reason: "no_keyword" };

  const body = lines
    .filter(
      (l) =>
        !/^(d[oó]nde|donde|ubicaci[oó]n|lugar|zona|where|location|nombre|name|soy)\s*[:\-]/i.test(
          l,
        ),
    )
    .join("\n")
    .replace(/^\S+\s*/, "")
    .trim();

  const haystack = trimmed;
  let category: Category = "CONNECT";
  for (const [cat, re] of CATEGORY_KEYWORDS) {
    if (re.test(haystack)) {
      category = cat;
      break;
    }
  }

  const urgency: Urgency = /urgente|urgencia|emergencia/i.test(haystack)
    ? "CRITICAL"
    : "NORMAL";

  return {
    ok: true,
    listing: {
      type,
      title,
      description: (body || title).slice(0, 4000),
      category,
      urgency,
      locationName: locationName.slice(0, 160),
      contactName,
    },
  };
}

export const WHATSAPP_HELP_MESSAGE = [
  "👋 Hola, soy el bot de Humanade (humanade.org) — la forma más simple de pedir ayuda u ofrecer ayuda.",
  "",
  "Para publicar una *necesidad*, envía un mensaje así:",
  "",
  "NECESITO agua potable para 30 familias",
  "Dónde: La Guaira, Vargas",
  "Nombre: María Rivera",
  "",
  "Para *ofrecer* ayuda, empieza con OFREZCO.",
  "",
  "Tu número de WhatsApp quedará como contacto en la publicación. Escribe URGENTE en el mensaje si es una emergencia.",
].join("\n");

export const WHATSAPP_NO_LOCATION_MESSAGE = [
  "📍 Casi listo — solo falta la ubicación. Agrega una línea así y reenvía tu mensaje completo:",
  "",
  "Dónde: La Guaira, Vargas",
].join("\n");

export function whatsAppSuccessMessage(listingUrl: string, manageUrl: string) {
  return [
    "✅ ¡Tu publicación está en línea!",
    "",
    `Ver: ${listingUrl}`,
    "",
    `🔒 Enlace privado para editar, marcar como resuelta o eliminar tu publicación (guárdalo y no lo compartas):`,
    manageUrl,
  ].join("\n");
}

/** Verify Meta's X-Hub-Signature-256 header when an app secret is configured. */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true; // not configured — skip verification
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const provided = signatureHeader.slice("sha256=".length);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(provided, "hex"),
    );
  } catch {
    return false;
  }
}

export async function sendWhatsAppMessage(to: string, body: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return;
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        }),
      },
    );
    if (!res.ok) {
      console.error("WhatsApp send failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("WhatsApp send error:", err);
  }
}
