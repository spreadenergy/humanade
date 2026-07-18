import {
  CATEGORY_ICONS,
  STATUS_BADGE_CLASSES,
  URGENCY_BADGE_CLASSES,
  type Category,
  type ListingType,
  type Status,
  type Urgency,
} from "@/lib/constants";
import type { Dict } from "@/lib/dictionaries/en";

const base =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold";

export function TypeBadge({ type, d }: { type: string; d: Dict }) {
  const label = d.types[type as ListingType];
  if (!label) return null;
  const color =
    type === "NEED" ? "bg-brand-blue text-white" : "bg-brand-green text-white";
  return <span className={`${base} ${color}`}>{label}</span>;
}

export function StatusBadge({ status, d }: { status: string; d: Dict }) {
  const label = d.statuses[status as Status];
  if (!label) return null;
  return (
    <span className={`${base} ${STATUS_BADGE_CLASSES[status as Status]}`}>
      {label}
    </span>
  );
}

export function UrgencyBadge({ urgency, d }: { urgency: string; d: Dict }) {
  if (urgency !== "CRITICAL" && urgency !== "HIGH") return null;
  return (
    <span className={`${base} ${URGENCY_BADGE_CLASSES[urgency as Urgency]}`}>
      {d.urgencyBadge[urgency]}
    </span>
  );
}

export function CategoryBadge({ category, d }: { category: string; d: Dict }) {
  const c = d.categories[category as Category];
  if (!c) return null;
  return (
    <span className={`${base} bg-slate-100 text-slate-700`}>
      <span aria-hidden="true">{CATEGORY_ICONS[category as Category]}</span>{" "}
      {c.short}
    </span>
  );
}
