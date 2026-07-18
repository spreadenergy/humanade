import {
  CATEGORIES,
  CATEGORY_KEYS,
  STATUSES,
  STATUS_KEYS,
  TYPES,
  TYPE_KEYS,
  URGENCIES,
  URGENCY_KEYS,
} from "@/lib/constants";
import type { ListingFilters } from "@/lib/listings";

/**
 * Plain GET form — filtering works with JavaScript disabled,
 * which matters on low-end devices and weak connections.
 */
export function FilterBar({
  filters,
  action = "/browse",
}: {
  filters: ListingFilters;
  action?: string;
}) {
  return (
    <form
      method="get"
      action={action}
      className="rounded-lg border border-slate-200 bg-white p-3"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <input
          type="search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Search…"
          aria-label="Search listings"
          className="field col-span-2 sm:col-span-3 lg:col-span-2"
        />
        <select name="type" defaultValue={filters.type ?? ""} aria-label="Type" className="field">
          <option value="">Needs + Offers</option>
          {TYPE_KEYS.map((k) => (
            <option key={k} value={k}>
              {TYPES[k].label}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          aria-label="Category"
          className="field"
        >
          <option value="">All categories</option>
          {CATEGORY_KEYS.map((k) => (
            <option key={k} value={k}>
              {CATEGORIES[k].icon} {CATEGORIES[k].short}
            </option>
          ))}
        </select>
        <select
          name="urgency"
          defaultValue={filters.urgency ?? ""}
          aria-label="Urgency"
          className="field"
        >
          <option value="">Any urgency</option>
          {URGENCY_KEYS.map((k) => (
            <option key={k} value={k}>
              {URGENCIES[k].label}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={filters.status ?? ""}
          aria-label="Status"
          className="field"
        >
          <option value="">Active (open + assigned)</option>
          {STATUS_KEYS.map((k) => (
            <option key={k} value={k}>
              {STATUSES[k].label}
            </option>
          ))}
          <option value="ANY">Everything</option>
        </select>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button type="submit" className="btn btn-navy !py-1.5 text-sm">
          Filter
        </button>
        <a href={action} className="text-sm text-slate-500 underline hover:text-navy">
          Clear
        </a>
      </div>
    </form>
  );
}
