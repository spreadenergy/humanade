export const TYPES = {
  NEED: {
    label: "I Need Help",
    shortLabel: "Need",
    color: "brand-blue",
    verb: "Requesting",
  },
  OFFER: {
    label: "I Can Help",
    shortLabel: "Offer",
    color: "brand-green",
    verb: "Offering",
  },
} as const;

export const CATEGORIES = {
  CONNECT: { label: "Human Connect", short: "Connect", icon: "🤝" },
  HEALTH: { label: "Human Health", short: "Health", icon: "🩺" },
  DENTAL: { label: "Human Dental", short: "Dental", icon: "🦷" },
  NUTRITION: { label: "Human Nutrition", short: "Nutrition", icon: "🍲" },
  SHELTER: { label: "Human Shelter", short: "Shelter", icon: "🏠" },
  VOLUNTEERS: { label: "Human Volunteers", short: "Volunteers", icon: "🙌" },
  LOGISTICS: { label: "Human Logistics", short: "Logistics", icon: "🚚" },
  EDUCATION: { label: "Human Education", short: "Education", icon: "📖" },
} as const;

export const URGENCIES = {
  CRITICAL: { label: "Critical", badge: "bg-red-600 text-white" },
  HIGH: { label: "High", badge: "bg-sun text-navy" },
  NORMAL: { label: "Normal", badge: "bg-slate-200 text-slate-700" },
} as const;

export const STATUSES = {
  OPEN: { label: "Open", badge: "bg-brand-green text-white" },
  ASSIGNED: { label: "Assigned", badge: "bg-brand-blue text-white" },
  FULFILLED: { label: "Fulfilled", badge: "bg-navy text-white" },
  CLOSED: { label: "Closed", badge: "bg-slate-400 text-white" },
} as const;

export type ListingType = keyof typeof TYPES;
export type Category = keyof typeof CATEGORIES;
export type Urgency = keyof typeof URGENCIES;
export type Status = keyof typeof STATUSES;

export const TYPE_KEYS = Object.keys(TYPES) as ListingType[];
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];
export const URGENCY_KEYS = Object.keys(URGENCIES) as Urgency[];
export const STATUS_KEYS = Object.keys(STATUSES) as Status[];

export const SITE_NAME = "Humanade";
export const SITE_TAGLINE = "Connecting Human Needs with Human Solutions.";
export const SITE_DESCRIPTION =
  "Humanade is the simplest way to ask for help or offer help. Post a need, post an offer, and get connected — anywhere in the world.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://humanade.org";
