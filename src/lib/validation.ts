import { z } from "zod";
import { CATEGORY_KEYS, TYPE_KEYS, URGENCY_KEYS } from "./constants";

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

const optionalCoord = (min: number, max: number) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === undefined || v === "" ? null : Number(v)))
    .refine((v) => v === null || (Number.isFinite(v) && v >= min && v <= max), {
      message: "Invalid coordinate",
    });

export const listingSchema = z
  .object({
    type: z.enum(TYPE_KEYS),
    title: z
      .string()
      .trim()
      .min(4, "Title must be at least 4 characters")
      .max(120, "Title must be 120 characters or fewer"),
    description: z
      .string()
      .trim()
      .min(10, "Please describe the need or offer in at least 10 characters")
      .max(4000, "Description must be 4000 characters or fewer"),
    category: z.enum(CATEGORY_KEYS),
    urgency: z.enum(URGENCY_KEYS).default("NORMAL"),
    quantity: optionalTrimmed(120),
    locationName: z
      .string()
      .trim()
      .min(2, "Please tell people where this is (city, town, or area)")
      .max(160),
    lat: optionalCoord(-90, 90),
    lng: optionalCoord(-180, 180),
    contactName: z
      .string()
      .trim()
      .min(2, "Please provide a name")
      .max(80),
    orgName: optionalTrimmed(120),
    phone: optionalTrimmed(40),
    whatsapp: optionalTrimmed(40),
    email: z
      .string()
      .trim()
      .max(160)
      .transform((v) => (v === "" ? null : v))
      .nullable()
      .optional()
      .refine((v) => v == null || z.email().safeParse(v).success, {
        message: "Invalid email address",
      }),
  })
  .refine((data) => data.phone || data.whatsapp || data.email, {
    message:
      "Provide at least one way to reach you: phone, WhatsApp, or email",
    path: ["phone"],
  });

export type ListingInput = z.infer<typeof listingSchema>;

export function parseListingForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return listingSchema.safeParse(raw);
}
