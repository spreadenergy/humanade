"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { STATUS_KEYS, type Status } from "@/lib/constants";
import { parseListingForm } from "@/lib/validation";

async function requireListing(token: string) {
  const listing = await prisma.listing.findUnique({
    where: { manageToken: token },
  });
  if (!listing) redirect("/");
  return listing;
}

export async function updateStatus(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!STATUS_KEYS.includes(status as Status)) return;
  const listing = await requireListing(token);
  await prisma.listing.update({
    where: { id: listing.id },
    data: { status },
  });
  revalidatePath(`/manage/${token}`);
  revalidatePath(`/listing/${listing.id}`);
}

export async function updateListing(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const listing = await requireListing(token);
  // Keep the original type; the form doesn't allow switching sides.
  formData.set("type", listing.type);
  const parsed = parseListingForm(formData);
  if (!parsed.success) {
    redirect(`/manage/${token}?error=1`);
  }
  await prisma.listing.update({
    where: { id: listing.id },
    data: parsed.data,
  });
  redirect(`/manage/${token}?saved=1`);
}

export async function deleteListing(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (formData.get("confirm") !== "on") {
    redirect(`/manage/${token}?confirmDelete=1`);
  }
  const listing = await requireListing(token);
  await prisma.listing.delete({ where: { id: listing.id } });
  redirect("/?deleted=1");
}
