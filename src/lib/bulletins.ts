import type { Listing } from "@prisma/client";
import { prisma } from "./db";
import { emailEnabled, sendEmail } from "./email";
import { sendWhatsAppMessage } from "./whatsapp";
import { SITE_URL } from "./constants";
import { getDict } from "./i18n";
import type { Locale } from "./i18n";

/**
 * Real-time bulletins: the moment a listing is created, every verified
 * subscriber whose filters match gets an email. This is how a water
 * charity hears "necesito agua" minutes after it's posted instead of
 * days later.
 *
 * Best-effort by design and called after the listing is saved — a mail
 * problem must never cost a post.
 */

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
      c
    ]!,
  );
}

function excerpt(text: string, max = 300): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${space > max * 0.6 ? cut.slice(0, space) : cut}…`;
}

function bulletinHtml(
  listing: Listing,
  locale: Locale,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const d = getDict(locale);
  const a = d.alertEmail;
  const isNeed = listing.type === "NEED";
  const pill = isNeed ? a.needLabel : a.offerLabel;
  const accent = isNeed ? "#2996d9" : "#5fae33";
  const urgent = listing.urgency === "CRITICAL";
  const url = `${SITE_URL}/listing/${listing.id}`;

  const subject = `${urgent ? `🔴 ${a.urgent} · ` : ""}${pill}: ${listing.title} — ${listing.locationName}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#22303f;line-height:1.6;max-width:34em">
      <p style="margin:0 0 12px">
        <span style="background:${accent};color:#fff;padding:4px 14px;border-radius:999px;font-weight:700;font-size:13px">${escapeHtml(pill)}</span>
        ${urgent ? `<span style="background:#dc2626;color:#fff;padding:4px 14px;border-radius:999px;font-weight:700;font-size:13px;margin-left:6px">${escapeHtml(a.urgent)}</span>` : ""}
      </p>
      <h2 style="color:#1b3a6b;margin:0 0 8px">${escapeHtml(listing.title)}</h2>
      <p style="margin:0 0 12px;color:#475569">${escapeHtml(excerpt(listing.description))}</p>
      <p style="margin:0 0 16px"><strong>📍 ${escapeHtml(listing.locationName)}</strong></p>
      <p style="margin:0 0 20px">
        <a href="${url}" style="background:${accent};color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700">${escapeHtml(a.view)}</a>
      </p>
      <p style="margin:0 0 6px;font-size:13px;color:#5b6b7c">${escapeHtml(a.reason)}</p>
      <p style="margin:0;font-size:13px"><a href="${unsubscribeUrl}" style="color:#5b6b7c">${escapeHtml(a.unsubscribe)}</a></p>
    </div>
  `;
  return { subject, html };
}

/** Short text bulletin for WhatsApp subscribers. */
function bulletinText(listing: Listing): string {
  const isNeed = listing.type === "NEED";
  const urgent = listing.urgency === "CRITICAL";
  return [
    `${urgent ? "🔴 URGENTE · " : ""}${isNeed ? "🔵 Necesita ayuda" : "🟢 Puede ayudar"}`,
    listing.title,
    `📍 ${listing.locationName}`,
    `${SITE_URL}/listing/${listing.id}`,
  ].join("\n");
}

export async function notifySubscribers(listing: Listing) {
  try {
    if (listing.hidden) return;
    const subscribers = await prisma.subscriber.findMany({
      where: { active: true, verified: true },
      take: 1000,
    });
    const matches = subscribers.filter(
      (s) =>
        (s.types === "ALL" || s.types === listing.type) &&
        (s.categories === "ALL" ||
          s.categories.split(",").includes(listing.category)),
    );
    if (matches.length === 0) return;

    const mailEnabled = emailEnabled();
    const waEnabled = Boolean(process.env.WHATSAPP_ACCESS_TOKEN);
    const posterWa = (listing.whatsapp ?? "").replace(/[^\d]/g, "");

    await Promise.allSettled(
      matches.map((s) => {
        if (s.channel === "whatsapp" && s.whatsapp) {
          // Don't echo someone's own post back at them.
          if (!waEnabled || s.whatsapp === posterWa) return Promise.resolve();
          return sendWhatsAppMessage(s.whatsapp, bulletinText(listing));
        }
        if (!mailEnabled || !s.email) return Promise.resolve();
        const { subject, html } = bulletinHtml(
          listing,
          (s.locale === "en" ? "en" : "es") as Locale,
          `${SITE_URL}/alerts/unsubscribe?token=${s.token}`,
        );
        return sendEmail({ to: s.email, subject, html });
      }),
    );
  } catch (err) {
    console.error("[bulletins] notify failed", err);
  }
}

export async function sendVerificationEmail(subscriber: {
  email: string;
  token: string;
  locale: string;
}) {
  const d = getDict((subscriber.locale === "en" ? "en" : "es") as Locale);
  const a = d.alertEmail;
  const url = `${SITE_URL}/alerts/confirm?token=${subscriber.token}`;
  return sendEmail({
    to: subscriber.email,
    subject: a.verifySubject,
    html: `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#22303f;line-height:1.6;max-width:34em">
        <h2 style="color:#1b3a6b;margin:0 0 12px">${escapeHtml(a.verifyHeading)}</h2>
        <p style="margin:0 0 16px">${escapeHtml(a.verifyIntro)}</p>
        <p style="margin:0 0 16px">
          <a href="${url}" style="background:#1b3a6b;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700">${escapeHtml(a.verifyButton)}</a>
        </p>
        <p style="margin:0 0 16px;font-size:14px;word-break:break-all"><a href="${url}" style="color:#186394">${url}</a></p>
        <p style="margin:0;font-size:13px;color:#5b6b7c">${escapeHtml(a.ignore)}</p>
      </div>
    `,
  });
}
