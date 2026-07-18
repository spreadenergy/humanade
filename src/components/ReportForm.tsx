import { reportListing } from "@/app/listing/[id]/actions";
import { REPORT_REASON_KEYS } from "@/lib/constants";
import type { Dict } from "@/lib/dictionaries/en";

/**
 * Minimal by design: a small muted "⚑ Report" text link, collapsed by
 * default (<details>); the short form only appears when opened. Plain
 * form — works without JavaScript and without an account.
 */
export function ReportForm({ listingId, d }: { listingId: string; d: Dict }) {
  return (
    <details>
      <summary className="inline-flex cursor-pointer select-none list-none text-xs text-slate-400 hover:text-slate-600 [&::-webkit-details-marker]:hidden">
        {d.report.flag}
      </summary>
      <form
        action={reportListing}
        className="mt-2 max-w-md space-y-3 rounded-lg border border-slate-200 bg-white p-4"
      >
        <input type="hidden" name="listingId" value={listingId} />
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="text-xs text-slate-500">{d.report.desc}</p>
        <select
          name="reason"
          required
          defaultValue=""
          aria-label={d.report.reason}
          className="field !py-2 text-sm"
        >
          <option value="" disabled>
            {d.report.reason}…
          </option>
          {REPORT_REASON_KEYS.map((k) => (
            <option key={k} value={k}>
              {d.report.reasons[k]}
            </option>
          ))}
        </select>
        <textarea
          name="comment"
          rows={2}
          maxLength={500}
          placeholder={d.report.commentPh}
          aria-label={d.report.comment}
          className="field !py-2 text-sm"
        />
        <button type="submit" className="btn btn-outline !py-1 text-xs">
          {d.report.submit}
        </button>
      </form>
    </details>
  );
}
