"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  AUTO_HIDE_REPORT_COUNT,
  REPORT_REASON_KEYS,
  type ReportReason,
} from "@/lib/constants";
import { withinLimit } from "@/lib/rate-limit";

export async function reportListing(formData: FormData) {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) redirect("/");

  const listingId = String(formData.get("listingId") ?? "");
  const reason = String(formData.get("reason") ?? "");
  const comment =
    String(formData.get("comment") ?? "")
      .trim()
      .slice(0, 500) || null;

  if (!REPORT_REASON_KEYS.includes(reason as ReportReason)) {
    redirect(`/listing/${listingId}`);
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, hidden: true },
  });
  if (!listing) redirect("/");

  // Enough reports hide a listing automatically, so without a limit one
  // person could silence any request for help by submitting this form
  // repeatedly. One report per listing per day, and a ceiling across all
  // listings so nobody can sweep the board.
  const allowed =
    (await withinLimit({
      max: 1,
      windowMs: 24 * 60 * 60 * 1000,
      scope: `report:${listingId}`,
    })) &&
    (await withinLimit({
      max: 10,
      windowMs: 60 * 60 * 1000,
      scope: "report",
    }));
  // Silently accepted: telling someone their report was rejected only
  // teaches them how to work around it, and a real reporter is done here.
  if (!allowed) redirect(`/listing/${listingId}?reported=1`);

  await prisma.report.create({ data: { listingId, reason, comment } });

  // Community safety valve: enough pending reports hides the listing
  // until a moderator reviews it (unhide + dismiss restores it).
  const pending = await prisma.report.count({ where: { listingId } });
  if (pending >= AUTO_HIDE_REPORT_COUNT && !listing.hidden) {
    await prisma.listing.update({
      where: { id: listingId },
      data: { hidden: true },
    });
  }

  revalidatePath(`/listing/${listingId}`);
  redirect(`/listing/${listingId}?reported=1`);
}
