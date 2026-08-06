import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (token) {
    await prisma.subscriber.updateMany({
      where: { token },
      data: { active: false },
    });
  }
  return NextResponse.redirect(new URL("/alerts?unsubscribed=1", request.url));
}
