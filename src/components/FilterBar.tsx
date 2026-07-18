import {
  CATEGORY_ICONS,
  CATEGORY_KEYS,
  STATUS_KEYS,
  TYPE_KEYS,
  URGENCY_KEYS,
} from "@/lib/constants";
import type { Dict } from "@/lib/dictionaries/en";
import type { ListingFilters } from "@/lib/listings";

/**
 * Plain GET form — filtering works with JavaScript disabled,
 * which matters on low-end devices and weak connections.
 */
export function FilterBar({
  filters,
  d,
  action = "/browse",
}: {
  filters: ListingFilters;
  d: Dict;
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
          placeholder={d.filter.searchPlaceholder}
          aria-label={d.filter.searchAria}
          className="field col-span-2 sm:col-span-3 lg:col-span-2"
        />
        <select
          name="type"
          defaultValue={filters.type ?? ""}
          aria-label={d.filter.type}
          className="field"
        >
          <option value="">{d.filter.needsOffers}</option>
          {TYPE_KEYS.map((k) => (
            <option key={k} value={k}>
              {d.types[k]}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          aria-label={d.filter.category}
          className="field"
        >
          <option value="">{d.filter.allCategories}</option>
          {CATEGORY_KEYS.map((k) => (
            <option key={k} value={k}>
              {CATEGORY_ICONS[k]} {d.categories[k].short}
            </option>
          ))}
        </select>
        <select
          name="urgency"
          defaultValue={filters.urgency ?? ""}
          aria-label={d.filter.urgency}
          className="field"
        >
          <option value="">{d.filter.anyUrgency}</option>
          {URGENCY_KEYS.map((k) => (
            <option key={k} value={k}>
              {d.urgencies[k]}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={filters.status ?? ""}
          aria-label={d.filter.status}
          className="field"
        >
          <option value="">{d.filter.activeDefault}</option>
          {STATUS_KEYS.map((k) => (
            <option key={k} value={k}>
              {d.statuses[k]}
            </option>
          ))}
          <option value="ANY">{d.filter.everything}</option>
        </select>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button type="submit" className="btn btn-navy !py-1.5 text-sm">
          {d.filter.filter}
        </button>
        <a
          href={action}
          className="text-sm text-slate-500 underline hover:text-navy"
        >
          {d.filter.clear}
        </a>
      </div>
    </form>
  );
}
