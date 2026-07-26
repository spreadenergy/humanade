"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, adminKeyOk, adminSessionOk } from "@/lib/admin";

/**
 * Sign-in. The key arrives once, by POST, and is kept in an httpOnly
 * cookie — it no longer travels in the address bar on every click.
 */
export async function signIn(formData: FormData) {
  const key = String(formData.get("key") ?? "");
  if (!adminKeyOk(key)) redirect("/admin?bad=1");
  const store = await cookies();
  store.set(ADMIN_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function signOut() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

async function requireSession() {
  if (!(await adminSessionOk())) redirect("/admin");
}

export async function toggleHidden(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (listing) {
    await prisma.listing.update({
      where: { id },
      data: { hidden: !listing.hidden },
    });
  }
  revalidatePath("/admin");
  redirect("/admin");
}

export async function dismissReports(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  await prisma.report.deleteMany({ where: { listingId: id } });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function adminDelete(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  await prisma.listing.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin");
  redirect("/admin");
}
