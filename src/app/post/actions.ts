"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getI18n } from "@/lib/i18n";
import { parseListingForm } from "@/lib/validation";

export type PostFormState = {
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
  values?: Record<string, string>;
};

/** Everything the person typed, so a failed submit never empties the form. */
function typedValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (typeof v === "string") values[k] = v;
  }
  return values;
}

/**
 * Postgres errors worth a second attempt: the connection was unreachable,
 * timed out, was closed under us, or the pool was momentarily full. A
 * serverless database sleeps, and the first request after that fails once
 * and succeeds immediately after. Anything else (bad data, constraint
 * violations) would fail identically on a retry, so it is not retried.
 */
const TRANSIENT_CODES = new Set(["P1001", "P1002", "P1008", "P1017", "P2024"]);

function isTransient(err: unknown): boolean {
  const code = (err as { code?: string })?.code;
  return typeof code === "string" && TRANSIENT_CODES.has(code);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function createWithRetry(data: Parameters<typeof prisma.listing.create>[0]["data"]) {
  const attempts = 3;
  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma.listing.create({ data });
    } catch (err) {
      if (attempt >= attempts || !isTransient(err)) throw err;
      await wait(200 * attempt);
    }
  }
}

export async function createListing(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) redirect("/");

  const { d } = await getI18n();
  const parsed = parseListingForm(formData, d.errors);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      fieldErrors: flat.fieldErrors as PostFormState["fieldErrors"],
      formError: flat.formErrors[0],
      values: typedValues(formData),
    };
  }

  const manageToken = crypto.randomBytes(18).toString("base64url");

  // The write is the one step that can fail for reasons the person cannot
  // do anything about. If it does, hand the form back with every word
  // still in it — someone describing a medical emergency on a bad
  // connection must never be asked to type it all again.
  try {
    await createWithRetry({ ...parsed.data, manageToken });
  } catch (err) {
    console.error("[post] listing NOT saved", err);
    return { formError: d.errors.saveFailed, values: typedValues(formData) };
  }

  redirect(`/manage/${manageToken}?created=1`);
}
