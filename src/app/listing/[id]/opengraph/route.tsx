import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { listingCard } from "@/lib/share-card";

export const dynamic = "force-dynamic";

/** Link-preview image: WhatsApp/Facebook render this automatically when a
 *  listing URL is shared, showing the listing's own words as the card. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const listing = await prisma.listing.findFirst({
    where: { id, hidden: false },
  });
  if (!listing) notFound();

  return new ImageResponse(
    listingCard(listing, { width: 1200, height: 630 }),
    { width: 1200, height: 630 },
  );
}
