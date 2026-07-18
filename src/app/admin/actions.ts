"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { adminKeyOk } from "@/lib/admin";

async function requireKey(formData: FormData) {
  const key = String(formData.get("key") ?? "");
  if (!adminKeyOk(key)) redirect("/admin");
  return key;
}

export async function toggleHidden(formData: FormData) {
  const key = await requireKey(formData);
  const id = String(formData.get("id") ?? "");
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (listing) {
    await prisma.listing.update({
      where: { id },
      data: { hidden: !listing.hidden },
    });
  }
  revalidatePath("/admin");
  redirect(`/admin?key=${encodeURIComponent(key)}`);
}

export async function adminDelete(formData: FormData) {
  const key = await requireKey(formData);
  const id = String(formData.get("id") ?? "");
  await prisma.listing.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin");
  redirect(`/admin?key=${encodeURIComponent(key)}`);
}
