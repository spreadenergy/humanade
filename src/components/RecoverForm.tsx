"use client";

import { useActionState } from "react";

import { recoverLinks, type RecoverState } from "@/app/manage/recover/actions";
import type { Dict } from "@/lib/dictionaries/en";

export function RecoverForm({ d }: { d: Dict }) {
  const [state, formAction, pending] = useActionState<RecoverState, FormData>(
    recoverLinks,
    {},
  );

  if (state.done) {
    return (
      <div className="rounded-lg border border-action-green bg-green-50 p-4">
        <p className="font-semibold text-navy">{d.recover.sentTitle}</p>
        <p className="mt-1 text-sm text-slate-600">{d.recover.sentBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="recover-email"
          className="mb-1 block font-semibold text-navy"
        >
          {d.recover.emailLabel}
        </label>
        <input
          id="recover-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={160}
          className="field"
        />
      </div>

      <button type="submit" disabled={pending} className="btn btn-blue">
        {pending ? d.recover.sending : d.recover.submit}
      </button>
    </form>
  );
}
