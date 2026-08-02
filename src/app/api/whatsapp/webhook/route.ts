import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage, verifyWebhookSignature } from "@/lib/whatsapp";
import { advanceConversation } from "@/lib/whatsapp-flow";

export const dynamic = "force-dynamic";

/**
 * Meta WhatsApp Cloud API webhook.
 * GET  — subscription verification handshake.
 * POST — incoming messages: parse NECESITO/OFREZCO posts, create listings,
 *        and reply with the public + private management links.
 * Setup instructions: see the "WhatsApp bot" section of the README.
 */

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");
  if (
    mode === "subscribe" &&
    token &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

type WebhookMessage = {
  from?: string;
  type?: string;
  text?: { body?: string };
};

type WebhookContact = { wa_id?: string; profile?: { name?: string } };

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verifyWebhookSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const entries =
    (payload as { entry?: { changes?: { value?: unknown }[] }[] }).entry ?? [];
  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      const value = change.value as
        | { messages?: WebhookMessage[]; contacts?: WebhookContact[] }
        | undefined;
      const messages = value?.messages ?? [];
      const contacts = value?.contacts ?? [];
      for (const message of messages) {
        if (message.type !== "text" || !message.from) continue;
        await handleTextMessage(
          message.from,
          message.text?.body ?? "",
          contacts.find((c) => c.wa_id === message.from)?.profile?.name,
        );
      }
    }
  }

  // Always 200 so Meta doesn't retry endlessly.
  return NextResponse.json({ ok: true });
}

async function handleTextMessage(
  from: string,
  text: string,
  profileName: string | undefined,
) {
  try {
    const reply = await advanceConversation(from, text, profileName);
    if (reply) await sendWhatsAppMessage(from, reply);
  } catch (err) {
    console.error("WhatsApp flow error:", err);
  }
}
