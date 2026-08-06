import crypto from "node:crypto";
import { prisma } from "./db";
import { SITE_URL } from "./constants";
import { notifySubscribers } from "./bulletins";
import {
  inferCategory,
  parseWhatsAppMessage,
  whatsAppSuccessMessage,
} from "./whatsapp";

/**
 * Conversational posting flow — the shortest path from a WhatsApp message
 * to a published listing:
 *
 *   hola → 1 pedir / 2 ofrecer → ¿cuál es la necesidad? → ¿dónde?
 *        → ¿es urgente? → ¿tu nombre? → published (links sent back)
 *
 * The sender's WhatsApp number is used as the contact automatically, so
 * there's no contact question. Power users can still send the whole
 * "NECESITO … / Dónde: …" template in one message and skip the questions.
 * "CANCELAR" resets at any point. Sessions older than 12h restart.
 */

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const MSG = {
  greeting: [
    "👋 Hola, soy el bot de Humanade.",
    "",
    "1️⃣ Pedir ayuda",
    "2️⃣ Ofrecer ayuda",
  ].join("\n"),
  askNeed: "¿Cuál es la necesidad?",
  askOffer: "¿Qué puedes ofrecer?",
  askWhere: "📍 ¿Dónde?",
  askUrgent: "⚠️ ¿Es urgente? Sí o No",
  askName: "¿Nombre de la persona u organización a contactar?",
  canceled: "Cancelado. Escribe HOLA para empezar de nuevo.",
  needTooShort: "Cuéntame con un poco más de detalle, por favor.",
  whereTooShort: "¿En qué ciudad o sector?",
};

async function publish(input: {
  from: string;
  type: string;
  need: string;
  locationName: string;
  urgency: string;
  contactName: string;
}) {
  const manageToken = crypto.randomBytes(18).toString("base64url");
  const firstLine = input.need.split("\n")[0].trim();
  const listing = await prisma.listing.create({
    data: {
      type: input.type,
      title: firstLine.slice(0, 120),
      description: input.need.slice(0, 4000),
      category: inferCategory(input.need),
      urgency: input.urgency,
      locationName: input.locationName.slice(0, 160),
      contactName: input.contactName.slice(0, 80),
      whatsapp: `+${input.from}`,
      manageToken,
    },
  });
  await notifySubscribers(listing);
  return (
    whatsAppSuccessMessage(
      `${SITE_URL}/listing/${listing.id}`,
      `${SITE_URL}/manage/${manageToken}`,
    ) + "\n\n📱 Este WhatsApp quedó como contacto."
  );
}

export async function advanceConversation(
  from: string,
  text: string,
  profileName?: string,
): Promise<string> {
  const msg = text.trim();

  if (/^(cancelar|cancel)\.?$/i.test(msg)) {
    await prisma.botSession.deleteMany({ where: { waId: from } });
    return MSG.canceled;
  }

  // Power-user path: full template in one message publishes immediately.
  const parsed = parseWhatsAppMessage(msg);
  if (parsed.ok) {
    await prisma.botSession.deleteMany({ where: { waId: from } });
    return publish({
      from,
      type: parsed.listing.type,
      need: parsed.listing.description,
      locationName: parsed.listing.locationName ?? "",
      urgency: parsed.listing.urgency,
      contactName:
        parsed.listing.contactName ?? profileName ?? "WhatsApp",
    });
  }

  let session = await prisma.botSession.findUnique({ where: { waId: from } });
  if (session && Date.now() - session.updatedAt.getTime() > SESSION_TTL_MS) {
    await prisma.botSession.delete({ where: { waId: from } });
    session = null;
  }

  // Starting with NECESITO/OFREZCO but missing location? Jump into the
  // flow with the need already captured instead of rejecting the message.
  if (!session && parsed.ok === false && parsed.reason === "no_location") {
    const type = /^(ofrezco|ofrecemos|tengo|offer)/i.test(msg)
      ? "OFFER"
      : "NEED";
    const need = msg.replace(/^\S+\s*/, "").trim();
    await prisma.botSession.create({
      data: { waId: from, step: "WHERE", type, need },
    });
    return MSG.askWhere;
  }

  if (!session) {
    await prisma.botSession.create({
      data: { waId: from, step: "TYPE" },
    });
    return MSG.greeting;
  }

  switch (session.step) {
    case "TYPE": {
      const lower = msg.toLowerCase();
      let type: string | null = null;
      if (/^1\b/.test(lower) || /pedir|necesito|ayuda\b.*necesito/.test(lower))
        type = "NEED";
      else if (/^2\b/.test(lower) || /ofrecer|ofrezco|puedo ayudar|tengo/.test(lower))
        type = "OFFER";
      if (!type) return MSG.greeting;
      await prisma.botSession.update({
        where: { waId: from },
        data: { step: "NEED", type },
      });
      return type === "NEED" ? MSG.askNeed : MSG.askOffer;
    }

    case "NEED": {
      if (msg.length < 4) return MSG.needTooShort;
      await prisma.botSession.update({
        where: { waId: from },
        data: { step: "WHERE", need: msg },
      });
      return MSG.askWhere;
    }

    case "WHERE": {
      if (msg.length < 2) return MSG.whereTooShort;
      await prisma.botSession.update({
        where: { waId: from },
        data: { step: "URGENT", locationName: msg },
      });
      return MSG.askUrgent;
    }

    case "URGENT": {
      const urgent = /^(s[ií]|si\b|yes|1)/i.test(msg);
      await prisma.botSession.update({
        where: { waId: from },
        data: { step: "NAME", urgency: urgent ? "CRITICAL" : "NORMAL" },
      });
      return MSG.askName;
    }

    case "NAME": {
      const name = msg.length >= 2 ? msg : (profileName ?? "WhatsApp");
      const reply = await publish({
        from,
        type: session.type ?? "NEED",
        need: session.need ?? "",
        locationName: session.locationName ?? "",
        urgency: session.urgency ?? "NORMAL",
        contactName: name,
      });
      await prisma.botSession.delete({ where: { waId: from } });
      return reply;
    }

    default: {
      await prisma.botSession.delete({ where: { waId: from } });
      return MSG.greeting;
    }
  }
}
