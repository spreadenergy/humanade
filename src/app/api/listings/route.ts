import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { normalizeFilters, searchListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

/**
 * Partner access. Without it the feed still carries everything needed to
 * find and show a listing — just not the phone numbers.
 */
function isPartner(request: NextRequest): boolean {
  const configured = process.env.LISTINGS_API_KEY;
  if (!configured || configured === "change-me") return false;
  const given = request.headers.get("x-api-key") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Public read-only JSON API — lets relief organizations and other tools
 * consume Humanade listings programmatically.
 * GET /api/listings?q=&type=&category=&urgency=&status=&page=
 *
 * Contact channels are deliberately withheld from the open feed. They are
 * public on each listing page, one at a time, which is the difference
 * between a person reading a request for help and a script collecting
 * every phone number on the platform in one call — the people posting here
 * are exactly who gets targeted by that. Partners that need the channels
 * send `x-api-key`.
 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = normalizeFilters(params);
  const { items, total, page, pageCount } = await searchListings(filters);
  const partner = isPartner(request);

  return NextResponse.json({
    total,
    page,
    pageCount,
    items: items.map((l) => ({
      id: l.id,
      type: l.type,
      title: l.title,
      description: l.description,
      category: l.category,
      urgency: l.urgency,
      status: l.status,
      quantity: l.quantity,
      locationName: l.locationName,
      lat: l.lat,
      lng: l.lng,
      contactName: l.contactName,
      orgName: l.orgName,
      // Which channels exist, so a client can say "reachable by WhatsApp"
      // without being handed the number.
      hasPhone: Boolean(l.phone),
      hasWhatsapp: Boolean(l.whatsapp),
      hasEmail: Boolean(l.email),
      ...(partner
        ? { phone: l.phone, whatsapp: l.whatsapp, email: l.email }
        : {}),
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      url: `/listing/${l.id}`,
    })),
  });
}
