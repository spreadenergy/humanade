import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/constants";
import { es } from "@/lib/dictionaries/es";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${es.siteTagline}`,
    short_name: SITE_NAME,
    description: es.siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#1b3a6b",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
