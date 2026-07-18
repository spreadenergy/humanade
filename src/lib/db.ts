import { PrismaClient } from "@prisma/client";

/**
 * Connection string resolution: DATABASE_URL, with a fallback to the
 * prefixed variables the Vercel/Neon integration creates
 * (e.g. humanade_DATABASE_URL) so no manual env renaming is needed.
 */
export function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ??
    process.env.humanade_DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.humanade_POSTGRES_PRISMA_URL
  );
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasourceUrl: resolveDatabaseUrl() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
