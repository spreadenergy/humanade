/**
 * Outgoing mail. There is exactly one thing worth sending: the private
 * link that lets someone edit or close what they posted. Until now that
 * link was shown on screen with a copy button and nothing else — close
 * the tab and the listing was beyond reach forever, still ringing your
 * phone about something already resolved.
 *
 * Sending is best-effort by design. The listing is already saved before
 * this runs, so a mail failure must never turn into a lost post.
 */
const API = "https://api.resend.com/emails";

function configured() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  return key && from ? { key, from } : null;
}

export function emailEnabled(): boolean {
  return configured() !== null;
}

/** Keeps a stray newline in user-supplied text out of the headers. */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

interface Mail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: Mail): Promise<boolean> {
  const conf = configured();
  if (!conf) return false;
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${conf.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: conf.from,
        to: [headerSafe(to)],
        subject: headerSafe(subject),
        html,
        ...(replyTo ? { reply_to: headerSafe(replyTo) } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send threw", err);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

interface ManageLinkMail {
  to: string;
  listingTitle: string;
  manageUrl: string;
  copy: {
    subject: string;
    heading: string;
    intro: string;
    button: string;
    keepIt: string;
    signature: string;
  };
}

/**
 * Deliberately plain HTML: this is read on cheap phones over patchy
 * connections, and the link has to survive a client that strips styling.
 */
export async function sendManageLink({ to, listingTitle, manageUrl, copy }: ManageLinkMail) {
  const title = escapeHtml(listingTitle);
  const url = escapeHtml(manageUrl);
  return sendEmail({
    to,
    subject: `${copy.subject}: ${listingTitle}`,
    html: `
      <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#22303f;line-height:1.6;max-width:34em">
        <h2 style="color:#1b3a6b;margin:0 0 12px">${escapeHtml(copy.heading)}</h2>
        <p style="margin:0 0 8px"><strong>${title}</strong></p>
        <p style="margin:0 0 16px">${escapeHtml(copy.intro)}</p>
        <p style="margin:0 0 16px">
          <a href="${url}" style="background:#186394;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">${escapeHtml(copy.button)}</a>
        </p>
        <p style="margin:0 0 16px;font-size:14px;word-break:break-all"><a href="${url}" style="color:#186394">${url}</a></p>
        <p style="margin:0 0 16px;font-size:14px;color:#5b6b7c">${escapeHtml(copy.keepIt)}</p>
        <p style="margin:0;font-size:14px;color:#5b6b7c">${escapeHtml(copy.signature)}</p>
      </div>
    `,
  });
}
