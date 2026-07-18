"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { parseListingForm } from "@/lib/validation";

export type PostFormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
  values?: Record<string, string>;
};

export async function createListing(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) redirect("/");

  const parsed = parseListingForm(formData);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    const values: Record<string, string> = {};
    for (const [k, v] of formData.entries()) {
      if (typeof v === "string") values[k] = v;
    }
    return {
      fieldErrors: flat.fieldErrors as PostFormState["fieldErrors"],
      formError: flat.formErrors[0],
      values,
    };
  }

  const manageToken = crypto.randomBytes(18).toString("base64url");
  await prisma.listing.create({
    data: { ...parsed.data, manageToken },
  });

  redirect(`/manage/${manageToken}?created=1`);
}
