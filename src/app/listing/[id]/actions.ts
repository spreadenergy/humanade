"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  AUTO_HIDE_REPORT_COUNT,
  REPORT_REASON_KEYS,
  type ReportReason,
} from "@/lib/constants";

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
