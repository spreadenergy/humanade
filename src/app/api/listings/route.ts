import { NextRequest, NextResponse } from "next/server";
import { normalizeFilters, searchListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

/**
 * Public read-only JSON API — lets relief organizations and other tools
 * consume Humanade listings programmatically.
 * GET /api/listings?q=&type=&category=&urgency=&status=&page=
 */
export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = normalizeFilters(params);
  const { items, total, page, pageCount } = await searchListings(filters);
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
      phone: l.phone,
      whatsapp: l.whatsapp,
      email: l.email,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      url: `/listing/${l.id}`,
    })),
  });
}
