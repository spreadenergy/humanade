import { z } from "zod";
import { CATEGORY_KEYS, TYPE_KEYS, URGENCY_KEYS } from "./constants";
import type { Dict } from "./dictionaries/en";
import { en } from "./dictionaries/en";

type Errs = Dict["errors"];

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional();

const optionalCoord = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === undefined || v === "" ? null : Number(v)))
    .refine((v) => v === null || (Number.isFinite(v) && v >= min && v <= max), {
      message,
    });

export function createListingSchema(errs: Errs = en.errors) {
  return z
    .object({
      type: z.enum(TYPE_KEYS),
      title: z.string().trim().min(4, errs.titleMin).max(120, errs.titleMax),
      description: z
        .string()
        .trim()
        .min(10, errs.descMin)
        .max(4000, errs.descMax),
      category: z.enum(CATEGORY_KEYS),
      urgency: z.enum(URGENCY_KEYS).default("NORMAL"),
      quantity: optionalTrimmed(120),
      locationName: z.string().trim().min(2, errs.locationMin).max(160),
      lat: optionalCoord(-90, 90, errs.coordInvalid),
      lng: optionalCoord(-180, 180, errs.coordInvalid),
      contactName: z.string().trim().min(2, errs.nameMin).max(80),
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
          message: errs.emailInvalid,
        }),
    })
    .refine((data) => data.phone || data.whatsapp || data.email, {
      message: errs.contactRequired,
      path: ["phone"],
    });
}

export type ListingInput = z.infer<ReturnType<typeof createListingSchema>>;

export function parseListingForm(formData: FormData, errs?: Errs) {
  const raw = Object.fromEntries(formData.entries());
  return createListingSchema(errs).safeParse(raw);
}
