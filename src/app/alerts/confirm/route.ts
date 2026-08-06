import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const subscriber = token
    ? await prisma.subscriber.findUnique({ where: { token } })
    : null;
  if (subscriber) {
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { verified: true, active: true },
    });
    return NextResponse.redirect(new URL("/alerts?confirmed=1", request.url));
  }
  return NextResponse.redirect(new URL("/alerts", request.url));
}
