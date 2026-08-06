import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-metadata";
import { CATEGORY_ICONS, CATEGORY_KEYS } from "@/lib/constants";
import { subscribe } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, d } = await getI18n();
  return pageMetadata({
    title: d.alerts.title,
    description: d.alerts.metaDescription,
    path: "/alerts",
    locale,
  });
}
export const dynamic = "force-dynamic";

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const { d } = await getI18n();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-navy">🔔 {d.alerts.title}</h1>
        <p className="mt-2 text-slate-600">{d.alerts.intro}</p>
      </div>

      {sp.sent && (
        <div className="rounded-lg border border-brand-green bg-green-50 p-3 text-sm text-brand-green-dark">
          {d.alerts.sent}
        </div>
      )}
      {sp.subscribed && (
        <div className="rounded-lg border border-brand-green bg-green-50 p-3 text-sm text-brand-green-dark">
          {d.alerts.subscribed}
        </div>
      )}
      {sp.confirmed && (
        <div className="rounded-lg border border-brand-green bg-green-50 p-3 text-sm text-brand-green-dark">
          {d.alerts.confirmed}
        </div>
      )}
      {sp.unsubscribed && (
        <div className="rounded-lg border border-slate-300 bg-slate-100 p-3 text-sm text-slate-700">
          {d.alerts.unsubscribed}
        </div>
      )}
      {sp.invalid && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {d.alerts.invalid}
        </div>
      )}

      <form
        action={subscribe}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
      >
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="s-name" className="mb-1 block text-sm font-semibold text-navy">
              {d.alerts.name}
            </label>
            <input id="s-name" name="name" required maxLength={80} className="field" />
          </div>
          <div>
            <label htmlFor="s-org" className="mb-1 block text-sm font-semibold text-navy">
              {d.alerts.org}{" "}
              <span className="font-normal text-slate-400">{d.form.optional}</span>
            </label>
            <input id="s-org" name="orgName" maxLength={120} className="field" />
          </div>
        </div>
        <div>
          <label htmlFor="s-email" className="mb-1 block text-sm font-semibold text-navy">
            {d.alerts.email}
          </label>
          <input id="s-email" name="email" type="email" required maxLength={160} className="field" />
        </div>
        <div>
          <label htmlFor="s-types" className="mb-1 block text-sm font-semibold text-navy">
            {d.alerts.typeLabel}
          </label>
          <select id="s-types" name="types" defaultValue="ALL" className="field">
            <option value="ALL">{d.alerts.typeAll}</option>
            <option value="NEED">{d.alerts.typeNeed}</option>
            <option value="OFFER">{d.alerts.typeOffer}</option>
          </select>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold text-navy">{d.alerts.catLabel}</p>
          <p className="mb-2 text-xs text-slate-500">{d.alerts.catAllNote}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORY_KEYS.map((k) => (
              <label
                key={k}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <input type="checkbox" name="categories" value={k} className="h-4 w-4" />
                <span aria-hidden="true">{CATEGORY_ICONS[k]}</span>
                {d.categories[k].short}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-navy w-full sm:w-auto">
          {d.alerts.submit}
        </button>
      </form>
    </div>
  );
}
