export const TYPE_KEYS = ["NEED", "OFFER"] as const;
export type ListingType = (typeof TYPE_KEYS)[number];

export const CATEGORY_KEYS = [
  "CONNECT",
  "HEALTH",
  "DENTAL",
  "NUTRITION",
  "SHELTER",
  "VOLUNTEERS",
  "LOGISTICS",
  "EDUCATION",
] as const;
export type Category = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_ICONS: Record<Category, string> = {
  CONNECT: "🤝",
  HEALTH: "🩺",
  DENTAL: "🦷",
  NUTRITION: "🍲",
  SHELTER: "🏠",
  VOLUNTEERS: "🙌",
  LOGISTICS: "🚚",
  EDUCATION: "📖",
};

export const URGENCY_KEYS = ["CRITICAL", "HIGH", "NORMAL"] as const;
export type Urgency = (typeof URGENCY_KEYS)[number];

export const URGENCY_BADGE_CLASSES: Record<Urgency, string> = {
  CRITICAL: "bg-red-600 text-white",
  HIGH: "bg-sun text-navy",
  NORMAL: "bg-slate-200 text-slate-700",
};

export const STATUS_KEYS = ["OPEN", "ASSIGNED", "FULFILLED", "CLOSED"] as const;
export type Status = (typeof STATUS_KEYS)[number];

export const STATUS_BADGE_CLASSES: Record<Status, string> = {
  OPEN: "bg-brand-green text-white",
  ASSIGNED: "bg-brand-blue text-white",
  FULFILLED: "bg-navy text-white",
  CLOSED: "bg-slate-400 text-white",
};

export const SITE_NAME = "Humanade";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://humanade.org";

/** Default map view when no listings have pins (Venezuela). */
export const DEFAULT_MAP_CENTER: [number, number] = [8.6, -66.6];
export const DEFAULT_MAP_ZOOM = 6;
