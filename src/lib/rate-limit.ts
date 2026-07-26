import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * A small in-memory guard against someone flooding the board. It is
 * deliberately not backed by the database: the alternative is a table of
 * IP addresses belonging to people asking for medicine and shelter, and
 * that is a worse thing to hold than an imperfect limiter.
 *
 * Being in memory, it is per-instance, so a determined attacker spread
 * across instances gets more than the nominal allowance. It still stops
 * the case this actually needs to stop — one script hammering the form —
 * and costs nothing.
 *
 * Addresses are hashed with a per-process salt and the buckets expire, so
 * nothing here can be read back as an IP.
 */
const SALT = createHash("sha256")
  .update(String(process.env.VERCEL_DEPLOYMENT_ID ?? "") + Math.random())
  .digest("hex");

type Bucket = { hits: number[]; };
const buckets = new Map<string, Bucket>();
/** Bounded so a flood of distinct addresses cannot grow this forever. */
const MAX_BUCKETS = 5_000;

function callerKey(ip: string, scope: string): string {
  return createHash("sha256").update(`${SALT}:${scope}:${ip}`).digest("hex");
}

async function callerIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export interface Limit {
  /** How many actions are allowed inside the window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Distinguishes posting from reporting so one cannot exhaust the other. */
  scope: string;
}

/** True when the caller is within their allowance (and records the hit). */
export async function withinLimit({ max, windowMs, scope }: Limit): Promise<boolean> {
  const ip = await callerIp();
  // An unidentifiable caller is not worth blocking: behind some proxies
  // everyone would share one bucket and legitimate posts would fail.
  if (ip === "unknown") return true;

  const key = callerKey(ip, scope);
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);

  if (bucket.hits.length >= max) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.hits.push(now);
  if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) {
    // Drop the oldest entry rather than let the map grow without bound.
    const oldest = buckets.keys().next().value;
    if (oldest) buckets.delete(oldest);
  }
  buckets.set(key, bucket);
  return true;
}
