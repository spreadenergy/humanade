import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { listingCard } from "@/lib/share-card";

export const dynamic = "force-dynamic";

/** Downloadable share card (1080×1350) with a QR code back to the
 *  listing — made to be forwarded through WhatsApp groups as an image. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const listing = await prisma.listing.findFirst({
    where: { id, hidden: false },
  });
  if (!listing) notFound();

  const qrDataUrl = await QRCode.toDataURL(`${SITE_URL}/listing/${id}`, {
    width: 440,
    margin: 1,
    color: { dark: "#1b3a6b", light: "#ffffff" },
  });

  return new ImageResponse(
    listingCard(listing, { width: 1080, height: 1350, qrDataUrl }),
    { width: 1080, height: 1350 },
  );
}
