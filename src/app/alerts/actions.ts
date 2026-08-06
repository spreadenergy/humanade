"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { emailEnabled } from "@/lib/email";
import { sendVerificationEmail } from "@/lib/bulletins";
import { getLocale, lp } from "@/lib/i18n";
import { withinLimit } from "@/lib/rate-limit";
import { CATEGORY_KEYS, TYPE_KEYS } from "@/lib/constants";

const subscribeSchema = z.object({
  name: z.string().trim().min(2).max(80),
  orgName: z
    .string()
    .trim()
    .max(120)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional(),
  email: z
    .string()
    .trim()
    .max(160)
    .refine((v) => z.email().safeParse(v).success),
});

export async function subscribe(formData: FormData) {
  // Honeypot: real users never fill this hidden field.
  if (formData.get("website")) redirect("/");

  const locale = await getLocale();
  const back = lp(locale, "/alerts");

  if (!(await withinLimit({ max: 6, windowMs: 60 * 60 * 1000, scope: "subscribe" }))) {
    redirect(`${back}?sent=1`); // silently accepted, same as reports
  }

  const parsed = subscribeSchema.safeParse({
    name: formData.get("name") ?? "",
    orgName: formData.get("orgName") ?? "",
    email: formData.get("email") ?? "",
  });
  if (!parsed.success) redirect(`${back}?invalid=1`);

  const rawType = String(formData.get("types") ?? "ALL");
  const types =
    rawType === "ALL" || TYPE_KEYS.includes(rawType as (typeof TYPE_KEYS)[number])
      ? rawType
      : "ALL";

  const picked = formData
    .getAll("categories")
    .map(String)
    .filter((c) => (CATEGORY_KEYS as readonly string[]).includes(c));
  const categories =
    picked.length === 0 || picked.length === CATEGORY_KEYS.length
      ? "ALL"
      : picked.join(",");

  const email = parsed.data.email.toLowerCase();
  const token = crypto.randomBytes(18).toString("base64url");
  // Without a configured mail service there is no way to verify — accept
  // directly (local/dev) rather than dead-ending the signup.
  const canVerify = emailEnabled();

  const subscriber = await prisma.subscriber.upsert({
    where: { email },
    create: {
      name: parsed.data.name,
      orgName: parsed.data.orgName ?? null,
      email,
      types,
      categories,
      locale,
      token,
      verified: !canVerify,
      active: true,
    },
    update: {
      name: parsed.data.name,
      orgName: parsed.data.orgName ?? null,
      types,
      categories,
      locale,
      active: true,
    },
  });

  if (canVerify && !subscriber.verified) {
    await sendVerificationEmail(subscriber);
    redirect(`${back}?sent=1`);
  }
  redirect(`${back}?subscribed=1`);
}
