"use server";

import { z } from "zod";

import { SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getI18n } from "@/lib/i18n";
import { withinLimit } from "@/lib/rate-limit";

export type RecoverState = { done?: boolean; error?: string };

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/**
 * Sends someone every management link tied to their email address.
 *
 * The answer is identical whether or not the address has any listings.
 * Saying "no listings found" would turn this form into a way of asking
 * whether a given person has posted asking for help, which for someone
 * living in a shelter is not a harmless thing to be able to look up.
 */
export async function recoverLinks(
  _prev: RecoverState,
  formData: FormData,
): Promise<RecoverState> {
  if (formData.get("website")) return { done: true };

  const { d } = await getI18n();
  const email = z.email().safeParse(String(formData.get("email") ?? "").trim());
  if (!email.success) return { error: d.errors.emailInvalid };

  if (
    !(await withinLimit({ max: 3, windowMs: 60 * 60 * 1000, scope: "recover" }))
  ) {
    return { error: d.errors.tooMany };
  }

  const listings = await prisma.listing
    .findMany({
      where: { email: email.data, hidden: false },
      select: { title: true, manageToken: true, status: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    })
    .catch(() => []);

  if (listings.length) {
    const rows = listings
      .map(
        (l) =>
          `<li style="margin-bottom:10px"><strong>${escapeHtml(l.title)}</strong><br>
           <a href="${SITE_URL}/manage/${l.manageToken}" style="color:#186394;word-break:break-all">${SITE_URL}/manage/${escapeHtml(l.manageToken)}</a></li>`,
      )
      .join("");
    await sendEmail({
      to: email.data,
      subject: d.recover.emailSubject,
      html: `
        <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#22303f;line-height:1.6;max-width:34em">
          <h2 style="color:#1b3a6b;margin:0 0 12px">${escapeHtml(d.recover.emailHeading)}</h2>
          <p style="margin:0 0 16px">${escapeHtml(d.recover.emailIntro)}</p>
          <ul style="padding-left:18px;margin:0 0 16px">${rows}</ul>
          <p style="margin:0;font-size:14px;color:#5b6b7c">${escapeHtml(d.recover.emailFooter)}</p>
        </div>
      `,
    });
  }

  return { done: true };
}
