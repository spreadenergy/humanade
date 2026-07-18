import {
  CATEGORIES,
  STATUSES,
  TYPES,
  URGENCIES,
  type Category,
  type ListingType,
  type Status,
  type Urgency,
} from "@/lib/constants";

const base =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold";

export function TypeBadge({ type }: { type: string }) {
  const t = TYPES[type as ListingType];
  if (!t) return null;
  const color =
    type === "NEED" ? "bg-brand-blue text-white" : "bg-brand-green text-white";
  return <span className={`${base} ${color}`}>{t.label}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const s = STATUSES[status as Status];
  if (!s) return null;
  return <span className={`${base} ${s.badge}`}>{s.label}</span>;
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const u = URGENCIES[urgency as Urgency];
  if (!u || urgency === "NORMAL") return null;
  return <span className={`${base} ${u.badge}`}>{u.label} urgency</span>;
}

export function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORIES[category as Category];
  if (!c) return null;
  return (
    <span className={`${base} bg-slate-100 text-slate-700`}>
      <span aria-hidden="true">{c.icon}</span> {c.short}
    </span>
  );
}
