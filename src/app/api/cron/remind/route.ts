import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { emailEnabled, sendEmail } from "@/lib/email";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

function authorised(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/**
 * Nudges people to close what has already been resolved.
 *
 * A board of needs is only worth reading if what is on it is still true.
 * Nothing ever expired here and nobody was ever asked to close anything,
 * so given a few months the listing for water that arrived in July is
 * still sitting above the one for water that has not.
 *
 * Runs daily and picks only listings whose fifteenth day fell in the last
 * twenty-four hours. That window is what keeps this from needing a
 * "reminded" column: each listing passes through it exactly once, so
 * nobody gets the same reminder twice.
 */
export async function GET(request: NextRequest) {
  if (!authorised(request)) {
    // 404 rather than 401: an unauthenticated caller should not learn
    // that this endpoint exists.
    return new NextResponse("Not found", { status: 404 });
  }
  if (!emailEnabled()) {
    return NextResponse.json({ skipped: "email not configured" });
  }

  const now = Date.now();
  const due = await prisma.listing.findMany({
    where: {
      hidden: false,
      status: { in: ["OPEN", "ASSIGNED"] },
      email: { not: null },
      createdAt: {
        lte: new Date(now - 15 * DAY),
        gt: new Date(now - 16 * DAY),
      },
    },
    select: { id: true, title: true, email: true, manageToken: true },
    take: 200,
  });

  let sent = 0;
  for (const listing of due) {
    if (!listing.email) continue;
    // Spanish: this only goes to people who posted, and that is who they
    // are. Nothing records which language they filled the form in.
    const d = getDict("es");
    const manageUrl = `${SITE_URL}/manage/${listing.manageToken}`;
    const ok = await sendEmail({
      to: listing.email,
      subject: `${d.remind.subject}: ${listing.title}`,
      html: `
        <div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#22303f;line-height:1.6;max-width:34em">
          <h2 style="color:#1b3a6b;margin:0 0 12px">${escapeHtml(d.remind.heading)}</h2>
          <p style="margin:0 0 8px"><strong>${escapeHtml(listing.title)}</strong></p>
          <p style="margin:0 0 16px">${escapeHtml(d.remind.body)}</p>
          <p style="margin:0 0 16px">
            <a href="${manageUrl}" style="background:#186394;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">${escapeHtml(d.remind.button)}</a>
          </p>
          <p style="margin:0 0 16px;font-size:14px">${escapeHtml(d.remind.stillOpen)}</p>
          <p style="margin:0;font-size:14px;color:#5b6b7c">${escapeHtml(d.remind.signature)}</p>
        </div>
      `,
    });
    if (ok) sent++;
  }

  return NextResponse.json({ due: due.length, sent });
}
