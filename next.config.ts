import type { NextConfig } from "next";

/**
 * Sent on every response. Nothing here is exotic; the site simply had none
 * of it, and the admin panel lists the name and phone number of everyone
 * who has posted — it should not be framable by another site, and its URLs
 * should not travel to third parties in a Referer header.
 *
 * `geolocation=(self)` is deliberate: the location picker asks for it.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), geolocation=(self)",
  },
  { key: "Content-Security-Policy", value: "upgrade-insecure-requests" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
