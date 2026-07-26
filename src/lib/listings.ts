import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import {
  CATEGORY_KEYS,
  STATUS_KEYS,
  TYPE_KEYS,
  URGENCY_KEYS,
  type Category,
  type ListingType,
  type Status,
  type Urgency,
} from "./constants";

export const PAGE_SIZE = 30;

export type ListingFilters = {
  q?: string;
  type?: string;
  category?: string;
  urgency?: string;
  status?: string;
  page?: number;
};

export function normalizeFilters(params: {
  [key: string]: string | string[] | undefined;
}): ListingFilters {
  const pick = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const page = Number(pick(params.page));
  return {
    q: pick(params.q)?.trim() || undefined,
    type: TYPE_KEYS.includes(pick(params.type) as ListingType)
      ? pick(params.type)
      : undefined,
    category: CATEGORY_KEYS.includes(pick(params.category) as Category)
      ? pick(params.category)
      : undefined,
    urgency: URGENCY_KEYS.includes(pick(params.urgency) as Urgency)
      ? pick(params.urgency)
      : undefined,
    status:
      pick(params.status) === "ANY" ||
      STATUS_KEYS.includes(pick(params.status) as Status)
        ? pick(params.status)
        : undefined,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

function buildWhere(filters: ListingFilters): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = { hidden: false };
  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = filters.category;
  if (filters.urgency) where.urgency = filters.urgency;
  // Default view: everything still active (open or assigned).
  if (!filters.status) where.status = { in: ["OPEN", "ASSIGNED"] };
  else if (filters.status !== "ANY") where.status = filters.status;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { locationName: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  return where;
}

/**
 * Urgency first, then newest. It has to be the database that sorts: doing
 * it afterwards, on one page of results, only reordered the twenty rows
 * that recency had already chosen, so a CRITICAL need from three days ago
 * sat on page two while NORMAL ones from today filled page one — the exact
 * opposite of what this board is for.
 *
 * The stored values sort correctly as plain text (CRITICAL < HIGH <
 * NORMAL), which is why this needs no enum or rank column.
 */
const URGENCY_THEN_NEWEST = [
  { urgency: "asc" as const },
  { createdAt: "desc" as const },
];

export async function searchListings(filters: ListingFilters) {
  const where = buildWhere(filters);
  const page = filters.page ?? 1;
  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: URGENCY_THEN_NEWEST,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getMappableListings(filters: ListingFilters) {
  const where = buildWhere(filters);
  where.lat = { not: null };
  where.lng = { not: null };
  return prisma.listing.findMany({
    where,
    // Same order as the list: if the 500 cap ever bites, it must drop the
    // least urgent pins, not the oldest critical ones.
    orderBy: URGENCY_THEN_NEWEST,
    take: 500,
    select: {
      id: true,
      type: true,
      title: true,
      category: true,
      urgency: true,
      status: true,
      locationName: true,
      lat: true,
      lng: true,
    },
  });
}
